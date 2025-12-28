import React from "react";

export default function RadiologistDetailsModal({ radiologist }) {
  // Safety check
  if (!radiologist) return null;

  return (
    <dialog id="view_radiologist_modal" className="modal">
      <div className="modal-box w-11/12 max-w-3xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* --- LEFT SIDE: PROFILE IMAGE & STATUS --- */}
          <div className="flex flex-col items-center justify-center md:w-1/3 border-r border-base-200 pr-6">
            <div className="avatar mb-4">
              <div className="w-32 h-32 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                <img src={radiologist.img} alt={radiologist.name} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center">{radiologist.name}</h3>
            <span className="badge badge-ghost mt-2">{radiologist.spec}</span>
            <span className={`badge mt-2 ${radiologist.status === "Active" ? "badge-success text-white" : "badge-error text-white"}`}>
              {radiologist.status} Account
            </span>
          </div>

          {/* --- RIGHT SIDE: DETAILS GRID --- */}
          <div className="flex-1 space-y-4">
            
            {/* Professional Info */}
            <h4 className="font-bold text-lg border-b pb-2">Professional Details</h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">SLMC Registration No</span>
                <span className="font-mono text-base font-bold text-primary">{radiologist.regNo}</span>
              </div>
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Specialization Area</span>
                <span>{radiologist.spec}</span>
              </div>
            </div>

            {/* Contact Info */}
            <h4 className="font-bold text-lg border-b pb-2 mt-6">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Mobile Phone</span>
                <span>{radiologist.phone}</span>
              </div>
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Email Address</span>
                <span>{radiologist.email}</span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex gap-2 justify-end mt-8">
              <button className="btn btn-sm btn-outline btn-secondary">Edit Profile</button>
              <button className="btn btn-sm btn-outline btn-error">Revoke Access</button>
            </div>
          </div>

        </div>
      </div>
      
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}