// app/protected/dashboard/page.jsx
"use client";
import { useEffect } from "react";
import Footer from "@/components/footer-dashboard";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function Dashboard() {
  useEffect(() => {
    // Draw first doughnut chart
    const ctx1 = document.getElementById("myChart");
    let pieChart1;

    if (ctx1) {
      pieChart1 = new Chart(ctx1, {
        type: "doughnut",
        data: {
          datasets: [{
            data: [300, 50, 100],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)"
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // allows the chart to fill its container
        }
      });
    }

    // Draw second doughnut chart
    const ctx2 = document.getElementById("myChart2");
    let pieChart2;

    if (ctx2) {
      pieChart2 = new Chart(ctx2, {
        type: "doughnut",
        data: {
          datasets: [{
            data: [150, 100, 250],
            backgroundColor: [
              "rgb(153, 102, 255)",
              "rgb(75, 192, 192)",
              "rgb(255, 159, 64)"
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
    }

    // Cleanup function to destroy both charts
    return () => {
      if (pieChart1) pieChart1.destroy();
      if (pieChart2) pieChart2.destroy();
    };
  }, []);

  return (
    <main className="p-2">
      <header className="bg-slate-400 w-full h-auto p-4">
        <p className="text-sm"><span className="text-slate-600">Home</span> / Dashboard</p>
        <h1 className="text-4xl font-semibold mt-4">Dashboard</h1>
        <p>Dashboard Parlimen Alor Gajah</p>
      </header>

      <section id="status" className="bg-blue-200 w-full h-32 mt-4 p-4 grid grid-cols-5 gap-4">
        <div className="h-full rounded bg-blue-700">
          <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-50">PERMOHONAN</h1>
        </div>
        <div className="h-full rounded bg-amber-200">
          <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">SEDANG DIPROSES</h1>
        </div>
        <div className="h-full rounded bg-green-400">
          <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">DILULUSKAN</h1>
        </div>
        <div className="h-full rounded bg-red-500">
          <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">DITOLAK</h1>
        </div>
        <div className="h-full rounded bg-cyan-400">
          <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">KIV</h1>
        </div>
      </section>

      <section id="analysis" className="w-full h-56 mt-4 py-4 grid grid-cols-4 gap-4">
          <div className="bg-sky-50 h-full rounded shadow-md"></div>
          <div className="bg-sky-50 h-full rounded shadow-md"></div>
          <div className="bg-sky-50 h-full rounded shadow-md"></div>
          <div className="bg-sky-50 h-full rounded shadow-md"></div>
        </section>

      <section id="chart-pie" className="flex bg-slate-400 w-full h-full mt-4">
        {/* Pie Chart 1 */}
        <article className="flex flex-col justify-center items-center bg-slate-500 m-5 w-full md:w-1/2 h-96">
          <h1 className="text-xl mb-4">Program Mesra Rakyat</h1>
          <div className="chart-container w-[200px] h-[200px]">
            <canvas id="myChart" className="border"></canvas>
          </div>
        </article>
        {/* Pie Chart 2 */}
        <article className="flex flex-col justify-center items-center bg-slate-500 m-5 w-full md:w-1/2 h-96">
          <h2 className="text-xl mb-4">Program Mesra Rakyat</h2>
          <div className="chart-container w-[200px] h-[200px]">
            <canvas id="myChart2" className="border"></canvas>
          </div>
        </article>
      </section>

      <section id="chart-bar" className="bg-slate-400 w-full h-96 mt-4">
        {/* Bar Chart Section */}
      </section>
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
//           <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-50">PERMOHONAN</h1>
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