// app\protected\layout.jsx
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }) {
  const supabase = createClient();
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  // This useEffect will always be called in the same order
  useEffect(() => {
    const fetchUserData = async () => {
      try {
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
        console.log("Error fetching user role:", err.message);
        setUserRole("Error");
      }
    };

    fetchUserData();
  }, [supabase]);

  // Only redirect when userRole is determined and needs redirect
  useEffect(() => {
    if (userRole === "No Role" || userRole === "Error") {
      // Redirect to the login page and pass state for showing the toast
      router.push("/", { state: { showToast: true } });
    }
  }, [userRole, router]);

  if (userRole === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-slate-700 min-h-screen font-sans subpixel-antialiased">
      <Sidebar userRole={userRole} />
      <div className="flex-1 bg-slate-100 px-4 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}
