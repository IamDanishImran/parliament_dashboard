// app/protected/bantuan_mesra/page.jsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import Header from "@/components/header";
import BarGraph from "@/components/bar-pmr";
import PanelStatus from "@/components/panel-status-pmr";
import LegendStatus from "@/components/legend-status";
import LegendCategory from "@/components/legend-category";
import Footer from "@/components/footer-dashboard";

export default function Program_Mesra() {
  // Form List Section
  const [statusSearch, setStatus] = useState('');
  const [bulanSearch, setBulanBantuan] = useState('');
  const [jenisBantuanSearch, setJenisBantuan] = useState('');
  const [dunSearch, setDunSearch] = useState('');
  const [kategoriSearch, setKategoriSearch] = useState('');
  const [bantuanSearch, setBantuanSearch] = useState('');
  const [form, setForm] = useState([]);
  const [filteredForm, setFilteredForm] = useState([]); // Fixed initialization
  const supabase = createClient();

// Fetch data when the component mounts
useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('form')
      .select('*, dun(id_register(*))');
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setForm(data);
      setFilteredForm(data); // Initialize with full data
    }
  };
  fetchData();
}, []);

const handleSearch = () => {
  const filteredResults = form.filter((item) => {
    // Extract the short month from the inserted_at timestamp string
    const itemMonth = new Date(item.inserted_at).toLocaleString('en-GB', { month: 'short' });

    return (
      (statusSearch === '*' || item.form_status.toLowerCase() === statusSearch.toLowerCase()) &&
      (jenisBantuanSearch === '*' || item.help_type.toUpperCase() === jenisBantuanSearch.toUpperCase()) &&
      (!bulanSearch || itemMonth.toLowerCase() === bulanSearch.toLowerCase()) &&
      (!dunSearch || item.dun.id_register?.description.toLowerCase().includes(dunSearch.toLowerCase())) &&
      (!kategoriSearch || item.category?.title.toLowerCase().includes(kategoriSearch.toLowerCase())) &&
      (!bantuanSearch || item.help_type.toLowerCase().includes(bantuanSearch.toLowerCase()))
    );
  });

  setFilteredForm(filteredResults); // Update filtered results
};

const resetSearch = () => {
  setStatus('');
  setBulanBantuan('');
  setJenisBantuan('');
  setDunSearch('');
  setKategoriSearch('');
  setBantuanSearch('');
  setFilteredForm(form); // Reset to original data
};

    return (
      <main className="p-2 pl-10 pr-20">
        <Header title="Rumusan Program Mesra Rakyat" />

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
              <option value="January">Jan</option>
              <option value="February">Feb</option>
              <option value="March">Mar</option>
              <option value="April">Apr</option>
              <option value="May">May</option>
              <option value="June">Jun</option>
              <option value="July">Jul</option>
              <option value="August">Aug</option>
              <option value="September">Sep</option>
              <option value="October">Oct</option>
              <option value="November">Nov</option>
              <option value="December">Dec</option>
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

        <PanelStatus />

        {/* <PanelAnalysis /> */}

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