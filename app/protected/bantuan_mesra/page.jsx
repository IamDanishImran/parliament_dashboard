"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@nextui-org/skeleton";

import Header from "@/components/header";
import PanelStatus from "@/components/bantuan_mesra/panel-status-pmr";
import PanelAnalysis from "@/components/bantuan_mesra/panel-analysis-pmr";
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
  const [loading, setLoading] = useState(true);

  // Fetch Form Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('form')
          .select('*, dun(id_register(*))')
          .eq('category', 'Community Outreach Program');
        if (error) {
          console.error("Error fetching data:", error);
        } else {
          console.log("Fetched Data:", data);
          setForm(data);
          setFilteredForm(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }; fetchData();
  }, []);

  const handleSearch = () => {
    // Filter results based on search criteria
    const filteredResults = form.filter((item) => {
      const matchesBantuan = !jenisBantuanSearch || jenisBantuanSearch === '*' || item.help_type.toUpperCase() === jenisBantuanSearch.toUpperCase();
      const matchesDun = !dunSearch || dunSearch === '*' || item.dun.id_register?.description.toLowerCase() === dunSearch.toLowerCase();
      return matchesBantuan && matchesDun;
    });
    setFilteredForm(filteredResults); // Update filtered results
  };

  const resetSearch = () => {
    setJenisBantuan('');
    setDunSearch('');
    setFilteredForm(form);
  };

  return (
    <main className="pt-6 sm:pt-4 sm:p-2 sm:pl-10 sm:pr-20">
      <Header title="Community Outreach Program Summary" navigator="Community Outreach Program" />
      <br />
      {/* Search Bar */}
      <Skeleton isLoaded={!loading}>
        <section id="search" className="flex flex-col w-full h-auto rounded border shadow shadow-gray-400">
          <article>
            <h1 className="mx-4 mt-4 text-2xl font-semibold">Search Panel</h1>
          </article>
          <article className="flex justify-around px-2">
            <div className="w-2/4 m-2">
              <label htmlFor="kategori_bantuan">Assistance Type</label>
              <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500">
                <select className="w-full h-full bg-sky-50" id="kategori_bantuan" value={jenisBantuanSearch} onChange={(e) => setJenisBantuan(e.target.value)}>
                  <option value="*">All</option>
                  <option value="Cash Assistance">Cash Assistance</option>
                  <option value="Equipment Assistance">Equipment Assistance</option>
                  <option value="Equipment & Cash Assistance">Equipment & Cash Assistance</option>
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
                  <option value="Outside Melaka">Outside Melaka</option>
                </select>
              </div>
            </div>
          </article>
        
          <article className="flex mt-2 px-4 py-4 gap-4">
            <button className="w-32 h-8 flex justify-center items-center rounded bg-indigo-600 hover:bg-violet-500 text-slate-50 ease-in duration-200"
              onClick={handleSearch}>
              Search
            </button>
            <button className="w-32 h-8 flex justify-center items-center rounded border border-slate-900 bg-slate-50
            hover:bg-indigo-600 hover:border-lg hover:border-neutral-50 hover:text-slate-50 ease-in duration-200"
              onClick={resetSearch}>
              Reset Search
            </button>
          </article>
        </section>
      </Skeleton>

      <br />

      <PanelStatus filteredForm={filteredForm} />

      <PanelAnalysis filteredForm={filteredForm} /> {/* Panel Analysis */}

      <br />
      <section id="chart-pie" className="flex flex-col sm:flex-row sm:w-full sm:h-full gap-4">
        <PieDun filteredForm={filteredForm} /> {/* Pie Chart Dun */}
        <PieCategory filteredForm={filteredForm} /> {/* Pie Chart Category */}
      </section>

      <br /><br />
      <BarGraph filteredForm={filteredForm} />
      <Footer />
    </main>
  );
}