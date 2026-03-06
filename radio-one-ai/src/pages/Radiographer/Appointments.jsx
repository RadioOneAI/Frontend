import React, { useEffect, useMemo, useState } from "react";
import UploadImagesModal from "../../component/Radiographer/UploadImagesModal";
import ViewReportModal from "../../component/Radiographer/ViewReportModal";

const API_BASE = "http://127.0.0.1:5000";

const PRIORITY_DEADLINES_MS = {
  critical: 15 * 60 * 1000,
  urgent: 24 * 60 * 60 * 1000,
  routine: 48 * 60 * 60 * 1000,
  normal: null,
  pending: null,
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
  const p = (priority || "pending").toLowerCase();
  if (p === "critical")
    return <span className="badge badge-error text-white">Critical</span>;
  if (p === "urgent")
    return <span className="badge badge-warning text-white">Urgent</span>;
  if (p === "routine")
    return <span className="badge badge-info text-white">Routine</span>;
  if (p === "normal")
    return <span className="badge badge-info text-white">Normal</span>;
  return <span className="badge badge-ghost">Pending</span>;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });

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

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const mapApiPrescriptionToUi = (item) => ({
    requestId: item.scan_req_id || `REQ-${item.id}`,
    createdAt: item.created_at
      ? new Date(item.created_at).toLocaleString()
      : "N/A",
    Receptionist: item.created_by?.name || "N/A",
    doctor:item.doctor?.name || `Doctor #${item.doctor_id ?? "-"}`,
    patient: item.patient?.name || `Patient #${item.patient_id ?? "-"}`,
    scanType: item.scan_type || "N/A",
    organ: item.organ || "N/A",
    status: item.status || "pending",
    uploadedImages: [],
    priority: "pending",
    dueAt: null,
    imagesCount: item.images_count ?? 0,
    description: item.description || "",
    createdBy: item.created_by || null,
    updatedBy: item.updated_by || null,
    patientId: item.patient_id ?? item.patientId ?? item.patient?.id ?? null,
    prescriptionId: item.id ?? null,
    apiImages: [],
    loadingImages: false,
  });

  const normalizeApiImage = (img, idx, fallback) => {
    if (!img) return null;
    const url =
      img.url ||
      img.image_url ||
      img.file_url ||
      img.path ||
      img.image ||
      (typeof img === "string" ? img : "");

    if (!url) return null;
    return {
      id: img.id || `${fallback.requestId}-IMG-${idx + 1}`,
      name: img.name || img.filename || `Image ${idx + 1}`,
      url,
      modality: fallback.scanType || "N/A",
      organ: fallback.organ || "N/A",
    };
  };

  const collectImagesFromResponse = (payload, fallback) => {
    const dataRoot = payload?.data ?? payload;
    const rows = Array.isArray(dataRoot)
      ? dataRoot
      : dataRoot
        ? [dataRoot]
        : [];

    const imageCandidates = [];
    rows.forEach((row) => {
      if (!row || typeof row !== "object") return;
      if (Array.isArray(row.images)) imageCandidates.push(...row.images);
      if (Array.isArray(row.uploaded_images))
        imageCandidates.push(...row.uploaded_images);
      if (Array.isArray(row.files)) imageCandidates.push(...row.files);
      if (row.image_url || row.file_url || row.path || row.image)
        imageCandidates.push(row);
      if (Array.isArray(row.prescriptions)) {
        row.prescriptions.forEach((p) => {
          if (Array.isArray(p?.images)) imageCandidates.push(...p.images);
          if (Array.isArray(p?.uploaded_images))
            imageCandidates.push(...p.uploaded_images);
          if (Array.isArray(p?.files)) imageCandidates.push(...p.files);
          if (p?.image_url || p?.file_url || p?.path || p?.image)
            imageCandidates.push(p);
        });
      }
    });

    return imageCandidates
      .map((img, idx) => normalizeApiImage(img, idx, fallback))
      .filter(Boolean);
  };

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Missing access token. Please log in again.");
      }

      const res = await fetch(`${API_BASE}/api/prescriptions`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load prescriptions.");
      }

      const list = Array.isArray(json?.data) ? json.data : [];
      setAppointments(list.map(mapApiPrescriptionToUi));
      setApiMessage({ type: "", text: "" });
    } catch (error) {
      setApiMessage({
        type: "error",
        text: error.message || "Unable to fetch prescriptions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const filteredAppointments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter(
      (a) =>
        a.requestId.toLowerCase().includes(q) ||
        a.patient.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.Receptionist.toLowerCase().includes(q) ||
        a.scanType.toLowerCase().includes(q) ||
        a.organ.toLowerCase().includes(q) ||
        String(a.status || "")
          .toLowerCase()
          .includes(q),
    );
  }, [appointments, searchTerm]);

  const openUploadModal = (a) => {
    setSelectedAppointment(a);
    setTimeout(() => document.getElementById(uploadModalId)?.showModal(), 0);
  };

  const openViewModal = async (a) => {
    setViewAppointment({ ...a, loadingImages: true, apiImages: [] });
    setTimeout(() => document.getElementById(viewModalId)?.showModal(), 0);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token. Please log in again.");

      // ✅ MUST use prescriptionId (id), NOT patientId
      if (!a.prescriptionId) {
        throw new Error("Prescription ID missing for this record.");
      }

      const prescId = encodeURIComponent(String(a.prescriptionId));

      const res = await fetch(`${API_BASE}/api/prescriptions/${prescId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 401)
        throw new Error("Unauthorized. Please log in again.");
      if (!res.ok || json?.success === false) {
        throw new Error(
          json?.message || "Failed to load prescription details.",
        );
      }

      // Your API returns { data: { images: [...] } }
      const images = collectImagesFromResponse(json, a);

      setViewAppointment((prev) =>
        prev && prev.requestId === a.requestId
          ? { ...prev, apiImages: images, loadingImages: false }
          : prev,
      );
    } catch (error) {
      setViewAppointment((prev) =>
        prev && prev.requestId === a.requestId
          ? { ...prev, apiImages: [], loadingImages: false }
          : prev,
      );
      setApiMessage({
        type: "error",
        text: error.message || "Unable to load images for this prescription.",
      });
    }
  };

  const handleUploadSubmit = ({ files, priority }) => {
    if (!selectedAppointment) return;

    const p = (priority || "normal").toLowerCase();
    const deadlineMs = PRIORITY_DEADLINES_MS[p];
    const dueAt = deadlineMs
      ? new Date(Date.now() + deadlineMs).toISOString()
      : null;

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
            },
      ),
    );
  };

  const getRemaining = (a) =>
    a.dueAt ? formatRemaining(new Date(a.dueAt).getTime() - now) : "-";

  return (
    <div className="space-y-6 text-base">
      <h1 className="text-4xl font-bold">Appointments</h1>

      {apiMessage.text ? (
        <div className="alert alert-error">
          <span>{apiMessage.text}</span>
        </div>
      ) : null}

      <input
        className="input input-bordered w-full max-w-2xl text-lg"
        placeholder="Search by Request ID / Patient / Receptionist..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full text-sm text-center">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Doctor Name</th>
              <th>Receptionist Name</th>
              <th>Patient</th>
              <th>Scan Type</th>
              <th>Organ</th>
              <th>Images</th>
              <th>Priority</th>
              <th>Time Left</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="11"
                  className="text-center py-4 text-base-content/50"
                >
                  Loading prescriptions...
                </td>
              </tr>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((a) => (
                <tr key={a.requestId}>
                  <td className="font-mono font-bold">{a.requestId}</td>
                  <td>{a.doctor}</td>
                  <td>{a.Receptionist}</td>
                  <td>{a.patient}</td>
                  <td>{a.scanType}</td>
                  <td>{a.organ}</td>
                  <td>{a.imagesCount}</td>
                  <td>{priorityBadge(a.priority)}</td>
                  <td>{getRemaining(a)}</td>
                  <td>{a.status}</td>
                  <td>{a.createdAt}</td>

                  <td className="text-center space-x-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openViewModal(a)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openUploadModal(a)}
                      disabled={!!a.dueAt}
                    >
                      Upload Images
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="text-center py-4 text-base-content/50"
                >
                  No prescriptions found.
                </td>
              </tr>
            )}
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
