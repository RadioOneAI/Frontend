import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SystemLogs() {
  const container = useRef();
  
  const [logs] = useState([
    { id: 101, user: "Admin (You)", action: "Deleted Doctor Account", target: "Dr. Ravi De Silva", ip: "192.168.1.1", time: "2 mins ago", status: "Success" },
    { id: 102, user: "Dr. Sarah Jenkins", action: "Updated Patient Record", target: "Kamal Gunawardena", ip: "172.16.0.4", time: "15 mins ago", status: "Success" },
    { id: 103, user: "System", action: "Failed Login Attempt", target: "Unknown User", ip: "45.33.22.11", time: "1 hour ago", status: "Error" },
    { id: 104, user: "Radiologist Mike", action: "Uploaded MRI Scan", target: "Sita Kumari", ip: "192.168.1.5", time: "2 hours ago", status: "Success" },
    { id: 105, user: "Admin (You)", action: "Exported Patient List", target: "System", ip: "192.168.1.1", time: "5 hours ago", status: "Warning" },
    { id: 106, user: "System", action: "Database Backup", target: "Daily Backup", ip: "Localhost", time: "Yesterday", status: "Success" },
  ]);

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".filter-card", { y: -10, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.from(".table-card", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: container }
  );

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Success: "badge-success text-white shadow-lg shadow-success/20",
      Error: "badge-error text-white shadow-lg shadow-error/20",
      Warning: "badge-warning text-white shadow-lg shadow-warning/20",
    };
    return (
      <div className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] ${styles[status] || "badge-ghost"}`}>
        {status}
      </div>
    );
  };

  return (
    <div ref={container} className="space-y-8 p-4">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            System <span className="text-gradient">Audit Logs</span>
          </h1>
          <p className="text-base-content/50 font-medium">Track all system activities and security events in real-time.</p>
        </div>
        <button className="btn btn-primary rounded-2xl font-black px-8 shadow-xl shadow-primary/20">
          EXPORT LOGS
        </button>
      </div>

      {/* --- FILTERS --- */}
      <div className="filter-card glass-card p-4 rounded-3xl border border-base-content/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 relative">
          <input 
            type="text" 
            placeholder="Search by User or Action..." 
            className="input input-ghost w-full focus:bg-transparent text-lg font-medium pl-12 h-14" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="md:col-span-4">
          <select 
            className="select select-ghost w-full h-14 rounded-2xl font-bold bg-base-content/5 border-none" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Events</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Error">Error / Security</option>
          </select>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="table-card glass-card rounded-[2.5rem] border border-base-content/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr className="text-base-content/40 uppercase tracking-widest text-[10px] font-black border-b border-base-content/5">
                <th className="py-6 px-8 text-left">User Identity</th>
                <th className="py-6 text-left">Action Performed</th>
                <th className="py-6">Target Entity</th>
                <th className="py-6">Network IP</th>
                <th className="py-6">Timestamp</th>
                <th className="py-6 px-8 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="font-medium text-sm">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-base-200/30 transition-colors group">
                    <td className="py-5 px-8 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-black text-xs text-primary border border-primary/10">
                          {log.user.charAt(0)}
                        </div>
                        <span className="font-black text-base-content/80">{log.user}</span>
                      </div>
                    </td>
                    <td className="text-left">
                      <span className="font-bold text-base-content/60">{log.action}</span>
                    </td>
                    <td>
                      <span className="font-mono font-black text-xs bg-base-content/5 px-3 py-1.5 rounded-lg border border-base-content/5">
                        {log.target}
                      </span>
                    </td>
                    <td>
                      <span className="text-[11px] font-black opacity-30 tracking-widest">{log.ip}</span>
                    </td>
                    <td>
                      <div className="flex flex-col items-center">
                        <span className="font-black">{log.time}</span>
                      </div>
                    </td>
                    <td className="px-8 text-right">{getStatusBadge(log.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center opacity-30 font-black uppercase tracking-[0.3em] text-xs">
                    No system records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-base-content/5 bg-base-content/[0.02] flex justify-center">
          <div className="join bg-base-100/50 p-1 rounded-2xl border border-base-content/5">
            <button className="join-item btn btn-ghost btn-sm rounded-xl font-bold">PREV</button>
            <button className="join-item btn btn-primary btn-sm rounded-xl font-black">1</button>
            <button className="join-item btn btn-ghost btn-sm rounded-xl font-bold">2</button>
            <button className="join-item btn btn-ghost btn-sm rounded-xl font-bold">NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
}