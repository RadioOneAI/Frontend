import React, { useMemo, useState } from "react";
import PatientReportModal from "../../component/Patient/PatientReportModal";

export default function PatientReports() {
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

  // ✅ Search filter
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">My Medical Reports</h1>
        <p className="text-base-content/60">
          View and download your radiology results
        </p>
      </div>

      {/* Search */}
      <input
        className="input input-bordered w-full max-w-2xl text-lg"
        placeholder="Search by Request ID / Scan / Doctor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Date</th>
                <th>Scan Type</th>
                <th>Doctor</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover">
                    <td>{report.date}</td>
                    <td className="font-semibold">{report.type}</td>
                    <td>{report.doctor}</td>

                    <td>
                      {report.isCritical ? (
                        <span className="badge badge-warning gap-1">
                          Action Required
                        </span>
                      ) : report.status === "Archived" ? (
                        <span className="badge badge-ghost">Archived</span>
                      ) : (
                        <span className="badge badge-success text-white">
                          Normal
                        </span>
                      )}
                    </td>

                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedReportId(report.id)}
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-base-content/50"
                  >
                    No reports found.
                  </td>
                </tr>
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
