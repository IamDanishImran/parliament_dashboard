// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get("code");
//   const origin = requestUrl.origin;
//   const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

//   if (code) {
//     try {
//       const supabase = createClient();
//       const { session, error } = await supabase.auth.exchangeCodeForSession(code);
      
//       if (error) {
//         console.error("Error exchanging code for session:", error.message);
//         return NextResponse.redirect(`${origin}/auth/error?message=${error.message}`);
//       }
//     } catch (error) {
//       console.error("Error during exchangeCodeForSession:", error);
//       return NextResponse.redirect(`${origin}/auth/error?message=An unexpected error occurred.`);
//     }
//   }

//   // Redirect to a custom URL if provided and it's valid
//   if (redirectTo && redirectTo.startsWith(origin)) {
//     return NextResponse.redirect(`${origin}${redirectTo}`);
//   }

//   // Default redirect after successful authentication
//   return NextResponse.redirect(`${origin}/protected/dashboard/`);
// }


// // /app/auth/callback/route.js
// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get("code");
//   const origin = requestUrl.origin;
//   const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

//   if (code) {
//     const supabase = createClient();
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   if (redirectTo) {
//     return NextResponse.redirect(`${origin}${redirectTo}`);
//   }

//   // URL to redirect to after sign up process completes
//   return NextResponse.redirect(`${origin}/protected/dashboard`);
// }




// /app/auth/callback/route.ts
// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   // The `/auth/callback` route is required for the server-side auth flow implemented
//   // by the SSR package. It exchanges an auth code for the user's session.
//   // https://supabase.com/docs/guides/auth/server-side/nextjs
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get("code");
//   const origin = requestUrl.origin;
//   const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

//   if (code) {
//     const supabase = await createClient();
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   if (redirectTo) {
//     return NextResponse.redirect(`${origin}${redirectTo}`);
//   }

//   // URL to redirect to after sign up process completes
//   return NextResponse.redirect(`${origin}/protected/dashboard`);
// }





// /app/auth/callback/route.ts
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { encodedRedirect } from "@/utils/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next)
    }
  }

  // redirect the user to an error page with some instructions
  return encodedRedirect(
    "Error",
    "/sign-up",
    "Check Again"
  );
}