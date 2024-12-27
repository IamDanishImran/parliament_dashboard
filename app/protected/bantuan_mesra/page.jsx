"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import Header from "@/components/header";
import PanelStatus from "@/components/bantuan_mesra/panel-status-pmr";
import PieDun from "@/components/bantuan_mesra/pieDun";
import PieCategory from "@/components/bantuan_mesra/pieCategory";
import BarGraph from "@/components/bantuan_mesra/bar-pmr";
import Footer from "@/components/footer";

export default function Program_Mesra() {
  const [jenisBantuanSearch, setJenisBantuan] = useState('');
  const [dunSearch, setDunSearch] = useState('');
  const [form, setForm] = useState([]);
  const [filteredForm, setFilteredForm] = useState([]);
  const supabase = createClient();

  // Fetch Form Data
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('form')
        .select('*, dun(id_register(*))')
        .eq('category', 'Program Mesra Rakyat');
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Fetched Data:", data); // Add this line
        setForm(data);
        setFilteredForm(data);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    console.log("Jenis Bantuan Search:", jenisBantuanSearch);
    console.log("Dun Search:", dunSearch);

    const filteredResults = form.filter((item) => {
      const matchesBantuan = !jenisBantuanSearch || jenisBantuanSearch === '*' || item.help_type.toUpperCase() === jenisBantuanSearch.toUpperCase();
      const matchesDun = !dunSearch || dunSearch === '*' || item.dun.id_register?.description.toLowerCase() === dunSearch.toLowerCase();

      console.log("Item Help Type:", item.help_type);
      console.log("Item Dun Description:", item.dun.id_register?.description);
      console.log("Matches Bantuan:", matchesBantuan);
      console.log("Matches Dun:", matchesDun);

      return matchesBantuan && matchesDun;
    });

    console.log("Filtered Results:", filteredResults);
    setFilteredForm(filteredResults); // Update filtered results
  };

  const resetSearch = () => {
    setJenisBantuan('');
    setDunSearch('');
    setFilteredForm(form);
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
            <label htmlFor="kategori_bantuan">Jenis Bantuan</label>
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
            <label htmlFor="dun">Dun</label>
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

      <PanelStatus filteredForm={filteredForm} />
      <section id="chart-pie" className="flex w-full h-full mt-4 gap-4">
        {/* Pie Chart Dun */}
        <PieDun filteredForm={filteredForm} />
        {/* Pie Chart Category */}
        <PieCategory filteredForm={filteredForm} />
      </section>
      <BarGraph filteredForm={filteredForm} />
      <Footer />
    </main>
  );
}