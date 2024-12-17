"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { createClient } from "@/utils/supabase/client";

export default function ProtectedLayout({ children }) {
  const supabase = createClient();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("User not authenticated");

        const email = user.email;

        // Check `dun` table
        const { data: userDun, error: dunError } = await supabase
          .from("dun")
          .select("id_register")
          .eq("email", email);

        if (dunError) throw dunError;

        if (userDun && userDun.length > 0) {
          const idRegister = userDun[0].id_register;
          const { data: register, error: registerError } = await supabase
            .from("registration")
            .select("role_code")
            .eq("id", idRegister);

          if (registerError) throw registerError;

          if (register && register.length > 0) {
            setUserRole(register[0].role_code);
            return;
          }
        }

        // Check `admin` table
        const { data: userAdmin, error: adminError } = await supabase
          .from("admin")
          .select("id_register")
          .eq("email", email);

        if (adminError) throw adminError;

        if (userAdmin && userAdmin.length > 0) {
          const idRegister = userAdmin[0].id_register;
          const { data: register, error: registerError } = await supabase
            .from("registration")
            .select("role_code")
            .eq("id", idRegister);

          if (registerError) throw registerError;

          if (register && register.length > 0) {
            setUserRole(register[0].role_code);
            return;
          }
        }

        // Default if no role is found
        setUserRole("No Role");
      } catch (err) {
        console.error("Error fetching user role:", err.message);
        setUserRole("Error");
      }
    };

    fetchUserData();
  }, [supabase]);

  return (
    <div className="flex bg-slate-700 min-h-screen font-sans subpixel-antialiased">
      <Sidebar userRole={userRole} />
      {/* Page content */}
      <div className="flex-1 bg-slate-100 px-4 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}
