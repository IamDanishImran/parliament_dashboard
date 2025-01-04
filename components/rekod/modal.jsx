import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from "@/utils/supabase/client";

const supabase = createClient(); // Initialize once

const Modal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [dunData, setDunData] = useState([]);
  const [formData, setFormData] = useState({
    barang_bantuan: '',
    kategori_bantuan: '',
    kategori_penerima: '',
    no_tel: '',
    jenis_bantuan: '',
    kuantiti: '',
    harga: '',
    alamat: '',
    catatan: ''
  });

  useEffect(() => {
    if (!open) return;

    const fetchDunData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('User email:', user.email);
        if (!user) {
          toast.error('You need to login first');
          onClose();
          return;
        }
        const { data: getDun, error } = await supabase
          .from('dun')
          .select('id')
          .eq('email', user.email)
          .single();
        if (error) {
          toast.error(`Admin can't access add form`);
          onClose();
          return;
        }
        setDunData(getDun);
      } catch (error) {
        toast.error('An unexpected error occurred.');
        console.error(error);
      }
    };
    fetchDunData();
  }, [open, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const notify = () => {
    toast("Form Submitted!", {
      autoClose: 10000,
      closeButton: true,
      pauseOnHover: true,
      draggable: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!dunData) {
        toast.error("DUN data is missing. Please check your account.");
        setLoading(false);
        return;
      }
      const { barang_bantuan, kategori_bantuan, kategori_penerima, no_tel, alamat, harga, kuantiti } = formData;
      if (!barang_bantuan || !kategori_bantuan || !kategori_penerima || !no_tel || !alamat || !harga || !kuantiti) {
        toast.error("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      const { data: formSubmission, error: formSubmissionError } = await supabase
        .from('form')
        .insert({
          notes: formData.catatan,
          category: formData.kategori_bantuan,
          category_type: formData.kategori_penerima,
          quantity: parseInt(formData.kuantiti, 10),
          price: parseFloat(formData.harga),
          form_status: 'MOHON',
          id_dun: dunData.id,
          address: formData.alamat,
          phone: formData.no_tel,
          help_type: formData.jenis_bantuan,
          item: formData.barang_bantuan,
        });
      if(formSubmissionError) {
        toast.error("Failed to submit the form.");
        console.error(formSubmissionError);
      } else {
        toast.success("Form submitted successfully!");
        onClose();
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-90">
      <div className="bg-white rounded-lg w-[1000px] h-[700px] p-6">
        <form onSubmit={handleSubmit}>
          {/* Form fields here */}
          <section className="grid grid-cols-3 gap-4">
            <article className="col-span-3 text-center text-3xl py-4 font-semibold text-indigo-600">
              <h1>Borang Serahan Bantuan</h1>
            </article>
            <article className="flex flex-col col-span-3 gap-1">
              <label htmlFor="barang_bantuan" className="text-indigo-700">Barang Bantuan</label>
              <input
                type="text"
                id="barang_bantuan"
                name="barang_bantuan"
                aria-label="Barang Bantuan"
                required
                className="h-8 rounded border border-gray-400"
                placeholder="Contoh: Kerusi Roda, Katil Hospital"
                value={formData.barang_bantuan}
                onChange={handleChange}
              />
            </article>
            {/* Other form fields go here */}
            <article className="flex flex-col gap-1">
              <label className="text-indigo-700">Kategori Bantuan</label>
              <select
                name="kategori_bantuan"
                className="h-8 rounded border border-gray-400"
                value={formData.kategori_bantuan}
                onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Program Kebajikan">Program Kebajikan</option>
                <option value="Program Mesra Rakyat">Program Mesra Rakyat</option>
              </select>
            </article>

            {/* Kategori Penerima */}
            <article className="flex flex-col gap-1">
              <label className="text-indigo-700">Kategori Penerima</label>
              <select
                name="kategori_penerima"
                className="h-8 rounded border border-gray-400"
                value={formData.kategori_penerima}
                onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="Kesejahteraan Rakyat">Kesejahteraan Rakyat</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="NGO/Pertubuhan">NGO/Pertubuhan</option>
                <option value="Bencana">Bencana</option>
                <option value="Keagamaan">Keagamaan</option>
                <option value="Pusat Khidmat">Pusat Khidmat</option>
              </select>
            </article>

            {/* No Telefon */}
            <article className="flex flex-col gap-1">
              <label className="text-indigo-700">No Telefon</label>
              <input
                type="text"
                id="no_tel"
                name="no_tel"
                aria-label="No Telefon"
                className="h-8 rounded border border-gray-400"
                placeholder="&nbsp;0109992938"
                value={formData.no_tel}
                onChange={handleChange}
              />
            </article>

            {/* Section 3 */}
            <article className="flex flex-col gap-1">
              <label className="text-indigo-700">Jenis Bantuan</label>
              <select
                name="jenis_bantuan"
                className="h-8 rounded border border-gray-400"
                value={formData.jenis_bantuan}
                onChange={handleChange}>
                <option value="">Pilih</option>
                <option value="TUNAI">Tunai</option>
                <option value="BANTUAN PERALATAN">Bantuan Peralatan</option>
                <option value="PERALATAN DAN TUNAI">Peralatan dan Tunai</option>
              </select>
            </article>
            <article className="flex flex-col gap-1">
              <label className="text-indigo-700">Kuantiti</label>
              <select
                id="kuantiti"
                name="kuantiti"
                value={formData.kuantiti}
                onChange={handleChange}
                className="h-8 rounded border border-gray-400">
                <option value="">Pilih</option>
                {Array.from({ length: 50 }, (_, i) => (
                  <option key={i + 1} value={i + 1}> 
                    {i + 1}
                  </option>
                ))}
              </select>
            </article>
            <article className="flex flex-col gap-1">
              <label className="text-indigo-700">Harga</label>
              <input
                type="text"
                id="harga"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                placeholder='&nbsp;Contoh: 890.00'
                className="h-8 rounded border border-gray-400"/>
            </article>
            
            {/* Section 4 */}
            <article className="flex flex-col col-span-3 gap-1">
              <label className="text-indigo-700">Alamat</label>
              <input
              type="text"
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              placeholder='&nbsp;Contoh: No Jalan, Daerah'
              className="h-8 rounded border border-gray-400"/>
            </article>
            
            {/* Section 5 */}
            <article className="flex flex-col col-span-3 gap-1">
              <label className="text-indigo-700">Catatan</label>
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                className="rounded border border-gray-400 p-2"
                placeholder="Catatan tambahan"/>
              </article>
          </section>
          <div className="mt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 w-1/2 px-4 py-2 rounded text-black hover:bg-gray-400">
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={notify}
              className="bg-indigo-600 w-1/2 text-white px-4 py-2 rounded hover:bg-indigo-500">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <ToastContainer />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;