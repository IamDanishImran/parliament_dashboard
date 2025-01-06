import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditModal = ({ isOpen, onClose, formData, supabase }) => {
  const [formStatus, setFormStatus] = useState(formData.form_status || "");
  const [notes, setNotes] = useState(formData.notes || "");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedDunUser, setHasCheckedDunUser] = useState(false);

  useEffect(() => {
    if (formData) {
      setFormStatus(formData.form_status);
      setNotes(formData.notes);
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
        if (!error) {
          toast.error(`DUN users can't access edit form`);
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
      setHasCheckedDunUser(true);
      checkDunUser();
    }
  }, [isOpen, onClose, supabase, hasCheckedDunUser]);

  useEffect(() => {
    if (!isOpen) {
      setHasCheckedDunUser(false); // Reset the state when the modal closes
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!formStatus || !notes) {
      toast.info('Please fill in all fields');
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
    if (window.confirm("Are you sure you want to delete this form?")) {
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

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl p-6">
        <h2 className="text-3xl mb-4">Edit Form</h2>

        <div className="mb-4">
          <label htmlFor="formStatus" className="block mb-2">Form Status</label>
          <select name="formStatus" id="formStatus" value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
            <option value="MOHON">MOHON</option>
            <option value="LULUS">LULUS</option>
            <option value="DITOLAK">DITOLAK</option>
            <option value="KIV">KIV</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="notes" className="block mb-2">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            {isLoading ? "Deleting..." : "Delete Form"}
          </button>
        </div>

        <button onClick={onClose} className="bg-gray-600 text-white w-full py-2 rounded mt-4">Close</button>
      </div>
    </div>
  );
};

export default EditModal;
