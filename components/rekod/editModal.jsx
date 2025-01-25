import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalEdit, setModalEdit] = useState(false); // For admin-specific UI

  // Load form data when modal opens
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

  // Check if the user is an admin and adjust UI accordingly
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("You need to log in first.");
          onClose();
          return;
        }

        const { data: adminAccess } = await supabase
          .from("admin")
          .select("email")
          .eq("email", user.email)
          .single();

        // If admin data exists, enable admin-specific UI
        setModalEdit(!!adminAccess);
      } catch (error) {
        toast.error("An error occurred while checking user role.");
        console.error(error);
        onClose();
      }
    };

    if (isOpen) {
      checkUserRole();
    }
  }, [isOpen, supabase, onClose]);

  // Handle form save
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formStatus || !notes || !category || !categoryType || !quantity || !price || !address || !phone || !helpType || !item || !date || !adminNotes) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("form")
        .update({ form_status: formStatus, admin_notes: adminNotes })
        .eq("id", formData.id);

      if (error) throw error;
      toast.success("Form updated successfully.");
      onClose();
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("An error occurred while updating the form.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form delete
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this form?")) {
      setIsDeleting(true);
      try {
        const { error } = await supabase
          .from("form")
          .delete()
          .eq("id", formData.id);

        if (error) throw error;
        toast.success("Form deleted successfully.");
        onClose();
      } catch (error) {
        console.error("Error deleting form:", error);
        toast.error("An error occurred while deleting the form.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <main className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <section className="bg-white rounded-lg h-[600px] sm:h-auto w-11/12 max-w-4xl p-6 relative overflow-y-auto">
            {modalEdit ? (
              <>
              <article className="text-center text-3xl pb-14 font-semibold text-indigo-600">
                <h1>Application Management</h1>
              </article>
              <form onSubmit={handleSave}>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          {/* Dun */}
          <article className="flex flex-col col-span-2 gap-1">
            <label className="text-indigo-700">Dun</label>
            <input type="text" id="dun" name="dun" value={dun} disabled
              onChange={(e) => setDun(e.target.value)}
              className="h-8 rounded border border-gray-400 px-2" 
            />
          </article>
          <article className="flex flex-col col-span-2 gap-1">
            <label htmlFor="barang_bantuan" className="text-indigo-700">Assistance Items</label>
            <input type="text" id="barang_bantuan" name="barang_bantuan" value={item} disabled
              className="h-8 rounded border border-gray-400 px-2"
              onChange={(e) => setItem(e.target.value)}
            />
          </article>
          <article className="flex flex-col gap-1">
            <label className="text-indigo-700">Program Category</label>
            <input type="text" id="barang_bantuan" name="barang_bantuan" value={category} disabled
              className="h-8 rounded border border-gray-400 px-2"
              onChange={(e) => setCategory(e.target.value)}
            />
          </article>
          {/* Kategori Penerima */}
          <article className="flex flex-col col-span-1 gap-1">
            <label className="text-indigo-700">Category</label>
            <input type="text" id="barang_bantuan" name="barang_bantuan" value={categoryType} disabled
              className="h-8 rounded border border-gray-400 px-2"
              onChange={(e) => setCategoryType(e.target.value)}
            />
          </article>
          <article className="flex flex-col gap-1">
            <label className="text-indigo-700">Assistance Type</label>
            <input type="text" id="barang_bantuan" name="barang_bantuan" value={helpType} disabled
              className="h-8 rounded border border-gray-400 px-2"
              onChange={(e) => setHelpType(e.target.value)}
            />
          </article>
          <article className="flex flex-col gap-1">
            <label className="text-indigo-700">Quantity</label>
            <input type="text" id="barang_bantuan" name="barang_bantuan" value={quantity} disabled
              className="h-8 rounded border border-gray-400 px-2"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </article>
          <article className="flex flex-col gap-1">
            <label className="text-indigo-700">Price</label>
            <input type="text" id="harga" name="harga" value={price} disabled
              onChange={(e) => setPrice(e.target.value)}
              className="h-8 rounded border border-gray-400 px-2"
            />
          </article>
          {/* No Telefon */}
          <article className="flex flex-col col-span-1 gap-1">
            <label className="text-indigo-700">Phone Number</label>
            <input type="text" id="no_tel" name="no_tel" value={phone} aria-label="No Telefon" disabled
            className="h-8 rounded border border-gray-400 px-2"
            onChange={(e) => setPhone(e.target.value)}
            />
          </article>
          {/* Alamat */}
          <article className="flex flex-col col-span-2 gap-1">
            <label className="text-indigo-700">Address</label>
            <input type="text" id="alamat" name="alamat" value={address} disabled
              onChange={(e) => setAddress(e.target.value)}
              className="h-8 rounded border border-gray-400 px-2" 
            />
          </article>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <article className="flex flex-col col-span-2 gap-1">
            <label className="text-indigo-700">Application Notes</label>
            <textarea name="catatan" value={notes} disabled
              className="rounded border border-gray-400 p-2 h-[120px]"
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
              
              <article className="flex flex-col col-span-2 gap-1">
                <label className="text-indigo-700">Admin Notes</label>
                <input type="text" id="admin_notes" name="admin_notes" value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="h-8 rounded border border-gray-400 px-2" 
                />
              </article> 
              <article className="flex col-span-2 gap-2">
            <button onClick={handleDelete} disabled={isDeleting}
              className="btn bg-red-500 text-white w-1/2 p-2 rounded mt-4 hover:bg-red-400"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button type="submit" disabled={isSaving}
              className={`btn bg-indigo-600 text-white w-1/2 p-2 rounded mt-4 hover:bg-indigo-700 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </article>
          <article className="col-span-2 gap-3">
            <button type="button" onClick={onClose}
                className="bg-gray-300 w-full mb-4 px-4 py-2 mt-2 rounded text-black hover:bg-gray-400">
                Close
              </button>
          </article>
             </div>
             </section>
            </form>
            <ToastContainer />
              </>
            ) : (
              <>
              <article className="text-center text-3xl pb-10 sm:pb-14 font-semibold text-indigo-600">
                <h1>Review Application</h1>
              </article>
              <form onSubmit={handleSave}>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          {/* Dun */}
          <article className="flex flex-col col-span-2 gap-1">
            <label className="text-indigo-700">Dun</label>
            <input type="text" id="dun" name="dun" value={dun} disabled
              onChange={(e) => setDun(e.target.value)}
              className="h-8 rounded border border-gray-400 px-2" 
            />
          </article>
          <article className="flex flex-col col-span-2 gap-1">
            <label htmlFor="barang_bantuan" className="text-indigo-700">Assistance Items</label>
            <input type="text" id="barang_bantuan" name="barang_bantuan" value={item} disabled
              className="h-8 rounded border border-gray-400 px-2"
              onChange={(e) => setItem(e.target.value)}
            />
          </article>
          <article className="flex flex-col gap-1">
            <label className="text-indigo-700">Program Category</label>
            <input type="text" id="barang_bantuan" name="barang_bantuan" value={category} disabled
              className="h-8 rounded border border-gray-400 px-2"
              onChange={(e) => setCategory(e.target.value)}
            />
          </article>
          {/* Kategori Penerima */}
          <article className="flex flex-col col-span-1 gap-1">
            <label className="text-indigo-700">Category</label>
            <input type="text" id="barang_bantuan" name="barang_bantuan" value={categoryType} disabled
              className="h-8 rounded border border-gray-400 px-2"
              onChange={(e) => setCategoryType(e.target.value)}
            />
          </article>
          <article className="flex flex-col gap-1">
            <label className="text-indigo-700">Assistance Type</label>
            <input type="text" id="barang_bantuan" name="barang_bantuan" value={helpType} disabled
              className="h-8 rounded border border-gray-400 px-2"
              onChange={(e) => setHelpType(e.target.value)}
            />
          </article>
          <article className="flex flex-col gap-1">
            <label className="text-indigo-700">Quantity</label>
            <input type="text" id="barang_bantuan" name="barang_bantuan" value={quantity} disabled
              className="h-8 rounded border border-gray-400 px-2"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </article>
          <article className="flex flex-col gap-1">
            <label className="text-indigo-700">Price</label>
            <input type="text" id="harga" name="harga" value={price} disabled
              onChange={(e) => setPrice(e.target.value)}
              className="h-8 rounded border border-gray-400 px-2"
            />
          </article>
          {/* No Telefon */}
          <article className="flex flex-col col-span-1 gap-1">
            <label className="text-indigo-700">Phone Number</label>
            <input type="text" id="no_tel" name="no_tel" value={phone} aria-label="No Telefon" disabled
            className="h-8 rounded border border-gray-400 px-2"
            onChange={(e) => setPhone(e.target.value)}
            />
          </article>
          {/* Alamat */}
          <article className="flex flex-col col-span-2 gap-1">
            <label className="text-indigo-700">Address</label>
            <input type="text" id="alamat" name="alamat" value={address} disabled
              onChange={(e) => setAddress(e.target.value)}
              className="h-8 rounded border border-gray-400 px-2" 
            />
          </article>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <article className="flex flex-col col-span-2 gap-1">
            <label className="text-indigo-700">Application Notes</label>
            <textarea name="catatan" value={notes} disabled
              className="rounded border border-gray-400 p-2 h-[120px]"
            />
          </article>
              {/* Form Status */}
              <article className="flex flex-col col-span-2 gap-1">
                <label className="text-indigo-700">Form Status</label>
                <input type="text" id="admin_notes" name="admin_notes" value={formStatus}
                  readOnly disabled
                  className="h-8 rounded border border-gray-400 px-2" 
                />
              </article>
              
              <article className="flex flex-col col-span-2 gap-1">
                <label className="text-indigo-700">Admin Notes</label>
                <input type="text" id="admin_notes" name="admin_notes" value={adminNotes}
                  readOnly disabled
                  className="h-8 rounded border border-gray-400 px-2" 
                />
              </article> 
          <article className="col-span-2 gap-3">
            <button type="button" onClick={onClose}
                className="bg-gray-300 w-full mb-4 px-4 py-2 mt-2 rounded text-black hover:bg-gray-400">
                Close
              </button>
          </article>
             </div>
             </section>
            </form>
            <ToastContainer />
              </>
            )}
      </section>
    </main>
  );
};

export default EditModal;
