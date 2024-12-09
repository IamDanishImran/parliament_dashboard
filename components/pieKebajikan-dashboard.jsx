"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Chart } from "chart.js";
import LegendCategory from "@/components/legend-category";

const ChartKebajikan = () => {
  const supabase = createClient();
  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("form")
          .select("category_type")
          .eq("category", "Bantuan Kebajikan");

        if (error) {
          console.error("Error fetching data:", error.message);
          return;
        }

        // Mapping for status to labels
        const statusToLabel = {
          Kesejahteraan_Rakyat: "Kesejahteraan Rakyat",
          Pendidikan: "Pendidikan",
          NGO_Pertubuhan: "NGO/Pertubuhan",
          Bencana: "Bencana",
          Keagamaan: "Keagamaan",
          Pusat_Khidmat: "Pusat Khidmat",
        };

        // Count occurrences of each status
        const statusCount = { 
          Kesejahteraan_Rakyat: 0, 
          Pendidikan: 0, 
          NGO_Pertubuhan: 0, 
          Bencana: 0, 
          Keagamaan: 0, 
          Pusat_Khidmat: 0 
        };

        (data || []).forEach((item) => {
          statusCount[item.form_status] =
            (statusCount[item.form_status] || 0) + 1;
        });

        // Extract labels and data for the chart
        setChartLabels(Object.keys(statusToLabel).map((key) => statusToLabel[key]));
        setChartData([
          statusCount.Kesejahteraan_Rakyat,
          statusCount.Pendidikan,
          statusCount.NGO_Pertubuhan,
          statusCount.Bencana,
          statusCount.Keagamaan,
          statusCount.Pusat_Khidmat,
        ]);
      } catch (err) {
        console.error("Error:", err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData.length === 0) return;

    const Kebajikan_Chart = document.getElementById("kebajikanChart");

    if (!Kebajikan_Chart) {
      console.error("Chart element not found!");
      return;
    }

    const data = {
      datasets: [
        {
          label: "Program Status",
          data: chartData,
          backgroundColor: ["#fef08a", "#4ade80", "#ef4444", "#22d3ee", "#f97316", "#9333ea"],
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

    const chartInstance = new Chart(Kebajikan_Chart, {
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
      <h1 className="text-xl">Bantuan Kebajikan</h1>
      <div className="chart-container w-[300px] h-[300px]">
        <canvas id="kebajikanChart" className="w-full h-full"></canvas>
      </div>
      <LegendCategory />
    </article>
  );
};

export default ChartKebajikan;
