// app/api/registrations/route.js
import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Prefer using the service role key on the server to bypass RLS, fall back to anon key
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url) {
      return new Response(JSON.stringify({ error: 'Missing NEXT_PUBLIC_SUPABASE_URL env var' }), { status: 500 });
    }

    const keyToUse = serviceKey || anonKey;
    if (!keyToUse) {
      return new Response(JSON.stringify({ error: 'No Supabase key found in environment (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)' }), { status: 500 });
    }

    const supabase = createSupabaseClient(url, keyToUse, {
      auth: { persistSession: false },
    });

    const { data, error, status } = await supabase
      .from('registration')
      .select('id,role_code,description,inserted_at,updated_at')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase registration fetch error:', error);
      return new Response(JSON.stringify({ error: error.message || error }), {
        status: status || 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If empty, include a diagnostic hint about RLS / missing service key
    if (!data || data.length === 0) {
      console.warn('/api/registrations returned empty result. Check that the `registration` table contains rows and that RLS/policies allow the key in use to SELECT.');
      return new Response(JSON.stringify({ data: [], hint: serviceKey ? 'Service key used' : 'Anon key used; consider setting SUPABASE_SERVICE_ROLE_KEY for server access' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Unexpected error in /api/registrations:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
