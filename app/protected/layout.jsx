// app\protected\layout.jsx
"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import MobileNav from "@/components/mobileNav";

export default function ProtectedLayout({ children }) {
  const supabase = createClient();
  const [userRole, setUserRole] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Listen for window resizing to determine screen size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint in Tailwind is 640px
    };

    // Set initial screen size
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    if (userRole === "No Role" || userRole === "Error") {
      router.push("/", { state: { showToast: true } });
    }
  }, [userRole, router]);

  if (userRole === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex bg-slate-700 min-h-screen font-sans subpixel-antialiased relative">
      {isMobile ? (
        <>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="absolute top-7 left-5 text-white bg-blue-500 p-2 rounded-md z-50"
          >
            {mobileNavOpen ? "Close Menu" : 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          }  
          </button>
          {mobileNavOpen && (
            <>
              {/* Background overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setMobileNavOpen(false)} // Close when clicking outside
              ></div>
  
              {/* MobileNav */}
              <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50">
                <MobileNav userRole={userRole} />
              </div>
            </>
          )}
        </>
      ) : (
        <Sidebar userRole={userRole} />
      )}
      <div className="flex-1 bg-slate-100 px-4 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
  
}
