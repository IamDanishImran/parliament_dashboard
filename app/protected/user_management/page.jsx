'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Skeleton } from "@nextui-org/skeleton";

import Header from "@/components/header";
import DunModal from "@/components/user_management/DunModal";
import AdminModal from "@/components/user_management/AdminModal";
import Footer from "@/components/footer";

const UserManagement = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dunData, setDunData] = useState([]);
  const [adminData, setAdminData] = useState([]);

  // To ensure which interface need to be display according to the admin role
  const [adminRole, setAdminRole] = useState(null);

  // Modal State
  const [isDunModalOpen, setDunModalOpen] = useState(false);
  const [dunModalData, setDunModalData] = useState(null);
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);
  const [adminModalData, setAdminModalData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error("Failed to fetch session info.");
  
        const adminEmail = session?.session?.user?.email;
        if (!adminEmail) throw new Error("User email not found.");
  
        const { data: adminRoleData, error: adminRoleError } = await supabase
          .from('admin')
          .select(`id, id_register, status, registration:registration(description)`)
          .eq('email', adminEmail)
          .limit(1)
          .single();
        if (adminRoleError) throw new Error("Failed to fetch admin data.");
        if (!adminRoleData) throw new Error("No admin data found.");
  
        setAdminRole(adminRoleData.registration.description);
  
        const { data: fetchDunData, error: dunError } = await supabase
          .from('dun')
          .select(`id, name, email, ic, status, id_register, registration:registration(description)`);
        if (dunError) throw new Error("Failed to fetch dun data.");
        setDunData(fetchDunData);
  
        const { data: fetchAdminData, error: adminError } = await supabase
          .from('admin')
          .select(`id, name, email, ic, status, id_register, registration:registration(description)`);
        if (adminError) throw new Error("Failed to fetch admin data.");
        setAdminData(fetchAdminData);
  
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAdminData();
  }, []);
  
  

  // Modal Handlers
  const handleDunModal = (item) => {
    console.log("Dun Modal Data:", item);
    if (item) {
      setDunModalData(item);
      setDunModalOpen(true);
    } else {
      console.error("No data found for Dun Modal");
    }
  };
  const closeDunModal = () => setDunModalOpen(false);

  const handleAdminModal = (item) => {
    console.log("Admin Modal Data:", item);
    setAdminModalData(item);
    setAdminModalOpen(true);
  };
  const closeAdminModal = () => setAdminModalOpen(false);

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <main className="p-2 pl-10 pr-20">
      <Header title="User Management" />

      <Skeleton isLoaded={!loading}>
      {adminRole === "Manager" && (
        <div className="flex flex-col">
          {/* Manage Admins */}
          <section className="border mt-4 rounded shadow">
            <article className="h-[300px] overflow-y-auto">
              <table className="table-auto w-full text-left border-collapse">
                <thead className="text-gray-700 bg-gray-200">
                  <tr className="border border-black">
                    <th className="border border-black px-4 py-1">Bil</th>
                    <th className="border border-black px-4 py-1">Name</th>
                    <th className="border border-black px-4 py-1">Email</th>
                    <th className="border border-black px-4 py-1">IC</th>
                    <th className="border border-black px-4 py-1">Status</th>
                    <th className="border border-black px-4 py-1">Info</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-50">
                  {adminData.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <td className="border border-black px-4 py-1">{index + 1}</td>
                      <td className="border border-black px-4 py-1">{item.name}</td>
                      <td className="border border-black px-4 py-1">{item.email}</td>
                      <td className="border border-black px-4 py-1">{item.ic}</td>
                      <td className="border border-black px-4 py-1">{item.status}</td>
                      <td className="border border-black px-4 py-1">
                        <button onClick={() => handleAdminModal(item)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section>
          
          {/* Manage Duns */}
          <section className="border mt-4 rounded shadow">
            <article className="h-[300px] overflow-y-auto">
              <table className="table-auto w-full text-left border-collapse">
                <thead className="text-gray-700 bg-gray-200">
                  <tr className="border border-black">
                    <th className="border border-black px-4 py-1">Bil</th>
                    <th className="border border-black px-4 py-1">Name</th>
                    <th className="border border-black px-4 py-1">Email</th>
                    <th className="border border-black px-4 py-1">IC</th>
                    <th className="border border-black px-4 py-1">Status</th>
                    <th className="border border-black px-4 py-1">Dun</th>
                    <th className="border border-black px-4 py-1">Info</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-50">
                  {dunData.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <td className="border border-black px-4 py-1">{index + 1}</td>
                      <td className="border border-black px-4 py-1">{item.name}</td>
                      <td className="border border-black px-4 py-1">{item.email}</td>
                      <td className="border border-black px-4 py-1">{item.ic}</td>
                      <td className="border border-black px-4 py-1">{item.status}</td>
                      <td className="border border-black px-4 py-1">{item.registration.description}</td>
                      <td className="border border-black px-4 py-1">
                        <button onClick={() => handleDunModal(item)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section>
        </div>
      )}
      </Skeleton>

      <Skeleton isLoaded={!loading}>
      {adminRole === "Supervisor" && (
        <div>
          {/* Manage Duns */}
          <section className="border mt-4 rounded shadow">
            <article className="h-[500px] overflow-y-auto">
              <table className="table-auto w-full text-left border-collapse">
                <thead className="text-gray-700 bg-gray-200">
                  <tr className="border border-black">
                    <th className="border border-black px-4 py-1">Bil Dun</th>
                    <th className="border border-black px-4 py-1">Name</th>
                    <th className="border border-black px-4 py-1">Email</th>
                    <th className="border border-black px-4 py-1">IC</th>
                    <th className="border border-black px-4 py-1">Dun</th>
                    <th className="border border-black px-4 py-1">Info</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-50">
                  {dunData.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <td className="border border-black px-4 py-1">{index + 1}</td>
                      <td className="border border-black px-4 py-1">{item.name}</td>
                      <td className="border border-black px-4 py-1">{item.email}</td>
                      <td className="border border-black px-4 py-1">{item.ic}</td>
                      <td className="border border-black px-4 py-1">{item.registration.description}</td>
                      <td className="border border-black px-4 py-1">
                        <button onClick={() => handleDunModal(item)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section>
        </div>
      )}
      </Skeleton>

      {/* Dun Modal */}
      {dunModalData && isDunModalOpen && (
        <DunModal
          isOpen={isDunModalOpen}
          onClose={closeDunModal}
          formData={dunModalData}
          supabase={supabase}
        />
      )}

      {/* Admin Modal */}
      {adminModalData && isAdminModalOpen && (
        <AdminModal
          isOpen={isAdminModalOpen}
          onClose={closeAdminModal}
          formData={adminModalData}
          supabase={supabase}
        />
      )}

      <Footer />
    </main>
  );
};

export default UserManagement;
