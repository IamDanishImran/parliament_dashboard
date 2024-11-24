import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export const updateSession = async (request) => { // Changed parameter name from NextRequest to request
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, // Removed non-null assertion
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value); // Set the cookie in response directly
            });
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    const { user, error } = await supabase.auth.getUser();

    // Protected routes
    if (request.nextUrl.pathname.startsWith("/protected") && error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/" && !error) {
      return NextResponse.redirect(new URL("/protected/dashboard/", request.url));
    }

    return response;
  } catch (e) {
    // Handle errors related to Supabase client creation
    console.error("Supabase client creation error:", e); // Logging the error
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};