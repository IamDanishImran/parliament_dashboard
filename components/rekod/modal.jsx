import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from "@/utils/supabase/client";
import { Divider } from "@nextui-org/divider";

const supabase = createClient(); // Initialize Supabase client once

const Modal = ({ open, onClose, handleAddItem }) => {
  const [loading, setLoading] = useState(false);
  const [dunData, setDunData] = useState(null); // Null to check if data exists
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
  const [totalPrice, setTotalPrice] = useState(0); // State for total price

  // Fetch DUN data when the modal is opened
  useEffect(() => {
    if (!open) return;

    const fetchDunData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
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
        console.log(error);
      }
    };

    fetchDunData();
  }, [open, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Calculate total price when 'kuantiti' or 'harga' changes
    if (name === 'kuantiti' || name === 'harga') {
      const quantity = name === 'kuantiti' ? parseInt(value, 10) : parseInt(formData.kuantiti, 10);
      const price = name === 'harga' ? parseFloat(value) : parseFloat(formData.harga);
      setTotalPrice(quantity > 0 && price > 0 ? quantity * price : 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!dunData?.id) { // Check for valid dunData
        toast.error("DUN data is missing. Please check your account.");
        setLoading(false);
        return;
      }
      
      const { barang_bantuan, kategori_bantuan, kategori_penerima, no_tel, alamat, harga, kuantiti } = formData;
      // List of required fields for cleaner validation
      const requiredFields = [barang_bantuan, kategori_bantuan, kategori_penerima, no_tel, alamat, harga, kuantiti];
      
      if (requiredFields.some(field => !field)) {
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
          price: totalPrice,
          form_status: 'IN PROGRESS',
          id_dun: dunData.id,
          address: formData.alamat,
          phone: formData.no_tel,
          help_type: formData.jenis_bantuan,
          item: formData.barang_bantuan,
        });
  
      if (formSubmissionError) throw formSubmissionError;
      handleAddItem();
      setFormData({
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
    } catch (error) {
      toast.error("An unexpected error occurred!.");
      console.log("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
      <main className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <section className="bg-white justify-center items-center rounded w-[400px] h-[600px] mx-4 sm:m-0 py-8 px-2 overflow-y-auto 
        sm:w-auto sm:h-auto sm:p-6 sm:pt-12 sm:pb-20 ">
        <article className="text-center text-3xl pb-14 font-semibold text-indigo-600">
          <h1>Application Form</h1>
        </article>
        <form onSubmit={handleSubmit}>
          <section className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Form fields */}
              <article className="flex flex-col col-span-2 gap-1">
                <label htmlFor="barang_bantuan" className="text-indigo-700">Assistance Item</label>
                <input type="text" id="barang_bantuan"
                  name="barang_bantuan"
                  className="h-8 rounded border border-gray-400 px-2"
                  placeholder="&nbsp;Example: Wheelchair, Hospital Bed"
                  value={formData.barang_bantuan}
                  onChange={handleChange}
                />
              </article>
              {/* Other fields */}
              <article className="flex flex-col gap-1">
                <label className="text-indigo-700">Program Category</label>
                <select
                  name="kategori_bantuan"
                  className="h-8 rounded border border-gray-400"
                  value={formData.kategori_bantuan}
                  onChange={handleChange}>
                  <option value="">Choose</option>
                  <option value="Welfare Assistance Program">Welfare Assistance Program</option>
                  <option value="Community Outreach Program">Community Outreach Program</option>
                </select>
              </article>

              {/* Kategori Penerima */}
              <article className="flex flex-col col-span-1 gap-1">
                <label className="text-indigo-700">Category</label>
                <select
                  name="kategori_penerima"
                  className="h-8 rounded border border-gray-400"
                  value={formData.kategori_penerima}
                  onChange={handleChange}>
                  <option value="">Choose</option>
                  <option value="Public Well-Being">Public Well-Being</option>
                  <option value="Education">Education</option>
                  <option value="NGO/Organization">NGO/Organization</option>
                  <option value="Disaster">Disaster</option>
                  <option value="Religious">Religious</option>
                  <option value="Service Center">Service Center</option>
                </select>
              </article>

              <article className="flex flex-col gap-1">
                <label className="text-indigo-700">Assistance Type</label>
                <select
                  name="jenis_bantuan"
                  className="h-8 rounded border border-gray-400"
                  value={formData.jenis_bantuan}
                  onChange={handleChange}>
                  <option value="">Choose</option>
                  <option value="Cash Assistance">Cash Assistance</option>
                  <option value="Equipment Assistance">Equipment Assistance</option>
                  <option value="Equipment & Cash Assistance">Equipment & Cash Assistance</option>
                </select>
              </article>

              <article className="flex flex-col gap-1">
                <label className="text-indigo-700">Quantity</label>
                <select
                  id="kuantiti"
                  name="kuantiti"
                  value={formData.kuantiti}
                  onChange={handleChange}
                  className="h-8 rounded border border-gray-400">
                  <option value="">Choose</option>
                  {Array.from({ length: 50 }, (_, i) => (
                    <option key={i + 1} value={i + 1}> 
                      {i + 1}
                    </option>
                  ))}
                </select>
              </article>

              <article className="flex flex-col gap-1">
              <label className="text-indigo-700">Price</label>
              <input
                type="text"
                id="harga"
                name="harga"
                value={formData.harga}
                onChange={handleChange}
                placeholder='&nbsp;Example: 890.00'
                className="h-8 rounded border border-gray-400 px-2"/>
            </article>

            {/* No Telefon */}
            <article className="flex flex-col col-span-1 gap-1">
              <label className="text-indigo-700">Phone Number</label>
              <input
                type="text"
                id="no_tel"
                name="no_tel"
                aria-label="No Telefon"
                className="h-8 rounded border border-gray-400 px-2"
                placeholder="&nbsp;0123456789"
                value={formData.no_tel}
                onChange={handleChange}
              />
            </article>

            {/* Alamat */}
            <article className="flex flex-col col-span-2 gap-1">
              <label className="text-indigo-700">Address</label>
              <input
              type="text"
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              placeholder='&nbsp;Example: Street Number, District'
              className="h-8 rounded border border-gray-400 px-2"/>
            </article>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {/* First Article */}
              <article className="flex flex-col col-span-2 gap-1 py-0">
                <label className="text-indigo-700">Notes</label>
                <textarea name="catatan" value={formData.catatan}
                  onChange={handleChange}
                  className="rounded border border-gray-400 p-2 h-[120px]"
                  placeholder="Additional notes"
                />
                <Divider className="my-4" />
                  <p className="text-lg font-semibold">
                    Total Price: <span className="text-indigo-600">RM {totalPrice.toFixed(2)}</span>
                  </p>
                <Divider className="my-4" />
                {/* Final Actions */}
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={onClose}
                    className="bg-gray-300 w-1/2 px-4 py-2 rounded text-black hover:bg-gray-400">
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-indigo-600 w-1/2 px-4 py-2 rounded text-white hover:bg-indigo-700 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}>
                      {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </article>
            </div>
          </section>
        </form>
        <ToastContainer />
      </section>
    </main>
  );
};

export default Modal;