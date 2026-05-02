import React, { useEffect, useMemo, useState, useRef } from "react";
import PdfReportModal from "../../component/Radiographer/PdfReportModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Toast from "../../component/Toast";

const API_BASE = "http://127.0.0.1:5000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function mapApiPrescriptionToUi(item) {
  return {
    requestId: item.scan_req_id || `REQ-${item.id}`,
    scanRequestId: item.scan_req_id || item.scan_request_id || null,
    createdAt: item.created_at
      ? new Date(item.created_at).toLocaleString()
      : "N/A",
    doctor: item.doctor?.name || `Doctor #${item.doctor_id ?? "-"}`,
    patient: item.patient?.name || `Patient #${item.patient_id ?? "-"}`,
    scanType: item.scan_type || "N/A",
    radiographer: item.created_by?.name || "N/A",
    organ: item.organ || "N/A",
    status: item.status || "pending",
    prescriptionId: item.id ?? null,
    reportId: item.report_id ?? item.report?.id ?? null,
    report: { findings: "", impression: "", notes: "" },
    analysis: null,
  };
}

function extractReportFromPayload(payload, requestedId) {
  const dataRoot = payload?.data ?? payload;
  const rows = Array.isArray(dataRoot) ? dataRoot : dataRoot ? [dataRoot] : [];
  if (!rows.length) return null;
  const reqNum = Number(requestedId);
  return rows.find((r) => Number(r?.id) === reqNum) || rows[0] || null;
}

export default function Radiologistretrieve() {
  const container = useRef();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [pdfReportState, setPdfReportState] = useState({
    loading: false,
    error: "",
    requestedId: null,
    resolvedId: null,
    report: null,
  });

  const pdfModalId = "radiologist_pdf_report_modal";

  useGSAP(
    () => {
      gsap.from(".page-header", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".stat-card", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".filter-card", {
        y: -10,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.from(".table-card", {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
      });
    },
    { scope: container },
  );

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token)
          throw new Error("Missing access token. Please log in again.");
        const res = await fetch(`${API_BASE}/api/prescriptions`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false)
          throw new Error(json?.message || "Failed to load prescriptions.");
        const list = Array.isArray(json?.data) ? json.data : [];
        setAppointments(list.map(mapApiPrescriptionToUi));
      } catch (error) {
        setToast({
          message: error.message || "Unable to load prescriptions.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
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
        a.radiographer.toLowerCase().includes(q) ||
        String(a.status || "")
          .toLowerCase()
          .includes(q) ||
        a.scanType.toLowerCase().includes(q) ||
        a.organ.toLowerCase().includes(q),
    );
  }, [appointments, searchTerm]);

  const openPdfReportModal = async (a) => {
    const reportId = a?.reportId ?? null;
    if (reportId == null) {
      setToast({
        message: "Can't display report. Report ID is missing for this record.",
        type: "error",
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
      const res = await fetch(
        `${API_BASE}/api/reports/${encodeURIComponent(String(reportId))}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Failed to load report details.");
      const report = extractReportFromPayload(json, reportId);
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

  return (
    <div ref={container} className="space-y-8 p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* --- HEADER --- */}
      <div className="page-header flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Clinical <span className="text-gradient">Appointments</span>
          </h1>
          <p className="text-base-content/50 font-medium italic">
            Manage diagnostic workflows, AI analysis, and finalized reports.
          </p>
        </div>
      </div>

      {/* --- SEARCH --- */}
      <div className="filter-card glass-card p-4 rounded-3xl border border-base-content/5 max-w-2xl relative bg-base-100/40">
        <input
          type="text"
          placeholder="Search Request ID / Patient / Doctor / Scan..."
          className="input input-ghost w-full focus:bg-transparent text-lg font-bold pl-12 h-14"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-base-content/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* --- TABLE --- */}
      <div className="table-card glass-card rounded-[2.5rem] border border-base-content/5 overflow-hidden shadow-xl shadow-base-content/5 bg-base-100/40">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr className="text-base-content/40 uppercase tracking-widest text-[10px] font-black border-b border-base-content/5">
                <th className="py-6 px-8 text-center">Clinical Request</th>
                <th className="py-6 text-center">Patient Identity</th>
                <th className="py-6 text-center">Scan / Organ</th>
                <th className="py-6 text-center">Assigned Staff</th>
                <th className="py-6 text-center">Status</th>
                <th className="py-6 px-8 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="font-bold text-sm text-center">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                  </td>
                </tr>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((a) => (
                  <tr
                    key={a.requestId}
                    className="hover:bg-base-200/50 transition-colors group border-b border-base-content/5 last:border-0"
                  >
                    <td className="py-5 px-8 text-center">
                      <div className="font-black text-primary text-base">
                        {a.requestId}
                      </div>
                      <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                        {a.createdAt}
                      </div>
                    </td>

                    <td className="text-center">
                      <span className="font-black text-base-content/80 text-base">
                        {a.patient}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="font-black">{a.scanType}</div>
                      <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                        {a.organ}
                      </div>
                    </td>

                    <td className="text-center">
                      <div className="font-bold text-base-content/70">
                        {a.doctor}
                      </div>
                      <div className="text-[10px] opacity-40 uppercase tracking-widest">
                        {a.radiographer}
                      </div>
                    </td>

                    <td className="text-center">
                      <div
                        className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] shadow-lg ${
                          a.analysis ||
                          String(a.status)
                            .toLowerCase()
                            .includes("completed") ||
                          String(a.status).toLowerCase().includes("ready")
                            ? "badge-secondary text-white shadow-secondary/10"
                            : "badge-success text-white shadow-success/10"
                        }`}
                      >
                        {a.analysis ||
                        String(a.status).toLowerCase().includes("completed") ||
                        String(a.status).toLowerCase().includes("ready")
                          ? "REPORT READY"
                          : "PENDING"}
                      </div>
                    </td>

                    <td className="px-8 text-center">
                      <button
                        onClick={() => openPdfReportModal(a)}
                        className="btn btn-primary btn-xs rounded-lg font-black hover:bg-base-300 transition-colors"
                      >
                        DIAGNOSTIC REPORT
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-20 text-center opacity-30 font-black uppercase tracking-[0.3em] text-xs"
                  >
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
