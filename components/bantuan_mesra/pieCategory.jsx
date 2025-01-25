"use client";
import { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { Skeleton } from "@nextui-org/skeleton";
import LegendCategory from "@/components/legend-category";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const PieCategory = ({ filteredForm }) => {
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({
    "Public Well-Being": 0,
    "Education": 0,
    "Religious": 0,
    "NGO/Organization": 0,
    "Disaster": 0,
    "Service Center": 0,
  });

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    try {
      if (!Array.isArray(filteredForm)) return;

    const category_counts = {
      "Public Well-Being": 0,
      "Education": 0,
      "Religious": 0,
      "NGO/Organization": 0,
      "Disaster": 0,
      "Service Center": 0,
    };

    // Loop through the filteredForm data
    filteredForm.forEach((form) => {
      if (form?.category_type === "Public Well-Being") category_counts["Public Well-Being"]++;
      if (form?.category_type === "Education") category_counts["Education"]++;
      if (form?.category_type === "Religious") category_counts["Religious"]++;
      if (form?.category_type === "NGO/Organization") category_counts["NGO/Organization"]++;
      if (form?.category_type === "Disaster") category_counts["Disaster"]++;
      if (form?.category_type === "Service Center") category_counts["Service Center"]++;
    });
    setCategoryCounts(category_counts);
    } catch(error) {
      console.error("Error calculating category counts:", error);
    } finally {
      setLoading(false);
    }
  }, [filteredForm]);

  useEffect(() => {
    try {
      if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const dataValues = Object.values(categoryCounts);

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart instance
    chartRef.current = new Chart(ctx, {
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
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return Object.keys(categoryCounts)[index];
              },
              label: (context) => {
                const index = context.dataIndex;
                const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
                const percentage = ((Object.values(categoryCounts)[index] / total) * 100).toFixed(2);
                return `${Object.values(categoryCounts)[index]} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
    // Cleanup to prevent chart duplication on re-renders
    return () => {
      try {
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }
      } catch (error) {
        console.error("Error initializing chart:", error);
      }
    };
    } catch (error) {
      console.error("Error initializing chart:", error);
    }
  }, [categoryCounts]);

  const [currentYear, setCurrentYear] = useState(null);
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  const hasData = Object.values(categoryCounts).some((count) => count > 0);

  return (
    <main className="w-full sm:w-1/2 bg-slate-50 rounded border shadow shadow-gray-400">
      <Skeleton isLoaded={!loading}>
      <article className="flex flex-col gap-y-4 p-4 justify-center items-center w-full h-full">
      <h1 className="text-xl text-center my-4">Community Outreach Program by Category {currentYear}</h1>
      <div className="chart-container w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]">
        {hasData ? (
          <canvas ref={canvasRef} id="categoryChart" className="w-full h-full aspect-square"></canvas>
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

export default PieCategory;