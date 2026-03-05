import React, { useEffect, useState } from "react";
// Imports based on your file structure
import ReceptionistDetailsModal from "../../component/Admin/ReceptionistDetailsModal";
import TablePagination from "../../component/TablePagination";
import ConfirmationModal from "../../component/Admin/ConfirmationModal";
import ExportButton from "../../component/ExportButton";
import Toast from "../../component/Toast";

const API_BASE = "http://127.0.0.1:5000";

export default function ManageReceptionists() {
  const [receptionists, setReceptionists] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterShift, setFilterShift] = useState("All"); 
  const [isLoadingReceptionists, setIsLoadingReceptionists] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Track which user is being deleted
  const [userToDelete, setUserToDelete] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const mapApiReceptionistToUi = (item) => ({
    id: item.id,
    name: item.name || "N/A",
    email: item.email || "N/A",
    phone: item.phone || "N/A",
    staffId: item.username || "N/A",
    shift: item.address || "N/A",
    status: String(item.status || "").toLowerCase() === "active" ? "Active" : "Inactive",
    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      item.name || "Receptionist"
    )}&background=random`,
    role: item.role || "receptionist",
    age: item.age ?? null,
    gender: item.gender || null,
    date_of_birth: item.date_of_birth || null,
    created_at: item.created_at || null,
  });

  const fetchReceptionists = async () => {
    setIsLoadingReceptionists(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Missing access token. Please log in again.");
      }

      const res = await fetch(`${API_BASE}/api/admin/staff?role=receptionist`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load receptionists.");
      }

      const list = Array.isArray(json?.data) ? json.data : [];
      setReceptionists(list.map(mapApiReceptionistToUi));
      setApiMessage({ type: "", text: "" });
    } catch (error) {
      setApiMessage({
        type: "error",
        text: error.message || "Unable to fetch receptionists.",
      });
    } finally {
      setIsLoadingReceptionists(false);
    }
  };

  useEffect(() => {
    fetchReceptionists();
  }, []);

  // Filter Logic
  const filteredUsers = receptionists.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.staffId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift = filterShift === "All" || user.shift === filterShift;
    return matchesSearch && matchesShift;
  });

  // Handle Add Receptionist
  const handleAddReceptionist = (e) => {
    e.preventDefault();
    const form = e.target;
    const newUser = {
      id: receptionists.length + 1,
      name: form.name.value,
      email: form.email.value,
      staffId: form.staffId.value,
      shift: form.shift.value,
      phone: form.phone.value,
      status: "Active",
      // Generate a random avatar based on name
      img: `https://ui-avatars.com/api/?name=${form.name.value}&background=random`
    };
    setReceptionists([...receptionists, newUser]);
    document.getElementById("add_receptionist_modal").close();
    form.reset();

    // Trigger Success Toast
    setToast({ message: "New Receptionist registered successfully!", type: "success" });
  };

  // Handle View Details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    // Slight timeout to ensure state updates before modal renders if needed, or just let the condition handle it
  };

  // Handle Delete Click
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setTimeout(() => document.getElementById("delete_confirm_modal").showModal(), 0);
  };

  // Confirm Delete Action
  const confirmDelete = () => {
    if (userToDelete) {
      setReceptionists(receptionists.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      // Trigger Delete Toast
      setToast({ message: "Receptionist account deleted.", type: "error" });
    }
  };

  // Handle Export
  const handleExport = () => {
    setToast({ message: "Exporting receptionist list to CSV...", type: "success" });
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Receptionists</h1>
          <p className="text-base-content/70">Manage front desk staff and schedules.</p>
        </div>
      </div>

      {apiMessage.text ? (
        <div className="alert alert-error">
          <span>{apiMessage.text}</span>
        </div>
      ) : null}

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4 bg-base-100 p-4 rounded-xl shadow-sm">
        <div className="form-control flex-1">
          <input 
            type="text" 
            placeholder="Search by Name or Username..." 
            className="input input-bordered w-full" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="form-control w-full sm:w-auto">
          <select className="select select-bordered w-full" value={filterShift} onChange={(e) => setFilterShift(e.target.value)}>
            <option value="All">All Shifts</option>
            <option value="Morning Desk">Morning Desk</option>
            <option value="Night Shift">Night Shift</option>
            <option value="Weekend">Weekend</option>
            <option value="General">General</option>
            <option value="N/A">N/A</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full align-middle">
          <thead>
            <tr>
              <th>Name & Contact</th>
              <th>Staff ID</th>
              <th>Shift / Desk</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingReceptionists ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-base-content/50">
                  Loading receptionists...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar"><div className="mask mask-squircle w-12 h-12"><img src={user.img} alt={user.name} /></div></div>
                      <div><div className="font-bold">{user.name}</div><div className="text-sm opacity-50">{user.email}</div><div className="text-xs opacity-50">{user.phone}</div></div>
                    </div>
                  </td>
                  <td className="font-mono text-sm">{user.staffId}</td>
                  <td><span className="badge badge-ghost badge-sm font-medium">{user.shift}</span></td>
                  <td>{user.status === "Active" ? <div className="badge badge-success gap-2 text-white badge-sm">Active</div> : <div className="badge badge-error gap-2 text-white badge-sm">{user.status}</div>}</td>
                  <th>
                    <div className="flex gap-2">
                      <div className="tooltip" data-tip="View Details">
                        <button className="btn btn-square btn-ghost btn-sm bg-base-200" onClick={() => handleViewDetails(user)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </div>
                      <div className="tooltip" data-tip="Delete User">
                        <button className="btn btn-square btn-ghost btn-sm text-error bg-base-200 hover:bg-error hover:text-white" onClick={() => handleDeleteClick(user)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-4 text-base-content/50">No receptionists found matching your search.</td></tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <TablePagination />
      </div>

      {/* --- ADD MODAL --- */}
      <dialog id="add_receptionist_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
          <h3 className="font-bold text-lg mb-4">Onboard New Receptionist</h3>
          <div className="divider my-0"></div>
          <form onSubmit={handleAddReceptionist} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control"><label className="label"><span className="label-text">Full Name</span></label><input name="name" type="text" placeholder="Alice Brown" className="input input-bordered w-full" required /></div>
                <div className="form-control"><label className="label"><span className="label-text">Staff ID</span></label><input name="staffId" type="text" placeholder="Ex: REC-101" className="input input-bordered w-full" required /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control"><label className="label"><span className="label-text">Assigned Shift/Desk</span></label>
                  <select name="shift" className="select select-bordered w-full">
                    <option disabled selected>Select Shift</option>
                    <option>Morning Desk</option>
                    <option>Night Shift</option>
                    <option>Weekend</option>
                    <option>General</option>
                  </select>
                </div>
                <div className="form-control"><label className="label"><span className="label-text">Phone Number</span></label><input name="phone" type="tel" placeholder="+94 7X XXX XXXX" className="input input-bordered w-full" required /></div>
              </div>
              <div className="divider text-xs uppercase opacity-50">Login Credentials</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control"><label className="label"><span className="label-text">Email (Username)</span></label><input name="email" type="email" placeholder="reception@radioone.ai" className="input input-bordered w-full" required /></div>
                <div className="form-control"><label className="label"><span className="label-text">Temporary Password</span></label><input type="password" placeholder="••••••••" className="input input-bordered w-full" required /></div>
              </div>
              <div className="modal-action"><button type="submit" className="btn btn-primary w-full md:w-auto">Create Account</button></div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Details Modal */}
      {selectedUser && (
        <ReceptionistDetailsModal 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        id="delete_confirm_modal" 
        title="Delete Receptionist" 
        message={`Are you sure you want to remove ${userToDelete?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete} 
      />

    </div>
  );
}
