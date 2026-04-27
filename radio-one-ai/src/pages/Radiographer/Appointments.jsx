import React, { useEffect, useMemo, useState, useRef } from "react";
import UploadImagesModal from "../../component/Radiographer/UploadImagesModal";
import ViewReportModal from "../../component/Radiographer/ViewReportModal";
import PdfReportModal from "../../component/Radiographer/PdfReportModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

export default function Appointments() {
  const container = useRef();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewAppointment, setViewAppointment] = useState(null);

  const uploadModalId = "upload_images_modal";
  const viewModalId = "view_report_modal";
  const pdfModalId = "pdf_report_modal";

  const [now, setNow] = useState(Date.now());
  const [pdfReportState, setPdfReportState] = useState({
    loading: false,
    error: "",
    requestedId: null,
    resolvedId: null,
    report: null,
  });

  useGSAP(
    () => {
      gsap.from(".page-title", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".search-container", { y: -10, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.from(".table-card", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: container }
  );

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
    scanRequestId: item.scan_req_id || null,
    createdAt: item.created_at
      ? new Date(item.created_at).toLocaleString()
      : "N/A",
    receptionist: item.created_by?.name || "N/A",
    doctor: item.doctor?.name || `Doctor #${item.doctor_id ?? "-"}`,
    doctorId: item.doctor_id ?? item.doctor?.id ?? null,
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
    reportId: item.report_id ?? item.report?.id ?? null,
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
    const rows = Array.isArray(dataRoot) ? dataRoot : dataRoot ? [dataRoot] : [];

    const imageCandidates = [];

    rows.forEach((row) => {
      if (!row || typeof row !== "object") return;

      if (Array.isArray(row.images)) imageCandidates.push(...row.images);
      if (Array.isArray(row.uploaded_images)) imageCandidates.push(...row.uploaded_images);
      if (Array.isArray(row.files)) imageCandidates.push(...row.files);

      if (row.image_url || row.file_url || row.path || row.image) {
        imageCandidates.push(row);
      }

      if (Array.isArray(row.prescriptions)) {
        row.prescriptions.forEach((p) => {
          if (Array.isArray(p?.images)) imageCandidates.push(...p.images);
          if (Array.isArray(p?.uploaded_images)) imageCandidates.push(...p.uploaded_images);
          if (Array.isArray(p?.files)) imageCandidates.push(...p.files);
          if (p?.image_url || p?.file_url || p?.path || p?.image) {
            imageCandidates.push(p);
          }
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
        a.receptionist.toLowerCase().includes(q) ||
        a.scanType.toLowerCase().includes(q) ||
        a.organ.toLowerCase().includes(q) ||
        String(a.status || "").toLowerCase().includes(q)
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

      if (!a.prescriptionId) {
        throw new Error("Prescription ID missing for this record.");
      }

      const prescId = encodeURIComponent(String(a.prescriptionId));

      const res = await fetch(`${API_BASE}/api/prescriptions/${prescId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load prescription details.");
      }

      const images = collectImagesFromResponse(json, a);

      setViewAppointment((prev) =>
        prev && prev.requestId === a.requestId
          ? { ...prev, apiImages: images, loadingImages: false }
          : prev
      );
    } catch (error) {
      setViewAppointment((prev) =>
        prev && prev.requestId === a.requestId
          ? { ...prev, apiImages: [], loadingImages: false }
          : prev
      );

      setApiMessage({
        type: "error",
        text: error.message || "Unable to load images for this prescription.",
      });
    }
  };

  const extractReportFromPayload = (payload, requestedId) => {
    const dataRoot = payload?.data ?? payload;
    const rows = Array.isArray(dataRoot) ? dataRoot : dataRoot ? [dataRoot] : [];
    if (!rows.length) return null;

    const reqNum = Number(requestedId);
    const exact = rows.find((r) => Number(r?.id) === reqNum);
    return exact || rows[0] || null;
  };

  const openPdfReportModal = async (a) => {
    const reportId = a?.reportId ?? null;

    if (reportId == null) {
      setApiMessage({
        type: "error",
        text: "Can't give diagnostic report. Report ID is missing for this record.",
      });
      return;
    }

    setPdfReportState({
      loading: true,
      error: "",
      requestedId: reportId,
      resolvedId: null,
      report: null,
    });
    setTimeout(() => document.getElementById(pdfModalId)?.showModal(), 0);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token. Please log in again.");
      if (!reportId) throw new Error("Report ID missing for this record.");

      const res = await fetch(`${API_BASE}/api/reports/${encodeURIComponent(String(reportId))}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      let report = null;

      if (res.ok && json?.success !== false) {
        report = extractReportFromPayload(json, reportId);
      }

      if (!report) {
        const listRes = await fetch(`${API_BASE}/api/reports`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        const listJson = await listRes.json().catch(() => ({}));

        if (listRes.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }

        if (!listRes.ok || listJson?.success === false) {
          throw new Error(listJson?.message || "Failed to load report list.");
        }

        const rows = Array.isArray(listJson?.data) ? listJson.data : [];
        const scanReq = a?.scanRequestId || a?.requestId || null;
        const byPrescription = rows.filter(
          (r) =>
            Number(r?.prescription_id) === Number(a?.prescriptionId) &&
            a?.prescriptionId != null,
        );
        const byScanReq = rows.filter(
          (r) =>
            (r?.scan_req_id && r.scan_req_id === scanReq) ||
            (r?.scan_request_id && r.scan_request_id === scanReq),
        );

        const candidates = byPrescription.length ? byPrescription : byScanReq;
        const sorted = [...candidates].sort((x, y) => {
          const tx = new Date(x?.created_at || 0).getTime();
          const ty = new Date(y?.created_at || 0).getTime();
          return ty - tx;
        });
        report = sorted[0] || null;
      }

      if (!report) throw new Error("Report details not found.");

      setPdfReportState({
        loading: false,
        error: "",
        requestedId: reportId,
        resolvedId: report.id ?? null,
        report,
      });
    } catch (error) {
      setPdfReportState({
        loading: false,
        error: error.message || "Unable to load report details.",
        requestedId: reportId,
        resolvedId: null,
        report: null,
      });
    }
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
    <div ref={container} className="space-y-8 p-4">
      <div className="page-title">
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Appointment <span className="text-gradient">Manager</span>
        </h1>
        <p className="text-base-content/50 font-medium">View and manage clinical prescriptions and scan requests.</p>
      </div>

      {apiMessage.text && (
        <div className="alert alert-error rounded-2xl border-none font-bold text-white shadow-xl animate-bounce-in">
          <span>{apiMessage.text}</span>
        </div>
      )}

      <div className="search-container glass-card p-2 rounded-3xl max-w-2xl flex items-center gap-4 border border-base-content/5">
        <div className="relative flex-1">
          <input
            className="input input-ghost w-full focus:bg-transparent text-lg font-medium pl-12 h-14"
            placeholder="Search request, patient, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="table-card glass-card rounded-[2.5rem] border border-base-content/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr className="text-base-content/40 uppercase tracking-widest text-[10px] font-black border-b border-base-content/5">
                <th className="py-6 px-8">Request ID</th>
                <th className="py-6">Clinical Info</th>
                <th className="py-6">Patient</th>
                <th className="py-6">Time Left</th>
                <th className="py-6">Status</th>
                <th className="py-6">Created</th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="font-medium text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-20">
                    <span className="loading loading-spinner loading-lg text-primary" />
                    <p className="mt-4 font-bold opacity-30 uppercase tracking-widest text-xs">Accessing Prescriptions...</p>
                  </td>
                </tr>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((a) => (
                  <tr key={a.requestId} className="hover:bg-base-200/30 transition-colors group">
                    <td className="py-5 px-8">
                      <span className="font-mono font-black text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                        {a.requestId}
                      </span>
                    </td>
                    <td className="text-left">
                      <div className="flex flex-col">
                        <span className="font-black text-base uppercase tracking-tighter">{a.scanType}</span>
                        <span className="text-xs opacity-50 font-bold uppercase tracking-widest">{a.organ}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-base-200 flex items-center justify-center font-black text-xs border border-base-content/5">
                          {a.patient.charAt(0)}
                        </div>
                        <div className="text-left">
                          <div className="font-black">{a.patient}</div>
                          <div className="text-[10px] opacity-40 uppercase tracking-tighter font-bold">Ref: {a.doctor}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`font-black ${getRemaining(a) === "Overdue" ? 'text-error animate-pulse' : 'text-base-content/60'}`}>
                        {getRemaining(a)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] ${
                        String(a.status).toLowerCase().includes('uploaded') ? 'badge-success text-white' : 'badge-warning text-white'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="text-[11px] font-bold opacity-40">{a.createdAt}</td>

                    <td className="px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="btn btn-ghost btn-xs rounded-lg font-black hover:bg-base-300" onClick={() => openViewModal(a)}>VIEW</button>
                        <button className="btn btn-secondary btn-xs rounded-lg font-black shadow-lg shadow-secondary/10" onClick={() => openPdfReportModal(a)}>REPORT</button>
                        <button 
                          className="btn btn-primary btn-xs rounded-lg font-black shadow-lg shadow-primary/10" 
                          onClick={() => openUploadModal(a)}
                          disabled={!!a.dueAt}
                        >
                          UPLOAD
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-20 text-center opacity-30 font-black uppercase tracking-[0.3em] text-xs">
                    No prescriptions matched your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      <PdfReportModal
        modalId={pdfModalId}
        state={pdfReportState}
        onClose={() =>
          setPdfReportState({
            loading: false,
            error: "",
            requestedId: null,
            resolvedId: null,
            report: null,
          })
        }
      />
    </div>
  );
}
