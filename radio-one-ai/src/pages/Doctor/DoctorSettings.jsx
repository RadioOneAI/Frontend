import React, { useState } from "react";
import Toast from "../../component/Toast"; 

export default function DoctorSettings() {
  const [toast, setToast] = useState(null);
  
  // Mock Doctor Data
  const [formData, setFormData] = useState({
    name: "Dr. Sarah Jenkins",
    regNo: "SLMC-8901",
    spec: "Neurologist",
    phone: "077-123-4567",
    email: "sarah.j@cityhospital.com",
    hospital: "City Hospital, Colombo",
    alertCritical: true,
    alertReportReady: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Simple validation check
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setToast({ message: "New passwords do not match!", type: "error" });
        setTimeout(() => setToast(null), 3000);
        return;
    }

    // Simulate API update
    setToast({ message: "Settings saved successfully!", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-3xl font-bold">Doctor Profile & Settings</h1>
        <p className="text-base-content/70">Manage your professional details and system preferences.</p>
      </div>

      <form onSubmit={handleSave}>
        
        {/* --- PROFESSIONAL PROFILE --- */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-primary border-b border-base-200 pb-2 mb-4">Professional Information</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="avatar">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Doctor Profile" />
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-outline">Update Photo</button>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="form-control">
                  <label className="label"><span className="label-text">Full Name</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">SLMC Registration No</span></label>
                  <input type="text" value={formData.regNo} className="input input-bordered font-mono" disabled /> 
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Specialization</span></label>
                  <select name="spec" value={formData.spec} onChange={handleChange} className="select select-bordered">
                    <option>Neurologist</option>
                    <option>Oncologist</option>
                    <option>Cardiologist</option>
                    <option>General Physician</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Hospital / Clinic</span></label>
                  <input type="text" name="hospital" value={formData.hospital} onChange={handleChange} className="input input-bordered" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTACT INFO --- */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-secondary border-b border-base-200 pb-2 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Work Phone</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Email Address</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered" />
              </div>
            </div>
          </div>
        </div>

        {/* --- NOTIFICATIONS & PREFERENCES --- */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-accent border-b border-base-200 pb-2 mb-4">Notifications</h2>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input type="checkbox" name="alertCritical" checked={formData.alertCritical} onChange={handleChange} className="toggle toggle-error" />
                <span className="label-text font-medium">Email me immediately when <span className="text-error font-bold">Critical AI Findings</span> are detected</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input type="checkbox" name="alertReportReady" checked={formData.alertReportReady} onChange={handleChange} className="toggle toggle-success" />
                <span className="label-text font-medium">Notify me when a new patient report is ready for review</span>
              </label>
            </div>
          </div>
        </div>

        {/* --- SECURITY --- */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-neutral border-b border-base-200 pb-2 mb-4">Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              
              {/* Row 1: Current Password (Left) + Empty Spacer (Right) */}
              <div className="form-control">
                <label className="label"><span className="label-text">Current Password</span></label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  placeholder="********" 
                  className="input input-bordered w-full" 
                  onChange={handleChange}
                />
              </div>
              {/* Spacer div to push the next inputs to the next row on desktop */}
              <div className="hidden md:block"></div>

              {/* Row 2: New Password (Left) + Confirm Password (Right) */}
              <div className="form-control">
                <label className="label"><span className="label-text">New Password</span></label>
                <input 
                  type="password" 
                  name="newPassword" 
                  placeholder="Enter new password" 
                  className="input input-bordered w-full" 
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Confirm New Password</span></label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  placeholder="Re-enter new password" 
                  className="input input-bordered w-full" 
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex justify-end gap-4 pb-10">
          <button type="button" className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary px-8">Save Changes</button>
        </div>

      </form>
    </div>
  );
}