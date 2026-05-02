import React, { useEffect, useMemo, useState, useRef } from "react";
import PatientReportModal from "../../component/Patient/PatientReportModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const API_BASE = "http://127.0.0.1:5000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function fmtDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusMeta() {
  return { label: "Ready to View", cls: "badge-success text-white shadow-success/10" };
}

function mapApiReportToRow(r) {
  return {
    id: r?.id,
    requestId: r?.scan_req_id || r?.scan_request_id || `REPORT-${r?.id ?? "-"}`,
    date: fmtDate(r?.created_at),
    type: `${(r?.scan_type || "Scan").toUpperCase()} - ${(r?.organ || "N/A").charAt(0).toUpperCase() + (r?.organ || "N/A").slice(1)}`,
    doctor: r?.doctor?.name || `Doctor #${r?.doctor_id ?? "-"}`,
    status: r?.status || "pending",
  };
}

export default function PatientReports() {
  const container = useRef();
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".filter-card", { y: -10, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.from(".table-card", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: container }
  );

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Missing access token. Please log in again.");

        const res = await fetch(`${API_BASE}/api/reports`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to load reports.");
        }
        const list = Array.isArray(json?.data) ? json.data : [];
        setReports(list.map(mapApiReportToRow));
      } catch (error) {
        setErrorMsg(error?.message || "Unable to load reports.");
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(
      (r) =>
        String(r.requestId).toLowerCase().includes(q) ||
        String(r.type).toLowerCase().includes(q) ||
        String(r.doctor).toLowerCase().includes(q)
    );
  }, [searchTerm, reports]);

  return (
    <div ref={container} className="space-y-8 p-4">

      {/* --- HEADER --- */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            My Medical <span className="text-gradient">Records</span>
          </h1>
          <p className="text-base-content/50 font-medium">Access and download your imaging results and AI diagnostic reports.</p>
        </div>
      </div>

      {/* --- SEARCH --- */}
      <div className="filter-card glass-card p-4 rounded-3xl border border-base-content/5 max-w-2xl relative bg-base-100/40">
        <input
          type="text"
          placeholder="Search by Request ID / Scan / Doctor..."
          className="input input-ghost w-full focus:bg-transparent text-lg font-bold pl-12 h-14"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {errorMsg && (
        <div className="alert alert-error rounded-2xl shadow-md max-w-2xl">
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}

      {/* --- TABLE --- */}
      <div className="table-card glass-card rounded-[2.5rem] border border-base-content/5 overflow-hidden shadow-xl shadow-base-content/5 bg-base-100/40">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr className="text-base-content/40 uppercase tracking-widest text-[10px] font-black border-b border-base-content/5">
                <th className="py-6 px-8 text-left">Case / Request ID</th>
                <th className="py-6">Medical Modality</th>
                <th className="py-6">Attending Specialist</th>
                <th className="py-6">Clinical Status</th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-bold text-sm">
              {isLoading ? (
                <tr><td colSpan="5" className="py-20"><span className="loading loading-spinner loading-lg text-primary" /></td></tr>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const meta = statusMeta();
                  return (
                    <tr key={report.id} className="hover:bg-base-200/50 transition-colors group border-b border-base-content/5 last:border-0">
                      <td className="py-5 px-8 text-left">
                        <div className="font-black text-base-content/80 text-base">{report.requestId}</div>
                        <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{report.date}</div>
                      </td>
                      <td>
                        <div className="font-black text-primary">{report.type}</div>
                        <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest italic">MRI Sequence</div>
                      </td>
                      <td><span className="font-black text-base-content/70">{report.doctor}</span></td>
                      <td>
                        <div className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] shadow-lg ${meta.cls}`}>
                          {meta.label}
                        </div>
                      </td>
                      <td className="px-8 text-right">
                        <button
                          onClick={() => setSelectedReportId(report.id)}
                          className="btn btn-ghost btn-xs rounded-lg font-black hover:bg-primary/10 hover:text-primary transition-all px-4 py-2"
                        >
                          VIEW RESULTS
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="5" className="py-20 text-center opacity-30 font-black uppercase tracking-[0.3em] text-xs">No reports found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {selectedReportId && (
        <PatientReportModal
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
        />
      )}
    </div>
  );
}
