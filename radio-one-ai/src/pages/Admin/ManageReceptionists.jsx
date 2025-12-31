import React, { useState } from "react";
// Imports based on your new folder structure
import ReceptionistDetailsModal from "../../component/Admin/ReceptionistDetailsModal";
import ConfirmationModal from "../../component/Admin/ConfirmationModal";
import TablePagination from "../../component/TablePagination";
import ExportButton from "../../component/ExportButton";
import Toast from "../../component/Toast";

export default function ManageReceptionists() {
  // 1. Mock Data
  const [receptionists, setReceptionists] = useState([
    { id: 1, name: "Alice Brown", email: "alice.b@radioone.ai", phone: "077-111-2233", staffId: "REC-101", shift: "Morning Desk", status: "Active", img: "" },
    { id: 2, name: "Mark Wilson", email: "mark.w@radioone.ai", phone: "077-444-5566", staffId: "REC-102", shift: "Night Shift", status: "Active", img: "" },
    { id: 3, name: "Jenny Lee", email: "jenny.l@radioone.ai", phone: "071-777-8899", staffId: "REC-103", shift: "Weekend", status: "On Leave", img: "" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // Filter Logic
  const filteredUsers = receptionists.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.staffId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Add
  const handleAddReceptionist = (e) => {
    e.preventDefault();
    const form = e.target;
    const newUser = {
      id: receptionists.length + 1,
      name: form.name.value,
      email: form.email.value,
      staffId: form.staffId.value,
      phone: form.phone.value,
      shift: form.shift.value,
      status: "Active",
    };
    setReceptionists([...receptionists, newUser]);
    document.getElementById("add_receptionist_modal").close();
    form.reset();
    setToast({ message: "New Receptionist added successfully!", type: "success" });
  };

  // Handle Delete
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    document.getElementById("delete_confirm_modal").showModal();
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setReceptionists(receptionists.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
      setToast({ message: "Receptionist account deleted.", type: "error" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Receptionists</h1>
          <p className="text-base-content/70">Manage front desk staff and schedules.</p>
        </div>
        <div className="flex gap-3">
          <ExportButton onExport={() => setToast({ message: "Exporting list...", type: "success" })} />
          <button className="btn btn-primary" onClick={() => document.getElementById("add_receptionist_modal").showModal()}>
            + Add Receptionist
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-base-100 p-4 rounded-xl shadow-sm">
        <input
          type="text"
          placeholder="Search by Name or Staff ID..."
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Staff ID</th>
              <th>Shift / Desk</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span>{user.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm opacity-50">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-sm">{user.staffId}</td>
                  <td>{user.shift}</td>
                  <td>
                    <div className={`badge ${user.status === "Active" ? "badge-success text-white" : "badge-warning"} badge-sm`}>
                      {user.status}
                    </div>
                  </td>
                  <th>
                    <button className="btn btn-ghost btn-xs" onClick={() => setSelectedUser(user)}>View</button>
                    <button className="btn btn-ghost btn-xs text-error" onClick={() => handleDeleteClick(user)}>Delete</button>
                  </th>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-4 opacity-50">No receptionists found.</td></tr>
            )}
          </tbody>
        </table>
        <TablePagination />
      </div>

      {/* Add Modal */}
      <dialog id="add_receptionist_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
          <h3 className="font-bold text-lg mb-4">Add Receptionist</h3>
          <form onSubmit={handleAddReceptionist} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control"><label className="label">Name</label><input name="name" className="input input-bordered" required /></div>
              <div className="form-control"><label className="label">Staff ID</label><input name="staffId" className="input input-bordered" required /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control"><label className="label">Shift</label><select name="shift" className="select select-bordered"><option>Morning Desk</option><option>Night Shift</option><option>Weekend</option></select></div>
              <div className="form-control"><label className="label">Phone</label><input name="phone" className="input input-bordered" required /></div>
            </div>
            <div className="form-control"><label className="label">Email</label><input name="email" type="email" className="input input-bordered" required /></div>
            <button type="submit" className="btn btn-primary w-full">Create Account</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Details Modal */}
      {selectedUser && <ReceptionistDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

      {/* Delete Confirmation */}
      <ConfirmationModal
        id="delete_confirm_modal"
        title="Delete Account"
        message={`Are you sure you want to delete ${userToDelete?.name}?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}