import { useState, useEffect } from "react";

const AdminModal = ({ isOpen, onClose, dunData = {}, supabase }) => {
  const [dunStatus, setDunStatus] = useState(dunData.status || "");
  const [name, setName] = useState(dunData.name || "");
  const [email, setEmail] = useState(dunData.email || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dunData) {
      setDunStatus(dunData.status || "");
      setName(dunData.name || "");
      setEmail(dunData.email || "");
    }
  }, [dunData]);

  const handleSave = async () => {
    if (!dunStatus) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("dun")
        .update({ status: dunStatus })
        .eq("id", dunData.id);

      if (error) throw error;

      alert("Dun updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating dun:", error);
      alert("An error occurred while updating the dun.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl p-6">
        <h2 className="text-3xl mb-4">Admin Management</h2>

        <section className="grid grid-flow-col grid-row-6 gap-4 mb-4">
          <article className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              aria-label="Name"
              value={name}
              readOnly
              className="h-8 rounded border border-gray-400"
            />
          </article>

          <article className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              aria-label="Email"
              value={email}
              readOnly
              className="h-8 rounded border border-gray-400"
            />
          </article>

          <article className="flex flex-col">
            <label htmlFor="status">Status</label>
            <input
              type="text"
              id="status"
              name="status"
              value={dunStatus}
              onChange={(e) => setDunStatus(e.target.value)}
              className="h-8 rounded border border-gray-400"
            />
          </article>
        </section>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="w-1/2 mr-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 "
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-1/2 ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;