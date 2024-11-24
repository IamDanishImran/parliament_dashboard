// components/Sidebar.jsx
"use client"; // Ensure this component is a Client Component

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-slate-50 w-60 h-screen flex flex-col">
    </div>
  );
}