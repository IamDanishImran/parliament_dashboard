import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // Ensure this path is correct and leads to your Supabase client configuration

export async function GET() {
  try {
    // Initialize the Supabase client
    const supabase = createClient();

    // Fetch the form statuses from the `form_status` table
    const { data, error } = await supabase
      .from("form")
      .select("form_status");

    // Handle errors from the Supabase query
    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: "Failed to fetch data from Supabase" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
