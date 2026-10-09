const { spawnSync } = require("node:child_process");
const { existsSync, readFileSync, writeFileSync, unlinkSync } = require("node:fs");
const { resolve } = require("node:path");
const { tmpdir } = require("node:os");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const envText = readFileSync(path, "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^"|"$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(resolve(".env.local"));

function normalizeDbUrl(raw) {
  try {
    // Normalize credentials so special characters are safely percent-encoded.
    return new URL(raw).toString();
  } catch {
    return null;
  }
}

const dbUrlCandidatesRaw = [
  process.env.SUPABASE_DB_URL,
  process.env.DATABASE_URL,
  process.env.SUPABASE_DB_URL_FALLBACK,
  process.env.DATABASE_URL_FALLBACK,
].filter(Boolean);

const dbUrlCandidates = dbUrlCandidatesRaw
  .map(normalizeDbUrl)
  .filter(Boolean);

if (dbUrlCandidates.length === 0) {
  console.error(
    "Missing valid DB URL. Set SUPABASE_DB_URL or DATABASE_URL (optionally *_FALLBACK).",
  );
  process.exit(1);
}

const localSupabaseExe = resolve(
  "node_modules",
  "supabase",
  "bin",
  process.platform === "win32" ? "supabase.exe" : "supabase",
);

const cli = existsSync(localSupabaseExe) ? localSupabaseExe : "supabase";
const sqlFile = resolve("seed_data_fix.sql");
if (!existsSync(sqlFile)) {
  console.error(`SQL file not found: ${sqlFile}`);
  process.exit(1);
}

function splitSqlStatements(sqlText) {
  const statements = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;
  let dollarQuoteTag = null;

  for (let i = 0; i < sqlText.length; i += 1) {
    const char = sqlText[i];
    const next = sqlText[i + 1];

    if (inLineComment) {
      current += char;
      if (char === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      current += char;
      if (char === "*" && next === "/") {
        current += next;
        i += 1;
        inBlockComment = false;
      }
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !dollarQuoteTag) {
      if (char === "-" && next === "-") {
        current += char + next;
        i += 1;
        inLineComment = true;
        continue;
      }
      if (char === "/" && next === "*") {
        current += char + next;
        i += 1;
        inBlockComment = true;
        continue;
      }
    }

    if (!inDoubleQuote && !dollarQuoteTag && char === "'") {
      inSingleQuote = !inSingleQuote;
      current += char;
      continue;
    }

    if (!inSingleQuote && !dollarQuoteTag && char === '"') {
      inDoubleQuote = !inDoubleQuote;
      current += char;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote) {
      if (!dollarQuoteTag && char === "$") {
        const match = sqlText.slice(i).match(/^\$[A-Za-z0-9_]*\$/);
        if (match) {
          dollarQuoteTag = match[0];
          current += match[0];
          i += match[0].length - 1;
          continue;
        }
      } else if (dollarQuoteTag && sqlText.startsWith(dollarQuoteTag, i)) {
        current += dollarQuoteTag;
        i += dollarQuoteTag.length - 1;
        dollarQuoteTag = null;
        continue;
      }
    }

    if (char === ";" && !inSingleQuote && !inDoubleQuote && !dollarQuoteTag) {
      const trimmed = current.trim();
      if (trimmed && !/^BEGIN$/i.test(trimmed) && !/^COMMIT$/i.test(trimmed)) {
        statements.push(trimmed);
      }
      current = "";
      continue;
    }

    current += char;
  }

  const trailing = current.trim();
  if (trailing && !/^BEGIN$/i.test(trailing) && !/^COMMIT$/i.test(trailing)) {
    statements.push(trailing);
  }

  return statements;
}

const sqlText = readFileSync(sqlFile, "utf8");
const statements = splitSqlStatements(sqlText);

if (statements.length === 0) {
  console.error("No SQL statements found in seed_data_fix.sql");
  process.exit(1);
}

function runWithDbUrl(dbUrl) {
  for (let i = 0; i < statements.length; i += 1) {
    const statement = statements[i];
    const tempSqlPath = resolve(tmpdir(), `reseed-stmt-${process.pid}-${i}.sql`);
    writeFileSync(tempSqlPath, `${statement};\n`, "utf8");

    const result = spawnSync(
      cli,
      ["db", "query", "--db-url", dbUrl, "--file", tempSqlPath, "--output", "table"],
      { stdio: "pipe", shell: false, encoding: "utf8" },
    );
    unlinkSync(tempSqlPath);

    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);

    if (result.error) {
      throw new Error(result.error.message);
    }
    if (result.status !== 0) {
      throw new Error(`Statement ${i + 1} failed with exit code ${result.status}`);
    }
  }
}

let lastError = null;

for (let idx = 0; idx < dbUrlCandidates.length; idx += 1) {
  const dbUrl = dbUrlCandidates[idx];
  console.log(`\n[reseed] Trying DB URL ${idx + 1}/${dbUrlCandidates.length}...`);
  try {
    runWithDbUrl(dbUrl);
    console.log("[reseed] Completed successfully.");
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`[reseed] Attempt ${idx + 1} failed: ${error.message}`);
  }
}

console.error("\n[reseed] All DB URL attempts failed.");
if (lastError) {
  console.error(lastError.message);
}
process.exit(1);
