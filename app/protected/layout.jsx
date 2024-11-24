// app/protected/layout.js
import React from "react";
import Sidebar from "@/components/sidebar";

export default function ProtectedLayout({ children }) {
  return (
    <div className="flex bg-slate-700 min-h-screen">
      <Sidebar />
      {/* Page content - will change depending on the page */}
      <div className="flex-1 bg-slate-100 px-4 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}
