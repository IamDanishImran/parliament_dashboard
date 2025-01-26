// components\user_management\AdminModal.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminModal = ({ isOpen, onClose, formData, supabase }) => {
  const [adminName, setAdminName] = useState(formData?.name || "");
  const [adminStatus, setAdminStatus] = useState(formData?.status || "");
  const [adminEmail, setAdminEmail] = useState(formData?.email || "");
  const [adminIC, setAdminIC] = useState(formData?.ic || "");
  const [admin, setAdmin] = useState(formData?.registration.description || "");
  const [roleCode, setRoleCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !formData) return null;

  // Role code mapping
  const roleCodeMapping = {
    "Rembia": "10598878",
    "Machap Jaya": "12345678",
    "Durian Tunggal": "98765432",
    "Asahan": "45671234",
    "Gadek": "31415926",
    "Outside Alor Gajah": "74035216",
    "Outside Melaka": "20479352",
    "Supervisor": "80845621"
  };

  useEffect(() => {
    if (formData) {
      setAdminName(formData.name || "");
      setAdminStatus(formData.status || "");
      setAdminEmail(formData.email || "");
      setAdminIC(formData.ic || "");
      setAdmin(formData.registration.description || "");
    }
  }, [formData]);

  useEffect(() => {
    setRoleCode(roleCodeMapping[admin] || "");
  }, [admin]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update admin information
      const { data, error } = await supabase
        .from("admin")
        .update({
          name: adminName,
          email: adminEmail,
          status: "Approved",
          ic: adminIC,
        })
        .eq("id", formData.id);

      if (error) throw error;

      // Send approval email
      const response = await fetch("/api/user-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: adminEmail,
          subject: "Your Application Has Been Approved",
          text: `Dear ${adminName},\n\nYour registration has been approved successfully.\n\nBest regards,\nParliament Team Support\nHere's the registration code ${roleCode}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to send approval email");

      toast.success("admin request approved and email sent successfully.");
      onClose();
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("admin")
          .delete()
          .eq("id", formData.id);

        if (error) throw error;

        toast.success("admin request deleted successfully.");
        onClose();
      } catch (error) {
        console.error("Error:", error.message);
        toast.error("Failed to delete admin request.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-2 sm:p-0 bg-black bg-opacity-50">
      <div className="bg-white rounded shadow py-6 px-2 sm:p-6 w-[600px]">
        <h2 className="text-2xl text-center text-indigo-600 font-semibold mb-4">Admin Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <article className="flex flex-col col-span-1 gap-1">
            <label htmlFor="status" className="text-indigo-700">
              Status
            </label>
            <input
              type="text"
              value={adminStatus}
              aria-disabled="true"
              disabled
              className={`h-8 rounded border px-2 ${
                adminStatus === "Pending"
                  ? "bg-yellow-300"
                  : adminStatus === "Approved"
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
              value={adminName}
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
              value={adminEmail}
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
              value={adminIC}
              aria-disabled="true"
              disabled
              className="h-8 rounded border border-gray-400 px-2"
            />
          </article>
          <article className="flex flex-col col-span-1 gap-1">
            <label htmlFor="admin" className="text-indigo-700">
              admin
            </label>
            <input
              type="text"
              id="admin"
              name="admin"
              value={admin}
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
          className="bg-gray-600 text-white w-1/4 py-2 rounded mt-4 disabled:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdminModal;
