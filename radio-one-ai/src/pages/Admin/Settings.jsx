import React from "react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>
      <p className="text-base-content/70">Manage your account details and system-wide configurations.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* --- 1. ADMIN PROFILE SETTINGS --- */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Admin Profile
            </h2>
            <div className="divider my-0"></div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input type="text" placeholder="Admin Name" defaultValue="System Administrator" className="input input-bordered w-full" />
            </div>

            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input type="email" placeholder="admin@radioone.com" defaultValue="admin@radioone.com" className="input input-bordered w-full" />
            </div>

            <div className="card-actions justify-end mt-6">
              <button className="btn btn-primary btn-sm">Update Profile</button>
            </div>
          </div>
        </div>

        {/* --- 2. SECURITY SETTINGS --- */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Security
            </h2>
            <div className="divider my-0"></div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input type="password" placeholder="New Password" className="input input-bordered w-full" />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Confirm</span>
                </label>
                <input type="password" placeholder="Confirm" className="input input-bordered w-full" />
              </div>
            </div>

            <div className="card-actions justify-end mt-6">
              <button className="btn btn-error btn-outline btn-sm">Change Password</button>
            </div>
          </div>
        </div>

        {/* --- 3. AI CONFIGURATION (Domain Specific) --- */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              AI Model Parameters
            </h2>
            <div className="divider my-0"></div>
            
            <p className="text-sm text-base-content/70">Adjust sensitivity for tumor detection models.</p>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text font-bold">Detection Confidence Threshold</span>
                <span className="label-text-alt">85%</span>
              </label>
              <input type="range" min="0" max="100" defaultValue="85" className="range range-secondary range-xs" />
              <div className="w-full flex justify-between text-xs px-2 mt-2">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            <div className="form-control mt-4">
              <label className="label cursor-pointer justify-start gap-4">
                <input type="checkbox" className="toggle toggle-secondary" defaultChecked />
                <span className="label-text">Enable Auto-Segmentation</span>
              </label>
            </div>

            <div className="card-actions justify-end mt-4">
              <button className="btn btn-secondary btn-sm">Save Config</button>
            </div>
          </div>
        </div>

        {/* --- 4. SYSTEM PREFERENCES --- */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Notifications & Logs
            </h2>
            <div className="divider my-0"></div>

            <div className="form-control">
              <label className="label cursor-pointer justify-between">
                <span className="label-text">Email Alert on New Registration</span>
                <input type="checkbox" className="toggle toggle-accent" defaultChecked />
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-between">
                <span className="label-text">System Error Reports</span>
                <input type="checkbox" className="toggle toggle-accent" defaultChecked />
              </label>
            </div>

            <div className="divider"></div>

            <div className="card-actions justify-between items-center">
              <span className="text-xs opacity-50">Last Backup: Today, 10:00 AM</span>
              <button className="btn btn-outline btn-accent btn-sm">Download Logs</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}