// components/modal.jsx
// components/modal.jsx
import React from 'react';
import { SubmitButton } from './submit-button';
import Link from 'next/link';

const Modal = ({ open, onClose, formData, handleChange, handleAddItem, total, items, handleDeleteItem }) => {
    if (!open) return null;

    // Do you know how to create a function that can submit this form to the table form?

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl p-6">
        <article id="form-title" className="text-center text-3xl font-semibold text-indigo-600 py-4 mb-4">
          <h1>Borang Serahan Bantuan</h1>
        </article>
        <article className="flex w-full">
          <div className="flex flex-col gap-4 w-full">
            {/* Form sections */}
            {/* Section 1 */}
            <section className="flex flex-col px-2 gap-2">
              <label className="text-indigo-700">Barang Bantuan</label>
              <input
                type="text"
                name="barang_bantuan"
                className="h-8 rounded border border-gray-400"
                placeholder=" Contoh: Kerusi Roda, Katil Hospital"
                value={formData?.barang_bantuan || ''}
                onChange={handleChange}
              />
            </section>
            {/* Section 2 */}
            <section className="grid grid-flow-col grid-rows-1 gap-x-2 px-2 h-[60px]">
              <div className="flex flex-col gap-2">
                <label className="text-indigo-700">Kategori Bantuan</label>
                <select
                  name="kategori_bantuan"
                  className="h-8 rounded border border-gray-400"
                  value={formData?.kategori_bantuan || ''}
                  onChange={handleChange}>
                  <option value="1">Program Kebajikan</option>
                  <option value="2">Program Mesra Rakyat</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-indigo-700">Kategori Penerima</label>
                <select
                  name="kategori_penerima"
                  className="h-8 rounded border border-gray-400"
                  value={formData?.kategori_penerima || ''}
                  onChange={handleChange}>
                  <option value="1">Kesejahteraan Rakyat</option>
                  <option value="2">Pendidikan</option>
                  <option value="3">NGO/Pertubuhan</option>
                  <option value="4">Bencana</option>
                  <option value="5">Keagamaan</option>
                  <option value="6">Pusat Khidmat</option>
                </select>
              </div>
            </section>
            {/* Section 3 */}
            <section className="grid grid-flow-col grid-rows-1 gap-x-2 px-2 h-[60px]">
              <div className="flex flex-col gap-2">
                <label className="text-indigo-700">No Telefon</label>
                <input
                  type="text"
                  name="no_tel"
                  className="h-8 rounded border border-gray-400"
                  placeholder=" 0109992938"
                  value={formData?.no_tel || ''}
                  onChange={handleChange}/>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-indigo-700">Jenis Bantuan</label>
                <select
                  name="jenis_bantuan"
                  className="h-8 rounded border border-gray-400"
                  value={formData?.jenis_bantuan || ''}
                  onChange={handleChange}>
                  <option value="1">Tunai</option>
                  <option value="2">Bantuan Peralatan</option>
                  <option value="3">Tunai dan Peralatan</option>
                </select>
              </div>
            </section>
            {/* Section 4 */}
            <section className="flex flex-col px-2 gap-2">
              <label className="text-indigo-700">Alamat</label>
              <input
                type="text"
                name="alamat"
                className="h-8 rounded border border-gray-400"
                placeholder=" No Rumah Jalan Daerah"
                value={formData?.alamat || ''}
                onChange={handleChange}/>
            </section>
            {/* Section 5 */}
            <section className="grid grid-flow-col grid-rows-1 gap-x-2 px-2 h-[60px]">
              <div className="flex flex-col gap-2">
                <label className="text-indigo-700">Kuantiti</label>
                <select
                  name="kuantiti"
                  className="h-8 rounded border border-gray-400"
                  value={formData?.kuantiti || ''}
                  onChange={handleChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-indigo-700">Harga</label>
                <input
                  type="text"
                  name="harga"
                  className="h-8 rounded border border-gray-400"
                  placeholder=" Contoh 890.00"
                  value={formData?.harga || ''}
                  onChange={handleChange}/>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <section className="flex flex-col gap-2 px-2">
              <label className="text-indigo-700">Catatan</label>
              <textarea
                name="catatan"
                className="h-[100px] rounded border border-gray-400"
                value={formData?.catatan || ''}
                onChange={handleChange}>
              </textarea>

              <SubmitButton pendingText="Processing..." className="bg-indigo-600 hover:bg-indigo-500">
                Submit
              </SubmitButton>
              <Link href={"/rekod"} className="bg-neutral-700 text-slate-50 justify-center text-center p-2 rounded-sm hover:bg-neutral-800">
                Cancel
              </Link>
            </section>
          </div>
        </article>


        {/* Close button */}
      <article className='flex justify-center items-center mt-4'>
        <button onClick={onClose} className="bg-indigo-600 text-white text-base w-36 p-2 rounded">
          Close
        </button>
      </article>
      </div>
    </div>
  );
};

export default Modal;










// export default function Modal({ open, onClose, children }) {
//   return (
//       <div
//           className={`fixed inset-0 flex justify-center items-center transition-colors duration-200 ${
//               open ? "visible bg-black/20" : "invisible"
//           }`}
//           onClick={onClose}
//       >
//           <div
//               className={`bg-white w-[90%] max-w-[1000px] max-h-[auto] overflow-y-auto rounded shadow p-4 transition-all duration-300 ${
//                   open ? "scale-100 opacity-100" : "scale-125 opacity-0"
//               }`}
//               onClick={(e) => e.stopPropagation()} // Prevent click propagation
//           >
//               {children}
//           </div>
//       </div>
//   );
// }
