// components/Sidebar.jsx
"use client";
import { createClient } from "@/utils/supabase/client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/actions";

export default function Sidebar({ userRole }) {
  const pathname = usePathname();
  const [isAdminWithAccess, setIsAdminWithAccess] = useState(false);
  const [isAccessAllAdmin, setAccessAllAdmin] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Check if the user role is allowed to access Help Center
    if (userRole === "25048082") { setIsAdminWithAccess(true); }
    if(userRole === "80845621") { setIsAdminWithAccess(false); }
    else { setIsAdminWithAccess(true); }
  }, [userRole]);

  // Check if the user is admin to allowed to access User Management
  useEffect(() => {
    if (userRole === "80845621" || userRole === "25048082") { setAccessAllAdmin(true) }
    else { setAccessAllAdmin(false) }
  }, [userRole]);

  return (
    <div className="bg-slate-50 w-60 h-screen flex flex-col">
      <nav className="flex-1 p-4">
        <div> 
          <img src="/logo.svg" alt="dashboard-logo" className="w-full h-18" />
        </div>
        <div className="bg-slate-300 w-full h-0.5"></div>
        <div className={`text-sm rounded px-4 py-2 m-1 mt-6 ${pathname === "/protected/dashboard" ? "bg-indigo-600 text-slate-50 pointer-events-none" : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"} duration-200`}>
          <Link href="/protected/dashboard">Dashboard</Link>
        </div>
        <div className={`text-sm rounded px-4 py-2 m-1 mt-4 ${pathname === "/protected/rekod" ? "bg-indigo-600 text-slate-50 pointer-events-none" : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"} duration-200`}>
          <Link href="/protected/rekod">Rekod</Link>
        </div>
        <div className={`text-sm rounded px-4 py-2 m-1 mt-4 ${pathname === "/protected/bantuan_kebajikan" ? "bg-indigo-600 text-slate-50 pointer-events-none" : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"} duration-200`}>
          <Link href="/protected/bantuan_kebajikan">Bantuan Kebajikan</Link>
        </div>
        <div className={`text-sm rounded px-4 py-2 m-1 mt-4 ${pathname === "/protected/bantuan_mesra" ? "bg-indigo-600 text-slate-50 pointer-events-none" : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"} duration-200`}>
          <Link href="/protected/bantuan_mesra">Program Mesra Rakyat (PMR)</Link>
        </div>
      </nav>
      <div className="p-4">

      {isAdminWithAccess && (
        <div className={`text-sm rounded px-4 py-2 m-1 mt-4 ${pathname === "/protected/help" ? "bg-indigo-600 text-slate-50 pointer-events-none" : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"} duration-200`}>
          <Link href="/protected/help">Help Center</Link>
        </div>
      )}

      {isAccessAllAdmin && (
        <div className={`text-sm rounded px-4 py-2 m-1 mt-4 ${pathname === "/protected/user_management" ? "bg-indigo-600 text-slate-50 pointer-events-none" : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"} duration-200`}>
          <Link href="/protected/user_management">User Management</Link>
      </div>
      )}
        <div className={`text-sm rounded px-4 py-2 m-1 mt-4 ${pathname === "/protected/sign-out" ? "bg-indigo-600 text-slate-50 pointer-events-none" : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"} duration-200`}>
          <form action={signOutAction} method="post">
            <button type="submit">Sign out</button>
          </form>
        </div>
      </div>
    </div>
  );
}