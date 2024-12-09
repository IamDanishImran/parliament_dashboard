// components\barGraph-dashboard.jsx
import React from "react";
import { useEffect } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const BarGraph = () => {
    useEffect(() => {
        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const barData = {
            labels: labels,
            datasets: [
                {
                    data: [65, 59, 80, 81, 56, 55, 40, 50, 30, 80, 40, 20],
                    backgroundColor: ["rgba(147, 197, 253)"],
                    label: "RM",
                },
            ],
        };
        
        const barOptions = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };
        
        const barCtx = document.getElementById("barChart");
        let barChart;
        if (barCtx) {
            barChart = new Chart(barCtx, {
              type: "bar",
              data: barData,
              options: barOptions,
            });
        }
        
        return () => {
            if (barChart) barChart.destroy();
        };
    }, []);
    
    return (
    <div className="bg-slate-50 w-full h-auto mt-8 px-14 py-6 flex flex-col justify-center items-center rounded border shadow shadow-gray-400">
        <h1 className="text-xl mb-4">Total Perbelanjaan Mengikut bulanan</h1>
        <canvas id="barChart" className="bg-slate-50" height="30%" width="80%"></canvas>
    </div>
  );
};

export default BarGraph;
