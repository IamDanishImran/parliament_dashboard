// app/api/fetch-data/route.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies(); // get cookies in a server-side context
  const supabase = createServerClient({ cookies: cookieStore });

  const { data, error } = await supabase.from("form").select("*");

  if (error) {
    return new Response("Error fetching data", { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
