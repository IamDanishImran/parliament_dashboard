// app/protected/bantuan_kebajikan/page.jsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import Header from "@/components/header";
import BarGraph from "@/components/bar-kebajikan";
import PanelStatus from "@/components/panel-status-kebajikan";
import PanelAnalysis from "@/components/panel-analysis-kebajikan";
import LegendStatus from "@/components/legend-status";
import LegendCategory from "@/components/legend-category";
import Footer from "@/components/footer-dashboard";

export default function Bantuan_Kebajikan() {
  // Form List 
  const [bulanSearch, setBulanBantuan] = useState('');
  const [jenisBantuanSearch, setJenisBantuan] = useState('');
  const [dunSearch, setDunSearch] = useState('');
  const [form, setForm] = useState([]);
  const [filteredForm, setFilteredForm] = useState([]);
  const supabase = createClient();

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('form').select('*', 'dun(id_register(*))').eq('category', "Bantuan Kebajikan");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setForm(data);
      setFilteredForm(data);
    }
    setLoading(false);
  };
  fetchData();
}, []);

  // Handle Search functionality
  const handleSearch = () => {
    const filteredResults = form.filter((item) => {
      const itemMonth = new Date(item.inserted_at).toLocaleString('en-GB', { month: 'short' });
  
      return (
        (jenisBantuanSearch === '*' || item.help_type.toUpperCase() === jenisBantuanSearch.toUpperCase()) &&
        (!bulanSearch || itemMonth.toLowerCase() === bulanSearch.toLowerCase()) &&
        (!dunSearch || item.dun.id_register?.description?.toLowerCase() === dunSearch.toLowerCase())
      );
    });
    setFilteredForm(filteredResults);
  };

  // Reset Search function
  const resetSearch = () => {
    setBulanBantuan('');
    setJenisBantuan('');
    setDunSearch('');
    setFilteredForm(form); // Reset to original data
  };

  const calculateStatusCounts = () => {
    const newStatusCounts = {
      TOTAL: 0,
      MOHON: 0,
      LULUS: 0,
      DITOLAK: 0,
      KIV: 0,
    };
  
    filteredForm.forEach((form) => {
      const status = form.form_status.toUpperCase();
      if (status === 'MOHON') newStatusCounts.MOHON++;
      if (status === 'LULUS') newStatusCounts.LULUS++;
      if (status === 'DITOLAK') newStatusCounts.DITOLAK++;
      if (status === 'KIV') newStatusCounts.KIV++;
    });
  
    newStatusCounts.TOTAL = newStatusCounts.MOHON + newStatusCounts.LULUS + newStatusCounts.DITOLAK + newStatusCounts.KIV;
  
    setStatusCounts(newStatusCounts);
  };
  


  const [statusCounts, setStatusCounts] = useState({
    TOTAL: 0,
    MOHON: 0,
    LULUS: 0,
    DITOLAK: 0,
    KIV: 0,
  });

  useEffect(() => {
    if (filteredForm.length === 0) {
      setStatusCounts({
        TOTAL: 0,
        MOHON: 0,
        LULUS: 0,
        DITOLAK: 0,
        KIV: 0,
      });
      return;
    }
  
    calculateStatusCounts();
  }, [filteredForm]);
  

    return (
      <main className="p-2 pl-10 pr-20">
        <Header title="Rumusan Program Kebajikan" />

        {/* Search Bar */}
      <section id="search" className="flex flex-col w-full h-auto mt-4 rounded border shadow shadow-gray-400">
        <article>
          <h1 className="mx-4 mt-4 text-2xl font-semibold">Panel Carian</h1>
        </article>

        <article className="flex justify-around px-2">
        <div className="w-2/4 m-2">
          <label htmlFor="Kategori Bantuan">Jenis Bantuan</label>
          <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500">
            <select className="w-full h-full bg-sky-50" id="kategori_bantuan" value={jenisBantuanSearch} onChange={(e) => setJenisBantuan(e.target.value)}>
              <option value="*">All</option>
              <option value="TUNAI">Tunai</option>
              <option value="BANTUAN PERALATAN">Bantuan Peralatan</option>
              <option value="PERALATAN DAN TUNAI">Peralatan dan Tunai</option>
            </select>
          </div>
        </div>

        <div className="w-2/4 m-2">
          <label htmlFor="Dun">Dun</label>
          <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500">
            <select className="w-full h-full bg-sky-50" id="dun" value={dunSearch} onChange={(e) => setDunSearch(e.target.value)}>
              <option value="*">All</option>
              <option value="Rembia">Rembia</option>
              <option value="Machap Jaya">Machap Jaya</option>
              <option value="Durian Tunggal">Durian Tunggal</option>
              <option value="Asahan">Asahan</option>
              <option value="Gadek">Gadek</option>
              <option value="Luar Alor Gajah">Luar Alor Gajah</option>
              <option value="Luar Melaka">Luar Melaka</option>
            </select>
          </div>
        </div>

        <div className="w-2/4 m-2">
          <label htmlFor="Bantuan Bulanan">Bulan Bantuan Diberi</label>
          <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500">
            <select className="w-full h-full bg-sky-50" id="bulan_bantuan" value={bulanSearch} onChange={(e) => setBulanBantuan(e.target.value)}>
              <option value="">All</option>
              <option value="Jan">Jan</option>
              <option value="Feb">Feb</option>
              <option value="Mar">Mar</option>
              <option value="Apr">Apr</option>
              <option value="May">May</option>
              <option value="Jun">Jun</option>
              <option value="Jul">Jul</option>
              <option value="Aug">Aug</option>
              <option value="Sep">Sep</option>
              <option value="Oct">Oct</option>
              <option value="Nov">Nov</option>
              <option value="Dec">Dec</option>
            </select>
          </div>
        </div>
      </article>
      <article className="flex mt-2 px-4 py-4 gap-4">
        <button
          className="w-32 h-8 flex justify-center items-center rounded bg-indigo-600 hover:bg-violet-500 text-slate-50 ease-in duration-200"
          onClick={handleSearch}>
            Search
        </button>
        <button
          className="w-32 h-8 flex justify-center items-center rounded border border-slate-900 bg-slate-50 hover:bg-violet-500 text-slate-900 ease-in duration-200"
          onClick={resetSearch}>
            Reset Search
        </button>
        </article>
      </section>

      {/* Status Panel */}
      <section id="status" className="bg-blue-200 w-full h-32 mt-4 p-4 grid grid-cols-5 gap-4">
          <div className="h-full rounded bg-blue-700 text-center hover:shadow-md ease-out">
            <h1 className="items-center text-center mt-2 text-lg font-semi text-slate-50">PERMOHONAN</h1>
            <p className="text-2xl mt-2 font-medium text-slate-50">{statusCounts.TOTAL}</p>
          </div>
          <div className="h-full rounded bg-amber-200 text-center">
            <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">SEDANG DIPROSES</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts.MOHON}</p>
          </div>
          <div className="h-full rounded bg-green-400 text-center">
            <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">DILULUSKAN</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts.LULUS}</p>
          </div>
          <div className="h-full rounded bg-red-500 text-center">
            <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">DITOLAK</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts.DITOLAK}</p>
          </div>
          <div className="h-full rounded bg-cyan-400 text-center">
            <h1 className="items-center text-center mt-2 text-xl font-semi text-slate-900">KIV</h1>
            <p className="text-2xl mt-2 font-medium">{statusCounts.KIV}</p>
          </div>
        </section>

        <PanelAnalysis />

      <section id="chart-pie" className="flex w-full h-full mt-4 gap-4">
        {/* Pie Chart 1 */}
        <article className="flex flex-col bg-sky-50 gap-y-4 p-4 justify-center items-center w-1/2 h-auto rounded shadow-md">
          <h1 className="text-xl">Program Mesra Rakyat</h1>
          <div className="chart-container w-[300px] h-[300px]">
            <canvas id="myChart" className=""></canvas>
          </div>
          <LegendStatus />
        </article>

        {/* Pie Chart 2 */}
        <article className="flex flex-col bg-sky-50 gap-y-4 p-4 justify-center items-center w-1/2 h-auto rounded shadow-md">
          <h1 className="text-xl">Bantuan Kebajikan</h1>
          <div className="chart-container w-[300px] h-[300px]">
            <canvas id="myChart2" className=""></canvas>
          </div>
          < LegendCategory />
        </article>
      </section>

      <BarGraph />
      
        <Footer />
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