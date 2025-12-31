import React from "react";

export default function RadiographerDetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <h3 className="font-bold text-2xl mb-4 text-primary">Radiographer Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center p-4 bg-base-200 rounded-xl">
            <div className="avatar placeholder mb-2">
              <div className="bg-neutral text-neutral-content rounded-full w-24">
                <span className="text-3xl">{user.name.charAt(0)}</span>
              </div>
            </div>
            <p className="font-bold text-lg">{user.name}</p>
            <span className="badge badge-success text-white">Active</span>
          </div>

          {/* Details Section */}
          <div className="space-y-3">
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">License ID</label>
                <p className="font-medium">{user.licenseId || "N/A"}</p>
             </div>
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                <p className="font-medium">{user.email}</p>
             </div>
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                <p className="font-medium">{user.phone}</p>
             </div>
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Hospital Branch</label>
                <p className="font-medium">{user.branch || "Main Hospital"}</p>
             </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary">Edit Details</button>
        </div>
      </div>
    </div>
  );
}