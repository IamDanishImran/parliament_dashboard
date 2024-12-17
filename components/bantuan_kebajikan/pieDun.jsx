"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { Chart, registerables } from "chart.js";
import LegendDun from "@/components/legend-dun";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const ChartKebajikan = () => {
  const supabase = createClient();

  // Fetch form counts grouped by descriptions
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
        Rembia: 0,
        Gadek: 0,
        Machap_Jaya: 0,
        Asahan: 0,
        Durian_Tunggal: 0,
        Luar_Alor_Gajah: 0,
        Luar_Melaka: 0,
      };

      // Loop through the fetched data
      data.forEach((form) => {
        const description = form?.id_dun?.id_register?.description;
        if (description) {
          const key = description.replace(/ /g, "_");
          if (dun_counts[key] !== undefined) {
            dun_counts[key]++;
          }
        }
      });

      return dun_counts;
    } catch (error) {
      console.error("Error fetching form counts by description:", error);
      return null;
    }
  };

  useEffect(() => {
    const createChart = async () => {
      const dunCounts = await fetchFormCountsByDescription();
      if (!dunCounts) return;

      const ctx = document.getElementById("pmrChart").getContext("2d");
      const labels = Object.keys(dunCounts).map((key) => key.replace(/_/g, " "));
      const dataValues = Object.values(dunCounts);

      // Destroy existing chart if it exists
      if (Chart.getChart("pmrChart")) {
        Chart.getChart("pmrChart").destroy();
      }

      new Chart(ctx, {
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
                  return labels[index];
                }
              }
            },
          },
        },
      });
    };

    createChart();
  }, []);

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
