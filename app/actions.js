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

  if (!email || !password || !name || !ic || !register_code) {
    return encodedRedirect("error", "/sign-up", "All fields are required.");
  }

  const { data: registerID, error: dbError } = await supabase
    .from("registration")
    .select("*")
    .eq("role_code", register_code)
    .single();

  if (dbError || !registerID) {
    return encodedRedirect("error", "/sign-up", "Invalid or missing registration code.");
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  const user_id = signUpData?.user?.id;
  if (signUpError || !user_id) {
    return encodedRedirect("error", "/sign-up", "Failed to sign up. Please try again.");
  }

  const isAdminRole = registerID.role_code === "25048082" || registerID.role_code === "80845621";
  try {
    if (isAdminRole) {
      // Check if an admin already exists before proceeding
      const { data: existingAdmin, error: adminCheckError } = await supabase
        .from("admin")
        .select("*")
        .eq("role_code", register_code)
        .single();  // Only looking for one admin

      if (adminCheckError || existingAdmin) {
        // If an admin exists, don't create the dun user, and show an error
        return encodedRedirect("error", "/sign-up", "An admin has already signed up. You cannot create a region user (Dun) until an admin is added.");
      }
      
      // Insert into admin table
      const { data: insertAdmin, error: adminError } = await supabase
        .from("admin")
        .insert([{ user_id: user_id, name, email, ic, id_register: registerID.id }]);

      if (adminError) {
        console.error("Insert error (admin): " + adminError.message);
        return encodedRedirect("error", "/sign-up", "Failed to save user data.");
      }
    } else {
      // Insert into dun table and get its ID
      const { data: insertDun, error: dunError } = await supabase
        .from("dun")
        .insert([{ user_id: user_id, name, email, ic, id_register: registerID.id }])
        .select('id');

      if (dunError || !insertDun) {
        console.error("Insert error (dun): " + dunError?.message);
        return encodedRedirect("error", "/sign-up", "Failed to save user data.");
      }

      const dunId = insertDun[0]?.id;
      if (!dunId) {
        console.error("Failed to retrieve the inserted dun id.");
        return encodedRedirect("error", "/sign-up", "Failed to retrieve user ID.");
      }

      // Determine if the id_register is odd or even and fetch corresponding admin
      const isOdd = registerID.id % 2 !== 0;
      const { data: adminData, error: adminFetchError } = await supabase
        .from("admin")
        .select("id")
        .eq("id_register", isOdd ? 1 : 2);

      if (adminFetchError) {
        console.error("Error fetching admin ID: " + adminFetchError?.message);
        return encodedRedirect("error", "/sign-up", "Failed to fetch admin data.");
      }

      // Handle cases where no admin is found or multiple admins are returned
      if (adminData.length === 0) {
        console.error("No admin found for the given register code.");
        return encodedRedirect("error", "/sign-up", "No admin found for this registration.");
      } else if (adminData.length > 1) {
        console.error("Multiple admins found for the given register code.");
        return encodedRedirect("error", "/sign-up", "Multiple admins found, please contact support.");
      }

      const adminId = adminData[0]?.id;

      // Insert into admin_dun junction table
      const { error: junctionError } = await supabase
        .from('admin_dun')
        .insert([{ id_admin: adminId, id_dun: dunId }]);

      if (junctionError) {
        console.error("Insert error (admin_dun): " + junctionError.message);
        return encodedRedirect("error", "/sign-up", "Failed to assign admin to dun.");
      }
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return encodedRedirect("error", "/sign-up", "Something went wrong!");
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Check your email for a verification link."
  );
};





// Sign In Action
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
  return encodedRedirect(
    "success",
    "/protected/dashboard",
    "Thanks for signing up! Please check your email for a verification link."
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
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
