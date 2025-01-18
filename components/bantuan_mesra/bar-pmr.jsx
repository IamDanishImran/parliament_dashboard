"use client";
import { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Skeleton } from "@nextui-org/react";

// Register all necessary components for Chart.js
Chart.register(...registerables);

const BarGraph = ({ filteredForm }) => {
  const [monthlyData, setMonthlyData] = useState({ months: [], totals: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (!Array.isArray(filteredForm)) return;

    // Process the data to sum the prices per month
    const monthTotals = {};
    const allMonths = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Initialize month totals to zero for all months
    allMonths.forEach((month) => {
      monthTotals[month] = 0;
    });

    // Loop through the filteredForm data and sum prices per month
    filteredForm.forEach((form) => {
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
      console.error("Error processing data:", error);
    } finally {
      setLoading(false);
    }
  }, [filteredForm]);

  useEffect(() => {
    try {
      if (monthlyData.months.length === 0) return; // Ensure data is available

    // Get the canvas context
    const ctx = document.getElementById("barChart").getContext("2d");

    // Destroy the previous chart if it exists
    if (typeof window !== "undefined" && window.barChartInstance) {
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
    } catch (error) {
      console.log("Error rendering chart");
    } finally {
      setLoading(false);
    }
  }, [monthlyData]);

  // Display Current Year
  const [currentYear, setCurrentYear] = useState(null);
    useEffect(() => {
      setCurrentYear(new Date().getFullYear());
    }, []);

  return (
    <Skeleton isLoaded={!loading}>
      <section className="bg-slate-50 w-full h-auto px-14 py-12 flex flex-col justify-center items-center rounded border shadow shadow-gray-400">
        <h1 className="text-xl mb-4">{`Total Expenditure by Month for (${currentYear})`}</h1>
        <canvas id="barChart" className="bg-slate-50" height="300" width="600"></canvas>
      </section>
    </Skeleton>
  );
};

export default BarGraph;