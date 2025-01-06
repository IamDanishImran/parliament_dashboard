"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Skeleton } from "@nextui-org/skeleton";
import LegendStatus from "@/components/legend-status";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const ChartPMR = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    Mohon: 0, Lulus: 0, Ditolak: 0, KIV: 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const { data, error } = await supabase
          .from("form")
          .select("form_status")
          .eq("category", "Program Mesra Rakyat");
        if (error) throw new Error(error.message);

        const counts = { Mohon: 0, Lulus: 0, Ditolak: 0, KIV: 0 };
        data.forEach((form) => {
          const status = form.form_status?.toUpperCase();
          if (status === "MOHON") counts.Mohon++;
          if (status === "LULUS") counts.Lulus++;
          if (status === "DITOLAK") counts.Ditolak++;
          if (status === "KIV") counts.KIV++;
        });
        setStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching form status counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById("pmrChart")?.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: Object.values(statusCounts),
            backgroundColor: ["#fef08a", "#4ade80", "#ef4444", "#22d3ee"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (context) => Object.keys(statusCounts)[context[0].dataIndex],
              label: (context) => {
                const value = context.raw || 0;
                const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(2);
                return `${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    return () => chart?.destroy();
  }, [statusCounts]);

  return (
    <main className="w-1/2 bg-slate-50 rounded border shadow shadow-gray-400">
      <Skeleton isLoaded={!loading}>
        <article className="flex flex-col gap-y-8 p-4 justify-center items-center w-full h-full">
          <h1 className="text-xl">Program Mesra Rakyat</h1>
          <div className="chart-container w-[300px] h-[300px]">
            <canvas id="pmrChart" className="w-full h-full"></canvas>
          </div>
          <LegendStatus />
        </article>
      </Skeleton>
    </main>
  );
};

export default ChartPMR;
