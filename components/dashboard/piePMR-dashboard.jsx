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
    "IN PROGRESS": 0, 
    "APPROVED": 0, 
    "REJECTED": 0, 
    "KIV": 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const { data, error } = await supabase
          .from("form")
          .select("form_status")
          .eq("category", "Community Outreach Program");
        if (error) throw new Error(error.message);

        const counts = { "IN PROGRESS": 0, "APPROVED": 0, "REJECTED": 0, "KIV": 0 };
        data.forEach((form) => {
          const status = form.form_status?.toUpperCase();
          if (status === "IN PROGRESS") counts["IN PROGRESS"]++;
          if (status === "APPROVED") counts["APPROVED"]++;
          if (status === "REJECTED") counts["REJECTED"]++;
          if (status === "KIV") counts["KIV"]++;
        });
        setStatusCounts(counts);
      } catch (error) {
        console.log("Error fetching form status counts:", error);
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
  const hasData = Object.values(statusCounts).some((count) => count > 0);

  return (
    <main className="w-full sm:w-1/2 bg-slate-50 rounded border shadow shadow-gray-400">
      <Skeleton isLoaded={!loading}>
      <article className="flex flex-col gap-y-4 p-4 justify-center items-center w-full h-full">
          <h1 className="text-xl text-center">Community Outreach Program</h1>
          <div className="chart-container w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]">
            {hasData ? (
              <canvas id="pmrChart" className="w-full h-full aspect-square"></canvas>
            ) : (
              <div className="flex justify-center items-center w-full h-full text-gray-500">
                <p className="text-center text-black">No Data</p>
              </div>
            )}
          </div>
          <LegendStatus />
        </article>
      </Skeleton>
    </main>
  );
};

export default ChartPMR;
