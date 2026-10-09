"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

// Helper to insert user-related rows into the DB
async function insertUserData(table, payload) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).insert(payload);

  if (error) {
    console.error(`insertUserData error for ${table}:`, error);
    throw error;
  }
}

async function sendApprovalEmail({ to, name, roleCode, roleDescription }) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("Email configuration is missing.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: emailUser, pass: emailPass },
  });

  await transporter.sendMail({
    from: emailUser,
    to,
    subject: "DUN Account Approved - Registration Code",
    text: `Dear ${name},

Your DUN account request has been approved.
Region: ${roleDescription}
Registration code: ${roleCode}

Please use this registration code during sign-in.

Regards,
Parliament Dashboard`,
  });
}

// Normalize registration code input
function normalizeRoleCodeInput(value) {
  const raw = value?.toString().trim();
  if (!raw) return null;

  const upper = raw.toUpperCase();

  if (upper === "SUP") return "00000001";
  if (upper === "DUN") return "00000002";

  return raw.replace(/[^a-zA-Z0-9]/g, "");
}

// ================= SIGN UP =================
export const signUpAction = async (formData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const ic = formData.get("identification_number")?.toString();
  const register_code = normalizeRoleCodeInput(formData.get("register_code"));

  const supabase = await createClient();

  try {
    // 1. Validate input
    if (!email || !password || !name || !ic || !register_code) {
      return { status: "error", message: "All fields are required." };
    }

    // 2. Check registration code exists
    const { data: registerRole, error: regError } = await supabase
      .from("registration")
      .select("id, role_code")
      .eq("role_code", register_code)
      .single();

    if (regError || !registerRole) {
      return { status: "error", message: "Invalid registration code." };
    }

    const isAdmin = registerRole.role_code === "00000001";

    // RBAC rule: this flow is for DUN registration only.
    if (isAdmin) {
      return {
        status: "error",
        message: "Admin account is managed by system owner. Please sign up as DUN only.",
      };
    }

    // 3. 🚨 Prevent DUN code reuse - ensure this registration isn't already taken
    const { data: existingDun, error: existingError } = await supabase
      .from("dun")
      .select("id")
      .eq("id_register", registerRole.id)
      .limit(1);

    if (existingError) {
      console.error("Error checking existing DUN usage:", existingError);
      return { status: "error", message: "Sign-up failed." };
    }

    if (existingDun && existingDun.length > 0) {
      return { status: "error", message: "Registration code already used." };
    }

    // 4. Create auth user
    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    const user_id = signUpData?.user?.id;

    if (signUpError || !user_id) {
      return {
        status: "error",
        message: signUpError?.message || "Sign-up failed.",
      };
    }

    // 5. Insert into correct table
    const payload = {
      user_id,
      name,
      email,
      ic,
      id_register: registerRole.id,
      status: "Pending",
    };

    await insertUserData("dun", payload);

    return {
      status: "success",
      message:
        "Thanks for signing up! Check your email for a verification link.",
    };
  } catch (error) {
    console.error("Sign-up error:", error);
    return { status: "error", message: "Sign-up failed." };
  }
};

// ================= SIGN IN =================
export const signInAction = async (formData) => {
  const supabase = await createClient();

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const register_code = normalizeRoleCodeInput(formData.get("register_code"));

  if (!email || !password || !register_code) {
    return encodedRedirect("error", "/sign-in", "All fields are required.");
  }

  // 1. Validate registration code
  const { data: regRow, error: regError } = await supabase
    .from("registration")
    .select("id, role_code")
    .eq("role_code", register_code)
    .single();

  if (regError || !regRow) {
    return encodedRedirect("error", "/sign-in", "Invalid registration code.");
  }

  const isAdmin = regRow.role_code === "00000001";

  // 2. Fetch user WITH role verification
  let user, userError;

  if (isAdmin) {
    ({ data: user, error: userError } = await supabase
      .from("admin")
      .select("status")
      .eq("email", email)
      .eq("id_register", regRow.id)
      .single());
  } else {
    ({ data: user, error: userError } = await supabase
      .from("dun")
      .select("status")
      .eq("email", email)
      .eq("id_register", regRow.id)
      .single());
  }

  if (userError || !user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "Invalid credentials or role mismatch."
    );
  }

  if (!isAdmin && user.status !== "Approved") {
    return encodedRedirect("error", "/sign-in", "Your DUN account is pending admin approval.");
  }

  // 3. Authenticate
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
    "Welcome back!"
  );
};

// ================= APPROVE DUN =================
export const approveDunAction = async ({ dunId }) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return { status: "error", message: "Unauthorized request." };
  }

  // RBAC rule: only admin can approve DUN.
  const { data: adminRow, error: adminError } = await supabase
    .from("admin")
    .select("id")
    .eq("email", user.email)
    .single();

  if (adminError || !adminRow) {
    return { status: "error", message: "Only admin can approve DUN accounts." };
  }

  const { data: dunRow, error: dunError } = await supabase
    .from("dun")
    .select("id, name, email, status, registration:registration(role_code,description)")
    .eq("id", dunId)
    .single();

  if (dunError || !dunRow) {
    return { status: "error", message: "DUN record not found." };
  }

  if (dunRow.status === "Approved") {
    return { status: "success", message: "DUN already approved." };
  }

  const { error: updateError } = await supabase
    .from("dun")
    .update({ status: "Approved" })
    .eq("id", dunId);

  if (updateError) {
    return { status: "error", message: "Failed to approve DUN account." };
  }

  try {
    await sendApprovalEmail({
      to: dunRow.email,
      name: dunRow.name,
      roleCode: dunRow.registration?.role_code || "",
      roleDescription: dunRow.registration?.description || "",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return {
      status: "error",
      message: "DUN approved, but failed to send registration code email.",
    };
  }

  return {
    status: "success",
    message: "DUN approved and registration code sent by email.",
  };
};

// ================= FORGOT PASSWORD =================
export const forgotPasswordAction = async (formData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for reset link."
  );
};

// ================= RESET PASSWORD =================
export const resetPasswordAction = async (formData) => {
  const supabase = await createClient();

  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "All fields required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  return encodedRedirect(
    "success",
    "/protected/reset-password",
    "Password updated"
  );
};

// ================= SIGN OUT =================
export const signOutAction = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return redirect("/protected/dashboard");
  }

  return redirect("/");
};