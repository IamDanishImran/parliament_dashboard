import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EditModal = ({ isOpen, onClose, formData, supabase }) => {
  const [formStatus, setFormStatus] = useState("");
  const [complaint, setComplaint] = useState("");
  const [title, setTitle] = useState("");
  const [dunEmail, setDunEmail] = useState("");
  const [emailData, setEmailData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (formData) {
      setFormStatus(formData.status || "");
      setComplaint(formData.complaint || "");
      setTitle(formData.title || "");
      setDunEmail(formData.id_dun || "");
    }
  }, [formData]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.email) {
        throw new Error("User not authenticated or email not available");
      }
      const { data, error } = await supabase
        .from("email")
        .select("status, title, complaint, inserted_at, id_dun")
        .eq("id_dun", user.email)
        .maybeSingle();
      if (error || !data) {
        throw new Error("No email data found or an error occurred");
      }
      setEmailData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch email data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formStatus || !complaint || !title) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Update the email record in Supabase
      const { error } = await supabase
        .from("email")
        .update({ status: "Complete", title, complaint, id_dun: dunEmail })
        .eq("id", formData.id);

      if (error) throw error;

      // Fetch the email template
      const templateResponse = await fetch("/sendEmail.html");
      if (!templateResponse.ok) throw new Error("Failed to load email template");

      let emailTemplate = await templateResponse.text();

      // Replace placeholders with actual values
      emailTemplate = emailTemplate
        .replace(/{{title}}/g, title)
        .replace(/{{status}}/g, formStatus)
        .replace(/{{complaint}}/g, complaint);

      // Send the email
      const subject = "Help Support Parliament Alor Gajah:";
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: dunEmail, subject, body: emailTemplate, contentType: "text/html" }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to send email");
      }

      toast.success("Email sent successfully!");
      onClose();
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("email")
          .delete()
          .eq("id", formData.id);

        if (error) throw error;

        toast.success("Email deleted successfully");
        onClose();
      } catch (err) {
        console.error("Error deleting form:", err);
        toast.error("An error occurred while deleting the email.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl p-6 relative">
        <h2 className="text-3xl mb-4">Edit Email</h2>
        <div className="mt-6">
          <section className="grid grid-rows-1 grid-flow-col gap-x-2">
            <div className="col-span-1">
              <label className="text-gray-600">Status</label>
              <input
                type="text"
                value={formStatus}
                disabled
                className={`w-full p-2 border rounded mb-4 mt-2 ${
                  formStatus === "Pending"
                    ? "bg-yellow-300"
                    : formStatus === "Complete"
                    ? "bg-green-300"
                    : ""
                }`}
              />
            </div>
            <div className="col-span-2">
              <label className="text-gray-600">From:</label>
              <input
                type="text"
                value={dunEmail}
                disabled
                className="w-full p-2 border rounded mb-4 mt-2"
              />
            </div>
          </section>
          <label className="text-gray-600">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-2 border rounded mb-4 mt-2"
          />
          <label className="text-gray-600">Complaint</label>
          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="Complaint"
            className="w-full p-2 border rounded mt-2 mb-4 h-[150px]"
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

export default EditModal;