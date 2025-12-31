import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import TablePagination from "../../component/TablePagination"; // Adjust path if needed
import RadiographerDetailsModal from "../../component/Admin/RadiographerDetailsModal"; // Adjust path
import { Link } from "react-router-dom";

export default function ManageRadiographers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Dummy Data
  const [users] = useState([
    { id: 1, name: "Sarah Jenkins", email: "sarah.j@radioone.ai", phone: "077-123-4567", licenseId: "RAD-8892", status: "Active" },
    { id: 2, name: "David Kim", email: "david.k@radioone.ai", phone: "077-987-6543", licenseId: "RAD-1123", status: "On Leave" },
    { id: 3, name: "Priya Patel", email: "priya.p@radioone.ai", phone: "071-555-0192", licenseId: "RAD-5561", status: "Active" },
  ]);

  // Filter Logic
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Radiographers">
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="form-control w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search radiographers..."
            className="input input-bordered w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary text-white">
          + Add Radiographer
        </button>
      </div>

      {/* Table Card */}
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>License ID</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover">
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                          <span>{user.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm opacity-50">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-xs">{user.licenseId}</td>
                  <td>{user.phone}</td>
                  <td>
                    <div className={`badge ${user.status === "Active" ? "badge-success text-white" : "badge-warning"}`}>
                      {user.status}
                    </div>
                  </td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-xs text-primary"
                      onClick={() => setSelectedUser(user)}
                    >
                      View
                    </button>
                    <button className="btn btn-ghost btn-xs text-error">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination reused from your components */}
        <TablePagination />
      </div>

      {/* Modal */}
      {selectedUser && (
        <RadiographerDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </AdminLayout>
  );
}