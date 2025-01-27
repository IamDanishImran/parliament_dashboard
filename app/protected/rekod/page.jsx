"use client";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Skeleton } from "@nextui-org/skeleton";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/header";
import moment from 'moment';
import Modal from "@/components/rekod/modal";
import EditModal from "@/components/rekod/editModal";

export default function Rekod() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const checkAdminAndOpenModal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to login first');
        return;
      }
      const { data: getDun, error } = await supabase
        .from('dun')
        .select('id')
        .eq('email', user.email)
        .single();
      if (error || !getDun) {
        setIsAddModalOpen(false);
        toast.error(`Access to the requested action is restricted.`);
        console.log("can't access");
        return;
      }
      setIsAddModalOpen(true);
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const closeAddModal = () => setIsAddModalOpen(false);
  
  const [formData, setFormData] = useState({
    barang_bantuan: '',
    kategori_bantuan: '',
    kategori_penerima: '',
    no_tel: '',
    jenis_bantuan: '',
    alamat: '',
    kuantiti: '',
    harga: '',
    catatan: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddItem = () => {
    toast.success("Form added successfully!");
  };

  const handleDeleteItem = (index) => {
    toast.success("Form deleted successfully!");
  };

  const total = 100;
  const items = [];
  // Edit Modal Section
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);

  const handleEditClick = async (item) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to login first');
        return;
      }

      const { data: getAdmin, error: adminError } = await supabase
        .from('admin')
        .select('id')
        .eq('email', user.email)
        .single();
      if (adminError) {
        // toast.error("Access to the requested action is restricted.");
        // console.log("Dun can't access this section");
        // return;
      
  
      const { data: getDun, error } = await supabase
        .from('dun')
        .select('registration:registration(description)')
        .eq('email', user.email)
        .single();
        setEditingForm(item); // Set the form data to be edited
        setIsEditModalOpen(true); // Open the edit modal
      }
      setEditingForm(item); // Set the form data to be edited
      setIsEditModalOpen(true); // Open the edit modal
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error(error);
    }
  };  
  const closeEditModal = () => setIsEditModalOpen(false); // Close the edit modal


  // CSV Download function
  const downloadCSV = () => {
    if (filteredForm.length === 0) {
      toast.error("No data available to download.");
      return;
    }
    // Define the headers for the CSV based on the table columns
    const headers = [
      'No', 'Application Notes', 'Program Category', 'Category', 'Quantity', 'Price', 'Status', 'Address', 'No.Phone', 'Assistance Type', 'Item Request', 'Date of Application'
    ];
    toast.success("Data downloaded successfully!");
    // Map over filteredForm to extract the data from each row
    const rows = filteredForm.map((item, index) => [
      index + 1, // Serial number
      item.notes || '-',
      item.category || '-',
      item.category_type || '-',
      item.quantity || '-',
      item.price || '-',
      item.form_status || '-',
      // id_dun
      item.address || '-',
      item.phone || '-',
      item.help_type || '-',
      item.item || '-',
      moment(item.inserted_at).format("DD/MM/YYYY") || '-',
    ]);
    // Create CSV content
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.map(value => `"${value}"`).join(','))
    ].join('\n');
    // Create a Blob and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data_parliament.csv';
    link.click();
  };

    // Form List Section
    const [statusSearch, setStatus] = useState('*'); 
    const [programSearch, setProgram] = useState('*');
    const [dunSearch, setDun] = useState('*');
    const [categorySearch, setCategory] = useState('*');
    const [typeSearch, setType] = useState('*');

    const [form, setForm] = useState([]);
    const [filteredForm, setFilteredForm] = useState([]);

    // Fetch data when the component mounts
    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data, error } = await supabase
            .from('form')
            .select('*, dun(id_register(*))');
          if (error) {
            console.error("Error fetching data:", error);
            toast.error('An unexpected error occurred.');
            return;
          }
          setForm(data); // Store the fetched data
          setFilteredForm(data); // Initially, display all data
        } catch (error) {
          console.error(error);
          toast.error('An unexpected error occurred.');
        } finally {
          setLoading(false); // Ensure this is called in finally block
        }
      };
      fetchData();
    }, []);
    
    // Handle Search
    const handleSearch = () => {
      const filteredResults = form.filter((item) => {
        const matchesStatus = statusSearch === '*' || item.form_status.toLowerCase() === statusSearch.toLowerCase();
        const matchesProgram = programSearch === '*' || item.category.toLowerCase() === programSearch.toLowerCase();
        const matchesDun = dunSearch === '*' || item.dun.id_register?.description.toLowerCase() === dunSearch.toLowerCase();
        const matchesCategory = categorySearch === '*' || item.category_type.toLowerCase() === categorySearch.toLowerCase();
        const matchesType = typeSearch === '*' || item.help_type.toLowerCase() === typeSearch.toLowerCase(); 
        return matchesStatus && matchesProgram && matchesDun && matchesCategory && matchesType;
      });
      setFilteredForm(filteredResults); // Update filtered data based on the status and category search
    };
    
    // Reset Search
    const resetSearch = () => {
      setStatus('*');
      setProgram('*');
      setDun('*');
      setCategory('*');
      setType('*');
      setFilteredForm(form);
    };
    
    return (
      <main className="pt-6 sm:pt-4 sm:p-2 sm:pl-10 sm:pr-20">
        <ToastContainer />
        <Header title="Record" navigator="Record" />

        <br />

        <Skeleton isLoaded={!loading}>
        {/* Search Bar */}
        <section id="search" className="flex flex-col w-full h-auto rounded border shadow shadow-gray-400">
          <article>
            <h1 className="mx-4 mt-4 text-2xl font-semibold">Search Panel</h1>
          </article>

          <article className="grid-cols-2 mt-4 grid sm:grid-cols-3 gap-4 px-4">
            <div className="">
              <label htmlFor="statusForm">Status</label>
              <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500 w-[540px]">
                <select className="w-full h-full bg-sky-50" id="statusForm" value={statusSearch} onChange={(e) => setStatus(e.target.value)}>
                  <option value="*">All</option>
                  <option value="IN PROGRESS">IN PROGRESS</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="KIV">KIV</option>
                </select>
              </div>
            </div>

            <div className="">
              <label htmlFor="Kategori Bantuan">Program Category</label>
              <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500">
                <select className="w-full h-full bg-sky-50" id="programForm" value={programSearch} onChange={(e) => setProgram(e.target.value)}>
                  <option value="*">All</option>
                  <option value="Community Outreach Program">Community Outreach Program</option>
                  <option value="Welfare Assistance Program">Welfare Assistance Program</option>
                </select>
              </div>
            </div>

            <div className="">
              <label htmlFor="Dun">Dun</label>
              <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500">
                <select className="w-full h-full bg-sky-50" id="dun" value={dunSearch} onChange={(e) => setDun(e.target.value)}>
                  <option value="*">All</option>
                  <option value="Rembia">Rembia</option>
                  <option value="Machap Jaya">Machap Jaya</option>
                  <option value="Durian Tunggal">Durian Tunggal</option>
                  <option value="Asahan">Asahan</option>
                  <option value="Gadek">Gadek</option>
                  <option value="Luar Alor Gajah">Luar Alor Gajah</option>
                  <option value="Outside Melaka">Outside Melaka</option>
                </select>
              </div>
            </div>

            <div className="">
              <label htmlFor="Kategori Bantuan">Category</label>
              <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500">
                <select className="w-full h-full bg-sky-50" id="categoryForm" value={categorySearch} onChange={(e) => setCategory(e.target.value)}>
                  <option value="*">All</option>
                  <option value="Public Well-Being">Public Well-Being</option>
                  <option value="Education">Education</option>
                  <option value="NGO/Organization">NGO/Organization</option>
                  <option value="Disaster">Disaster</option>
                  <option value="Religious">Religious</option>
                  <option value="Service Center">Service Center</option>
                </select>
              </div>
            </div>

            <div className="">
              <label htmlFor="Kategori Bantuan">Assistance Type</label>
              <div className="w-full h-8 rounded bg-sky-50 border-2 border-slate-500">
                <select className="w-full h-full bg-sky-50" id="typeForm" value={typeSearch} onChange={(e) => setType(e.target.value)}>
                  <option value="*">All</option>
                  <option value="CASH ASSISTANCE">Cash Assistance</option>
                  <option value="EQUIPMENT ASSISTANCE">Equipment Assistance</option>
                  <option value="EQUIPMENT & CASH ASSISTANCE">Equipment & Cash Assistance</option>
                </select>
              </div>
            </div>
          </article>

        <article className="flex mt-2 px-4 py-4 gap-4">
          <button className="w-32 h-8 flex justify-center items-center rounded bg-indigo-600 hover:bg-violet-500 text-slate-50 ease-in duration-200"
            onClick={handleSearch}>
            Search
          </button>
          <button className="w-32 h-8 flex justify-center items-center rounded border border-slate-900 bg-slate-50
          hover:bg-indigo-600 hover:border-lg hover:border-neutral-50 hover:text-slate-50 ease-in duration-200"
            onClick={resetSearch}>
            Reset Search
          </button>
        </article>
      </section>
      </Skeleton>

      <br />

      <Skeleton isLoaded={!loading}>
        {/* Records Panel */}
      <section id="rekod" className="bg-slate-50 w-full h-[600px] border shadow shadow-gray-400">
        <article className="bg-slate-50 flex justify-between items-center p-2 border shadow shadow-md">
          <div>
            <button onClick={downloadCSV} className="text-gray-700 font-bold bg-gray-200 border border-black px-4 py-2 rounded hover:bg-slate-300 ease-in duration-200">
              Download Data
            </button>
          </div>
          <div>
          <button onClick={checkAdminAndOpenModal} className="text-indigo-700 font-bold bg-slate-50 border border-black px-4 py-2 rounded hover:bg-slate-300 ease-in duration-200">
              New Application
            </button>
          </div>
        </article>

        {/* Scrollable Table Section */}
        <article className="h-[500px] overflow-y-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="text-gray-700 bg-gray-200">
              <tr className="border border-black">
                <th className="border border-black px-4 py-1">No.</th>
                <th className="border border-black px-4 py-1">Category</th>
                <th className="border border-black px-4 py-1">Date of Application</th>
                <th className="border border-black px-4 py-1">Program Category</th>
                <th className="border border-black px-4 py-1 max-w-[180px] truncate">Application Notes</th>
                <th className="border border-black px-4 py-1 max-w-[100px] truncate">Dun</th>
                <th className="border border-black px-4 py-1">Assistance Type</th>
                <th className="border border-black px-4 py-1">Status</th>
                <th className="border border-black px-4 py-1">Info</th>
              </tr>
            </thead>
            <tbody className="bg-slate-50">
              {filteredForm.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-[220px]">No data found</td>
                </tr>
                ) : (
                  filteredForm.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-slate-50 border border-black hover:bg-slate-200 ease-out transition-200" : "bg-slate-100 border border-black hover:bg-slate-200 ease-out transition-200"}>
                    <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{index + 1}</td>
                    <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{item.category_type}</td>
                    <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{moment(item.inserted_at).format('DD MMMM YYYY')}</td>
                    <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap">{item.category}</td>
                    <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px] truncate">{item.notes}</td>
                    <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] truncate">{item.dun.id_register?.description}</td>
                    <td className="border px-4 py-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] truncate">{item.help_type}</td>
                    <td className={`border py-4 text-center min-w-[120px]
                      ${item.form_status === 'IN PROGRESS' ? 'bg-yellow-200' : ''}
                      ${item.form_status === 'APPROVED' ? 'bg-green-400' : ''}
                      ${item.form_status === 'KIV' ? 'bg-cyan-400' : ''}
                      ${item.form_status === 'REJECTED' ? 'bg-red-500' : ''}`}>
                      {item.form_status}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:text-blue-800">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </article>
      </section>
      </Skeleton>

      {/* Modal for adding records */}
      <Modal
          open={isAddModalOpen}
          onClose={closeAddModal}
          formData={formData}
          handleChange={handleChange}
          handleAddItem={handleAddItem}
          total={total}
          items={items}
          handleDeleteItem={handleDeleteItem}
        />

      {/* Edit Modal */}
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