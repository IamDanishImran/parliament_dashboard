// app/protected/layout.js
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
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setUserRole(null); // Default role if no user is logged in
          return;
        }

        const userId = user.id;

        // Check if the user is an admin
        const { data: adminData } = await supabase
          .from("admin")
          .select("id_register")
          .eq("user_id", userId)
          .single();

        if (adminData) {
          const { data: registrationData } = await supabase
            .from("registration")
            .select("role_code")
            .eq("id", adminData.id_register)
            .single();

          if (registrationData) {
            setUserRole(registrationData.role_code); // Set the role code
            return;
          }
        }

        // Check if the user is a DUN
        const { data: dunData } = await supabase
          .from("dun")
          .select("id_register")
          .eq("user_id", userId)
          .single();

        if (dunData) {
          const { data: registrationData } = await supabase
            .from("registration")
            .select("role_code")
            .eq("id", dunData.id_register)
            .single();

          if (registrationData) {
            setUserRole(registrationData.role_code); // Set the role code
            return;
          }
        }

        setUserRole(null); // Default if neither admin nor DUN
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserRole(null);
      }
    };

    fetchUserData();
  }, [supabase]);

  return (
    <div className="flex bg-slate-700 min-h-screen font-sans subpixel-antialiased">
      <Sidebar userRole={userRole} />
      {/* Page content - will change depending on the page */}
      <div className="flex-1 bg-slate-100 px-4 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}
