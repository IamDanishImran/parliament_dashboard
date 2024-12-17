"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Chart, registerables } from "chart.js";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const BarGraph = () => {
  const supabase = createClient();
  const [monthlyData, setMonthlyData] = useState({ months: [], totals: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch submission forms with their submission date and price
        const { data, error } = await supabase
          .from("form")
          .select("inserted_at, price")
          .eq('category', 'Program Mesra Rakyat')

        if (error) {
          throw new Error(error.message);
        }

        // Process the data to sum the prices per month
        const monthTotals = {};
        const allMonths = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Initialize month totals to zero for all months
        allMonths.forEach((month) => {
          monthTotals[month] = 0;
        });

        // Loop through the fetched data and sum prices per month
        data.forEach((form) => {
          const monthNumber = new Date(form.inserted_at).getMonth(); // Get numeric month (0-11)
          const month = allMonths[monthNumber]; // Map numeric month to abbreviated name
          const price = parseFloat(form.price) || 0; // Ensure price is a valid number

          monthTotals[month] += price; // Sum up the price for each month
        });

        // Convert the data into an array of months and their respective total prices
        const months = allMonths; // Ensure all months are represented
        const totals = months.map((month) => monthTotals[month]);

        setMonthlyData({ months, totals });
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (monthlyData.months.length === 0) return; // Ensure data is available

    // Get the canvas context
    const ctx = document.getElementById("barChart").getContext("2d");

    // Destroy the previous chart if it exists
    if (window.barChartInstance) {
      window.barChartInstance.destroy();
    }

    // Initialize Chart.js for Bar Graph
    window.barChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: monthlyData.months,
        datasets: [
          {
            label: "RM",
            data: monthlyData.totals,
            backgroundColor: "#36A2EB",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            ticks: {
              callback: function(value) {
                return "RM " + value.toFixed(2); // Format the Y-axis as currency
              },
            },
          },
        },
      },
    });
  }, [monthlyData]);

  // Display Current Year
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-slate-50 w-full h-auto mt-8 px-14 py-6 flex flex-col justify-center items-center rounded border shadow shadow-gray-400">
      <h1 className="text-xl mb-4">{`Total Perbelanjaan Mengikut Bulanan (${currentYear})`}</h1>
      <canvas id="barChart" className="bg-slate-50" height="300" width="600"></canvas>
    </div>
  );
};

export default BarGraph;
