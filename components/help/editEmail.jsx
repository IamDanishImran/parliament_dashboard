import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditModal = ({ isOpen, onClose, formData, supabase }) => {
  const [formStatus, setFormStatus] = useState("");
  const [complaint, setComplaint] = useState("");
  const [title, setTitle] = useState("");
  const [dunEmail, setDunEmail] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSave, setIsSave] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (formData) {
      setFormStatus(formData.status || "");
      setComplaint(formData.complaint || "");
      setTitle(formData.title || "");
      setDunEmail(formData.id_dun || "");
      setAdminNotes(formData.admin_notes || "");
    }
  }, [formData]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setIsSave(true);
    setError(null);
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.email) {
        throw new Error("User not authenticated or email not available");
      }

      const { data, error } = await supabase
        .from("email")
        .select("status, title, complaint, admin_notes, inserted_at, id_dun")
        .eq("id_dun", user.email)
        .maybeSingle();

      if (error || !data) {
        throw new Error("No email data found or an error occurred");
      }
      setAdminNotes(data.admin_notes || "");
    } catch (err) {
      setError(err.message || "Failed to fetch email data.");
    } finally {
      setIsSave(false);
    }
  };

  const handleSave = async () => {
    if (!formStatus || !complaint || !title || !adminNotes) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSave(true);
    try {
      const { error } = await supabase
        .from("email")
        .update({
          status: "Complete",
          title,
          complaint,
          id_dun: dunEmail,
          admin_notes: adminNotes,
        })
        .eq("id", formData.id);

      if (error) throw error;

      const templateResponse = await fetch("/sendEmail.html");
      if (!templateResponse.ok) throw new Error("Failed to load email template");

      let emailTemplate = await templateResponse.text();
      emailTemplate = emailTemplate
        .replace(/{{title}}/g, title)
        .replace(/{{status}}/g, formStatus)
        .replace(/{{complaint}}/g, complaint)
        .replace(/{{adminNotes}}/g, adminNotes);

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: dunEmail,
          subject: "Help Support Parliament Alor Gajah:",
          body: emailTemplate,
          contentType: "text/html",
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to send email");
      }

      toast.success("Email sent successfully!");
      onClose();
    } catch (err) {
      toast.error("An error occurred while processing your request.");
    } finally {
      setIsSave(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      setIsDelete(true);
      try {
        const { error } = await supabase
          .from("email")
          .delete()
          .eq("id", formData.id);

        if (error) throw error;

        toast.success("Email deleted successfully");
        onClose();
      } catch (err) {
        toast.error("An error occurred while deleting the email.");
      } finally {
        setIsDelete(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg h-[600px] sm:h-auto w-11/12 max-w-4xl p-6 relative overflow-y-auto">
          <h2 className="text-center text-3xl text-indigo-600 font-semibold mb-4">
            Email Submission
          </h2>
          <div className="mt-6">
            <section className="grid grid-rows-1 grid-flow-col gap-x-2">
              <div className="col-span-1">
                <label className="text-indigo-600">Status</label>
                <input
                  type="text"
                  value={formStatus}
                  readOnly
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
                <label className="text-indigo-600">From</label>
                <input
                  type="text"
                  value={dunEmail}
                  readOnly
                  className="w-full p-2 border rounded mb-4 mt-2"
                />
              </div>
            </section>
            <label className="text-indigo-600">Title</label>
            <input
              type="text"
              value={title}
              placeholder="Title"
              readOnly
              className="w-full p-2 border rounded mb-4 mt-2"
            />
            <label className="text-indigo-600">Complaint</label>
            <textarea
              value={complaint}
              placeholder="Complaint"
              readOnly
              className="w-full p-2 border rounded mt-2 mb-4 h-[150px]"
            />
          </div>
          <label className="text-indigo-600">Admin Notes</label>
          <input
            type="text"
            value={adminNotes}
            placeholder="Admin Notes"
            onChange={(e) => setAdminNotes(e.target.value)}
            className="w-full p-2 border rounded mb-4 mt-2"
          />
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={handleDelete}
              disabled={isDelete}
              className="btn bg-red-500 text-white w-full p-2 rounded mt-4 hover:bg-red-400"
            >
              {isDelete ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSave}
              className={`btn btn-primary text-white w-full p-2 rounded mt-4 ${
                isSave ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              {isSave ? "Saving..." : "Save"}
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
    </>
  );
};

export default EditModal;
