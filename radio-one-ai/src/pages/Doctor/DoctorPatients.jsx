import React, { useState } from "react";
import DoctorReportModal from "../../component/DoctorReportModal";

export default function DoctorPatients() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Dummy data representing the Receptionist's entry + Radiologist's upload
  const myPatients = [
    { id: "P001", name: "Kamal Gunawardena", age: 45, condition: "Headaches", scanDate: "2023-10-24", status: "Report Ready", urgency: "High" },
    { id: "P002", name: "Nimali Perera", age: 29, condition: "Routine Check", scanDate: "2023-10-22", status: "Report Ready", urgency: "Low" },
    { id: "P003", name: "Sunil Silva", age: 60, condition: "Vision Loss", scanDate: "2023-10-25", status: "Pending Scan", urgency: "Medium" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Patients</h1>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full align-middle">
              <thead>
                <tr>
                  <th>Patient Details</th>
                  <th>Condition</th>
                  <th>Last Scan</th>
                  <th>AI Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myPatients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs opacity-50">{p.age} yrs • ID: {p.id}</div>
                    </td>
                    <td>{p.condition}</td>
                    <td>{p.scanDate}</td>
                    <td>
                      {p.status === "Report Ready" ? (
                         p.urgency === "High" ? 
                         <div className="badge badge-error gap-2 text-white">Critical Finding</div> :
                         <div className="badge badge-info gap-2 text-white">Ready</div>
                      ) : (
                         <div className="badge badge-ghost gap-2">Pending Radiologist</div>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary" 
                        disabled={p.status !== "Report Ready"}
                        onClick={() => setSelectedPatient(p)}
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* The Report Modal */}
      {selectedPatient && (
        <DoctorReportModal 
          patient={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}
    </div>
  );
}