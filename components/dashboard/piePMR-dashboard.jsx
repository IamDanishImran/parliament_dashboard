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
    Kesejahteraan_Rakyat: 0,
    Pendidikan: 0,
    Keagamaan: 0,
    NGO_Pertubuhan: 0,
    Bencana: 0,
    Pusat_Khidmat: 0,
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
          MOHON: 0,
          LULUS: 0,
          DITOLAK: 0,
          KIV: 0,
        };

        // Loop through the form data and count each form_status
        data.forEach((form) => {
          if (form.form_status === "MOHON") form_status_counts.MOHON++;
          if (form.form_status === "LULUS") form_status_counts.LULUS++;
          if (form.form_status === "DITOLAK") form_status_counts.DITOLAK++;
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
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} forms`,
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
