import React from "react";

export default function UserProfile() {
  // Dummy user data
  const user = {
    firstName: "Shakya",
    lastName: "Pinnawala",
    email: "shakya@example.com",
    role: "Radiologist",
    hospital: "City General Hospital",
    avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user.avatar} alt="Profile" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-base-content/70">{user.role} at {user.hospital}</p>
              <div className="mt-2 flex gap-2 justify-center sm:justify-start">
                <span className="badge badge-primary">Pro Member</span>
                <span className="badge badge-ghost">Verified</span>
              </div>
            </div>
            <div className="sm:ml-auto">
              <button className="btn btn-outline btn-sm">Edit Profile</button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Personal Info */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs uppercase font-bold opacity-50">Email</label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold opacity-50">Phone</label>
                  <p className="font-medium">+94 77 123 4567</p>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold opacity-50">Address</label>
                  <p className="font-medium">123 Main St, Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats / Actions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Statistics</h2>
              
              <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200">
                <div className="stat">
                  <div className="stat-title">Scans</div>
                  <div className="stat-value text-primary">256</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Reports</div>
                  <div className="stat-value text-secondary">180</div>
                </div>
              </div>

              <div className="divider"></div>
              
              <div className="card-actions justify-end mt-auto">
                <button className="btn btn-error btn-outline btn-sm">Log Out</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}