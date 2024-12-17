"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

import Header from "@/components/header";
import userModal from "@/components/user_management/infoDun";
import Footer from "@/components/footer";
import UserModal from "@/components/user_management/infoDun";

export default function Bantuan_Kebajikan() {
  const supabase = createClient();
  const [dunData, setDunData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDun, setSelectedDun] = useState(null);
  const openModal = (dun) => {
    setSelectedDun(dun);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setSelectedDun(null);
    setIsModalOpen(false);
  };

  // Delete function
  const handleDelete = async (userId) => {
    if (!userId) return;

    const { error } = await supabase
      .from("admin_dun") // Replace with your actual table
      .delete()
      .eq("id_dun.id", userId); // Match the user's ID

    if (error) {
      console.error("Error deleting user:", error.message);
      alert("Failed to delete user");
    } else {
      alert("User deleted successfully");
      setDunData((prevData) => prevData.filter((item) => item.id_dun.id !== userId));
      setModalOpen(false);
    }
  };
  


  useEffect(() => {
    const fetchAdminAndData = async () => {
      try {
        // Fetch authenticated user and admin data in parallel
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw new Error(userError.message);

        const userEmail = userData?.user?.email;

        const { data: adminData, error: adminError } = await supabase
          .from("admin")
          .select("id")
          .eq("email", userEmail)
          .single();
        if (adminError) throw new Error(adminError.message);

        const { data: dunData, error: dunError } = await supabase
          .from("admin_dun")
          .select(`
            id_admin,
            id_dun (
              id,
              name,
              email,
              ic,
              id_register (
                description
              )
            )
          `)
          .eq("id_admin", adminData.id);

        if (dunError) throw new Error(dunError.message);

        setDunData(dunData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminAndData();
  }, [supabase]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <main className="p-2 pl-10 pr-20">
      <Header title="User Management" />

      <section className="border mt-4 rounded shadow">
        <article className="h-[500px] overflow-y-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="text-gray-700 bg-gray-200">
              <tr className="border border-black">
                <th className="border border-black px-4 py-1">Bil</th>
                <th className="border border-black px-4 py-1">Name</th>
                {/* <th className="border border-black px-4 py-1">Email</th>
                <th className="border border-black px-4 py-1">IC</th>
                <th className="border border-black px-4 py-1">Dun</th> */}
                <th className="border border-black px-4 py-1">Info</th>
              </tr>
            </thead>
            <tbody className="bg-slate-50">
              {dunData.map((item, index) => (
                <tr
                  key={item.id_dun.id}
                  className={
                    index % 2 === 0
                      ? "bg-slate-50 border border-black hover:bg-slate-200 ease-out transition-200"
                      : "bg-slate-100 border border-black hover:bg-slate-200 ease-out transition-200"
                  }
                >
                  <td className="border px-4 py-4">{index + 1}</td>
                  <td className="border px-4 py-4">{item.id_dun.name}</td>
                  {/* <td className="border px-4 py-4">{item.id_dun.email}</td>
                  <td className="border px-4 py-4">{item.id_dun.ic}</td>
                  <td className="border px-4 py-4">
                    {item.id_dun.id_register?.description || "N/A"}
                  </td> */}
                  <td className="border px-4 py-2 text-center">
                    <button onClick={() => openModal(item.id_dun)} className="text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>

      {/* Edit Modal */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onDelete={handleDelete}
          data={selectedDun}
          supabase={supabase}
        />
      )}

      <Footer />
    </main>
  );
}
