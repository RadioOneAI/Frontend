import React, { useMemo, useState } from "react";
import DoctorReportModal from "../../component/Doctor/DoctorReportModal";

export default function DoctorPatients() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data (later replace with API)
  const myPatients = [
    {
      id: "P001",
      name: "Kamal Gunawardena",
      age: 45,
      condition: "Headaches",
      scanDate: "2023-10-24",
      status: "Report Ready",
      urgency: "High",
    },
    {
      id: "P002",
      name: "Nimali Perera",
      age: 29,
      condition: "Routine Check",
      scanDate: "2023-10-22",
      status: "Report Ready",
      urgency: "Low",
    },
    {
      id: "P003",
      name: "Sunil Silva",
      age: 60,
      condition: "Vision Loss",
      scanDate: "2023-10-25",
      status: "Pending Scan",
      urgency: "Medium",
    },
  ];

  // ✅ Search filter
  const filteredPatients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return myPatients;

    return myPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q)
    );
  }, [searchTerm, myPatients]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">My Patients</h1>
        <p className="text-base-content/60">
          View AI reports and clinical findings
        </p>
      </div>

      {/* Search */}
      <input
        className="input input-bordered w-full max-w-2xl text-lg"
        placeholder="Search by Patient / ID / Condition..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto border border-base-300">
        <table className="table w-full text-sm">
          <thead>
            <tr>
              <th>Patient Details</th>
              <th>Condition</th>
              <th>Last Scan</th>
              <th>AI Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <tr key={p.id} className="hover">
                  <td>
                    <div className="font-bold">{p.name}</div>
                    <div className="text-xs opacity-60">
                      {p.age} yrs • ID: {p.id}
                    </div>
                  </td>

                  <td>{p.condition}</td>
                  <td>{p.scanDate}</td>

                  <td>
                    {p.status === "Report Ready" ? (
                      p.urgency === "High" ? (
                        <div className="badge badge-error text-white">
                          Critical Finding
                        </div>
                      ) : (
                        <div className="badge badge-info text-white">
                          Report Ready
                        </div>
                      )
                    ) : (
                      <div className="badge badge-ghost">
                        Pending Radiologist
                      </div>
                    )}
                  </td>

                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={p.status !== "Report Ready"}
                      onClick={() => setSelectedPatient(p)}
                    >
                      View Report
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
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Doctor Report Modal */}
      {selectedPatient && (
        <DoctorReportModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}
