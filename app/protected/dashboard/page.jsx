// Dashboard
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
      toast.success("Welcome back!");
    }
  }, [searchParams]);

  return (
    <main className="pt-4 p-2 pl-10 pr-20">
      <ToastContainer />
      <Header title="Dashboard" />
      <br />
      <PanelStatus />
      <br />
      <PanelAnalysis />
      <br />
      <section id="chart-pie" className="flex w-full h-full gap-4">
        <ChartPMR /> {/* Chart Program Mesra Rakyat */}
        <ChartKebajikan /> {/* Chart Bantuan Kebajikan */}
      </section>
      <br /><br />
      <BarGraph /> {/* Bar Graph Section */}
      <Footer />
    </main>
  );
}