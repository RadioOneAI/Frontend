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
    <div ref={container} className="space-y-8 p-6 lg:p-10 min-h-screen relative overflow-hidden bg-base-100/50">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[100px] pointer-events-none opacity-60"></div>

      <div className="page-title relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2">
            Appointment <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Manager</span>
          </h1>
          <p className="text-base-content/60 font-medium text-lg">Manage and process clinical prescriptions with AI assistance.</p>
        </div>
      </div>

      {apiMessage.text && (
        <div className="alert alert-error rounded-2xl border border-error/20 bg-error/10 text-error backdrop-blur-md shadow-xl animate-bounce-in relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="font-bold">{apiMessage.text}</span>
        </div>
      )}

      <div className="search-container relative z-10 max-w-3xl">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative glass bg-base-100/60 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center p-2 shadow-2xl">
            <svg className="w-7 h-7 ml-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="input input-ghost w-full focus:bg-transparent text-lg font-medium h-14 border-none focus:outline-none focus:ring-0 placeholder-base-content/30"
              placeholder="Search by Request ID, Patient Name, or Doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-card relative z-10 glass bg-base-100/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full text-left border-collapse">
            <thead>
              <tr className="text-base-content/50 uppercase tracking-widest text-[11px] font-bold border-b border-white/10 bg-base-200/20">
                <th className="py-6 px-8 rounded-tl-[2.5rem]">Request ID</th>
                <th className="py-6">Clinical Info</th>
                <th className="py-6">Patient Details</th>
                <th className="py-6">Time Left</th>
                <th className="py-6">Status</th>
                <th className="py-6">Created</th>
                <th className="py-6 px-8 text-right rounded-tr-[2.5rem]">Actions</th>
              </tr>
            </thead>

            <tbody className="font-medium text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-32">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <span className="loading loading-ring loading-lg text-primary scale-150" />
                      <p className="font-bold opacity-40 uppercase tracking-widest text-sm bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">Syncing Database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((a, index) => (
                  <tr key={a.requestId} className="hover:bg-base-200/50 transition-all duration-300 group border-b border-white/5 last:border-0" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td className="py-6 px-8">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></div>
                        <span className="font-mono font-bold text-base-content/80 group-hover:text-primary transition-colors">
                          {a.requestId}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[15px] text-base-content group-hover:text-primary transition-colors">{a.scanType}</span>
                        <span className="text-xs opacity-60 font-semibold uppercase tracking-wider">{a.organ}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="avatar placeholder">
                          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 text-base-content rounded-xl w-10 h-10 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                            <span className="text-sm font-bold">{a.patient.charAt(0)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[14px] text-base-content">{a.patient}</span>
                          <span className="text-[11px] opacity-60 font-semibold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            {a.doctor}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getRemaining(a) === "Overdue" ? 'bg-error/10 border-error/20 text-error' : 'bg-base-200/50 border-white/5 text-base-content/70'}`}>
                        {getRemaining(a) === "Overdue" && <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        <span className="font-bold text-[13px] tracking-wide">
                          {getRemaining(a)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {String(a.status).toLowerCase().includes('uploaded') ? (
                          <span className="badge badge-success badge-sm badge-outline gap-1 p-3 font-bold bg-success/10 border-success/30 text-success shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            {a.status}
                          </span>
                        ) : (
                          <span className="badge badge-warning badge-sm badge-outline gap-1 p-3 font-bold bg-warning/10 border-warning/30 text-warning shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {a.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-base-content/80">{a.createdAt.split(',')[0]}</span>
                        <span className="text-[11px] font-medium text-base-content/40">{a.createdAt.split(',')[1]}</span>
                      </div>
                    </td>
                    <td className="px-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="btn btn-circle btn-ghost btn-sm hover:bg-base-200 hover:text-primary transition-colors tooltip tooltip-left" 
                          data-tip="View Details"
                          onClick={() => openViewModal(a)}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm rounded-xl font-bold px-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(217,70,239,0.23)] hover:bg-secondary focus:outline-none transition-all duration-200" 
                          onClick={() => openPdfReportModal(a)}
                        >
                          REPORT
                        </button>
                        <button 
                          className="btn btn-primary btn-sm rounded-xl font-bold px-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] hover:bg-primary focus:outline-none transition-all duration-200" 
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
                  <td colSpan="7" className="py-24">
                    <div className="flex flex-col items-center justify-center text-center opacity-40">
                      <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      <span className="font-bold text-lg">No Prescriptions Found</span>
                      <span className="text-sm">Try adjusting your search filters</span>
                    </div>
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
