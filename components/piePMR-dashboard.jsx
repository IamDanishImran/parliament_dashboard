// components/piePMR-dashboard.jsx
"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Chart } from "chart.js";
import LegendStatus from "@/components/legend-status";

const ChartPMR = ({ categoryId }) => {
  const supabase = createClient();
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("form")
          .select("form_status")
          .eq("category", "Program Mesra Rakyat");

        if (error) {
          console.error("Error fetching data:", error.message);
          return;
        }

        // Mapping for status to labels
        const statusToLabel = {
          MOHON: "Sedang Proses",
          LULUS: "Lulus",
          DITOLAK: "Ditolak",
          KIV: "Kiv",
        };

        // Count occurrences of each status
        const statusCount = { MOHON: 0, LULUS: 0, DITOLAK: 0, KIV: 0 };

        (data || []).forEach((item) => {
          statusCount[item.form_status] =
            (statusCount[item.form_status] || 0) + 1;
        });

        // Extract labels and data for the chart
        setChartLabels(Object.keys(statusToLabel).map((key) => statusToLabel[key]));
        setChartData([
          statusCount.MOHON,
          statusCount.LULUS,
          statusCount.DITOLAK,
          statusCount.KIV,
        ]);
      } catch (err) {
        console.error("Error:", err.message);
      }
    };

    fetchData();
  }, [categoryId]);

  useEffect(() => {
    if (chartData.length === 0) return;

    const PMR_Chart = document.getElementById("pmrChart");

    if (!PMR_Chart) {
      console.error("Chart element not found!");
      return;
    }

    const data = {
      datasets: [
        {
          label: "Program Status",
          data: chartData,
          backgroundColor: ["#fef08a", "#4ade80", "#ef4444", "#22d3ee"],
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
    };

    const chartInstance = new Chart(PMR_Chart, {
      type: "doughnut",
      data,
      options,
    });

    return () => {
      chartInstance.destroy();
    };
  }, [chartData, chartLabels]);

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
