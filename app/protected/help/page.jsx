// app/protected/help/page.jsx
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/header";

export default function Help() {
  const supabase = createClient();
  const [userRole, setUserRole] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not logged in");

        const userId = user.id;

        // Check if the user is an admin or Dun
        const { data: adminData } = await supabase
          .from("admin")
          .select("id_register")
          .eq("user_id", userId)
          .single();

        if (adminData) {
          const { data: registrationData } = await supabase
            .from("registration")
            .select("role_code")
            .eq("id", adminData.id_register)
            .single();

          setUserRole(registrationData?.role_code);
          return;
        }

        const { data: dunData } = await supabase
          .from("dun")
          .select("id_register")
          .eq("user_id", userId)
          .single();

        if (dunData) {
          const { data: registrationData } = await supabase
            .from("registration")
            .select("role_code")
            .eq("id", dunData.id_register)
            .single();

          setUserRole(registrationData?.role_code);
          return;
        }

        throw new Error("Role not found");
      } catch (error) {
        console.error("Error fetching user role:", error);
        setError("Failed to determine user role. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [supabase]);

  useEffect(() => {
    if (userRole === "25048082") { // Assuming this is the admin role_code
      const fetchEmails = async () => {
        try {
          const { data, error } = await supabase.from("email").select("*");
          if (error) throw error;

          setEmails(data || []);
        } catch (error) {
          console.error("Error fetching emails:", error);
          setError("Failed to load email data. Please try again later.");
        }
      };

      fetchEmails();
    }
  }, [supabase, userRole]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <main className="p-4">
      <Header title="Help Center" />

      {userRole === "25048082" ? (
        // Admin Interface: Show Email Table
        <div className="mt-4 overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-slate-400">
            <thead className="bg-slate-200">
              <tr>
                <th className="border border-slate-400 px-4 py-2">ID</th>
                <th className="border border-slate-400 px-4 py-2">Title</th>
                <th className="border border-slate-400 px-4 py-2">Complaint</th>
                <th className="border border-slate-400 px-4 py-2">Status</th>
                <th className="border border-slate-400 px-4 py-2">Email</th>
                <th className="border border-slate-400 px-4 py-2">Send Date</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email, index) => (
                <tr
                  key={email.id || index}
                  className={index % 2 === 0 ? "bg-slate-50" : "bg-slate-100"}
                >
                  <td className="border border-slate-400 px-4 py-2">{email.id}</td>
                  <td className="border border-slate-400 px-4 py-2">{email.title || "N/A"}</td>
                  <td className="border border-slate-400 px-4 py-2">{email.complaint || "N/A"}</td>
                  <td className="border border-slate-400 px-4 py-2">{email.status || "Pending"}</td>
                  <td className="border border-slate-400 px-4 py-2">{email.email || "N/A"}</td>
                  <td className="border border-slate-400 px-4 py-2">
                    {email.inserted_at
                      ? new Date(email.inserted_at).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Dun Interface: Form to Send Email
        <form
          className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const emailData = Object.fromEntries(formData.entries());

            try {
              const { error } = await supabase.from("email").insert([emailData]);
              if (error) throw error;

              alert("Email sent successfully!");
            } catch (error) {
              console.error("Error sending email:", error);
              alert("Failed to send email.");
            }
          }}
        >
          <h2 className="text-lg font-bold mb-4">Send Email</h2>
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      )}
    </main>
  );
}
