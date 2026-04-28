import React, { useState, useRef } from "react";
import TablePagination from "../../component/Receptionist/TablePagination";
import ExportButton from "../../component/Receptionist/ExportButton";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SystemLogs() {
  const container = useRef();
  
  // 1. Dummy Log Data
  const [logs] = useState([
    { id: 101, user: "Radiologist (You)", action: "Verified Diagnostic Report", target: "REQ-8821", ip: "192.168.1.10", time: "2 mins ago", status: "Success" },
    { id: 102, user: "Radiologist (You)", action: "Requested AI Analysis", target: "REQ-8822", ip: "192.168.1.10", time: "15 mins ago", status: "Success" },
    { id: 103, user: "System", action: "Failed Login Attempt", target: "Unknown User", ip: "45.33.22.11", time: "1 hour ago", status: "Error" },
    { id: 104, user: "System", action: "AI Model Sync Complete", target: "Neural Engine v2", ip: "Localhost", time: "2 hours ago", status: "Success" },
    { id: 105, user: "Radiologist (You)", action: "Exported Case File", target: "REQ-7740", ip: "192.168.1.10", time: "5 hours ago", status: "Warning" },
  ]);

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".filter-row > div", { y: -10, opacity: 0, stagger: 0.1, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.from(".table-card", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: container }
  );

  // 2. Filter Logic
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div ref={container} className="space-y-8 p-4">
      
      {/* --- HEADER --- */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Audit <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="text-base-content/50 font-medium italic">Tracking diagnostic activities and system security events.</p>
        </div>
        <ExportButton onExport={() => alert("Downloading logs...")} label="DOWNLOAD LOGS" />
      </div>

      {/* --- FILTERS --- */}
      <div className="filter-row flex flex-col sm:flex-row gap-4 max-w-4xl">
        <div className="flex-1 relative glass-card p-2 rounded-2xl border border-base-content/5 bg-base-100/40">
           <input 
              type="text" 
              placeholder="Search User or Action..." 
              className="input input-ghost w-full focus:bg-transparent font-bold pl-12" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <div className="w-full sm:w-64 glass-card p-2 rounded-2xl border border-base-content/5 bg-base-100/40">
          <select 
            className="select select-ghost w-full focus:bg-transparent font-bold" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Events</option>
            <option value="Success">Success Only</option>
            <option value="Warning">Warnings</option>
            <option value="Error">Errors / Security</option>
          </select>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="table-card glass-card rounded-[2.5rem] border border-base-content/5 overflow-hidden shadow-xl shadow-base-content/5 bg-base-100/40">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr className="text-base-content/40 uppercase tracking-widest text-[10px] font-black border-b border-base-content/5">
                <th className="py-6 px-8 text-left">Initiator</th>
                <th className="py-6">Diagnostic Activity</th>
                <th className="py-6">Target Record</th>
                <th className="py-6">IP / Meta</th>
                <th className="py-6">Time</th>
                <th className="py-6 px-8 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="font-bold text-sm">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-base-200/50 transition-colors group border-b border-base-content/5 last:border-0">
                    <td className="py-5 px-8 text-left">
                       <div className="font-black text-base-content/80 text-base">{log.user}</div>
                       <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">ID: {log.id}</div>
                    </td>
                    <td><span className="font-black text-base-content/70">{log.action}</span></td>
                    <td><span className="font-mono text-[11px] bg-base-content/5 px-2 py-1 rounded-md opacity-60">{log.target}</span></td>
                    <td><span className="text-[11px] opacity-40 font-mono tracking-tighter">{log.ip}</span></td>
                    <td><span className="text-[11px] opacity-50 whitespace-nowrap">{log.time}</span></td>
                    <td className="px-8 text-right">
                      <div className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] shadow-lg ${
                        log.status === 'Success' ? 'badge-success text-white shadow-success/10' :
                        log.status === 'Error' ? 'badge-error text-white shadow-error/10' :
                        'badge-warning text-white shadow-warning/10'
                      }`}>
                        {log.status}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="py-20 text-center opacity-30 font-black uppercase tracking-[0.3em] text-xs">No audit logs found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-base-content/5 text-center">
           <TablePagination />
        </div>
      </div>
    </div>
  );
}