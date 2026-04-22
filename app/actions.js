// app/actions.js
"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const ic = formData.get("identification_number")?.toString();
  const register_code = formData.get("register_code")?.toString();
  const supabase = await createClient();

  try {
    if (!email || !password || !name || !ic || !register_code) {
      return { status: "error", message: "All fields are required." };
    }
  
    const { data: registerRole, error: registerRoleError } = await supabase
      .from("registration")
      .select("id")
      .eq("description", register_code)
      .single();
  
    if (registerRoleError || !registerRole) {
      return { status: "error", message: "Invalid or missing registration code." };
    }
  
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
  
    const user_id = signUpData?.user?.id;
    if (signUpError || !user_id) {
      return { status: "error", message: signUpError?.message || "Sign-up failed." };
    }
  
    const userRole = registerRole.id;
  
      if (register_code === "Supervisor") {
        await insertUserData("admin", {
          user_id,
          name,
          email,
          ic,
          id_register: userRole,
          status: "Pending",
        });
      } else {
        await insertUserData("dun", {
          user_id,
          name,
          email,
          ic,
          id_register: userRole,
          status: "Pending",
        });
      }
    return { status: "success", message: "Thanks for signing up! Check your email for a verification link." };
  } catch (error) {
    console.error("Sign-up error:", error);
    return { status: "error", message: "Sign-up failed." };
  }
};


// Sign In Action
export const signInAction = async (formData) => {
  const supabase = await createClient();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const register_code = formData.get("register_code")?.toString();
  
  // Check all fields are filled
  if (!email || !password || !register_code) {
    return encodedRedirect("error", "/sign-in", "All fields are required.");
  }

  // Check if the user has been approved by the manager
  let user;
  let userError;
  if (register_code === '25048082' || register_code === '80845621') {
    ({ data: user, error: userError } = await supabase
      .from("admin")
      .select("status")
      .eq("email", email)
      .single());
  } else {
    ({ data: user, error: userError } = await supabase
      .from("dun")
      .select("status")
      .eq("email", email)
      .single());
  }

  if (userError) {
    return encodedRedirect("error", "/sign-in", "The credentials you entered are incorrect. Please check and try again.");
  }
  if (user.status !== "Approved") {
    return encodedRedirect("error", "/sign-in", "User not approved.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  } 
  return encodedRedirect(
    "success",
    "/protected/dashboard?login=success",
    "Welcome back! You have successfully signed in."
  );
};



// Forgot Password Action
export const forgotPasswordAction = async (formData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};



// Reset Password Action
export const resetPasswordAction = async (formData) => {
  const supabase = createClient();

  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  return encodedRedirect("success", "/protected/reset-password", "Password updated");
};



// Sign Out Action
export const signOutAction = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error(error);
    return redirect('/protected/dashboard');
  }
  return redirect("/");
};


// export const signOutAction = async () => {
//   try {
//     const supabase = await createClient();
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error("Sign-out error:", error);
//       throw error; // Handle genuine errors
//     }
//     return redirect("/"); // This will throw NEXT_REDIRECT
//   } catch (err) {
//     if (err?.digest?.startsWith("NEXT_REDIRECT")) {
//       // Ignore NEXT_REDIRECT errors since they are part of the redirect mechanism
//       console.log("Redirecting to / after sign-out.");
//       return;
//     }
//     console.error("Unexpected error during sign-out:", err);
//     return redirect("/error"); // Optional: Redirect to an error page
//   }
// };