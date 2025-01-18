// export default function UserModal({ isOpen, onClose, data, onDelete }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white rounded p-4 w-1/2">
//         <h2 className="text-xl font-bold mb-4">User Details</h2>
//         <article className="grid grid-flow-col grid-rows-2 gap-4">
//           <div className="flex flex-col">
//             <label>Name</label>
//             <input
//               type="text"
//               disabled
//               value={data?.name || ""}
//               className="w-full p-2 border rounded mb-4 mt-2"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label>Email</label>
//             <input
//               type="text"
//               disabled
//               value={data?.email || ""}
//               className="w-full p-2 border rounded mb-4 mt-2"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label>Identification Card Number</label>
//             <input
//               type="text"
//               disabled
//               value={data?.ic || ""}
//               className="w-full p-2 border rounded mb-4 mt-2"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label>Dun</label>
//             <input
//               type="text"
//               disabled
//               value={data?.id_register?.description || "N/A"}
//               className="w-full p-2 border rounded mb-4 mt-2"
//             />
//           </div>
//         </article>

//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => onDelete(data?.id)}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Delete
//           </button>
//           <button
//             onClick={onClose}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
