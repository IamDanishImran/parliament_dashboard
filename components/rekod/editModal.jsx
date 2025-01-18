import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditModal = ({ isOpen, onClose, formData, supabase }) => {
  const [formStatus, setFormStatus] = useState(formData?.form_status || "");
  const [notes, setNotes] = useState(formData?.notes || "");
  const [category, setCategory] = useState(formData?.category || "");
  const [categoryType, setCategoryType] = useState(formData?.category_type || "");
  const [quantity, setQuantity] = useState(formData?.quantity || "");
  const [price, setPrice] = useState(formData?.price || "");
  const [address, setAddress] = useState(formData?.address || "");
  const [phone, setPhone] = useState(formData?.phone || "");
  const [helpType, setHelpType] = useState(formData?.help_type || "");
  const [item, setItem] = useState(formData?.item || "");
  const [date, setDate] = useState(formData?.inserted_at || "");
  const [dun, setDun] = useState(formData?.dun?.id_register?.description || "");
  const [adminNotes, setAdminNotes] = useState(formData?.admin_notes || "");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedDunUser, setHasCheckedDunUser] = useState(false);

  useEffect(() => {
    if (formData) {
      setNotes(formData.notes || "");
      setCategory(formData.category || "");
      setCategoryType(formData.category_type || "");
      setQuantity(formData.quantity || "");
      setPrice(formData.price || "");
      setFormStatus(formData.form_status || "");
      setAddress(formData.address || "");
      setPhone(formData.phone || "");
      setHelpType(formData.help_type || "");
      setItem(formData.item || "");
      setDate(formData.inserted_at || "");
      setDun(formData.dun?.id_register?.description || "");
      setAdminNotes(formData?.admin_notes || "");
    }
  }, [formData]);

  useEffect(() => {
    const checkDunUser = async () => {
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

        if (getDun && !error && !hasCheckedDunUser) {
          console.log("Error: Dun can't access edit form");
          toast.error("Dun can't access edit form");
          setHasCheckedDunUser(true);
          onClose();
          return;
        }
      } catch (error) {
        toast.error('An unexpected error occurred.');
        console.error(error);
        onClose();
      }
    };

    if (isOpen && !hasCheckedDunUser) {
      checkDunUser();
    }

    // Reset state when the modal closes
    if (!isOpen) {
      setHasCheckedDunUser(false);
    }
  }, [isOpen, onClose, supabase, hasCheckedDunUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formStatus || !notes || !category || !categoryType || !quantity || !price || !address || !phone || !helpType || !item || !date || !adminNotes) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("form")
        .update({ form_status: formStatus, notes: notes })
        .eq("id", formData.id);
      if (error) throw error;
      toast.success("Form updated successfully");
      onClose();
    } catch (error) {
      console.log("Error updating form:", error);
      toast.error("An error occurred while updating the form.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this form?")) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("form")
          .delete()
          .eq("id", formData.id);
        if (error) throw error;
        toast.success("Form deleted successfully");
        onClose();
      } catch (error) {
        console.error("Error deleting form:", error);
        toast.error("An error occurred while deleting the form.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <main className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-90">
      <section className="bg-white rounded-lg w-[1000px] max-h-[670px] p-6 pt-12 pb-20">
        <article className="text-center text-3xl pb-14 font-semibold text-indigo-600">
          <h1>Edit Modal</h1>
        </article>
        <form onSubmit={handleSave}>
          <section className='grid grid-cols-2 gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Dun */}
            <article className="flex flex-col col-span-2 gap-1">
              <label className="text-indigo-700">Dun</label>
              <input
              type="text"
              id="dun"
              name="dun"
              value={dun}
              onChange={(e) => setDun(e.target.value)}
              className="h-8 rounded border border-gray-400 px-2" 
              disabled
              />
            </article>
              {/* Form fields */}
              <article className="flex flex-col col-span-2 gap-1">
                <label htmlFor="barang_bantuan" className="text-indigo-700">Assistance Items</label>
                <input type="text" id="barang_bantuan" name="barang_bantuan"
                  className="h-8 rounded border border-gray-400 px-2"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  disabled
                />
              </article>
              {/* Other fields */}
              <article className="flex flex-col gap-1">
                <label className="text-indigo-700">Program Category</label>
                <input type="text" id="barang_bantuan"
                  name="barang_bantuan"
                  className="h-8 rounded border border-gray-400 px-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled
                />
              </article>

              {/* Kategori Penerima */}
              <article className="flex flex-col col-span-1 gap-1">
                <label className="text-indigo-700">Category</label>
                <input type="text" id="barang_bantuan"
                  name="barang_bantuan"
                  className="h-8 rounded border border-gray-400 px-2"
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  disabled
                />
              </article>

              <article className="flex flex-col gap-1">
                <label className="text-indigo-700">Assistance Type</label>
                <input type="text" id="barang_bantuan" name="barang_bantuan"
                  className="h-8 rounded border border-gray-400 px-2"
                  value={helpType}
                  onChange={(e) => setHelpType(e.target.value)}
                  disabled
                />
              </article>

              <article className="flex flex-col gap-1">
                <label className="text-indigo-700">Quantity</label>
                <input type="text" id="barang_bantuan"
                  name="barang_bantuan"
                  className="h-8 rounded border border-gray-400 px-2"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled
                />
              </article>

              <article className="flex flex-col gap-1">
              <label className="text-indigo-700">Price</label>
              <input
                type="text"
                id="harga"
                name="harga"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-8 rounded border border-gray-400 px-2"
                disabled
                />
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled
              />
            </article>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              {/* Alamat */}
            <article className="flex flex-col col-span-2 gap-1">
              <label className="text-indigo-700">Address</label>
              <input
              type="text"
              id="alamat"
              name="alamat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-8 rounded border border-gray-400 px-2" 
              disabled
              />
            </article>
            {/* Form Status */}
            <article className="flex flex-col col-span-2 gap-1">
              <label className="text-indigo-700">Form Status</label>
              <select name="formStatus" id="formStatus" value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="h-8 rounded border border-gray-400 px-2">
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="KIV">KIV</option>
              </select>
            </article>
              {/* First Article */}
              <article className="flex flex-col col-span-2 gap-1">
                <label className="text-indigo-700">Application Notes</label>
                <textarea name="catatan" value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded border border-gray-400 p-2 h-[120px]"
                />
                <label className="text-indigo-700">Admin Notes</label>
                <input type="text" id="admin_notes" name="alamat" value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="h-8 rounded border border-gray-400 px-2" 
                />
                {/* Final Actions */}
                <div className="flex justify-end gap-4">
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="btn bg-red-500 text-white w-1/2 p-2 rounded mt-4 hover:bg-red-400"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn bg-indigo-600 text-white w-1/2 p-2 rounded mt-4 hover:bg-indigo-700 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}>
                      {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
                <div className="col-span-2 gap-3">
                <button type="button" onClick={onClose}
                    className="bg-gray-300 w-full mb-4 px-4 py-2 mt-2 rounded text-black hover:bg-gray-400">
                    Close
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

export default EditModal;