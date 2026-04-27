import React, { useState, useRef } from "react";
import Toast from "../../component/Toast"; 
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function DoctorSettings() {
  const container = useRef();
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
    alertReportReady: true
  });

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".settings-card", { y: 20, opacity: 0, stagger: 0.15, duration: 0.8, delay: 0.2, ease: "power3.out" });
    },
    { scope: container }
  );

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setToast({ message: "Clinical identity saved successfully.", type: "success" });
  };

  return (
    <div ref={container} className="space-y-8 p-4 max-w-6xl mx-auto pb-20">
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* --- HEADER --- */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Clinical <span className="text-gradient">Identity</span>
          </h1>
          <p className="text-base-content/50 font-medium italic">Configure your professional profile and diagnostic alerts.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- PROFESSIONAL PROFILE --- */}
        <div className="settings-card glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40 shadow-xl shadow-base-content/5 lg:col-span-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
            Professional Information
            <span className="flex-1 h-px bg-primary/10" />
          </h2>
          
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex flex-col items-center gap-6 justify-center">
               <div className="w-40 h-40 rounded-[3rem] border-[6px] border-white shadow-2xl bg-indigo-50 flex items-center justify-center overflow-hidden">
                 <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Doctor Profile" className="w-full h-full object-cover" />
               </div>
               <button type="button" className="btn btn-ghost btn-sm font-black text-[10px] uppercase tracking-widest bg-base-content/5 rounded-xl">UPDATE ID PHOTO</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="form-control">
                <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Attending Name</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
              </div>
              <div className="form-control">
                <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">SLMC Registration No</span></label>
                <input type="text" value={formData.regNo} className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14 font-mono text-primary opacity-70" disabled /> 
              </div>
              <div className="form-control">
                <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Clinical Specialization</span></label>
                <select name="spec" value={formData.spec} onChange={handleChange} className="select select-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14">
                  <option>Neurologist</option>
                  <option>Oncologist</option>
                  <option>Cardiologist</option>
                  <option>General Physician</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Hospital / Clinic Network</span></label>
                <input type="text" name="hospital" value={formData.hospital} onChange={handleChange} className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTACT INFO --- */}
        <div className="settings-card glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40 shadow-xl shadow-base-content/5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-8 flex items-center gap-3">
            Communication Channels
            <span className="flex-1 h-px bg-secondary/10" />
          </h2>
          <div className="space-y-6">
            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Direct Work Phone</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>
            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Clinical Email Address</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>
          </div>
        </div>

        {/* --- SECURITY --- */}
        <div className="settings-card glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40 shadow-xl shadow-base-content/5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral mb-8 flex items-center gap-3">
            Access Protocols
            <span className="flex-1 h-px bg-neutral/10" />
          </h2>
          <div className="space-y-6">
            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Current Access Key</span></label>
              <input type="password" placeholder="••••••••" className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>
            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">New Access Key</span></label>
              <input type="password" placeholder="Leave blank to keep current" className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>
          </div>
        </div>

        {/* --- NOTIFICATIONS & PREFERENCES --- */}
        <div className="settings-card glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40 shadow-xl shadow-base-content/5 lg:col-span-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-8 flex items-center gap-3">
            Diagnostic Notifications
            <span className="flex-1 h-px bg-accent/10" />
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
             <div className="flex items-center justify-between p-6 bg-error/5 rounded-2xl border border-error/10">
                <div>
                  <p className="font-black text-sm text-error">Critical AI Findings</p>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest text-error">Immediate email alerts</p>
                </div>
                <input type="checkbox" name="alertCritical" checked={formData.alertCritical} onChange={handleChange} className="toggle toggle-error toggle-lg" />
              </div>

              <div className="flex items-center justify-between p-6 bg-success/5 rounded-2xl border border-success/10">
                <div>
                  <p className="font-black text-sm text-success">Report Ready Alerts</p>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest text-success">Notify on radiologist finalize</p>
                </div>
                <input type="checkbox" name="alertReportReady" checked={formData.alertReportReady} onChange={handleChange} className="toggle toggle-success toggle-lg" />
              </div>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="settings-card lg:col-span-2 flex justify-end gap-4 pt-6">
          <button type="button" className="btn btn-ghost h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-xs">CANCEL</button>
          <button type="submit" className="btn btn-primary h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/30 border-none text-xs">UPDATE CLINICAL PROFILE</button>
        </div>

      </form>
    </div>
  );
}