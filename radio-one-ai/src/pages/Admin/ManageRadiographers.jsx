import React, { useEffect, useState } from "react";
// REMOVED: import AdminLayout from "./AdminLayout"; 
import RadiographerDetailsModal from "../../component/Admin/RadiographerDetailsModal";
import TablePagination from "../../component/TablePagination";
import ConfirmationModal from "../../component/Admin/ConfirmationModal"; 
import ExportButton from "../../component/ExportButton";
import Toast from "../../component/Toast";

const API_BASE = "http://127.0.0.1:5000";

export default function ManageRadiographers() {
  const [radiographers, setRadiographers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [isLoadingRadiographers, setIsLoadingRadiographers] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Track which user is being deleted
  const [userToDelete, setUserToDelete] = useState(null);

  // New State for Toast Notification
  const [toast, setToast] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const mapApiRadiographerToUi = (item) => ({
    id: item.id,
    name: item.name || "N/A",
    email: item.email || "N/A",
    phone: item.phone || "N/A",
    licenseId: item.license_number || "N/A",
    branch: item.address || "N/A",
    status: String(item.status || "").toLowerCase() === "active" ? "Active" : "Inactive",
    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      item.name || "Radiographer"
    )}&background=random`,
    role: item.role || "radiographer",
    username: item.username || null,
    age: item.age ?? null,
    gender: item.gender || null,
    date_of_birth: item.date_of_birth || null,
    created_at: item.created_at || null,
  });

  const fetchRadiographers = async () => {
    setIsLoadingRadiographers(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Missing access token. Please log in again.");
      }

      const res = await fetch(`${API_BASE}/api/admin/staff?role=radiographer`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load radiographers.");
      }

      const list = Array.isArray(json?.data) ? json.data : [];
      setRadiographers(list.map(mapApiRadiographerToUi));
      setApiMessage({ type: "", text: "" });
    } catch (error) {
      setApiMessage({
        type: "error",
        text: error.message || "Unable to fetch radiographers.",
      });
    } finally {
      setIsLoadingRadiographers(false);
    }
  };

  useEffect(() => {
    fetchRadiographers();
  }, []);

  // Filter Logic
  const filteredUsers = radiographers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.licenseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = filterBranch === "All" || user.branch === filterBranch;
    return matchesSearch && matchesBranch;
  });

  // Handle Add Radiographer
  const handleAddRadiographer = (e) => {
    e.preventDefault();
    const form = e.target;
    const newRadiographer = {
      id: radiographers.length + 1,
      name: form.name.value,
      email: form.email.value,
      licenseId: form.licenseId.value,
      branch: form.branch.value,
      phone: form.phone.value,
      status: "Active",
      img: `https://ui-avatars.com/api/?name=${form.name.value}&background=random`
    };
    setRadiographers([...radiographers, newRadiographer]);
    document.getElementById("add_radiographer_modal").close();
    form.reset();

    // Trigger Success Toast
    setToast({ message: "New Radiographer added successfully!", type: "success" });
  };

  // Handle View Details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  // Handle Delete Click
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setTimeout(() => document.getElementById("delete_confirm_modal").showModal(), 0);
  };

  // Confirm Delete Action
  const confirmDelete = () => {
    if (userToDelete) {
      setRadiographers(radiographers.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      // Trigger Delete Toast
      setToast({ message: "Radiographer account deleted.", type: "error" });
    }
  };

  // Handle Export
  const handleExport = () => {
    setToast({ message: "Exporting radiographer list to CSV...", type: "success" });
  };

  return (
    // CHANGED: Removed <AdminLayout> wrapper and replaced with a div
    <div className="space-y-6">
        
        {/* Render Toast Component if active */}
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
            <h1 className="text-3xl font-bold">Manage Radiographers</h1>
            <p className="text-base-content/70">Oversee imaging technicians and staff.</p>
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
              placeholder="Search by Name or License ID..." 
              className="input input-bordered w-full" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="form-control w-full sm:w-auto">
            <select className="select select-bordered w-full" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
              <option value="All">All Branches</option>
              <option value="Main Hospital">Main Hospital</option>
              <option value="City Clinic">City Clinic</option>
              <option value="Emergency Unit">Emergency Unit</option>
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
                <th>License ID</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingRadiographers ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-base-content/50">
                    Loading radiographers...
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
                    <td className="font-mono text-sm">{user.licenseId}</td>
                    <td><span className="badge badge-ghost badge-sm font-medium">{user.branch}</span></td>
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
                <tr><td colSpan="5" className="text-center py-4 text-base-content/50">No radiographers found matching your search.</td></tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          <TablePagination />
        </div>

        {/* --- MODALS --- */}
        <dialog id="add_radiographer_modal" className="modal">
          <div className="modal-box w-11/12 max-w-2xl">
            <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
            <h3 className="font-bold text-lg mb-4">Onboard New Radiographer</h3>
            <div className="divider my-0"></div>
            <form onSubmit={handleAddRadiographer} className="space-y-4 mt-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="form-control"><label className="label"><span className="label-text">Full Name</span></label><input name="name" type="text" placeholder="John Doe" className="input input-bordered w-full" required /></div>
                 <div className="form-control"><label className="label"><span className="label-text">License / Reg ID</span></label><input name="licenseId" type="text" placeholder="Ex: RAD-8892" className="input input-bordered w-full" required /></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="form-control"><label className="label"><span className="label-text">Hospital Branch</span></label><select name="branch" className="select select-bordered w-full"><option disabled selected>Select Branch</option><option>Main Hospital</option><option>City Clinic</option><option>Emergency Unit</option></select></div>
                 <div className="form-control"><label className="label"><span className="label-text">Phone Number</span></label><input name="phone" type="tel" placeholder="+94 7X XXX XXXX" className="input input-bordered w-full" required /></div>
               </div>
               <div className="divider text-xs uppercase opacity-50">Login Credentials</div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="form-control"><label className="label"><span className="label-text">Email (Username)</span></label><input name="email" type="email" placeholder="tech@radioone.ai" className="input input-bordered w-full" required /></div>
                 <div className="form-control"><label className="label"><span className="label-text">Temporary Password</span></label><input type="password" placeholder="••••••••" className="input input-bordered w-full" required /></div>
               </div>
               <div className="modal-action"><button type="submit" className="btn btn-primary w-full md:w-auto">Create Account</button></div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop"><button>close</button></form>
        </dialog>

        {/* Details Modal */}
        {selectedUser && (
          <RadiographerDetailsModal 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
          />
        )}
        
        {/* Delete Confirmation Modal */}
        <ConfirmationModal 
          id="delete_confirm_modal" 
          title="Delete Radiographer" 
          message={`Are you sure you want to remove ${userToDelete?.name}? This action cannot be undone.`}
          onConfirm={confirmDelete} 
        />

    </div>
  );
}
