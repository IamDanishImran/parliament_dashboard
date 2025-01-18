import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminModal = ({ isOpen, onClose, formData, supabase }) => {
  const [adminName, setAdminName] = useState(formData?.name || "");
  const [adminStatus, setAdminStatus] = useState(formData?.status || "");
  const [adminEmail, setAdminEmail] = useState(formData?.email || "");
  const [adminIC, setAdminIC] = useState(formData?.ic || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !formData) return null;

  console.log("formData.id:", formData.id);

  useEffect(() => {
    if (formData) {
      setAdminName(formData.name);
      setAdminStatus(formData.status);
      setAdminEmail(formData.email);
      setAdminIC(formData.ic);
    }
  }, [formData]);

  const handleSave = async () => {
    if (!adminName || !adminEmail || !adminStatus || !adminIC) {
      toast.error("Please fill in all fields");
      return;
    }
  
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("admin")
        .update({ name: adminName, email: adminEmail, status: adminStatus, ic: adminIC, status: 'Approved' })
        .eq("id", formData.id)
        .select();
  
      if (error) {
        console.error("Supabase Error:", error.message);
        toast.error("An error occurred while updating the admin request.");
      } else {
        console.log("Updated Record:", data);
        toast.success("Approved admin request successfully");
        onClose();
      }
    } catch (error) {
      console.error("Error updating admin request:", error);
      toast.error("An error occurred while updating the admin request.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleDelete = async () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Are you sure you want to delete this request?")
    ) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("admin")
          .delete()
          .eq("id", formData.id);

        if (error) throw error;

        toast.success("admin request deleted successfully");
        console.log(`FormData: ${formData}`);
        onClose();
      } catch (error) {
        console.error("Error deleting admin request:", error);
        toast.error("An error occurred while deleting the request.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded shadow p-6 w-1/3">
        <h2 className="text-xl font-semibold mb-4">admin Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <article className="flex flex-col col-span-1 gap-1">
            <label htmlFor="status" className="text-indigo-700">
              Status
            </label>
            <input
              type="text"
              value={adminStatus}
              disabled
              className={`h-8 rounded border border-gray-400 px-2 ${
                adminStatus === "Pending"
                  ? "bg-yellow-300"
                  : adminStatus === "Approved"
                  ? "bg-green-300"
                  : "bg-gray-200"
              }`}
            />
          </article>
          <article className="flex flex-col col-span-2 gap-1">
            <label htmlFor="name" className="text-indigo-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="h-8 rounded border border-gray-400 px-2"
              value={adminName}
              disabled
              onChange={(e) => setAdminName(e.target.value)}
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
              className="h-8 rounded border border-gray-400 px-2"
              value={adminEmail}
              disabled
              onChange={(e) => setAdminEmail(e.target.value)}
            />
          </article>
          <article className="flex flex-col col-span-2 gap-1">
            <label htmlFor="ic" className="text-indigo-700">
              IC
            </label>
            <input
              type="text"
              id="ic"
              name="ic"
              className="h-8 rounded border border-gray-400 px-2"
              value={adminIC}
              disabled
              onChange={(e) => setAdminIC(e.target.value)}
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
            disabled={isLoading}
            className="w-1/2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Approving..." : "Approve"}
          </button>
        </div>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white w-1/4 py-2 rounded mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdminModal;
