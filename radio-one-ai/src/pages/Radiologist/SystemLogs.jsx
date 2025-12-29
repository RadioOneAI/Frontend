import React, { useState } from "react";
import TablePagination from "../../component/Receptionist/TablePagination";
import ExportButton from "../../component/Receptionist/ExportButton";

export default function SystemLogs() {
  // 1. Dummy Log Data
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

  // 2. Filter Logic
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    if (status === "Success") return <div className="badge badge-success badge-sm text-white">Success</div>;
    if (status === "Error") return <div className="badge badge-error badge-sm text-white">Error</div>;
    if (status === "Warning") return <div className="badge badge-warning badge-sm">Warning</div>;
    return <div className="badge badge-ghost badge-sm">{status}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">System Audit Logs</h1>
          <p className="text-base-content/70">Track system activities and security events.</p>
        </div>
        <ExportButton onExport={() => alert("Downloading logs...")} label="Download Logs" />
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col sm:flex-row gap-4 bg-base-100 p-4 rounded-xl shadow-sm">
        <div className="form-control flex-1">
          <input 
            type="text" 
            placeholder="Search User or Action..." 
            className="input input-bordered w-full" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-control w-full sm:w-auto">
          <select 
            className="select select-bordered w-full" 
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
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full align-middle">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Target Entity</th>
              <th>IP Address</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover">
                  <td className="font-bold text-xs">{log.user}</td>
                  <td>{log.action}</td>
                  <td className="font-mono text-xs">{log.target}</td>
                  <td className="text-xs opacity-70">{log.ip}</td>
                  <td className="text-xs whitespace-nowrap">{log.time}</td>
                  <td>{getStatusBadge(log.status)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center py-4 text-base-content/50">No logs found.</td></tr>
            )}
          </tbody>
        </table>
        <TablePagination />
      </div>
    </div>
  );
}