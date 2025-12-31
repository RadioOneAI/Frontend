// src/component/Receptionist/PatientDetailsModal.jsx
import React, { useMemo, useState } from "react";
import PrescriptionFormModal from "./PrescriptionFormModal";
import EditPrescriptionFormModal from "./EditPrescriptionFormModel"; // keep your path as you wrote

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

  const organs = useMemo(
    () => ["Brain", "Lungs", "Breast", "Abdominal", "Other"],
    []
  );

  // ✅ DEMO PRESCRIPTIONS (ONLY FOR patient.id === 1)
  // (Added createdAtTs for correct sorting: latest -> old)
  const demoPrescriptionsForPatient1 = [
    {
      requestId: "REQ-1-0001",
      createdAt: "12/20/2025, 10:15 AM",
      createdAtTs: new Date("2025-12-20T10:15:00").getTime(),
      doctor: "Dr. Nimal Perera",
      scanType: "MRI",
      organ: "Brain",
      status: "Active",
    },
    {
      requestId: "REQ-1-0002",
      createdAt: "12/22/2025, 02:40 PM",
      createdAtTs: new Date("2025-12-22T14:40:00").getTime(),
      doctor: "Dr. Shalini Fernando",
      scanType: "CT",
      organ: "Abdominal",
      status: "Active",
    },
    {
      requestId: "REQ-1-0003",
      createdAt: "12/26/2025, 09:05 AM",
      createdAtTs: new Date("2025-12-26T09:05:00").getTime(),
      doctor: "Dr. Kasun Jayasinghe",
      scanType: "X-Ray",
      organ: "Lungs",
      status: "Active",
    },
  ];

  // --- PRESCRIPTIONS STORED PER PATIENT (DEMO, NO BACKEND) ---
  const [prescriptionsByPatient, setPrescriptionsByPatient] = useState(() => ({
    1: demoPrescriptionsForPatient1,
  }));

  const prescriptions = prescriptionsByPatient[patient.id] || [];

  // ✅ Sort Latest -> Old (DESC)
  // Uses createdAtTs if available, otherwise fallback to Date(createdAt)
  const prescriptionsSorted = useMemo(() => {
    const getTs = (p) =>
      typeof p.createdAtTs === "number"
        ? p.createdAtTs
        : new Date(p.createdAt).getTime();

    return [...prescriptions].sort((a, b) => getTs(b) - getTs(a));
  }, [prescriptions]);

  const addModalId = "add_prescription_modal";
  const editModalId = "edit_prescription_modal";

  // which row is being edited
  const [editingPrescription, setEditingPrescription] = useState(null);

  const openPrescriptionModal = () => {
    document.getElementById(addModalId)?.showModal();
  };

  const openEditModal = (row) => {
    setEditingPrescription(row);
    document.getElementById(editModalId)?.showModal();
  };

  // safer next number even if you delete rows
  const getNextNumberForPatient = (list) => {
    const nums = list
      .map((p) => {
        const match = String(p.requestId).match(/REQ-\d+-(\d+)/);
        return match ? Number(match[1]) : 0;
      })
      .filter((n) => !Number.isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return max + 1;
  };

  const handleAddPrescription = (data) => {
    const now = new Date();

    const nextNumber = getNextNumberForPatient(prescriptions);
    const requestId = `REQ-${patient.id}-${String(nextNumber).padStart(4, "0")}`;

    const newRow = {
      requestId,
      createdAt: now.toLocaleString(),
      createdAtTs: now.getTime(), // ✅ important for correct sorting
      doctor: data.doctor,
      scanType: data.scanType,
      organ: data.organ,
      status: "Active",
    };

    setPrescriptionsByPatient((prev) => ({
      ...prev,
      [patient.id]: [newRow, ...(prev[patient.id] || [])],
    }));
  };

  const handleUpdatePrescription = (updated) => {
    setPrescriptionsByPatient((prev) => {
      const list = prev[patient.id] || [];
      const newList = list.map((p) =>
        p.requestId === updated.requestId
          ? {
              ...p,
              doctor: updated.doctor,
              scanType: updated.scanType,
              organ: updated.organ,
              status: updated.status ?? p.status,
              // keep createdAt & createdAtTs as-is
            }
          : p
      );

      return { ...prev, [patient.id]: newList };
    });

    setEditingPrescription(null);
  };

  const handleDeletePrescription = (requestId) => {
    const ok = window.confirm(
      `Are you sure you want to delete prescription ${requestId}?`
    );
    if (!ok) return;

    setPrescriptionsByPatient((prev) => {
      const list = prev[patient.id] || [];
      return {
        ...prev,
        [patient.id]: list.filter((p) => p.requestId !== requestId),
      };
    });

    if (editingPrescription?.requestId === requestId) {
      setEditingPrescription(null);
    }
  };

  return (
    <div
      id="patient_details_section"
      className="card bg-base-100 shadow-xl text-base"
    >
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
                <span className="block opacity-50 text-sm uppercase font-bold">
                  NIC
                </span>
                <span className="font-mono">{patient.nic}</span>
              </div>
              <div>
                <span className="block opacity-50 text-sm uppercase font-bold">
                  Gender
                </span>
                <span>{patient.gender}</span>
              </div>
              <div>
                <span className="block opacity-50 text-sm uppercase font-bold">
                  Age
                </span>
                <span>{patient.age} Years</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 space-y-6">
            <div>
              <h4 className="font-bold text-xl border-b pb-2">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-base">
                <div>
                  <span className="block opacity-50 text-sm uppercase font-bold">
                    Address
                  </span>
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
              <h4 className="font-bold text-xl border-b pb-2">
                Contact Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-base">
                <div>
                  <span className="block opacity-50 text-sm uppercase font-bold">
                    Mobile
                  </span>
                  <span>{patient.phone}</span>
                </div>
                <div>
                  <span className="block opacity-50 text-sm uppercase font-bold">
                    Email
                  </span>
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
              Total: {prescriptionsSorted.length}
            </span>
          </div>

          <div className="divider my-2" />

          {prescriptionsSorted.length === 0 ? (
            <div className="text-base text-base-content/60">
              No prescriptions added yet. Click <b>“Add a prescription”</b> to
              create one.
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
                    <th>Selected Organ</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {prescriptionsSorted.map((p) => (
                    <tr key={p.requestId} className="text-base">
                      <td className="font-mono font-bold">{p.requestId}</td>
                      <td>{p.createdAt}</td>
                      <td>{p.doctor}</td>
                      <td>{p.scanType}</td>
                      <td>{p.organ}</td>

                      <td>
                        <span
                          className={`badge ${
                            p.status === "Active"
                              ? "badge-success text-white"
                              : "badge-error text-white"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => openEditModal(p)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-error text-white"
                            onClick={() => handleDeletePrescription(p.requestId)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Modal */}
        <PrescriptionFormModal
          modalId={addModalId}
          doctors={doctors}
          scanTypes={scanTypes}
          organs={organs}
          onSubmit={handleAddPrescription}
        />

        {/* Edit Modal */}
        <EditPrescriptionFormModal
          modalId={editModalId}
          doctors={doctors}
          scanTypes={scanTypes}
          organs={organs}
          initialData={editingPrescription}
          onSubmit={handleUpdatePrescription}
        />
      </div>
    </div>
  );
}
