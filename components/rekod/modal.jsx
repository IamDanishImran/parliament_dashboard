import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from "@/utils/supabase/client";

const Modal = ({ open, onClose }) => {
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
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [dunId, setDunId] = useState(null);

  const supabase = createClient();

  useEffect(() => {
    if (open) {
      const fetchUserAndDun = async () => {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) throw new Error("Failed to fetch user data: " + userError.message);
      
          setUserEmail(user?.email);
      
          const { data, error: dunError } = await supabase
            .from('dun')
            .select('id')
            .eq('user_id', user?.email)
            .single();
          if (dunError) throw new Error("Failed to fetch DUN ID: " + dunError.message);
      
          setDunId(data?.id);
        } catch (error) {
          toast.error(error.message);
        }
      };      

      fetchUserAndDun();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "no_tel" && !/^\d{10}$/.test(value)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!dunId) {
      toast.error("DUN ID is missing. Please check your account settings.");
      setLoading(false);
      return;
    }
  
    if (!formData.barang_bantuan || !formData.kategori_bantuan || !formData.kategori_penerima || !formData.no_tel || !formData.alamat) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }
  
    try {
      const { error } = await supabase
        .from('form')
        .insert({
          item: formData.barang_bantuan,
          category: formData.kategori_bantuan,
          category_type: formData.kategori_penerima,
          notes: formData.catatan,
          form_status: 'MOHON',
          quantity: parseInt(formData.kuantiti),
          address: formData.alamat,
          price: parseFloat(formData.harga, 10),
          phone: formData.no_tel,
          id_dun: dunId,
        });
  
      if (error) {
        toast.error("Failed to submit the form.");
        console.error(error.message);
      } else {
        toast.success("Form submitted successfully!");
        onClose(); // Close modal
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" aria-hidden={!open}>
      <div className="bg-white rounded-lg w-11/12 max-w-4xl p-6">
        <form onSubmit={handleSubmit}>
          <article id="form-title" className="text-center text-3xl font-semibold text-indigo-600 py-4 mb-4">
            <h1>Borang Serahan Bantuan</h1>
          </article>
          <article className="flex flex-col gap-4">
            {/* Form sections */}
            {/* Section 1 */}
            <section className="flex flex-col px-2 gap-2">
              <label className="text-indigo-700">Barang Bantuan</label>
              <input
                type="text"
                id="barang_bantuan"
                name="barang_bantuan"
                aria-label="Barang Bantuan"
                className="h-8 rounded border border-gray-400"
                placeholder="Contoh: Kerusi Roda, Katil Hospital"
                value={formData.barang_bantuan}
                onChange={handleChange}
              />
            </section>

            {/* Section 2 */}
            <section className="grid grid-cols-2 gap-4 px-2">
              <div className="flex flex-col gap-2">
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
              </div>
              <div className="flex flex-col gap-2">
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
              </div>
            </section>

            {/* Section 3 */}
            <section className="grid grid-cols-2 gap-4 px-2">
              <div className="flex flex-col gap-2">
                <label className="text-indigo-700">No Telefon</label>
                <input
                  type="text"
                  id="no_tel"
                  name="no_tel"
                  aria-label="no_tel"
                  className="h-8 rounded border border-gray-400"
                  placeholder="0109992938"
                  value={formData.no_tel}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
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
              </div>
            </section>

            {/* Section 4 */}
            <section className="flex flex-col gap-2 px-2">
              <label className="text-indigo-700">Alamat</label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="rounded border border-gray-400 p-2"
                placeholder="Alamat penerima bantuan"
              />
            </section>

            {/* Section 5 */}
            <section className="grid grid-cols-2 gap-4 px-2">
              <div className="flex flex-col gap-2">
                <label className="text-indigo-700">Kuantiti</label>
                <input
                  type="number"
                  id="kuantiti"
                  name="kuantiti"
                  value={formData.kuantiti}
                  onChange={handleChange}
                  className="h-8 rounded border border-gray-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-indigo-700">Harga</label>
                <input
                  type="text"
                  id="harga"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  className="h-8 rounded border border-gray-400"
                />
              </div>
            </section>

            {/* Section 6 */}
            <section className="flex flex-col gap-2 px-2">
              <label className="text-indigo-700">Catatan</label>
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                className="rounded border border-gray-400 p-2"
                placeholder="Catatan tambahan"
              />
            </section>

            <div className="mt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 px-4 py-2 rounded text-black hover:bg-gray-400">
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500">
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </article>
        </form>
      </div>
    </div>
  );
};

export default Modal;
