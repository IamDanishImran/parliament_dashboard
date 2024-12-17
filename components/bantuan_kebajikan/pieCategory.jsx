"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import LegendCategory from "@/components/legend-category";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const ChartKebajikan = () => {
  const supabase = createClient();

  const [statusCounts, setStatusCounts] = useState({
    Kesejahteraan_Rakyat: 0,
    Pendidikan: 0,
    Keagamaan: 0,
    NGO_Pertubuhan: 0,
    Bencana: 0,
    Pusat_Khidmat: 0,
  });

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        // Fetch all form data including category_type
        const { data, error } = await supabase
          .from("form")
          .select("category_type")
          .eq("category", "Bantuan Kebajikan");

        if (error) {
          throw new Error(error.message);
        }

        // Initialize the status counts
        const category_type_counts = {
          Kesejahteraan_Rakyat: 0,
          Pendidikan: 0,
          Keagamaan: 0,
          NGO_Pertubuhan: 0,
          Bencana: 0,
          Pusat_Khidmat: 0,
        };

        // Loop through the form data and count each category_type
        data.forEach((form) => {
          if (form.category_type === "Kesejahteraan Rakyat") category_type_counts.Kesejahteraan_Rakyat++;
          if (form.category_type === "Pendidikan") category_type_counts.Pendidikan++;
          if (form.category_type === "Bencana") category_type_counts.Bencana++;
          if (form.category_type === "NGO/Pertubuhan") category_type_counts.NGO_Pertubuhan++;
          if (form.category_type === "Keagamaan") category_type_counts.Keagamaan++;
          if (form.category_type === "Pusat Khidmat") category_type_counts.Pusat_Khidmat++;
        });

        // Update the state with the new status counts
        setStatusCounts(category_type_counts);
      } catch (error) {
        console.error("Error fetching category type counts:", error);
      }
    };

    fetchStatusCounts();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById("kebajikanChart").getContext("2d");
    const dataValues = Object.values(statusCounts);

    // Initialize Chart.js
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
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} forms`,
            },
          },
        },
      },
    });

    // Cleanup to prevent chart duplication on re-renders
    return () => {
      chart.destroy();
    };
  }, [statusCounts]);

  // Display Current Year
  const currentYear = new Date().getFullYear();

  return (
    <article className="flex flex-col bg-slate-50 gap-y-4 p-4 justify-center items-center w-1/2 h-auto rounded border shadow shadow-gray-400">
      <h1 className="text-xl text-center">{`Bantuan Kebajikan Mengikut Kategori ${currentYear}`}</h1>
      <div className="chart-container w-[300px] h-[300px]">
        <canvas id="kebajikanChart" className="w-full h-full"></canvas>
      </div>
      <LegendCategory />
    </article>
  );
};

export default ChartKebajikan;
