import React, { useEffect, useMemo, useState } from "react";
import UploadImagesModal from "../../component/Radiographer/UploadImagesModal";

export default function Appointments() {
  const [appointments, setAppointments] = useState([
    {
      requestId: "REQ-1-0001",
      createdAt: "12/20/2025, 10:15 AM",
      doctor: "Dr. Nimal Perera",
      patient: "Kamal Gunawardena",
      scanType: "MRI",
      radiographer: "Radiographer A. Silva",
      organ: "Brain",
      status: "Active",
    },
    {
      requestId: "REQ-1-0002",
      createdAt: "12/22/2025, 02:40 PM",
      doctor: "Dr. Shalini Fernando",
      patient: "Sita Kumari",
      scanType: "CT",
      radiographer: "Radiographer I. Perera",
      organ: "Abdominal",
      status: "Active",
    },
    {
      requestId: "REQ-1-0003",
      createdAt: "12/26/2025, 09:05 AM",
      doctor: "Dr. Kasun Jayasinghe",
      patient: "Mohamed Riaz",
      scanType: "X-Ray",
      radiographer: "Radiographer M. Fernando",
      organ: "Lungs",
      status: "Active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const modalId = "upload_images_modal";

  const filteredAppointments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter((a) => {
      return (
        a.requestId.toLowerCase().includes(q) ||
        a.patient.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.scanType.toLowerCase().includes(q) ||
        a.organ.toLowerCase().includes(q)
      );
    });
  }, [appointments, searchTerm]);

  // ✅ ONLY set selected appointment here (don't call showModal here)
  const openUploadModal = (appointment) => {
    setSelectedAppointment(appointment);
  };

  // ✅ Open modal AFTER React renders it
  useEffect(() => {
    if (!selectedAppointment) return;

    const dialog = document.getElementById(modalId);
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [selectedAppointment]);

  const handleUploadSubmit = ({ files }) => {
    if (!selectedAppointment) return;

    setAppointments((prev) =>
      prev.map((a) =>
        a.requestId === selectedAppointment.requestId
          ? {
              ...a,
              status: "Image Uploaded",
              uploadedFilesCount: files?.length || 0,
              uploadedAt: new Date().toLocaleString(),
            }
          : a
      )
    );
  };

  const getStatusBadge = (status) => {
    if (status === "Image Uploaded") {
      return (
        <div className="badge badge-info text-white badge-md text-base">
          Uploaded
        </div>
      );
    }
    return (
      <div className="badge badge-success text-white badge-md text-base">
        Active
      </div>
    );
  };

  return (
    <div className="space-y-6 text-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Appointments</h1>
          <p className="text-base-content/70 text-lg">
            View assigned appointments and upload patient scan images.
          </p>
        </div>

        <div className="stats shadow">
          <div className="stat py-3">
            <div className="stat-title text-base">Total</div>
            <div className="stat-value text-2xl">{appointments.length}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="form-control">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search by Request ID / Patient / Doctor / Scan Type..."
            className="input input-bordered w-full max-w-xl text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full align-middle text-lg">
          <thead>
            <tr className="text-lg">
              <th>Request ID</th>
              <th>Created Date &amp; Time</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Scan Type</th>
              <th>Radiographer</th>
              <th>Organ</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((a) => (
                <tr key={a.requestId} className="hover">
                  <td className="font-mono font-bold text-xl">{a.requestId}</td>
                  <td className="text-base">{a.createdAt}</td>
                  <td className="text-base">{a.doctor}</td>
                  <td className="text-base font-semibold">{a.patient}</td>
                  <td className="text-base">{a.scanType}</td>
                  <td className="text-base">{a.radiographer}</td>
                  <td className="text-base">{a.organ}</td>
                  <td>{getStatusBadge(a.status)}</td>

                  <td className="text-center">
                    <button
                      className="btn btn-primary btn-md text-base"
                      onClick={() => openUploadModal(a)}
                    >
                      Upload Images
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-6 text-base-content/50 text-lg"
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      <UploadImagesModal
        modalId={modalId}
        appointment={selectedAppointment}
        onSubmit={handleUploadSubmit}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
