import React, { useState } from "react";
import PatientReportModal from "../../component/Patient/PatientReportModal";

export default function PatientReports() {
  const [selectedReportId, setSelectedReportId] = useState(null);

  const reports = [
    {
      id: "REQ-8821",
      date: "24 Oct 2023",
      type: "MRI - Brain",
      doctor: "Dr. Sarah Jenkins",
      status: "Ready",
      isCritical: true
    },
    {
      id: "REQ-7740",
      date: "10 Aug 2022",
      type: "MRI Scan - Brain",
      doctor: "Dr. Amal Perera",
      status: "Archived",
      isCritical: false
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Medical Reports</h1>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200">
                <tr>
                  <th>Date</th>
                  <th>Scan Type</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.date}</td>
                    <td className="font-bold">{report.type}</td>
                    <td>{report.doctor}</td>
                    <td>
                      {report.isCritical ? (
                        <span className="badge badge-warning gap-1">Action Required</span>
                      ) : (
                        <span className="badge badge-success text-white">Normal</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedReportId(report.id)}
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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