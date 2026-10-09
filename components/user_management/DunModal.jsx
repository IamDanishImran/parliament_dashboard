import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { approveDunAction } from "@/app/actions";

const DunModal = ({ isOpen, onClose, formData, supabase }) => {
  const [dunName, setDunName] = useState(formData?.name || "");
  const [dunStatus, setDunStatus] = useState(formData?.status || "");
  const [dunEmail, setDunEmail] = useState(formData?.email || "");
  const [dunIC, setDunIC] = useState(formData?.ic || "");
  const [dun, setDun] = useState(formData?.registration.description || "");
  const [isLoading, setIsLoading] = useState(false); // For delete button
  const [isSaving, setIsSaving] = useState(false); // For save/approve button

  if (!isOpen || !formData) return null;

  useEffect(() => {
    if (formData) {
      setDunName(formData.name || "");
      setDunStatus(formData.status || "");
      setDunEmail(formData.email || "");
      setDunIC(formData.ic || "");
      setDun(formData.registration.description || "");
    }
  }, [formData]);

  const handleSave = async () => {
    setIsSaving(true); // Start loading for save button
    try {
      const result = await approveDunAction({ dunId: formData.id });
      if (result.status === "error") {
        throw new Error(result.message);
      }
      toast.success(result.message);
      onClose();
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSaving(false); // Stop loading for save button
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      setIsLoading(true); // Start loading for delete button
      try {
        const { error } = await supabase
          .from("dun")
          .delete()
          .eq("id", formData.id);

        if (error) throw error;

        toast.success("Dun request deleted successfully.");
        onClose();
      } catch (error) {
        console.error("Error:", error.message);
        toast.error("Failed to delete Dun request.");
      } finally {
        setIsLoading(false); // Stop loading for delete button
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-2 sm:p-0 bg-black bg-opacity-50">
      <div className="bg-white rounded shadow py-6 px-2 sm:p-6 w-[600px]">
        <h2 className="text-2xl text-center text-indigo-600 font-semibold mb-4">Dun Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <article className="flex flex-col col-span-1 gap-1">
            <label htmlFor="status" className="text-indigo-700">
              Status
            </label>
            <input
              type="text"
              value={dunStatus}
              aria-disabled="true"
              disabled
              className={`h-8 rounded border px-2 ${
                dunStatus === "Pending"
                  ? "bg-yellow-300"
                  : dunStatus === "Approved"
                  ? "bg-green-300"
                  : "bg-gray-200"
              }`}
            />
          </article>
          <article className="col-span-2"></article>
          <article className="flex flex-col col-span-2 gap-1">
            <label htmlFor="name" className="text-indigo-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={dunName}
              aria-disabled="true"
              disabled
              className="h-8 rounded border border-gray-400 px-2"
            />
          </article>
          <article className="flex flex-col col-span-2 gap-1">
            <label htmlFor="email" className="text-indigo-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={dunEmail}
              aria-disabled="true"
              disabled
              className="h-8 rounded border border-gray-400 px-2"
            />
          </article>
          <article className="col-span-1"></article>
          <article className="flex flex-col col-span-1 gap-1">
            <label htmlFor="ic" className="text-indigo-700">
              IC
            </label>
            <input
              type="text"
              id="ic"
              name="ic"
              value={dunIC}
              aria-disabled="true"
              disabled
              className="h-8 rounded border border-gray-400 px-2"
            />
          </article>
          <article className="flex flex-col col-span-1 gap-1">
            <label htmlFor="dun" className="text-indigo-700">
              Dun
            </label>
            <input
              type="text"
              id="dun"
              name="dun"
              value={dun}
              aria-disabled="true"
              disabled
              className="h-8 rounded border border-gray-400 px-2"
            />
          </article>
        </div>
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="w-1/2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-1/2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 disabled:bg-gray-400"
          >
            {isSaving ? "Approving..." : "Approve"}
          </button>
        </div>
        <button
          onClick={onClose}
          // disabled={isLoading || isSaving}
          className="bg-gray-600 text-white w-1/4 py-2 rounded mt-4 disabled:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DunModal;
