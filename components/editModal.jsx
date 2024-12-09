// components/editModal.jsx
import { useState, useEffect } from "react";

const EditModal = ({ isOpen, onClose, formData, supabase }) => {
  const [formStatus, setFormStatus] = useState(formData.form_status || "");
  const [notes, setNotes] = useState(formData.notes || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      setFormStatus(formData.form_status);
      setNotes(formData.notes);
    }
  }, [formData]);

  const handleSave = async () => {
    if (!formStatus || !notes) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("form")
        .update({ form_status: formStatus, notes: notes })
        .eq("id", formData.id);

      if (error) throw error;

    //   alert("Form updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating form:", error);
      alert("An error occurred while updating the form.");
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

        alert("Form deleted successfully");
        onClose();
      } catch (error) {
        console.error("Error deleting form:", error);
        alert("An error occurred while deleting the form.");
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
