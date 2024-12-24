"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import LegendStatus from "@/components/legend-status";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const ChartPMR = () => {
  const supabase = createClient();

  const [statusCounts, setStatusCounts] = useState({
    Mohon: 0,
    Lulus: 0,
    Ditolak: 0,
    KIV: 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        // Fetch all form data including form_status
        const { data, error } = await supabase
          .from("form")
          .select("form_status")
          .eq("category", "Program Mesra Rakyat");

        if (error) {
          throw new Error(error.message);
        }

        // Initialize the status counts
        const form_status_counts = {
          Mohon: 0,
          Lulus: 0,
          Ditolak: 0,
          KIV: 0,
        };

        // Loop through the form data and count each form_status
        data.forEach((form) => {
          if (form.form_status === "MOHON") form_status_counts.Mohon++;
          if (form.form_status === "LULUS") form_status_counts.Lulus++;
          if (form.form_status === "DITOLAK") form_status_counts.Ditolak++;
          if (form.form_status === "KIV") form_status_counts.KIV++;
        });

        // Update the state with the new status counts
        setStatusCounts(form_status_counts);
      } catch (error) {
        console.error("Error fetching form status counts:", error);
      }
    };

    fetchStatusCounts();
  }, []);


  useEffect(() => {
    const ctx = document.getElementById("pmrChart").getContext("2d");
    const dataValues = Object.values(statusCounts);
    // Initialize Chart.js
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: dataValues,
            backgroundColor: [
              "#fef08a", // MOHON
              "#4ade80", // LULUS
              "#ef4444", // DITOLAK
              "#22d3ee", // KIV
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return Object.keys(statusCounts)[index];
              },
              label: (context) => {
                // const status = Object.keys(statusCounts)[context.dataIndex];
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

    // Cleanup to prevent chart duplication on re-renders
    return () => {
      chart.destroy();
    };
  }, [statusCounts]);

  return (
    <article className="flex flex-col bg-slate-50 gap-y-4 p-4 justify-center items-center w-1/2 h-auto rounded border shadow shadow-gray-400">
      <h1 className="text-xl">Program Mesra Rakyat</h1>
      <div className="chart-container w-[300px] h-[300px]">
        <canvas id="pmrChart" className="w-full h-full"></canvas>
      </div>
      <LegendStatus />
    </article>
  );
};

export default ChartPMR;
