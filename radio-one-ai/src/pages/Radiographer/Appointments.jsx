import React, { useEffect, useMemo, useState } from "react";
import UploadImagesModal from "../../component/Radiographer/UploadImagesModal";

const PRIORITY_DEADLINES_MS = {
  critical: 15 * 60 * 1000,      // 15 min
  urgent: 24 * 60 * 60 * 1000,   // 24 h
  routine: 48 * 60 * 60 * 1000,  // 48 h
  normal: null,                 // no time
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
      dueAt: null, // ISO string or null
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
  const modalId = "upload_images_modal";

  // ticker for countdown UI
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const filteredAppointments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter((a) => (
      a.requestId.toLowerCase().includes(q) ||
      a.patient.toLowerCase().includes(q) ||
      a.doctor.toLowerCase().includes(q) ||
      a.scanType.toLowerCase().includes(q) ||
      a.organ.toLowerCase().includes(q)
    ));
  }, [appointments, searchTerm]);

  const openUploadModal = (appointment) => setSelectedAppointment(appointment);

  // Open modal AFTER render
  useEffect(() => {
    if (!selectedAppointment) return;
    const dialog = document.getElementById(modalId);
    if (dialog && !dialog.open) dialog.showModal();
  }, [selectedAppointment]);

  const handleUploadSubmit = ({ files, priority }) => {
    if (!selectedAppointment) return;

    const p = (priority || "normal").toLowerCase();
    const deadlineMs = PRIORITY_DEADLINES_MS[p];
    const dueAt = deadlineMs ? new Date(Date.now() + deadlineMs).toISOString() : null;

    // Create preview URLs (frontend demo)
    const newImages = (files || []).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
    }));

    setAppointments((prev) =>
      prev.map((a) => {
        if (a.requestId !== selectedAppointment.requestId) return a;

        // cleanup old blob urls
        (a.uploadedImages || []).forEach((img) => {
          if (img?.url?.startsWith("blob:")) URL.revokeObjectURL(img.url);
        });

        return {
          ...a,
          status: "Image Uploaded",
          uploadedFilesCount: newImages.length,
          uploadedAt: new Date().toLocaleString(),
          uploadedImages: newImages,
          priority: p,
          dueAt,
        };
      })
    );
  };

  const getStatusBadge = (a) => {
    if (a.status === "Image Uploaded") {
      return <div className="badge badge-info text-white badge-md text-base">Uploaded</div>;
    }
    return <div className="badge badge-success text-white badge-md text-base">Active</div>;
  };

  const getRemaining = (a) => {
    if (!a.dueAt) return "-";
    const ms = new Date(a.dueAt).getTime() - now;
    return formatRemaining(ms);
  };

  return (
    <div className="space-y-6 text-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Appointments</h1>
          <p className="text-base-content/70 text-lg">
            Upload scan images and set priority time.
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
        <input
          type="text"
          placeholder="Search by Request ID / Patient / Doctor / Scan Type..."
          className="input input-bordered w-full max-w-xl text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full align-middle text-lg">
          <thead>
            <tr className="text-lg">
              <th>Request ID</th>
              <th>Created</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Scan</th>
              <th>Organ</th>
              <th>Priority</th>
              <th>Time Left</th> {/* ✅ time only */}
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((a) => (
                <React.Fragment key={a.requestId}>
                  {/* Main row */}
                  <tr className="hover">
                    <td className="font-mono font-bold text-xl">{a.requestId}</td>
                    <td className="text-base">{a.createdAt}</td>
                    <td className="text-base">{a.doctor}</td>
                    <td className="text-base font-semibold">{a.patient}</td>
                    <td className="text-base">{a.scanType}</td>
                    <td className="text-base">{a.organ}</td>

                    <td>{priorityBadge(a.priority)}</td>

                    <td className="font-semibold">
                      {getRemaining(a)}
                    </td>

                    <td>{getStatusBadge(a)}</td>

                    <td className="text-center">
                      <button
                        className="btn btn-primary btn-md text-base"
                        onClick={() => openUploadModal(a)}
                      >
                        Upload Images
                      </button>
                    </td>
                  </tr>

                  {/* ✅ Uploaded image output row (shows under table row) */}
                  {a.uploadedImages?.length > 0 && (
                    <tr>
                      <td colSpan={10} className="bg-base-200/40">
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-bold text-base">
                              Uploaded Images ({a.uploadedImages.length})
                            </div>
                            <div className="text-sm text-base-content/60">
                              Uploaded at: {a.uploadedAt}
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-3">
                            {a.uploadedImages.map((img, idx) => (
                              <div key={`${img.name}-${idx}`} className="card bg-base-100 border border-base-300 w-40">
                                <figure className="px-3 pt-3">
                                  <img
                                    src={img.url}
                                    alt={img.name}
                                    className="rounded-xl w-full h-24 object-cover"
                                  />
                                </figure>
                                <div className="card-body p-3">
                                  <div className="text-xs font-semibold truncate">{img.name}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-6 text-base-content/50 text-lg">
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
