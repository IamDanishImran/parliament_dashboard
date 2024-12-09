// app/protected/rekod/page.jsx
"use client";
import Link from "next/link";
import Footer from "@/components/footer-dashboard";
import { useState, useEffect } from "react";

import Header from "@/components/header";
import moment from 'moment';
import { createClient } from "@/utils/supabase/client";
import Modal from "@/components/modal";
import EditModal from "@/components/editModal";

export default function Rekod() {
  // First Modal Section (for adding items)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  
  const [formData, setFormData] = useState({
    barang_bantuan: '',
    kategori_bantuan: '',
    kategori_penerima: '',
    no_tel: '',
    jenis_bantuan: '',
    alamat: '',
    kuantiti: '',
    harga: '',
    catatan: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddItem = () => {
    // Handle item addition logic
  };
  const handleDeleteItem = (index) => {
    // Handle item deletion logic
  };

  const total = 100; // Example total value
  const items = []; // Example items array

  // Edit Modal Section
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for the edit modal
  const [editingForm, setEditingForm] = useState(null); // Declare editingForm here, once, for use in the edit modal

  const handleEditClick = (item) => {
    setEditingForm(item); // Set the form data to be edited
    setIsEditModalOpen(true); // Open the edit modal
  };

  const closeEditModal = () => setIsEditModalOpen(false); // Close the edit modal



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



  // CSV Download function
    // Create the CSV content
    const downloadCSV = () => {
      console.log("Form data for CSV:", form); // Log the form data before download
      const headers = [
        'Barang Bantuan', 'Kategori Bantuan', 'Kategori Penerima', 'No Telefon',
        'Jenis Bantuan', 'Alamat', 'Kuantiti', 'Harga', 'Catatan',
      ];
      const rows = form.map((item) => [
        item.barang_bantuan, item.kategori_bantuan, item.kategori_penerima,
        item.no_tel, item.jenis_bantuan, item.alamat, item.kuantiti,
        item.harga, item.catatan,
      ]);
    
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'submission_data.csv';
      link.click();
    };

  return (
    <main className="p-2 pl-10 pr-20">
      <Header title="Rekod" />

      {/* Search Bar */}
      <section id="search" className="flex flex-col w-full h-auto mt-4 rounded border shadow shadow-gray-400">
        <article>
          <h1 className="mx-4 mt-4 text-2xl font-semibold">Panel Carian</h1>
        </article>

        <article className="mt-4 flex px-2">
          <div className="w-2/4 m-2">
            <label htmlFor="statusForm">Status</label>
            <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500 w-[540px]">
              <select className="w-full h-full bg-sky-50" id="statusForm" value={statusSearch} onChange={(e) => setStatus(e.target.value)}>
                <option value="*">All</option>
                <option value="MOHON">MOHON</option>
                <option value="LULUS">LULUS</option>
                <option value="DITOLAK">DITOLAK</option>
                <option value="KIV">KIV</option>
              </select>
            </div>
          </div>
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
          <label htmlFor="Kategori Bantuan">Kategori Bantuan</label>
          <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500">
            <select className="w-full h-full bg-sky-50" id="kategori_bantuan" value={kategoriSearch} onChange={(e) => setKategoriSearch(e.target.value)}>
              <option value="*">All</option>
              <option value="Program Mesra Rakyat">Program Mesra Rakyat</option>
              <option value="Bantuan Kebajikan">Bantuan Kebajikan</option>
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

      {/* Records Panel */}
      <section id="rekod" className="bg-slate-50 w-full h-[600px] mt-8 border shadow shadow-gray-400">
        <article className="bg-slate-50 flex justify-between items-center p-2 border shadow shadow-md">
          <div>
            <button onClick={downloadCSV} className="text-gray-700 font-bold bg-gray-200 border border-black px-4 py-2 rounded hover:bg-slate-300 ease-in duration-200">
              Download Data
            </button>
          </div>
          <div>
          <button onClick={openAddModal} className="text-indigo-700 font-bold bg-slate-50 border border-black px-4 py-2 rounded hover:bg-slate-300 ease-in duration-200">
              Tambah Rekod
            </button>
          </div>
        </article>


        {/* Modal for adding records */}
        <Modal
          open={isAddModalOpen}   // Correct state to control Add Modal visibility
          onClose={closeAddModal}
          formData={formData}
          handleChange={handleChange}
          handleAddItem={handleAddItem}
          total={total}
          items={items}
          handleDeleteItem={handleDeleteItem}
        />


        {/* Scrollable Table Section */}
        <article className="h-[500px] overflow-y-auto">
        <table className="table-auto w-full text-left border-collapse">
            <thead className="text-gray-700 bg-gray-200">
              <tr className="border border-black">
                <th className="border border-black px-4 py-1">Bil</th>
                <th className="border border-black px-4 py-1">Penerima</th>
                <th className="border border-black px-4 py-1">Tarikh Permohonan</th>
                <th className="border border-black px-4 py-1">Kategori Bantuan</th>
                <th className="border border-black px-4 py-1">Catatan Bantuan</th>
                <th className="border border-black px-4 py-1">Dun</th>
                <th className="border border-black px-4 py-1">Jenis Bantuan</th>
                <th className="border border-black px-4 py-1">Status</th>
                <th className="border border-black px-4 py-1">Info</th>
              </tr>
            </thead>
            <tbody className="bg-slate-50">
  {filteredForm.length === 0 ? (
    <tr>
      <td colSpan="9" className="text-center py-[220px]">No data found</td>
    </tr>
  ) : (
    filteredForm.map((item, index) => (
      <tr key={index} className="border border-black hover:bg-slate-200 ease-out transition-200">
        <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{index + 1}</td>
        <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{item.category_type}</td>
        <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{moment(item.inserted_at).format('DD MMMM YYYY')}</td>
        <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{item.category}</td>
        <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{item.notes}</td>
        <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{item.dun.id_register?.description}</td>
        <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{item.help_type}</td>
        <td className={`border px-4 py-4 text-center 
          ${item.form_status === 'MOHON' ? 'bg-yellow-200' : ''}
          ${item.form_status === 'LULUS' ? 'bg-emerald-300' : ''}
          ${item.form_status === 'KIV' ? 'bg-cyan-300' : ''}
          ${item.form_status === 'DITOLAK' ? 'bg-red-300' : ''}`}>
          {item.form_status}
        </td>
        <td className="border px-4 py-2 text-center">
          <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-800">
            Edit
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </article>
      </section>
      {/* Edit Modal */}
      {editingForm && isEditModalOpen && (
          <EditModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            formData={editingForm}
            supabase={supabase}
          />
        )}
      <Footer />
    </main>
  );
}
