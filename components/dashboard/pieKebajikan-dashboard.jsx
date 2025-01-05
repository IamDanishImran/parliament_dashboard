"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Skeleton } from "@nextui-org/skeleton";
import LegendCategory from "@/components/legend-category";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const ChartKebajikan = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({
    "Kesejahteraan Rakyat": 0,
    "Pendidikan": 0,
    "Keagamaan": 0,
    "NGO Pertubuhan": 0,
    "Bencana": 0,
    "Pusat Khidmat": 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const { data, error } = await supabase
          .from("form")
          .select("category_type")
          .eq("category", "Bantuan Kebajikan");
        if (error) {
          throw new Error(error.message);
        }

        const category_type_counts = {
          "Kesejahteraan Rakyat": 0,
          "Pendidikan": 0,
          "Keagamaan": 0,
          "NGO/Pertubuhan": 0,
          "Bencana": 0,
          "Pusat Khidmat": 0,
        };

        data.forEach((form) => {
          if (form.category_type === "Kesejahteraan Rakyat") category_type_counts["Kesejahteraan Rakyat"]++;
          if (form.category_type === "Pendidikan") category_type_counts["Pendidikan"]++;
          if (form.category_type === "Bencana") category_type_counts["Bencana"]++;
          if (form.category_type === "NGO/Pertubuhan") category_type_counts["NGO/Pertubuhan"]++;
          if (form.category_type === "Keagamaan") category_type_counts["Keagamaan"]++;
          if (form.category_type === "Pusat Khidmat") category_type_counts["Pusat Khidmat"]++;
        });

        setStatusCounts(category_type_counts);
      } catch (error) {
        console.error("Error fetching category type counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("kebajikanChart");
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
    const ctx = canvas.getContext("2d");

    try {
      const dataValues = Object.values(statusCounts);

      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: dataValues,
              backgroundColor: [
                "#f59e0b", // Kesejahteraan Rakyat
                "#f43f5e", // Pendidikan
                "#1d4ed8", // Keagamaan
                "#d946ef", // NGO/Pertubuhan
                "#a855f7", // Bencana
                "#0ea5e9", // Pusat Khidmat
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

      return () => {
        try {
          chart.destroy();
        } catch (error) {
          console.error("Error destroying chart:", error);
        }
      };
    } catch (error) {
      console.error("Error initializing chart:", error);
    }
  }, [statusCounts]);

  return (
    <main className="w-1/2 bg-slate-50 rounded border shadow shadow-gray-400">
      <Skeleton isLoaded={!loading}>
        <article className="flex flex-col gap-y-4 p-4 justify-center items-center w-full h-full">
          <h1 className="text-xl">Bantuan Kebajikan</h1>
          <div className="chart-container w-[300px] h-[300px]">
            <canvas id="kebajikanChart" className="w-full h-full"></canvas>
          </div>
          <LegendCategory />
        </article>
      </Skeleton>
    </main>
  );
};

export default ChartKebajikan;
