import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardCharts from "../../component/DashboardCharts"; 
import DoctorReportModal from "../../component/Doctor/DoctorReportModal"; // Import the modal

export default function DoctorDashboard() {
  // State to manage the open report modal
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header with Settings Button */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-base-content/70">Welcome back, Dr. Jenkins. Here is your clinical overview.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="text-sm font-mono opacity-50 hidden md:block">
              {new Date().toLocaleDateString()}
             </div>
             {/* SETTINGS BUTTON */}
             <Link to="/doctor/settings" className="btn btn-sm btn-outline">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 Settings
             </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 shadow rounded-2xl border-l-4 border-primary">
          <div className="stat-title">Patients Today</div>
          <div className="stat-value text-primary">12</div>
          <div className="stat-desc">4 New scans received</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-2xl border-l-4 border-error">
          <div className="stat-title">Critical Findings</div>
          <div className="stat-value text-error">2</div>
          <div className="stat-desc">Action Required</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-2xl border-l-4 border-accent">
          <div className="stat-title">Active Patients</div>
          <div className="stat-value text-accent">48</div>
          <div className="stat-desc">In treatment cycle</div>
        </div>
      </div>

      {/* AI Processed Scans Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
             <h2 className="card-title">Pending Review (AI Processed)</h2>
             <Link to="/doctor/patients" className="btn btn-sm btn-ghost">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Scan Info</th>
                  <th>AI Output (Doctor View)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                
                {/* Row 1: Critical Finding (Kamal - P001) */}
                <tr className="hover cursor-pointer" onClick={() => setSelectedPatient({ id: "P001", name: "Kamal Gunawardena" })}>
                  <td>
                    <div className="font-bold">Kamal Gunawardena</div>
                    <div className="text-xs opacity-50">Ref: #REQ-8821</div>
                  </td>
                  <td>MRI - Brain <br/><span className="text-[10px] opacity-60">24 Oct 2023</span></td>
                  <td>
                    <span className="text-error font-bold">Meningioma Detected</span><br/>
                    <span className="text-xs">Size: 2.4cm x 1.8cm | Loc: Left Frontal</span>
                  </td>
                  <td>
                    {/* Button triggers modal via parent row onClick or direct click */}
                    <button 
                        className="btn btn-xs btn-primary"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent double trigger
                            setSelectedPatient({ id: "P001", name: "Kamal Gunawardena" });
                        }}
                    >
                        Review Now
                    </button>
                  </td>
                </tr>

                {/* Row 2: Normal Finding (Nimali - P002) */}
                <tr className="hover cursor-pointer" onClick={() => setSelectedPatient({ id: "P002", name: "Nimali Perera" })}>
                  <td>
                    <div className="font-bold">Nimali Perera</div>
                    <div className="text-xs opacity-50">Ref: #REQ-8822</div>
                  </td>
                  <td>MRI - Spine <br/><span className="text-[10px] opacity-60">23 Oct 2023</span></td>
                  <td>
                    <span className="text-success font-bold">No Abnormalities</span><br/>
                    <span className="text-xs">Normal spinal alignment.</span>
                  </td>
                  <td>
                    <button 
                        className="btn btn-xs btn-outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient({ id: "P002", name: "Nimali Perera" });
                        }}
                    >
                        Details
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Charts Component Reused */}
      <DashboardCharts />

      {/* RENDER THE MODAL IF A PATIENT IS SELECTED */}
      {selectedPatient && (
        <DoctorReportModal 
          patient={selectedPatient} 
          onClose={() => setSelectedPatient(null)} 
        />
      )}

    </div>
  );
}