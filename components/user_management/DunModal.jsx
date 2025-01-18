import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DunModal = ({ isOpen, onClose, formData, supabase }) => {
  const [dunName, setDunName] = useState(formData?.name || "");
  const [dunStatus, setDunStatus] = useState(formData?.status || "");
  const [dunEmail, setDunEmail] = useState(formData?.email || "");
  const [dunIC, setDunIC] = useState(formData?.ic || "");
  const [dun, setDun] = useState(formData?.registration.description || "");
  const [roleCode, setRoleCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !formData) return null;

  useEffect(() => {
    if (formData) {
      setDunName(formData.name);
      setDunStatus(formData.status);
      setDunEmail(formData.email);
      setDunIC(formData.ic);
      setDun(formData.dun);
      if(dun === 'Rembia') { setRoleCode('10598878');}
      if(dun === 'Machap Jaya') { setRoleCode('12345678');}
      if(dun === 'Durian Tunggal') { setRoleCode('98765432');}
      if(dun === 'Asahan') { setRoleCode('45671234');}
      if(dun === 'Gadek') { setRoleCode('31415926');}
      if(dun === 'Outside Alor Gajah') { setRoleCode('74035216');}
      if(dun === 'Outside Melaka') { setRoleCode('20479352');}
    }
  }, [formData]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("dun")
        .update({
          name: dunName,
          email: dunEmail,
          status: "Approved",
          ic: dunIC,
        })
        .eq("id", formData.id);

      if (error) throw error;

      const response = await fetch("/api/user-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: dunEmail,
          subject: "Your Application Has Been Approved",
          text: `Dear ${dunName},\n\nYour registration has been approved successfully.\n\nBest regards,\nParliament Team Support
          here's the registration code ${roleCode}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to send approval email");

      toast.success("Dun request approved and email sent successfully.");
      onClose();
    } catch (error) {
      console.log("Error:", error.message);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded shadow p-6 w-1/3">
        <h2 className="text-xl font-semibold mb-4">Dun Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <article className="flex flex-col col-span-1 gap-1">
            <label htmlFor="status" className="text-indigo-700">
              Status
            </label>
            <input
              type="text"
              value={dunStatus}
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
              className="h-8 rounded border border-gray-400 px-2"
              value={dunName}
              disabled
              onChange={(e) => setDunName(e.target.value)}
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
              value={dunEmail}
              disabled
              onChange={(e) => setDunEmail(e.target.value)}
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
              className="h-8 rounded border border-gray-400 px-2"
              value={dunIC}
              disabled
              onChange={(e) => setDunIC(e.target.value)}
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
              className="h-8 rounded border border-gray-400 px-2"
              value={dun}
              disabled
              onChange={(e) => setDun(e.target.value)}
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

export default DunModal;
