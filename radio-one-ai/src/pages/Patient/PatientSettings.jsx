import React, { useState, useRef } from "react";
import Toast from "../../component/Toast"; 

export default function PatientSettings() {
  const [toast, setToast] = useState(null);
  
  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  // State for the profile image
  const [profileImage, setProfileImage] = useState("https://ui-avatars.com/api/?name=Kamal+G&background=random&size=128");
  
  // Mock User Data
  const [formData, setFormData] = useState({
    name: "Kamal Gunawardena",
    nic: "851234567V",
    age: "45",
    gender: "Male",
    phone: "077-111-2222",
    email: "kamal.g@gmail.com",
    address: "123, Galle Road, Colombo 03",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Handle Image Upload ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setToast({ message: "Photo updated successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // --- Trigger Hidden Input ---
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Password Validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setToast({ message: "New passwords do not match!", type: "error" });
        setTimeout(() => setToast(null), 3000);
        return;
    }

    // Simulate API update
    setToast({ message: "Profile updated successfully!", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-base-content/70">Manage your personal information and security.</p>
      </div>

      <form onSubmit={handleSave}>
        
        {/* --- PROFILE CARD --- */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-primary border-b border-base-200 pb-2 mb-4">Personal Details</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="avatar">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={profileImage} alt="Profile" />
                  </div>
                </div>
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />

                <button 
                  type="button" 
                  onClick={triggerFileInput} 
                  className="btn btn-sm btn-outline"
                >
                  Change Photo
                </button>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="form-control">
                  <label className="label"><span className="label-text">Full Name</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">NIC Number</span></label>
                  <input type="text" value={formData.nic} className="input input-bordered" disabled /> 
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Age</span></label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Gender</span></label>
                  <input type="text" value={formData.gender} className="input input-bordered" disabled />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTACT INFO CARD --- */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-secondary border-b border-base-200 pb-2 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Phone Number</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Email Address</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered" />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text">Home Address</span></label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="textarea textarea-bordered h-24"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECURITY CARD --- */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-error border-b border-base-200 pb-2 mb-4">Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              
              {/* Row 1: Current Password */}
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
              <div className="hidden md:block"></div> {/* Spacer */}

              {/* Row 2: New & Confirm Passwords */}
              <div className="form-control">
                <label className="label"><span className="label-text">New Password</span></label>
                <input 
                  type="password" 
                  name="newPassword" 
                  placeholder="Leave blank to keep same" 
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

        {/* --- ACTION BUTTONS --- */}
        <div className="flex justify-end gap-4 pb-10">
          <button type="button" className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary px-8">Save Changes</button>
        </div>

      </form>
    </div>
  );
}