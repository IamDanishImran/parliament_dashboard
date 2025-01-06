import { useState, useEffect } from "react";

const DunModal = ({ isOpen, onClose, dunData, supabase }) => {
  const [dunStatus, setDunStatus] = useState("");
  const [dunName, setDunName] = useState("");
  const [dunEmail, setDunEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("dunData", dunData);
    if (dunData) {
      console.log("dunData inside useEffect:", dunData);
      setDunStatus(dunData.status || "");
      setDunName(dunData.name || "");
      setDunEmail(dunData.email || "");
    }
  }, [dunData]);

  // Handle Save action
  const handleSave = async () => {
    if (!dunStatus || !dunName || !dunEmail) {
      alert("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("dun")
        .update({ status: "Approved", name, email })
        .eq("id", dunData.id);

      if (error) throw error;
      alert("Data updated successfully");
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete action
  const handleDelete = async () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this dun?")) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("dun")
          .delete()
          .eq("id", dunData.id);

        if (error) throw error;
        alert("Dun deleted successfully");
        onClose();
      } catch (err) {
        console.error("Error deleting dun:", err);
        alert("An error occurred while deleting the dun.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl p-6 relative">
        <h2 className="text-3xl mb-4">Dun Management</h2>
        <div className="mt-6">
          <section className="grid grid-rows-1 grid-flow-col gap-x-2">
            <div className="col-span-1">
              <label className="text-gray-600">Status</label>
              <input
                type="text"
                value={dunStatus}
                disabled
                className={`w-full p-2 border rounded mb-4 mt-2 ${
                  dunStatus === "Pending"
                    ? "bg-yellow-300"
                    : dunStatus === "Approved"
                    ? "bg-green-300"
                    : ""
                }`}
              />
            </div>
            <div className="col-span-2">
              <label className="text-gray-600">Email</label>
              <input
                type="text"
                value={dunEmail}
                disabled
                className="w-full p-2 border rounded mb-4 mt-2"
              />
            </div>
          </section>
          <label className="text-gray-600">Name</label>
          <input
            type="text"
            value={dunName}
            onChange={(e) => setDunName(e.target.value)}
            disabled
            className="w-full p-2 border rounded mb-4 mt-2"
          />
        </div>
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`btn btn-primary text-white w-full p-2 rounded mt-4 ${
              isLoading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="btn bg-red-500 text-white w-full p-2 rounded mt-4 hover:bg-red-400"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
        <div className="mt-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded text-black w-full hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DunModal;
