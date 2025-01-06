"use client";
import { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { Skeleton } from "@nextui-org/skeleton";
import LegendCategory from "@/components/legend-category";

Chart.register(...registerables);

const PieCategory = ({ filteredForm }) => {
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({
    "Kesejahteraan Rakyat": 0,
    Pendidikan: 0,
    Keagamaan: 0,
    "NGO/Pertubuhan": 0,
    Bencana: 0,
    "Pusat Khidmat": 0,
  });

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!filteredForm || !Array.isArray(filteredForm)) {
      setLoading(false);
      return;
    }

    const category_counts = {
      "Kesejahteraan Rakyat": 0,
      Pendidikan: 0,
      Keagamaan: 0,
      "NGO/Pertubuhan": 0,
      Bencana: 0,
      "Pusat Khidmat": 0,
    };

    try {
      filteredForm.forEach((form) => {
        if (form?.category_type in category_counts) {
          category_counts[form.category_type]++;
        }
      });
      setCategoryCounts(category_counts);
    } catch (error) {
      console.error("Error calculating category counts:", error);
    } finally {
      setLoading(false);
    }
  }, [filteredForm]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const dataValues = Object.values(categoryCounts);

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: dataValues,
            backgroundColor: [
              "#f59e0b",
              "#f43f5e",
              "#1d4ed8",
              "#d946ef",
              "#a855f7",
              "#0ea5e9",
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
              title: (context) => Object.keys(categoryCounts)[context[0].dataIndex],
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

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [categoryCounts]);

  const [currentYear, setCurrentYear] = useState(null);
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  const hasData = Object.values(categoryCounts).some((count) => count > 0);

  return (
    <main className="w-1/2 bg-slate-50 rounded border shadow shadow-gray-400">
      <Skeleton isLoaded={!loading}>
        <article className="flex flex-col gap-y-4 p-4 justify-center items-center w-full h-full">
          <h1 className="text-xl text-center my-4">Bantuan Kebajikan Mengikut Kategori {currentYear}</h1>
          <div className="chart-container w-[300px] h-[300px]">
            {hasData ? (
              <canvas ref={canvasRef} id="categoryChart" className="w-full h-full"></canvas>
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
