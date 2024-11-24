// app/protected/dashboard/page.jsx
import Link from "next/link";
import Footer from "@/components/footer-dashboard";

export default function Program_Mesra() {
    return (
      <main className="p-2">
        <header className=" bg-slate-400 w-full h-auto p-4">
          <p className="text-sm"><span className="text-slate-600">Home</span> / Program Mesra Rakyat</p>
          <h1 className="text-4xl font-semibold mt-4">Program Mesra Rakyat</h1>
          <p>Dashboard Program Mesra Rakyat</p>
        </header>
        <section id="search" className="flex flex-col w-full h-44 mt-4 rounded shadow-md">
          <article><h1 className="mx-4 mt-4 text-2xl font-semibold">Panel Carian</h1></article>
          <article className="flex justify-around px-2">
            <div className="w-2/4 m-2">
              <label htmlFor="Dun">Dun</label>
              <div className="w-full h-8 px-4 rounded bg-sky-50 border-2 border-slate-500">
                <input type="text" className="w-full h-full bg-sky-50"/>
              </div>
            </div>
            <div className="w-2/4 m-2">
              <label htmlFor="Kategori Bantuan">Kategori Bantuan</label>
              <div className="w-full h-8 px-4 rounded bg-sky-50 border-2 border-slate-500">
                <input type="text" className="w-full h-full bg-sky-50"/>
              </div>
            </div>
            <div className="w-2/4 m-2">
              <label htmlFor="Bantuan Bulanan">Bulanan Bantuan Diberi</label>
              <div className="w-full h-8 px-4 rounded bg-sky-50 border-2 border-slate-500">
                <input type="text" className="w-full h-full bg-sky-50"/>
              </div>
            </div>
          </article>
          <article className="flex mt-2 px-4 gap-4">
            <div className="w-32 h-8 flex justify-center items-center rounded bg-indigo-600 hover:bg-violet-500 text-slate-50 ease-in duration-200">
              <Link href="#">Search</Link>
            </div>
            <div className="w-32 h-8 flex justify-center items-center rounded border border-slate-900 bg-slate-50 hover:bg-violet-500 text-slate-900 ease-in duration-200">
              <Link href="#">Reset Search</Link>
            </div>
          </article>
        </section>
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
        <section id="chart-pie" className="bg-slate-400 w-full h-96 mt-4">
          <canvas></canvas>
          <canvas></canvas>
        </section>
        <section id="chart-bar" className="bg-slate-400 w-full h-96 mt-4">
          <canvas></canvas>
        </section>
        <Footer></Footer>
      </main>
    );
  }
  
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