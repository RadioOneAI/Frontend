import React from "react";

export default function PatientDetailsModal({ patient }) {
  // If no patient is selected, return null so nothing renders (safety check)
  if (!patient) return null;

  return (
    <dialog id="view_patient_modal" className="modal">
      <div className="modal-box w-11/12 max-w-3xl">
        <form method="dialog">
          {/* Close button top right */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* --- LEFT SIDE: PROFILE IMAGE & STATUS --- */}
          <div className="flex flex-col items-center justify-center md:w-1/3 border-r border-base-200 pr-6">
            <div className="avatar mb-4">
              <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={patient.img} alt={patient.name} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center">{patient.name}</h3>
            <span className={`badge mt-2 ${patient.status === "Active" ? "badge-success text-white" : "badge-error text-white"}`}>
              {patient.status} Account
            </span>
            <p className="text-xs text-base-content/50 mt-4">Registered: {patient.registeredDate}</p>
          </div>

          {/* --- RIGHT SIDE: DETAILS GRID --- */}
          <div className="flex-1 space-y-4">
            
            {/* Personal Info */}
            <h4 className="font-bold text-lg border-b pb-2">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">NIC Number</span>
                <span className="font-mono text-base">{patient.nic}</span>
              </div>
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Age</span>
                <span>{patient.age} Years</span>
              </div>
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Gender</span>
                <span>{patient.gender}</span>
              </div>
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Address</span>
                <span>{patient.address}</span>
              </div>
            </div>

            {/* Contact Info */}
            <h4 className="font-bold text-lg border-b pb-2 mt-6">Contact Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Mobile Phone</span>
                <span>{patient.phone}</span>
              </div>
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Email Address</span>
                <span>{patient.email}</span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex gap-2 justify-end mt-8">
              <button className="btn btn-sm btn-outline btn-primary">Edit Details</button>
              <button className="btn btn-sm btn-outline btn-error">Reset Password</button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Clicking outside triggers close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}