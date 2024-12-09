// app/api/userInfo/route.js
import { supabase } from '../../../lib/supabase'; // Assuming you have your supabase client in this path

export async function GET(request) {
  const { user_id } = request.url.searchParams; // Fetch user_id from query params

  // Fetch user data from `auth.users` table
  const { data: userData, error: userError } = await supabase
    .from('auth.users')
    .select('email, role')
    .eq('id', user_id)
    .single();

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), { status: 400 });
  }

  // Fetch additional user data from `admin` or `dun` table (depending on the role)
  const { data: roleData, error: roleError } = await supabase
    .from('admin') // Example: Assuming roles are in `admin` table
    .select('name, role')
    .eq('user_id', user_id)
    .single();

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), { status: 400 });
  }

  // Return combined user info
  return new Response(
    JSON.stringify({
      name: roleData?.name || 'Guest',
      email: userData.email,
      role: roleData?.role || 'User',
    }),
    { status: 200 }
  );
}
