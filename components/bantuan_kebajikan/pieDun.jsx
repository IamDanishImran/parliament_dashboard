"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import LegendDun from "@/components/legend-dun";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const ChartKebajikan = () => {
  const supabase = createClient();

  const [dunCounts, setDunCounts] = useState({
    "Rembia": 0,
    "Gadek": 0,
    "Machap Jaya": 0,
    "Asahan": 0,
    "Durian Tunggal": 0,
    "Luar Alor_Gajah": 0,
    "Luar Melaka": 0,
  });

  // Fetch form counts grouped by descriptions
  useEffect(() => {
    const fetchFormCountsByDescription = async () => {
      try {
        const { data, error } = await supabase
          .from("form")
          .select("id_dun(id_register(description))")
          .eq("category", "Bantuan Kebajikan");
  
        if (error) {
          throw new Error(error.message);
        }
  
        const dun_counts = {
          "Rembia": 0,
          "Gadek": 0,
          "Machap Jaya": 0,
          "Asahan": 0,
          "Durian Tunggal": 0,
          "Luar Alor_Gajah": 0,
          "Luar Melaka": 0,
        };
  
        // Loop through the fetched data
        data.forEach((form) => {
          if(form?.id_dun?.id_register?.description === "Rembia") dun_counts["Rembia"]++;
          if(form?.id_dun?.id_register?.description === "Gadek") dun_counts["Gadek"]++;
          if(form?.id_dun?.id_register?.description === "Machap Jaya") dun_counts["Machap Jaya"]++;
          if(form?.id_dun?.id_register?.description === "Asahan") dun_counts["Asahan"]++;
          if(form?.id_dun?.id_register?.description === "Durian Tunggal") dun_counts["Durian Tunggal"]++;
          if(form?.id_dun?.id_register?.description === "Luar Alor Gajah") dun_counts["Luar Alor_Gajah"]++;
          if(form?.id_dun?.id_register?.description === "Luar Melaka") dun_counts["Luar Melaka"]++;
        });

        // Update the dun count
        setDunCounts(dun_counts); 
      } catch (error) {
        console.error("Error fetching form counts by description:", error);
        return null;
      }
    };

    fetchFormCountsByDescription();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById("pmrChart").getContext("2d");
    const dataValues = Object.values(dunCounts);

    // Destroy existing chart if it exists
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

  // Display Current Year
  const currentYear = new Date().getFullYear();

  return (
    <article className="flex flex-col bg-slate-50 gap-y-4 p-4 justify-center items-center w-1/2 h-auto rounded border shadow shadow-gray-400">
      <h1 className="text-xl text-center">{`Bantuan Program Kebajikan Mengikut DUN ${currentYear}`}</h1>
      <div className="chart-container w-[300px] h-[300px]">
        <canvas id="pmrChart" className="w-full h-full"></canvas>
      </div>
      <LegendDun />
    </article>
  );
};

export default ChartKebajikan;
