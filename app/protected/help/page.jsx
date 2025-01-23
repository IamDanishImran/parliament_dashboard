"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Skeleton } from "@nextui-org/skeleton";

import Header from "@/components/header";
import EditModal from "@/components/help/editEmail";
import Footer from "@/components/footer";

export default function Help() {
  const supabase = createClient();

  // User Role and Email State
  const [userRole, setUserRole] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editing Email Section Hooks
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);

  const handleEditClick = (item) => {
    setEditingForm(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    fetchEmails(); // Refresh emails after closing the modal
  };

  const fetchEmails = async () => {
    try {
      const { data, error } = await supabase.from("email").select("*");
      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error("Error fetching emails:", error.message);
      setError("Failed to load email data. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch user role logic
    const fetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          toast.warning('User not logged in');
          setLoading(false);
          return;
        }

        const roles = ["admin", "dun"];
        for (const role of roles) {
          const { data } = await supabase
            .from(role)
            .select("id_register")
            .eq("user_id", user.id)
            .single();

          if (data) {
            const { data: registrationData } = await supabase
              .from("registration")
              .select("role_code")
              .eq("id", data.id_register)
              .single();
            setUserRole(registrationData?.role_code);
            return;
          }
        }
        throw new Error("Role not found");
      } catch (error) {
        console.error("Error fetching user role:", error);
        setError("Failed to determine user role. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [supabase]);

  useEffect(() => {
    if (userRole === "25048082") {
      fetchEmails();
    }
  }, [userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const { title, complaint } = Object.fromEntries(formData.entries());

    if (!title.trim() || !complaint.trim()) {
      toast.error("Please fill in all fields before submitting.");
      setLoading(false);
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Authentication error:", userError);
        toast.error("Please log in to submit a complaint.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("email").insert([
        { title, complaint, id_dun: user.email, status: "Pending" },
      ]);

      if (error) {
        console.error("Error inserting email:", error);
        toast.error("Failed to submit complaint. Please try again.");
        return;
      }

      toast.success("Complaint submitted!");
      e.target.reset();
      fetchEmails();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="p-4">
      <ToastContainer />

      <Skeleton isLoaded={!loading}>
        <Header title="Help Center" navigator="Help Center" />
      </Skeleton>

      <br />

      {userRole === "25048082" ? (
        <>
          <Skeleton isLoaded={!loading}>
            <div className="table-container max-h-[300px] overflow-y-auto border-1 shadow rounded">
              <table className="table-auto w-full border-collapse border border-slate-400">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-slate-400 px-4 py-2">No.</th>
                    <th className="border border-slate-400 px-4 py-2">Title</th>
                    <th className="border border-slate-400 px-4 py-2">Complaint</th>
                    <th className="border border-slate-400 px-4 py-2">Email</th>
                    <th className="border border-slate-400 px-4 py-2">Send Date</th>
                    <th className="border border-slate-400 px-4 py-2">Status</th>
                    <th className="border border-slate-400 px-4 py-2">Info</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email, index) => (
                    <tr key={email.id || index} className={index % 2 === 0 ? "bg-slate-50 hover:bg-slate-200" : "bg-slate-100 hover:bg-slate-200"}>
                      <td className="border border-slate-400 px-4 py-2">{index + 1}</td>
                      <td className="border border-slate-400 px-4 py-2">{email.title || "N/A"}</td>
                      <td className="border border-slate-400 px-4 py-2">{email.complaint || "N/A"}</td>
                      <td className="border border-slate-400 px-4 py-2">{email.id_dun || "N/A"}</td>
                      <td className="border border-slate-400 px-4 py-2">
                        {email.inserted_at
                          ? new Date(email.inserted_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className={`border border-slate-400 px-4 py-2 ${email.status === "Pending" ? "bg-yellow-200" : "bg-green-400"}`}>
                        {email.status || "Pending"}
                      </td>
                      <td className="border border-slate-400 px-4 py-2 text-center">
                        <button
                          onClick={() => handleEditClick(email)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Skeleton>
        </>
      ) : (
        <>
          <Skeleton isLoaded={!loading}>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
              <h2 className="text-lg font-bold mb-4">
                Get in touch with our team support
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  name="title"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Complaint
                </label>
                <textarea
                  name="complaint"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  required
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </Skeleton>
        </>
      )}

      {editingForm && isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          formData={editingForm}
          supabase={supabase}
        />
      )}
      <Footer />
    </main>
  );
}