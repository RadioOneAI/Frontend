import React from "react";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      <div className="hero bg-base-100 rounded-2xl shadow-xl p-8">
        <div className="hero-content flex-col lg:flex-row-reverse justify-between w-full">
          <div className="text-center lg:text-left max-w-lg">
            <h1 className="text-4xl font-bold">Hello, Kamal!</h1>
            <p className="py-6 text-lg opacity-80">
              Your latest MRI scan results from Oct 24, 2023 are ready for review. 
              Dr. Jenkins has updated your file.
            </p>
            <Link to="/patient/reports" className="btn btn-primary">View My Results</Link>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8">Recent Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Latest Report Card */}
        <div className="card bg-base-100 shadow-md border-l-4 border-warning">
          <div className="card-body">
            <h3 className="card-title text-base">New Report Available</h3>
            <p className="text-sm opacity-60">MRI Brain Scan • Dr. Sarah Jenkins</p>
            <div className="card-actions justify-end mt-2">
              <Link to="/patient/reports" className="btn btn-sm btn-ghost">Open</Link>
            </div>
          </div>
        </div>

        {/* Appointment Card */}
        <div className="card bg-base-100 shadow-md border-l-4 border-info">
          <div className="card-body">
            <h3 className="card-title text-base">Upcoming Appointment</h3>
            <p className="text-sm opacity-60">You have no upcoming appointments.</p>
            <div className="card-actions justify-end mt-2">
              <button className="btn btn-sm btn-ghost">Schedule Now</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}