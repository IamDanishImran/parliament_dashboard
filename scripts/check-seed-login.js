const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { spawnSync } = require("node:child_process");

async function main() {
  const envPath = resolve(".env.local");
  if (existsSync(envPath)) {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^"|"$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  }

  const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!dbUrl || !supabaseUrl || !anonKey) {
    console.error("Missing DB URL or Supabase URL/anon key in env.");
    process.exit(1);
  }

  const normalizedDbUrl = new URL(dbUrl).toString();
  const cli = resolve("node_modules", "supabase", "bin", process.platform === "win32" ? "supabase.exe" : "supabase");

  const sqlChecks = [
    `SELECT n.nspname AS schema_name, p.proname AS function_name FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'auth' AND p.proname ILIKE '%password%' ORDER BY p.proname;`,
    `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema='auth' AND table_name='identities' ORDER BY ordinal_position;`,
    `SELECT email, LEFT(encrypted_password, 4) AS hash_prefix, LENGTH(encrypted_password) AS hash_len FROM auth.users WHERE email IN ('sup1@example.com','dun1@example.com') ORDER BY email;`,
    `SELECT provider, provider_id, email FROM auth.identities WHERE email IN ('sup1@example.com','dun1@example.com') ORDER BY email;`,
    `SELECT email, email_confirmed_at IS NOT NULL AS confirmed, encrypted_password IS NOT NULL AS has_password FROM auth.users WHERE email IN ('sup1@example.com','dun1@example.com') ORDER BY email;`,
    `SELECT user_id, provider, email FROM auth.identities WHERE email IN ('sup1@example.com','dun1@example.com') ORDER BY email;`,
    `SELECT role_code, description FROM registration ORDER BY role_code;`,
    `SELECT email, status FROM admin WHERE email='sup1@example.com';`,
    `SELECT email, status FROM dun WHERE email='dun1@example.com';`,
  ];

  for (const sql of sqlChecks) {
    console.log("\n--- SQL CHECK ---");
    const r = spawnSync(cli, ["db", "query", "--db-url", normalizedDbUrl, sql, "--output", "table"], {
      stdio: "inherit",
      shell: false,
    });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(supabaseUrl, anonKey);
  const login = await sb.auth.signInWithPassword({
    email: "sup1@example.com",
    password: "parliament123",
  });

  console.log("\n--- AUTH CHECK ---");
  if (login.error) {
    console.log("signInWithPassword error:", login.error.message);
  } else {
    console.log("signInWithPassword success for sup1@example.com");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
