// app/protected/dashboard/page.jsx
"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Chart } from "chart.js";

import ChartPMR from "@/components/piePMR-dashboard";
import ChartKebajikan from "@/components/pieKebajikan-dashboard";
import Header from "@/components/header";
import BarGraph from "@/components/bar-dashboard";
import PanelStatus from "@/components/panel-status";
import PanelAnalysis from "@/components/panel-analysis";
import Footer from "@/components/footer-dashboard";

export default function Dashboard() {
  const supabase = createClient();

  return (
    <main className="p-2 pl-10 pr-20">
      <Header title="Dashboard" />

      <PanelStatus />

      <PanelAnalysis />

      <section id="chart-pie" className="flex w-full h-full mt-4 gap-4">
        {/* Pie Chart */}
        <ChartPMR categoryId={"2"} />

        {/* Pie Chart 2 */}
        <ChartKebajikan categoryId={"1"} />
      </section>

      {/* Bar Graph Section */}
      <BarGraph />

      <Footer />
    </main>
  );
}












































// import Footer from "@/components/footer-dashboard";
// import { Chart } from 'chart.js';

// export default function Dashboard() {
//   const ctx = document.getElementById('myChart');

//   new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//       datasets: [{
//         label: '# of Votes',
//         data: [12, 19, 3, 5, 2, 3],
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });

//   return (
//     <main className="p-2">
//       <header className=" bg-slate-400 w-full h-auto p-4">
//         <p className="text-sm"><span className="text-slate-600">Home</span> / Dashboard</p>
//         <h1 className="text-4xl font-semibold mt-4">Dashboard</h1>
//         <p>Dashboard Parlimen Alor Gajah</p>
//       </header>
//       <section id="status" className="bg-blue-200 w-full h-32 mt-4 p-4 grid grid-cols-5 gap-4">
//         <div className="h-full rounded bg-blue-700">
//           <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-50">PERPROSESAN</h1>
//         </div>
//         <div className="h-full rounded bg-amber-200">
//           <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">SEDANG DIPROSES</h1>
//         </div>
//         <div className="h-full rounded bg-green-400">
//           <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">DILULUSKAN</h1>
//         </div>
//         <div className="h-full rounded bg-red-500">
//           <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">DITOLAK</h1>
//         </div>
//         <div className="h-full rounded bg-cyan-400">
//           <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">KIV</h1>
//         </div>
//       </section>
//       <section id="analysis" className="w-full h-56 mt-4 py-4 grid grid-cols-4 gap-4">
//         <div className="bg-sky-50 h-full rounded shadow-md"></div>
//         <div className="bg-sky-50 h-full rounded shadow-md"></div>
//         <div className="bg-sky-50 h-full rounded shadow-md"></div>
//         <div className="bg-sky-50 h-full rounded shadow-md"></div>
//       </section>
//       <section id="chart-pie" className="bg-slate-400 w-full h-96 mt-4">
//         <canvas id="myChart"></canvas>
//         <canvas></canvas>
//       </section>
//       <section id="chart-bar" className="bg-slate-400 w-full h-96 mt-4">
//         <canvas></canvas>
//       </section>
//       <Footer></Footer>
//     </main>
//   );
// }

// export default function Dashboard() {
//   return (
//     <ProtectedLayout>
//       {/* Dashboard content goes here */}
//       <main className="p-2">
//         <section id="header" className="bg-emerald-400 w-full h-28"></section>
//         <section id="status" className="bg-indigo-600 w-full h-28 mt-4"></section>
//         <section id="chart-pie" className="bg-rose-500 w-full h-96 mt-4"></section>
//         <section id="chart-bar" className="bg-yellow-400 w-full h-96 mt-4"></section>
//       </main>
//     </ProtectedLayout>
//   );
// }