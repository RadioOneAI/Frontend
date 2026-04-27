import React, { useMemo, useState, useRef } from "react";
import PatientReportModal from "../../component/Patient/PatientReportModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function PatientReports() {
  const container = useRef();
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const reports = [
    {
      id: "REQ-8821",
      date: "24 Oct 2023",
      type: "MRI - Brain",
      doctor: "Dr. Sarah Jenkins",
      status: "Ready",
      isCritical: true,
    },
    {
      id: "REQ-7740",
      date: "10 Aug 2022",
      type: "MRI Scan - Brain",
      doctor: "Dr. Amal Perera",
      status: "Archived",
      isCritical: false,
    },
  ];

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".filter-card", { y: -10, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.from(".table-card", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: container }
  );

  const filteredReports = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return reports;

    return reports.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q)
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
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-base-200/50 transition-colors group border-b border-base-content/5 last:border-0">
                    <td className="py-5 px-8 text-left">
                       <div className="font-black text-base-content/80 text-base">{report.id}</div>
                       <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{report.date}</div>
                    </td>
                    <td>
                       <div className="font-black text-primary">{report.type}</div>
                       <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest italic">MRI Sequence</div>
                    </td>
                    <td><span className="font-black text-base-content/70">{report.doctor}</span></td>
                    <td>
                      <div className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] shadow-lg ${
                        report.isCritical ? 'badge-warning text-white shadow-warning/10' :
                        report.status === 'Archived' ? 'badge-ghost opacity-50' : 'badge-success text-white shadow-success/10'
                      }`}>
                        {report.isCritical ? 'Attention Required' : report.status === 'Archived' ? 'Archived' : 'Verified Ready'}
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
                ))
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
