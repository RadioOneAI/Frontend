import React from "react";
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
      <p className="opacity-60">Welcome back, Dr. Jenkins.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 shadow rounded-2xl">
          <div className="stat-title">Patients Today</div>
          <div className="stat-value text-primary">12</div>
          <div className="stat-desc">4 New scans received</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-2xl">
          <div className="stat-title">Critical Findings</div>
          <div className="stat-value text-error">2</div>
          <div className="stat-desc">Requiring immediate attention</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-2xl">
          <div className="stat-title">Total Active Patients</div>
          <div className="stat-value">48</div>
        </div>
      </div>

      {/* Quick Actions / Recent Scans */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
             <h2 className="card-title">Recent Scan Results</h2>
             <Link to="/doctor/patients" className="btn btn-sm btn-outline">View All Patients</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Test Type</th>
                  <th>Scan Date</th>
                  <th>AI Finding (Preview)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover">
                  <td>
                    <div className="font-bold">Kamal Gunawardena</div>
                    <div className="text-xs opacity-50">Ref: #REQ-8821</div>
                  </td>
                  <td>MRI - Brain</td>
                  <td>Oct 24, 2023</td>
                  <td><span className="text-error font-bold">Tumor Detected</span> (2.4cm)</td>
                  <td><span className="badge badge-warning">Review Needed</span></td>
                </tr>
                <tr className="hover">
                  <td>
                    <div className="font-bold">Sita Kumari</div>
                    <div className="text-xs opacity-50">Ref: #REQ-8822</div>
                  </td>
                  <td>MRI - Spine</td>
                  <td>Oct 23, 2023</td>
                  <td><span className="text-success font-bold">Normal</span></td>
                  <td><span className="badge badge-success">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}