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
  const origin = headers().get("origin");

  // Check for missing fields
  if (!email || !password || !name || !ic || !register_code) {
    return encodedRedirect("error", "/sign-up", "All fields are required");
  }

  // Validate the registration code
  const { data: registerID, error: dbError } = await supabase
    .from("registration")
    .select("id")
    .eq("role_code", register_code)
    .single();
  
  if (dbError) {
    console.error(`Database error: ${dbError.message}`);
    return encodedRedirect("error", "/sign-up", "Error validating role code.");
  }

  if (!registerID) {
    return encodedRedirect("error", "/sign-up", "Registration code invalid");
  }

  // Sign up the user with Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    console.error(`Sign-up error: ${signUpError.message}`);
    return encodedRedirect("error", "/sign-up", signUpError.message);
  }

  const user_id = signUpData.user?.id;
  if (!user_id) {
    console.error("Sign-up failed: user ID is missing.");
    return encodedRedirect("error", "/sign-up", "Failed to complete sign-up.");
  }

// Verify Admin or Dun
if (registerID.id === '25048082' || registerID.id === '80845621') {
  // Insert user data into the admin table after authentication
  const { error: insertError } = await supabase.from("admin").insert([
    {
      user_id: user_id,
      name,
      email,
      ic,
      id_register: registerID.id,
    },
  ]);
    
  if (insertError) {
    console.error("Insert error: " + insertError.message);
    return encodedRedirect("error", "/sign-up", "Failed to save user data.");
  }
} else {
  // Assign the registration code for managers
  const managerRegisterCode = '25048082';

  // Validate the registration code for the manager
  const { data: registerCodeData, error: dbError } = await supabase
    .from("registration")
    .select("id")
    .eq("role_code", managerRegisterCode)
    .single();

  if (dbError) {
    console.error("Database error: " + dbError.message);
    return encodedRedirect("error", "/sign-up", "Error validating registration code for manager.");
  }

  // Insert user data into the dun table after authentication
  const { error: dunInsertError } = await supabase.from("dun").insert([
    {
      user_id: user_id,
      name,
      email,
      ic,
      id_admin: registerCodeData.id,
      id_register: registerID.id,
    },
  ]);
    
  if (dunInsertError) {
    console.error("Insert error: " + dunInsertError.message);
    return encodedRedirect("error", "/sign-up", "Failed to save user data.");
  }
}
  // Success response
  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link."
  );
};



export const signInAction = async (formData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  } 
  return redirect("/protected/dashboard/");
};








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

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/");
};





// "use server";
// import { encodedRedirect } from "@/utils/utils";
// import { createClient } from "@/utils/supabase/server";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

// export const signUpAction = async (formData) => {
//   const email         = formData.get("email")?.toString();
//   const password      = formData.get("password")?.toString();
//   const name          = formData.get("name")?.toString();
//   const address       = formData.get("address")?.toString();
//   const phone         = formData.get("phone")?.toString();
//   const register_code = formData.get("register_code")?.toString();

//   const supabase = createClient();
//   const origin = headers().get("origin");

//   if (!email || !password || !name || !address || !phone || !register_code) {
//     return encodedRedirect(
//       "error",
//       "/sign-up",
//       "All fields are required",
//     );
//   }

//   // Validate the registration code
//   const { data: registerID, error: dbError } = await supabase
//     .from("registration")
//     .select("id")
//     .eq("role_code", register_code)
//     .single();
//     if (dbError) {
//       console.error(`Database error: ${dbError.message}`);
//       return encodedRedirect("error", "/sign-up", "Error validating role code.");
//     }
//     if (!registerID) {
//       return encodedRedirect("error", "/sign-up", "Registration code invalid");
//     }
    
//     const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: `${origin}/auth/callback`,
//       },
//     });
//     if (signUpError) {
//       console.error(`Sign-up error: ${signUpError.message}`);
//       return encodedRedirect("error", "/sign-up", signUpError.message);
//     }
//     const user_id = signUpData.user?.id;
//     if (!user_id) {
//       console.error("Sign-up failed: user ID is missing.");
//       return encodedRedirect("error", "/sign-up", "Failed to complete sign-up.");
//     }

//     if (registerID.id === '25048082' || registerID.id === '80845621') {
//       const { error } = await supabase.from("admin").insert([
//         {
//           user_id: user_id,
//           name,
//           email,
//           phone,
//           address,
//           id_register: registerID.id,
//         },
//       ]);

//       if ( error ) {
//         console.error("Insert error: " + insertError.message);
//         return encodedRedirect( "error", "/sign-up", "Failed to save user data.");
//       }
//     }
//     else {
//       const { error } = await supabase.from("dun").insert([
//         {
//           user_id: user_id,
//           name,
//           email,
//           phone,
//           address,
//           id_register: registerID.id,
//           id_admin: registerID.id === 1,
//         },
//       ]);

//       if ( error ) {
//         console.error("Insert error: " + error.message);
//         return encodedRedirect( "error", "/sign-up", "Failed to save user data.");
//       }
//     }
    
//     if (insertError) {
//       console.error("Insert error: " + insertError.message);
//       return encodedRedirect( "error", "/sign-up", "Failed to save user data.");
//     }
//     // Success response
//       return encodedRedirect(
//         "success",
//         "/sign-up",
//         "Thanks for signing up! Please check your email for a verification link.",
//       );
//   };