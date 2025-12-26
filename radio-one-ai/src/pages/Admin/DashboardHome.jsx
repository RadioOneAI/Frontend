import React from "react";
import { Link } from "react-router-dom";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-base-content/70">Welcome back, Admin. Here is today's system summary.</p>
        </div>
        <div className="text-sm font-mono opacity-50">
          Last updated: Today, 10:45 AM
        </div>
      </div>

      {/* --- STATS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Doctors Stat */}
        <div className="stat bg-base-100 shadow-md rounded-2xl border-l-4 border-primary">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div className="stat-title">Total Doctors</div>
          <div className="stat-value">24</div>
          <div className="stat-desc text-success">↗︎ 2 added this month</div>
        </div>
        
        {/* Radiologists Stat */}
        <div className="stat bg-base-100 shadow-md rounded-2xl border-l-4 border-secondary">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div className="stat-title">Radiologists</div>
          <div className="stat-value">8</div>
          <div className="stat-desc text-secondary">All systems active</div>
        </div>

        {/* Patients Stat (NEW) */}
        <div className="stat bg-base-100 shadow-md rounded-2xl border-l-4 border-accent">
          <div className="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <div className="stat-title">Total Patients</div>
          <div className="stat-value">1,250</div>
          <div className="stat-desc text-accent">↗︎ 15 new registrations</div>
        </div>
        
        {/* Scans Processed Stat */}
        <div className="stat bg-base-100 shadow-md rounded-2xl border-l-4 border-info">
          <div className="stat-figure text-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <div className="stat-title">AI Scans</div>
          <div className="stat-value">3.4K</div>
          <div className="stat-desc">Server Load: 45%</div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN: RECENT ACTIVITY --- */}
        <div className="lg:col-span-2 card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-between">
              Recent System Activity
              <button className="btn btn-xs btn-ghost">View Log</button>
            </h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>User / Event</th>
                    <th>Action Details</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-bold">System AI</td>
                    <td>Batch processing completed (MRI-Brain)</td>
                    <td>Just now</td>
                    <td><span className="badge badge-success badge-sm">Success</span></td>
                  </tr>
                  <tr>
                    <td>Dr. Sarah Jenkins</td>
                    <td>Verified Report #RP-8821</td>
                    <td>15 mins ago</td>
                    <td><span className="badge badge-info badge-sm">Logged</span></td>
                  </tr>
                  <tr>
                    <td>Patient: Kamal G.</td>
                    <td>New Account Registration</td>
                    <td>1 hour ago</td>
                    <td><span className="badge badge-warning badge-sm">Pending</span></td>
                  </tr>
                  <tr>
                    <td>Radiologist Mike</td>
                    <td>Uploaded Scan Request #SR-992</td>
                    <td>2 hours ago</td>
                    <td><span className="badge badge-success badge-sm">Processed</span></td>
                  </tr>
                  <tr>
                    <td className="text-error">System Alert</td>
                    <td>Failed Login Attempt (IP: 192.168...)</td>
                    <td>5 hours ago</td>
                    <td><span className="badge badge-error badge-sm">Blocked</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: QUICK ACTIONS & HEALTH --- */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link to="/admin/doctors" className="btn btn-outline btn-primary btn-sm h-auto py-3 flex flex-col gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>
                  Add Doctor
                </Link>
                <Link to="/admin/radiologists" className="btn btn-outline btn-secondary btn-sm h-auto py-3 flex flex-col gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                  Add Radio..
                </Link>
                <Link to="/admin/patients" className="btn btn-outline btn-accent btn-sm h-auto py-3 flex flex-col gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
                  New Patient
                </Link>
                <Link to="/admin/settings" className="btn btn-outline btn-neutral btn-sm h-auto py-3 flex flex-col gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                  System Logs
                </Link>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm opacity-70">Server & AI Health</h2>
              
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>AI Model Latency</span>
                  <span className="text-success">24ms (Good)</span>
                </div>
                <progress className="progress progress-success w-full" value="20" max="100"></progress>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Storage Usage (MRI Scans)</span>
                  <span className="text-warning">78%</span>
                </div>
                <progress className="progress progress-warning w-full" value="78" max="100"></progress>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Database Load</span>
                  <span className="text-info">45%</span>
                </div>
                <progress className="progress progress-info w-full" value="45" max="100"></progress>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}