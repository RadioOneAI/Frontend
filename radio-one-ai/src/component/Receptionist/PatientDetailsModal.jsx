// src/component/Receptionist/PatientDetailsModal.jsx
import React from "react";

export default function PatientDetailsModal({ patient, onBack }) {
  // If no patient is selected, render nothing
  if (!patient) return null;

  return (
    <div id="patient_details_section" className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold">Patient Details</h3>
            <p className="text-base-content/70 text-sm">
              Registered: {patient.registeredDate}
            </p>
          </div>

          <button type="button" className="btn btn-sm btn-outline" onClick={onBack}>
            ← Back to Patients
          </button>
        </div>

        <div className="divider my-2" />

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left */}
          <div className="w-full lg:w-1/3">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={patient.img} alt={patient.name} />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold">{patient.name}</h4>
                <span
                  className={`badge mt-1 ${
                    patient.status === "Active"
                      ? "badge-success text-white"
                      : "badge-error text-white"
                  }`}
                >
                  {patient.status} Account
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">NIC</span>
                <span className="font-mono">{patient.nic}</span>
              </div>
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Gender</span>
                <span>{patient.gender}</span>
              </div>
              <div>
                <span className="block opacity-50 text-xs uppercase font-bold">Age</span>
                <span>{patient.age} Years</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 space-y-5">
            <div>
              <h4 className="font-bold text-lg border-b pb-2">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <span className="block opacity-50 text-xs uppercase font-bold">
                    Address
                  </span>
                  <span>{patient.address}</span>
                </div>
                <div>
                  <span className="block opacity-50 text-xs uppercase font-bold">
                    Registered Date
                  </span>
                  <span>{patient.registeredDate}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg border-b pb-2">Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <span className="block opacity-50 text-xs uppercase font-bold">
                    Mobile
                  </span>
                  <span>{patient.phone}</span>
                </div>
                <div>
                  <span className="block opacity-50 text-xs uppercase font-bold">
                    Email
                  </span>
                  <span>{patient.email}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end pt-2">
              <button className="btn btn-sm btn-outline btn-primary">
                Edit Details
              </button>
              <button className="btn btn-sm btn-outline btn-error">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
