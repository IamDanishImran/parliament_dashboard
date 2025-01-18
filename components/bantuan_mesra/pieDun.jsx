"use client";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Skeleton } from "@nextui-org/skeleton";
import LegendDun from "@/components/legend-dun";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const PieDun = ({ filteredForm }) => {
  const [loading, setLoading] = useState(true);
  const [dunCounts, setDunCounts] = useState({
    "Rembia": 0,
    "Gadek": 0,
    "Machap Jaya": 0,
    "Asahan": 0,
    "Durian Tunggal": 0,
    "Outside Alor Gajah": 0,
    "Outside Melaka": 0,
  });

  useEffect(() => {
    try {
      const dun_counts = {
        "Rembia": 0,
        "Gadek": 0,
        "Machap Jaya": 0,
        "Asahan": 0,
        "Durian Tunggal": 0,
        "Outside Alor Gajah": 0,
        "Outside Melaka": 0,
      };
  
      // Loop through the filteredForm data
      filteredForm.forEach((form) => {
        if (form?.dun?.id_register?.description === "Rembia") dun_counts["Rembia"]++;
        if (form?.dun?.id_register?.description === "Gadek") dun_counts["Gadek"]++;
        if (form?.dun?.id_register?.description === "Machap Jaya") dun_counts["Machap Jaya"]++;
        if (form?.dun?.id_register?.description === "Asahan") dun_counts["Asahan"]++;
        if (form?.dun?.id_register?.description === "Durian Tunggal") dun_counts["Durian Tunggal"]++;
        if (form?.dun?.id_register?.description === "Luar Alor Gajah") dun_counts["Outside Alor Gajah"]++;
        if (form?.dun?.id_register?.description === "Outside Melaka") dun_counts["Outside Melaka"]++;
      });
  
      // Update the dun count
      setDunCounts(dun_counts);
    } catch (error) {
      console.error("Error calculating category counts:", error);
    } finally {
      setLoading(false);
    }
  }, [filteredForm]);

  useEffect(() => {
    if (loading) return;  // Ensure that the chart is only created when data is loaded
  
    const ctx = document.getElementById("pmrChart");
    if (!ctx) return;  // Check if the canvas element exists
  
    const dataValues = Object.values(dunCounts);
    const dunChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: dataValues,
            backgroundColor: [
              "#581c87",  // Rembia
              "#701a75",   // Gadek
              "#9d174d", // Machap Jaya
              "#bfdbfe", // Asahan
              "#fb923c", // Durian Tunggal
              "#fca5a5",   // Luar Alor Gajah
              "#2e1065", // Outside Melaka
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
                return Object.keys(dunCounts)[index];
              },
              label: (context) => {
                const index = context.dataIndex;
                const total = Object.values(dunCounts).reduce((a, b) => a + b, 0);
                const percentage = ((dataValues[index] / total) * 100).toFixed(2);
                return `${dataValues[index]} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  
    return () => {
      if (dunChart) {
        dunChart.destroy();
      }
    };
  }, [dunCounts, loading]); // Add loading as a dependency
  

  const [currentYear, setCurrentYear] = useState(null);
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  const hasData = Object.values(dunCounts).some(count => count > 0);

  return (
    <main className="w-1/2 bg-slate-50 rounded border shadow shadow-gray-400">
      <Skeleton isLoaded={!loading}>
        <article className="flex flex-col gap-y-4 p-4 justify-center items-center w-full h-full">
      <h1 className="text-xl text-center my-4">Community Outreach Program by Dun {currentYear}</h1>
      <div className="chart-container w-[300px] h-[300px]">
        {hasData ? (
          <canvas id="pmrChart" className="w-full h-full"></canvas>
        ) : (
          <div className="flex justify-center items-center w-full h-full text-gray-500">
            <p className="text-center text-black">No Data</p>
          </div>
        )}
      </div>
      <LegendDun />
    </article>
      </Skeleton>
    </main>
  );
};

export default PieDun;
