// app\protected\dashboard\page.jsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import ChartPMR from "@/components/dashboard/piePMR-dashboard";
import ChartKebajikan from "@/components/dashboard/pieKebajikan-dashboard";
import Header from "@/components/header";
import BarGraph from "@/components/dashboard/bar-dashboard";
import PanelStatus from "@/components/dashboard/panel-status";
import PanelAnalysis from "@/components/dashboard/panel-analysis";
import Footer from "@/components/footer";

export default function Dashboard() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const loginStatus = searchParams.get("login");
    console.log("Login status:", loginStatus);
    if (loginStatus && loginStatus.startsWith("success")) {
      toast.success("Welcome To Parliament Dashboard!");
    }
  }, [searchParams]);

  return (
    <main className="pt-6 sm:pt-4 sm:p-2 sm:pl-10 sm:pr-20">
      <ToastContainer />
      <Header title="Dashboard" navigator="Dashboard" />
      <br />
      <PanelStatus />
      <br />
      <PanelAnalysis />
      <br />
      <section id="chart-pie" className="flex flex-col sm:flex-row sm:w-full sm:h-full gap-4">
        <ChartPMR /> {/* Chart Community Outreach Program */}
        <ChartKebajikan /> {/* Chart Welfare Assistance Program */}
      </section>
      <br /><br />
      <BarGraph /> {/* Bar Graph Section */}
      <Footer />
    </main>
  );
}