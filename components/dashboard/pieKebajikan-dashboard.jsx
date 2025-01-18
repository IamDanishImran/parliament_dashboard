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
    "Public Well-Being": 0,
    "Education": 0,
    "Religious": 0,
    "NGO Pertubuhan": 0,
    "Disaster": 0,
    "Service Center": 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const { data, error } = await supabase
          .from("form")
          .select("category_type")
          .eq("category", "Welfare Assistance Program");
        if (error) {
          throw new Error(error.message);
        }

        const category_type_counts = {
          "Public Well-Being": 0,
          "Education": 0,
          "Religious": 0,
          "NGO/Organization": 0,
          "Disaster": 0,
          "Service Center": 0,
        };

        data.forEach((form) => {
          if (form.category_type === "Public Well-Being") category_type_counts["Public Well-Being"]++;
          if (form.category_type === "Education") category_type_counts["Education"]++;
          if (form.category_type === "Disaster") category_type_counts["Disaster"]++;
          if (form.category_type === "NGO/Organization") category_type_counts["NGO/Organization"]++;
          if (form.category_type === "Religious") category_type_counts["Religious"]++;
          if (form.category_type === "Service Center") category_type_counts["Service Center"]++;
        });

        setStatusCounts(category_type_counts);
      } catch (error) {
        console.log("Error fetching category type counts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("kebajikanChart");
    if (!canvas) {
      console.log("Canvas element not found");
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
                "#f59e0b", // Public Well-Being
                "#f43f5e", // Education
                "#1d4ed8", // Religious
                "#d946ef", // NGO/Organization
                "#a855f7", // Disaster
                "#0ea5e9", // Service Center
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
          console.log("Error destroying chart:", error);
        }
      };
    } catch (error) {
      console.log("Error initializing chart:", error);
    }
  }, [statusCounts]);
  const hasData = Object.values(statusCounts).some((count) => count > 0);

  return (
    <main className="w-1/2 bg-slate-50 rounded border shadow shadow-gray-400">
      <Skeleton isLoaded={!loading}>
        <article className="flex flex-col gap-y-4 p-4 justify-center items-center w-full h-full">
          <h1 className="text-xl">Welfare Assistance Program</h1>
          <div className="chart-container w-[300px] h-[300px]">
            {hasData ? (
              <canvas id="kebajikanChart" className="w-full h-full"></canvas>
            ) : (
              <div className="flex justify-center items-center w-full h-full text-gray-500">
                <p className="text-center text-black">No Data</p>
              </div>
            )}
          </div>
          <LegendCategory />
        </article>
      </Skeleton>
    </main>
  );
};

export default ChartKebajikan;
