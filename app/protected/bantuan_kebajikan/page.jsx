// app/protected/bantuan_kebajikan/page.jsx
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import Header from "@/components/header";
import PanelAnalysis from "@/components/bantuan_kebajikan/panel-analysis-kebajikan";
import ChartPMR from "@/components/bantuan_kebajikan/pieDun";
import ChartKebajikan from "@/components/bantuan_kebajikan/pieCategory";
import BarGraph from "@/components/bantuan_kebajikan/bar-kebajikan";
import Footer from "@/components/footer";

export default function Bantuan_Kebajikan() {
  const supabase = createClient();
  const [jenisBantuanSearch, setJenisBantuan] = useState("*");
  const [form, setForm] = useState([]);
  const [filteredForm, setFilteredForm] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    TOTAL: 0,
    MOHON: 0,
    LULUS: 0,
    DITOLAK: 0,
    KIV: 0,
  });

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('form')
        .select('*, dun(id_register(*))')
        .eq('category', 'Bantuan Kebajikan');

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setForm(data);
        setFilteredForm(data);
      }
    };

    fetchData();
  }, []);

  // Handle Search
  const handleSearch = () => {
    const filteredResults = form.filter((item) => {
      // Apply filter based on jenisBantuanSearch
      return jenisBantuanSearch === "*" || item.category.toLowerCase() === jenisBantuanSearch.toLowerCase();
    });

    setFilteredForm(filteredResults); // Update the filtered data
  };

  // Calculate status counts based on filtered data
  const calculateStatusCounts = (filteredData) => {
    const counts = {
      TOTAL: 0,
      MOHON: 0,
      LULUS: 0,
      DITOLAK: 0,
      KIV: 0,
    };

    filteredData.forEach((form) => {
      const status = form.form_status.toUpperCase();
      // Increment status counts based on the form status
      if (status === "MOHON") counts.MOHON++;
      if (status === "LULUS") counts.LULUS++;
      if (status === "DITOLAK") counts.DITOLAK++;
      if (status === "KIV") counts.KIV++;
    });

    counts.TOTAL = counts.MOHON + counts.LULUS + counts.DITOLAK + counts.KIV;

    return counts;
  };

  // Update status counts whenever filteredForm changes
  useEffect(() => {
    const counts = calculateStatusCounts(filteredForm);
    setStatusCounts(counts);
  }, [filteredForm]);

  // Reset Search
  const resetSearch = () => {
    setJenisBantuan("*");
    setFilteredForm(form); // Show all data when reset
  };
  

    return (
      <main className="p-2 pl-10 pr-20">
        <Header title="Rumusan Program Kebajikan" />

        {/* Search Bar */}
      <section id="search" className="flex flex-col w-full h-auto mt-4 rounded border shadow shadow-gray-400">
        <article>
          <h1 className="mx-4 mt-4 text-2xl font-semibold">Panel Carian</h1>
        </article>

        <article className="mt-4 flex px-2">
          <div className="w-2/4 m-2">
            <label htmlFor="Kategori Bantuan">Jenis Bantuan</label>
            <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500">
              <select className="w-full h-full bg-sky-50" id="jenis_bantuan" value={jenisBantuanSearch} onChange={(e) => setJenisBantuan(e.target.value)}>
                <option value="*">All</option>
                <option value="TUNAI">Tunai</option>
                <option value="BANTUAN PERALATAN">Bantuan Peralatan</option>
                <option value="PERALATAN DAN TUNAI">Peralatan dan Tunai</option>
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
        {/* Chart Dun */}
        <ChartPMR />
        {/* Chart Category */}
        <ChartKebajikan />
      </section>

      <BarGraph />
      
        <Footer />
      </main>
    );
  }
  