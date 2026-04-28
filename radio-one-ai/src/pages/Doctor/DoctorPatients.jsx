import React, { useEffect, useMemo, useState, useRef } from "react";
import DoctorReportModal from "../../component/Doctor/DoctorReportModal";
import PdfReportModal from "../../component/Radiographer/PdfReportModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Toast from "../../component/Toast";

const API_BASE = "http://127.0.0.1:5000";

function getLoggedDoctorId() {
  try {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    return user?.id ?? null;
  } catch {
    return null;
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function statusBadge(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("ready") || s.includes("completed")) {
    return <div className="badge badge-secondary badge-md text-white shadow-lg shadow-secondary/20 border-none uppercase text-[10px] font-black px-4 py-3 rounded-xl">REPORT READY</div>;
  }
  if (s.includes("critical") || s.includes("urgent")) {
    return <div className="badge badge-error badge-md text-white shadow-lg shadow-error/20 border-none uppercase text-[10px] font-black px-4 py-3 rounded-xl">CRITICAL FINDING</div>;
  }
  if (s.includes("image uploaded")) {
    return <div className="badge badge-success badge-md text-white shadow-lg shadow-success/20 border-none uppercase text-[10px] font-black px-4 py-3 rounded-xl">SCANNED</div>;
  }
  return <div className="badge badge-ghost badge-md shadow-lg shadow-base-content/5 border-none uppercase text-[10px] font-black px-4 py-3 rounded-xl">PENDING RADIOLOGIST</div>;
}

function mapPrescriptionToPatientRow(item) {
  return {
    id: String(item?.patient?.username || item?.patient?.id || item?.patient_id || item?.id || "-"),
    name: item?.patient?.name || `Patient #${item?.patient_id ?? "-"}`,
    age: item?.patient?.age ?? "N/A",
    condition: item?.description || `${item?.scan_type || "Scan"} - ${item?.organ || "N/A"}`,
    scanDate: item?.created_at ? new Date(item.created_at).toLocaleString() : "N/A",
    status: item?.status || "pending",
    urgency: "Medium",
    requestId: item?.scan_req_id || `REQ-${item?.id ?? "-"}`,
    scanRequestId: item?.scan_req_id || item?.scan_request_id || null,
    createdAt: item?.created_at ? new Date(item.created_at).toLocaleString() : "N/A",
    receptionist: item?.created_by?.name || "N/A",
    doctor: item?.doctor?.name || `Doctor #${item?.doctor_id ?? "-"}`,
    doctorId: item?.doctor_id ?? item?.doctor?.id ?? null,
    patient: item?.patient?.name || `Patient #${item?.patient_id ?? "-"}`,
    patientId: item?.patient_id ?? item?.patient?.id ?? null,
    scanType: item?.scan_type || "N/A",
    organ: item?.organ || "N/A",
    imagesCount: item?.images_count ?? 0,
    prescriptionId: item?.id ?? null,
    reportId: item?.report_id ?? item?.report?.id ?? null,
    description: item?.description || "",
    priority: "pending",
    dueAt: null,
  };
}

export default function DoctorPatients() {
  const container = useRef();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [pdfReportState, setPdfReportState] = useState({
    loading: false, error: "", requestedId: null, resolvedId: null, report: null,
  });

  const pdfModalId = "doctor_pdf_report_modal";

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".filter-card", { y: -10, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.from(".table-card", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: container }
  );

  useEffect(() => {
    const loadMyPatients = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Missing access token. Please log in again.");
        const doctorId = getLoggedDoctorId();
        if (!doctorId) throw new Error("Doctor ID not found in localStorage user.");

        const res = await fetch(`${API_BASE}/api/prescriptions`, {
          method: "GET", headers: getAuthHeaders(),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) throw new Error(json?.message || "Failed to load prescriptions.");

        const list = Array.isArray(json?.data) ? json.data : [];
        const mine = list.filter((item) => Number(item?.doctor_id ?? item?.doctor?.id) === Number(doctorId));
        setPatients(mine.map(mapPrescriptionToPatientRow));
      } catch (error) {
        setToast({ message: error?.message || "Unable to load my patients.", type: "error" });
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadMyPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((a) =>
      a.requestId.toLowerCase().includes(q) ||
      a.patient.toLowerCase().includes(q) ||
      a.doctor.toLowerCase().includes(q) ||
      a.receptionist.toLowerCase().includes(q) ||
      a.scanType.toLowerCase().includes(q) ||
      a.organ.toLowerCase().includes(q) ||
      String(a.status || "").toLowerCase().includes(q)
    );
  }, [searchTerm, patients]);

  const extractReportFromPayload = (payload, requestedId) => {
    const dataRoot = payload?.data ?? payload;
    const rows = Array.isArray(dataRoot) ? dataRoot : dataRoot ? [dataRoot] : [];
    if (!rows.length) return null;
    const reqNum = Number(requestedId);
    return rows.find((r) => Number(r?.id) === reqNum) || rows[0] || null;
  };

  const openPdfReportModal = async (p) => {
    const reportId = p?.reportId ?? null;
    if (reportId == null) {
      setToast({ message: "Can't display report. Report ID is missing for this record.", type: "error" });
      return;
    }

    setPdfReportState({ loading: true, error: "", requestedId: reportId, resolvedId: null, report: null });
    setTimeout(() => document.getElementById(pdfModalId)?.showModal(), 0);

    try {
      const fetchReportById = async (id) => {
        const res = await fetch(`${API_BASE}/api/reports/${encodeURIComponent(String(id))}`, {
          method: "GET", headers: getAuthHeaders(),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) return null;
        return extractReportFromPayload(json, id);
      };

      let report = null;
      let resolvedReportId = reportId ?? null;

      if (resolvedReportId != null) {
        report = await fetchReportById(resolvedReportId);
      }

      if (!report) {
        const listRes = await fetch(`${API_BASE}/api/reports`, {
          method: "GET", headers: getAuthHeaders(),
        });
        const listJson = await listRes.json().catch(() => ({}));
        if (!listRes.ok || listJson?.success === false) throw new Error(listJson?.message || "Failed to load report list.");

        const rows = Array.isArray(listJson?.data) ? listJson.data : [];
        const scanReq = p?.scanRequestId || p?.requestId || null;

        const byPrescription = rows.filter((r) => Number(r?.prescription_id) === Number(p?.prescriptionId) && p?.prescriptionId != null);
        const byScanReq = rows.filter((r) => (r?.scan_req_id && r.scan_req_id === scanReq) || (r?.scan_request_id && r.scan_request_id === scanReq));
        const byDoctorAndPatient = rows.filter((r) => Number(r?.doctor_id ?? r?.doctor?.id) === Number(p?.doctorId) && Number(r?.patient_id ?? r?.patient?.id) === Number(p?.patientId) && p?.doctorId != null && p?.patientId != null);
        const byDoctorOnly = rows.filter((r) => Number(r?.doctor_id ?? r?.doctor?.id) === Number(p?.doctorId) && p?.doctorId != null);

        let candidates = [];
        if (byPrescription.length) candidates = byPrescription;
        else if (byScanReq.length) candidates = byScanReq;
        else if (byDoctorAndPatient.length) candidates = byDoctorAndPatient;
        else candidates = byDoctorOnly;

        const sorted = [...candidates].sort((a, b) => new Date(b?.created_at || 0).getTime() - new Date(a?.created_at || 0).getTime());
        const best = sorted[0] || null;
        resolvedReportId = best?.id ?? null;
        report = best;

        if (resolvedReportId != null) {
          const full = await fetchReportById(resolvedReportId);
          if (full) report = full;
        }
      }

      if (!report) throw new Error("Report details not found.");
      setPdfReportState({ loading: false, error: "", requestedId: resolvedReportId ?? reportId, resolvedId: report.id ?? resolvedReportId ?? null, report });
    } catch (error) {
      setPdfReportState({ loading: false, error: error?.message || "Unable to load report details.", requestedId: reportId, resolvedId: null, report: null });
    }
  };

  return (
    <div ref={container} className="space-y-8 p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- HEADER --- */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Clinical <span className="text-gradient">Roster</span>
          </h1>
          <p className="text-base-content/50 font-medium italic">Track your patient scan requests, imaging data, and diagnostic reports.</p>
        </div>
      </div>

      {/* --- SEARCH --- */}
      <div className="filter-card glass-card p-4 rounded-3xl border border-base-content/5 max-w-2xl relative bg-base-100/40">
        <input 
          type="text" 
          placeholder="Search Request ID / Patient / Receptionist / Scan..." 
          className="input input-ghost w-full focus:bg-transparent text-lg font-bold pl-12 h-14" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* --- TABLE --- */}
      <div className="table-card glass-card rounded-[2.5rem] border border-base-content/5 overflow-hidden shadow-xl shadow-base-content/5 bg-base-100/40">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr className="text-base-content/40 uppercase tracking-widest text-[10px] font-black border-b border-base-content/5">
                <th className="py-6 px-8 text-left">Clinical Request</th>
                <th className="py-6">Patient Identity</th>
                <th className="py-6">Scan / Organ</th>
                <th className="py-6">Admission Staff</th>
                <th className="py-6">Status</th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-bold text-sm">
              {isLoading ? (
                <tr><td colSpan="6" className="py-20"><span className="loading loading-spinner loading-lg text-primary" /></td></tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr key={`${p.requestId}-${p.id}`} className="hover:bg-base-200/50 transition-colors group border-b border-base-content/5 last:border-0">
                    <td className="py-5 px-8 text-left">
                       <div className="font-black text-primary text-base">{p.requestId}</div>
                       <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{p.createdAt}</div>
                    </td>
                    <td>
                       <div className="font-black text-base-content/80 text-base">{p.patient}</div>
                       <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Images: {p.imagesCount}</div>
                    </td>
                    <td>
                       <div className="font-black">{p.scanType}</div>
                       <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{p.organ}</div>
                    </td>
                    <td>
                       <div className="font-bold text-base-content/70">{p.receptionist}</div>
                    </td>
                    <td>
                      {statusBadge(p.status)}
                    </td>
                    <td className="px-8 text-right">
                      <button 
                        onClick={() => openPdfReportModal(p)} 
                        className="btn btn-ghost btn-xs rounded-lg font-black hover:bg-base-300 transition-colors"
                      >
                        DIAGNOSTIC REPORT
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="py-20 text-center opacity-30 font-black uppercase tracking-[0.3em] text-xs">No patient records found in your roster.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPatient ? (
        <DoctorReportModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      ) : null}

      <PdfReportModal
        modalId={pdfModalId}
        state={pdfReportState}
        onClose={() => setPdfReportState({ loading: false, error: "", requestedId: null, resolvedId: null, report: null })}
      />
    </div>
  );
}