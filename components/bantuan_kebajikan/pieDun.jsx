"use client";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Skeleton } from "@nextui-org/skeleton"; // Import Skeleton component
import LegendDun from "@/components/legend-dun";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const PieDun = ({ filteredForm }) => {
  const [loading, setLoading] = useState(true); // Loading state for Skeleton
  const [dunCounts, setDunCounts] = useState({
    "Rembia": 0,
    "Gadek": 0,
    "Machap Jaya": 0,
    "Asahan": 0,
    "Durian Tunggal": 0,
    "Luar Alor_Gajah": 0,
    "Luar Melaka": 0,
  });

  useEffect(() => {
    const dun_counts = {
      "Rembia": 0,
      "Gadek": 0,
      "Machap Jaya": 0,
      "Asahan": 0,
      "Durian Tunggal": 0,
      "Luar Alor_Gajah": 0,
      "Luar Melaka": 0,
    };

    // Loop through the filteredForm data
    filteredForm.forEach((form) => {
      if (form?.dun?.id_register?.description === "Rembia") dun_counts["Rembia"]++;
      if (form?.dun?.id_register?.description === "Gadek") dun_counts["Gadek"]++;
      if (form?.dun?.id_register?.description === "Machap Jaya") dun_counts["Machap Jaya"]++;
      if (form?.dun?.id_register?.description === "Asahan") dun_counts["Asahan"]++;
      if (form?.dun?.id_register?.description === "Durian Tunggal") dun_counts["Durian Tunggal"]++;
      if (form?.dun?.id_register?.description === "Luar Alor Gajah") dun_counts["Luar Alor_Gajah"]++;
      if (form?.dun?.id_register?.description === "Luar Melaka") dun_counts["Luar Melaka"]++;
    });

    // Update the dun count
    setDunCounts(dun_counts);
    setLoading(false); // Set loading to false once data is processed
  }, [filteredForm]);

  useEffect(() => {
    const ctx = document.getElementById("pmrChart");
    const dataValues = Object.values(dunCounts);

    // Initialize Chart.js
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
              "#2e1065", // Luar Melaka
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
      dunChart.destroy();
    };
  }, [dunCounts]);

  const hasData = Object.values(dunCounts).some(count => count > 0);

  return (
    <main className="w-1/2 bg-slate-50 rounded border shadow shadow-gray-400">
      <Skeleton isLoaded={!loading}>
      <article className="flex flex-col gap-y-4 p-4 justify-center items-center w-full h-full">
      <h1 className="text-xl text-center">Program Mesra Rakyat</h1>
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
