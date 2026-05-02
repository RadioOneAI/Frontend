import React, { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:5000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function toImageSrc(value) {
  if (!value || typeof value !== "string") return "";
  const raw = value.trim();
  if (!raw) return "";
  if (raw.startsWith("data:image")) return raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${API_BASE}${raw}`;
  const isLikelyBase64 = /^[A-Za-z0-9+/=\r\n]+$/.test(raw) && raw.length > 120;
  if (isLikelyBase64) return `data:image/png;base64,${raw.replace(/\s+/g, "")}`;
  return "";
}

function fmtDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function extractReportFromPayload(payload) {
  const dataRoot = payload?.data ?? payload;
  if (Array.isArray(dataRoot)) return dataRoot[0] || null;
  return dataRoot || null;
}

function statusMeta() {
  return { label: "Ready", color: "success" };
}

export default function PatientReportModal({ reportId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (reportId == null) return;

    const loadReport = async () => {
      setLoading(true);
      setErrorMsg("");
      setReport(null);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Missing access token. Please log in again.");

        const res = await fetch(
          `${API_BASE}/api/reports/${encodeURIComponent(String(reportId))}`,
          { method: "GET", headers: getAuthHeaders() }
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to load report.");
        }
        const r = extractReportFromPayload(json);
        if (!r) throw new Error("Report not found.");
        setReport(r);
      } catch (err) {
        setErrorMsg(err?.message || "Unable to load report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [reportId]);

  if (reportId == null) return null;

  const diagnoses = report?.diagnoses || {};
  const patientNarrative =
    typeof diagnoses.patient === "string"
      ? diagnoses.patient
      : diagnoses?.patient?.text || diagnoses?.patient?.report || "";

  const reportImage = toImageSrc(
    report?.original_image ||
      report?.images?.original_mri ||
      report?.report_images?.[0]?.url ||
      ""
  );

  const meta = statusMeta();

  return (
    <dialog id="patient_report_modal" className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl bg-base-100 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-2xl">Scan Result Explanation</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`badge badge-${meta.color}`}>{meta.label}</span>
              {report?.scan_req_id && (
                <span className="text-xs opacity-60 font-mono">
                  {report.scan_req_id}
                </span>
              )}
              {report?.created_at && (
                <span className="text-xs opacity-60">
                  • {fmtDate(report.created_at)}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        {loading && (
          <div className="py-16 flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-sm opacity-60 font-bold">Loading your report...</p>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="alert alert-error rounded-xl">
            <span className="font-bold">{errorMsg}</span>
          </div>
        )}

        {!loading && !errorMsg && report && (
          <>
            {/* Visual */}
            <div className="w-full h-64 bg-black rounded-xl overflow-hidden flex justify-center items-center mb-6 relative">
              {reportImage ? (
                <img src={reportImage} alt="Scan Result" className="h-full object-contain" />
              ) : (
                <span className="text-white/60 text-sm italic">No preview image available</span>
              )}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                AI Generated Preview
              </div>
            </div>

            {/* Patient-friendly explanation */}
            <div className="space-y-4">
              <div className="p-4 bg-base-200 rounded-lg">
                <h4 className="font-bold text-lg mb-2">What does this mean?</h4>
                {patientNarrative ? (
                  <p className="text-base-content/80 text-sm leading-relaxed whitespace-pre-line">
                    {patientNarrative}
                  </p>
                ) : (
                  <p className="text-base-content/60 text-sm italic">
                    A patient-friendly explanation is not available for this
                    report.
                  </p>
                )}
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex gap-4 items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-bold text-primary">Good to know</h4>
                  <p className="text-sm text-base-content/70">
                    This summary is generated by AI from your scan and is meant
                    to be easy to understand. Please discuss the full clinical
                    findings with your referring doctor before making any
                    treatment decisions.
                  </p>
                </div>
              </div>

              <div className="divider">Next Steps</div>

              <div className="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {report?.doctor?.name
                    ? `Please contact ${report.doctor.name} to review this report and discuss next steps.`
                    : "Please contact your referring doctor to review this report."}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
