// src/component/Receptionist/PatientDetailsModal.jsx
import React, { useMemo, useState } from "react";
import PrescriptionFormModal from "./PrescriptionFormModal";

export default function PatientDetailsModal({ patient, onBack }) {
  if (!patient) return null;

  // --- HARD-CODED DROPDOWN DATA (DEMO) ---
  const doctors = useMemo(
    () => ["Dr. Nimal Perera", "Dr. Shalini Fernando", "Dr. Kasun Jayasinghe"],
    []
  );

  const scanTypes = useMemo(
    () => ["MRI", "CT", "X-Ray", "Ultrasound", "Mammogram"],
    []
  );

  const radiographers = useMemo(
    () => [
      "Radiographer A. Silva",
      "Radiographer I. Perera",
      "Radiographer M. Fernando",
    ],
    []
  );

  const organs = useMemo(
    () => ["Brain", "Lungs", "Breast", "Abdominal", "Other"],
    []
  );

  // ✅ DEMO PRESCRIPTIONS (ONLY FOR patient.id === 1)
  const demoPrescriptionsForPatient1 = [
    {
      requestId: "REQ-1-0001",
      createdAt: "12/20/2025, 10:15 AM",
      doctor: "Dr. Nimal Perera",
      scanType: "MRI",
      radiographer: "Radiographer A. Silva",
      organ: "Brain",
      status: "Active",
    },
    {
      requestId: "REQ-1-0002",
      createdAt: "12/22/2025, 02:40 PM",
      doctor: "Dr. Shalini Fernando",
      scanType: "CT",
      radiographer: "Radiographer I. Perera",
      organ: "Abdominal",
      status: "Active",
    },
    {
      requestId: "REQ-1-0003",
      createdAt: "12/26/2025, 09:05 AM",
      doctor: "Dr. Kasun Jayasinghe",
      scanType: "X-Ray",
      radiographer: "Radiographer M. Fernando",
      organ: "Lungs",
      status: "Active",
    },
  ];

  // --- PRESCRIPTIONS STORED PER PATIENT (DEMO, NO BACKEND) ---
  const [prescriptionsByPatient, setPrescriptionsByPatient] = useState(() => ({
    1: demoPrescriptionsForPatient1,
  }));

  const prescriptions = prescriptionsByPatient[patient.id] || [];
  const modalId = "add_prescription_modal";

  const openPrescriptionModal = () => {
    document.getElementById(modalId)?.showModal();
  };

  const handleAddPrescription = (data) => {
    const now = new Date();

    // Request ID increments per patient
    const nextNumber = prescriptions.length + 1;
    const requestId = `REQ-${patient.id}-${String(nextNumber).padStart(4, "0")}`;

    const newRow = {
      requestId,
      createdAt: now.toLocaleString(),
      doctor: data.doctor,
      scanType: data.scanType,
      radiographer: data.radiographer,
      organ: data.organ,
      status: "Active",
    };

    setPrescriptionsByPatient((prev) => ({
      ...prev,
      [patient.id]: [newRow, ...(prev[patient.id] || [])],
    }));
  };

  return (
    <div id="patient_details_section" className="card bg-base-100 shadow-xl text-base">
      <div className="card-body">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-3xl font-bold">Patient Details</h3>
            <p className="text-base-content/70 text-base">
              Registered: {patient.registeredDate}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-m btn-primary text-base"
              onClick={openPrescriptionModal}
            >
              + Add a prescription
            </button>

            <button
              type="button"
              className="btn btn-m btn-outline text-base"
              onClick={onBack}
            >
              ← Back to Patients
            </button>
          </div>
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
                <h4 className="text-2xl font-bold">{patient.name}</h4>
                <span
                  className={`badge mt-1 text-base ${
                    patient.status === "Active"
                      ? "badge-success text-white"
                      : "badge-error text-white"
                  }`}
                >
                  {patient.status} Account
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-base">
              <div>
                <span className="block opacity-50 text-sm uppercase font-bold">NIC</span>
                <span className="font-mono">{patient.nic}</span>
              </div>
              <div>
                <span className="block opacity-50 text-sm uppercase font-bold">Gender</span>
                <span>{patient.gender}</span>
              </div>
              <div>
                <span className="block opacity-50 text-sm uppercase font-bold">Age</span>
                <span>{patient.age} Years</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 space-y-6">
            <div>
              <h4 className="font-bold text-xl border-b pb-2">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-base">
                <div>
                  <span className="block opacity-50 text-sm uppercase font-bold">Address</span>
                  <span>{patient.address}</span>
                </div>
                <div>
                  <span className="block opacity-50 text-sm uppercase font-bold">
                    Registered Date
                  </span>
                  <span>{patient.registeredDate}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xl border-b pb-2">Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-base">
                <div>
                  <span className="block opacity-50 text-sm uppercase font-bold">Mobile</span>
                  <span>{patient.phone}</span>
                </div>
                <div>
                  <span className="block opacity-50 text-sm uppercase font-bold">Email</span>
                  <span>{patient.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions Table */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-bold text-xl">Prescriptions</h4>
            <span className="text-base text-base-content/60">
              Total: {prescriptions.length}
            </span>
          </div>

          <div className="divider my-2" />

          {prescriptions.length === 0 ? (
            <div className="text-base text-base-content/60">
              No prescriptions added yet. Click <b>“Add a prescription”</b> to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-base">
                <thead>
                  <tr className="text-base">
                    <th>Request ID</th>
                    <th>Created Date &amp; Time</th>
                    <th>Selected Doctor</th>
                    <th>Selected Scan Type</th>
                    <th>Selected Radiographer</th>
                    <th>Selected Organ</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((p) => (
                    <tr key={p.requestId} className="text-base">
                      <td className="font-mono font-bold">{p.requestId}</td>
                      <td>{p.createdAt}</td>
                      <td>{p.doctor}</td>
                      <td>{p.scanType}</td>
                      <td>{p.radiographer}</td>
                      <td>{p.organ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Component */}
        <PrescriptionFormModal
          modalId={modalId}
          doctors={doctors}
          scanTypes={scanTypes}
          radiographers={radiographers}
          organs={organs}
          onSubmit={handleAddPrescription}
        />
      </div>
    </div>
  );
}
