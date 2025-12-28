import React from "react";

export default function DoctorDetailsModal({ doctor }) {
  // Safety check to ensure a doctor object is provided before rendering
  if (!doctor) return null;

  return (
    <dialog id="view_doctor_modal" className="modal">
      <div className="modal-box w-11/12 max-w-3xl">
        <form method="dialog">
          {/* Close button in the top right corner */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* --- LEFT SIDE: PROFILE IMAGE & STATUS --- */}
          <div className="flex flex-col items-center justify-center md:w-1/3 border-r border-base-200 pr-6">
            <div className="avatar mb-4">
              <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={doctor.img} alt={doctor.name} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center">{doctor.name}</h3>
            <span className="badge badge-ghost mt-2">{doctor.spec}</span>
            <span className={`badge mt-2 ${doctor.status === "Active" ? "badge-success text-white" : "badge-error text-white"}`}>
              {doctor.status} Account
            </span>
          </div>

          {/* --- RIGHT SIDE: DETAILS GRID --- */}
          <div className="flex-1 space-y-4">
            
            {/* Professional Info Section */}
            <h4 className="font-bold text-lg border-b pb-2">Professional Details</h4>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">SLMC Registration No</span>
                <span className="font-mono text-base font-bold text-primary">{doctor.regNo}</span>
              </div>
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Specialization Area</span>
                <span>{doctor.spec}</span>
              </div>
            </div>

            {/* Contact Info Section */}
            <h4 className="font-bold text-lg border-b pb-2 mt-6">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Mobile Phone</span>
                <span>{doctor.phone}</span>
              </div>
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Email Address</span>
                <span>{doctor.email}</span>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="flex gap-2 justify-end mt-8">
              <button className="btn btn-sm btn-outline btn-secondary">Edit Profile</button>
              <button className="btn btn-sm btn-outline btn-error">Revoke Access</button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Clicking outside the modal box will close it */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}