import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Toast from "../../component/Toast";

const API_BASE = "http://127.0.0.1:5000";

export default function AddUsers() {
  const container = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "receptionist",
    license_number: "",
    username: "",
    email: "",
    phone: "",
    gender: "male",
    date_of_birth: "",
    address: "",
    password: "",
  });

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".form-section", { y: 20, opacity: 0, stagger: 0.15, duration: 0.8, delay: 0.2, ease: "power3.out" });
    },
    { scope: container }
  );

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/staff`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.success === false) throw new Error(json?.message || "User creation failed.");

      setToast({ message: "User created successfully!", type: "success" });
      setFormData({
        name: "", role: "receptionist", license_number: "", username: "",
        email: "", phone: "", gender: "male", date_of_birth: "", address: "", password: "",
      });
    } catch (error) {
      setToast({ message: error.message || "Unable to create user.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionHeader = ({ title, subtitle, icon, color }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className={`p-4 rounded-2xl bg-${color}/10 text-${color} shadow-lg shadow-${color}/5`}>
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-black tracking-tight">{title}</h2>
        <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-[0.2em]">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div ref={container} className="space-y-10 p-4 max-w-5xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header text-center mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-3">
          Onboard <span className="text-gradient">New Staff</span>
        </h1>
        <p className="text-base-content/50 font-medium">Create system accounts for medical and administrative personnel.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* --- SECTION 1: PERSONAL --- */}
        <div className="form-section glass-card p-10 rounded-[2.5rem] border border-base-content/5 relative overflow-hidden bg-base-100/40">
          <SectionHeader 
            title="Personal Details" 
            subtitle="Identification & Identity" 
            color="primary"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Full Legal Name</label>
              <input name="name" type="text" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold px-6" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Assigned Role</label>
              <select name="role" className="select select-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold px-6" value={formData.role} onChange={handleChange} required>
                <option value="receptionist">Receptionist</option>
                <option value="doctor">Doctor</option>
                <option value="radiologist">Radiologist</option>
                <option value="radiographer">Radiographer</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Gender</label>
              <select name="gender" className="select select-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold px-6" value={formData.gender} onChange={handleChange} required>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Date of Birth</label>
              <input name="date_of_birth" type="date" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold px-6" value={formData.date_of_birth} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* --- SECTION 2: ACCOUNT --- */}
        <div className="form-section glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40">
          <SectionHeader 
            title="Account Access" 
            subtitle="Security & Credentials" 
            color="secondary"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Login Username</label>
              <input name="username" type="text" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold px-6" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Temporary Password</label>
              <input name="password" type="password" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold px-6" value={formData.password} onChange={handleChange} minLength={6} required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Work Email Address</label>
              <input name="email" type="email" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold px-6" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* --- SECTION 3: PROFESSIONAL --- */}
        <div className="form-section glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40">
          <SectionHeader 
            title="Professional Credentials" 
            subtitle="Clinical Verification" 
            color="accent"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">License / Registration No</label>
              <input name="license_number" type="text" placeholder="Ex: SLMC-12345" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold px-6" value={formData.license_number} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Contact Number</label>
              <input name="phone" type="tel" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold px-6" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Home Address</label>
              <textarea name="address" className="textarea textarea-ghost w-full bg-base-content/5 rounded-2xl font-bold px-6 py-4 min-h-[120px]" value={formData.address} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button 
            type="submit" 
            className={`btn btn-primary rounded-[2rem] px-16 h-16 font-black shadow-2xl shadow-primary/30 text-lg tracking-tight ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "CREATE USER ACCOUNT"}
          </button>
        </div>
      </form>
    </div>
  );
}
