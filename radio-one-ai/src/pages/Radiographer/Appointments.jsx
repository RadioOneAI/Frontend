import React, { useEffect, useMemo, useState } from "react";
import UploadImagesModal from "../../component/Radiographer/UploadImagesModal";
import ViewReportModal from "../../component/Radiographer/ViewReportModal";

const PRIORITY_DEADLINES_MS = {
  critical: 15 * 60 * 1000,
  urgent: 24 * 60 * 60 * 1000,
  routine: 48 * 60 * 60 * 1000,
  normal: null,
};

function formatRemaining(ms) {
  if (ms == null) return "-";
  if (ms <= 0) return "Overdue";

  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m ${secs}s`;
}

function priorityBadge(priority) {
  const p = (priority || "normal").toLowerCase();
  if (p === "critical") return <span className="badge badge-error text-white">Critical</span>;
  if (p === "urgent") return <span className="badge badge-warning text-white">Urgent</span>;
  if (p === "routine") return <span className="badge badge-info text-white">Routine</span>;
  return <span className="badge badge-ghost">Normal</span>;
}

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
      uploadedImages: [],
      priority: "normal",
      dueAt: null,
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
      uploadedImages: [],
      priority: "normal",
      dueAt: null,
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
      uploadedImages: [],
      priority: "normal",
      dueAt: null,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewAppointment, setViewAppointment] = useState(null);

  const uploadModalId = "upload_images_modal";
  const viewModalId = "view_report_modal";

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const filteredAppointments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter(
      (a) =>
        a.requestId.toLowerCase().includes(q) ||
        a.patient.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.scanType.toLowerCase().includes(q) ||
        a.organ.toLowerCase().includes(q)
    );
  }, [appointments, searchTerm]);

  const openUploadModal = (a) => {
    setSelectedAppointment(a);
    setTimeout(() => document.getElementById(uploadModalId)?.showModal(), 0);
  };

  const openViewModal = (a) => {
    setViewAppointment(a);
    setTimeout(() => document.getElementById(viewModalId)?.showModal(), 0);
  };

  const handleUploadSubmit = ({ files, priority }) => {
    if (!selectedAppointment) return;

    const p = (priority || "normal").toLowerCase();
    const deadlineMs = PRIORITY_DEADLINES_MS[p];
    const dueAt = deadlineMs ? new Date(Date.now() + deadlineMs).toISOString() : null;

    const newImages = (files || []).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
    }));

    setAppointments((prev) =>
      prev.map((a) =>
        a.requestId !== selectedAppointment.requestId
          ? a
          : {
              ...a,
              status: "Image Uploaded",
              uploadedImages: newImages,
              uploadedAt: new Date().toLocaleString(),
              priority: p,
              dueAt,
            }
      )
    );
  };

  const getRemaining = (a) =>
    a.dueAt ? formatRemaining(new Date(a.dueAt).getTime() - now) : "-";

  return (
    <div className="space-y-6 text-base">
      <h1 className="text-4xl font-bold">Appointments</h1>

      <input
        className="input input-bordered max-w-xl"
        placeholder="Search by Request ID / Patient / Doctor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full text-lg">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Scan</th>
              <th>Priority</th>
              <th>Time Left</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((a) => (
              <tr key={a.requestId}>
                <td className="font-mono font-bold">{a.requestId}</td>
                <td>{a.doctor}</td>
                <td>{a.patient}</td>
                <td>{a.scanType}</td>
                <td>{priorityBadge(a.priority)}</td>
                <td>{getRemaining(a)}</td>
                <td>{a.status}</td>

                <td className="text-center space-x-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openUploadModal(a)}
                    disabled={!!a.dueAt}
                  >
                    Upload Images
                  </button>

                  {/* ✅ View button ONLY when timer is ON */}
                  {a.dueAt && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openViewModal(a)}
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UploadImagesModal
        modalId={uploadModalId}
        appointment={selectedAppointment}
        onSubmit={handleUploadSubmit}
        onClose={() => setSelectedAppointment(null)}
      />

      <ViewReportModal
        modalId={viewModalId}
        appointment={viewAppointment}
        onClose={() => setViewAppointment(null)}
      />
    </div>
  );
}
