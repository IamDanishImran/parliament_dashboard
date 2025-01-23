// components/Sidebar.jsx
"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { Skeleton } from "@nextui-org/react";

export default function Sidebar({ userRole }) {
  const pathname = usePathname();
  const [isAdminWithAccess, setIsAdminWithAccess] = useState(false);
  const [isAccessAllAdmin, setAccessAllAdmin] = useState(false);

  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Check if the user role is allowed to access Help Center
      if (userRole === "25048082") {
        setIsAdminWithAccess(true);
      } else if (userRole === "80845621") {
        setIsAdminWithAccess(false);
      } else {
        setIsAdminWithAccess(true);
      }
    } catch {
      console.log("Error to check admin role");
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    try {
      // Check if the user is admin to allow access to User Management
      if (userRole === "80845621" || userRole === "25048082") {
        setAccessAllAdmin(true);
      } else {
        setAccessAllAdmin(false);
      }
    } catch {
      console.log("Error to set access to Admins");
    }
  }, [userRole]);

  return (
    <div className="bg-slate-50 w-60 h-screen flex flex-col">
      <nav className="flex-1 p-4">
        <div>
          <img src="/parliament_logo.svg" alt="dashboard-logo" className="w-full h-18" />
        </div>
        <div className="bg-slate-300 w-full h-0.5"></div>

        <Skeleton isLoaded={!loading}>
          <div
            className={`text-sm rounded px-4 py-2 m-1 mt-6 ${
              pathname === "/protected/dashboard"
                ? "bg-indigo-600 text-slate-50 pointer-events-none"
                : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"
            } duration-200`}
          >
            <Link href="/protected/dashboard">Dashboard</Link>
          </div>
        </Skeleton>

        <Skeleton isLoaded={!loading}>
          <div
            className={`text-sm rounded px-4 py-2 m-1 mt-4 ${
              pathname === "/protected/rekod"
                ? "bg-indigo-600 text-slate-50 pointer-events-none"
                : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"
            } duration-200`}
          >
            <Link href="/protected/rekod">Record</Link>
          </div>
        </Skeleton>

        <Skeleton isLoaded={!loading}>
          <div
            className={`text-sm rounded px-4 py-2 m-1 mt-4 ${
              pathname === "/protected/bantuan_kebajikan"
                ? "bg-indigo-600 text-slate-50 pointer-events-none"
                : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"
            } duration-200`}
          >
            <Link href="/protected/bantuan_kebajikan">Welfare Assistance</Link>
          </div>
        </Skeleton>

        <Skeleton isLoaded={!loading}>
          <div
            className={`text-sm rounded px-4 py-2 m-1 mt-4 ${
              pathname === "/protected/bantuan_mesra"
                ? "bg-indigo-600 text-slate-50 pointer-events-none"
                : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"
            } duration-200`}
          >
            <Link href="/protected/bantuan_mesra">Community Outreach Program (COP)</Link>
          </div>
        </Skeleton>
      </nav>
      <div className="p-4">
        <Skeleton isLoaded={!loading && isAdminWithAccess}>
          {isAdminWithAccess && (
            <div
              className={`text-sm rounded px-4 py-2 m-1 mt-4 ${
                pathname === "/protected/help"
                  ? "bg-indigo-600 text-slate-50 pointer-events-none"
                  : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"
              } duration-200`}
            >
              <Link href="/protected/help">Help Center</Link>
            </div>
          )}
        </Skeleton>

        <Skeleton isLoaded={!loading && isAccessAllAdmin}>
          {isAccessAllAdmin && (
            <div
              className={`text-sm rounded px-4 py-2 m-1 mt-4 ${
                pathname === "/protected/user_management"
                  ? "bg-indigo-600 text-slate-50 pointer-events-none"
                  : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"
              } duration-200`}
            >
              <Link href="/protected/user_management">User Management</Link>
            </div>
          )}
        </Skeleton>

        <Skeleton isLoaded={!loading}>
          <div
            className={`text-sm rounded px-4 py-2 m-1 mt-4 ${
              pathname === "/protected/sign-out"
                ? "bg-indigo-600 text-slate-50 pointer-events-none"
                : "bg-slate-50 hover:bg-indigo-100 text-slate-700 hover:text-indigo-600"
            } duration-200`}
          >
            <form onSubmit={signOutAction} method="POST">
              <button type="submit">Sign out</button>
            </form>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}
