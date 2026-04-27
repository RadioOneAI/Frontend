import React, { useState, useRef } from "react";
import Toast from "../../component/Toast";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function PatientSettings() {
  const container = useRef();
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "Kamal Gunawardena",
    nic: "851234567V",
    age: "45",
    gender: "Male",
    phone: "077-111-2222",
    email: "kamal.g@gmail.com",
    address: "123, Galle Road, Colombo 03",
    currentPassword: "",
    newPassword: ""
  });

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".settings-card", { y: 20, opacity: 0, stagger: 0.15, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.from(".save-btn", { scale: 0.9, opacity: 0, duration: 0.6, delay: 0.8, ease: "back.out(1.7)" });
    },
    { scope: container }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setToast({ message: "Profile intelligence updated successfully!", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div ref={container} className="space-y-8 p-4 max-w-5xl mx-auto pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Account <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="text-base-content/50 font-medium italic">Manage your personal profile, contact data, and clinical security.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* --- PERSONAL DETAILS --- */}
        <div className="settings-card glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40 shadow-xl shadow-base-content/5">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Avatar Console */}
            <div className="flex flex-col items-center gap-6">
               <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-0 group-hover:scale-125 transition-transform duration-700" />
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-[2rem] ring-4 ring-primary/10 ring-offset-4 ring-offset-base-100 shadow-2xl overflow-hidden relative z-10">
                      <img src="https://ui-avatars.com/api/?name=Kamal+G&background=random&size=128" alt="Profile" />
                    </div>
                  </div>
               </div>
               <button type="button" className="btn btn-ghost btn-xs h-10 rounded-xl font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:bg-primary/5 transition-all">Update Photo</button>
            </div>

            {/* Fields Grid */}
            <div className="flex-1 space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-3">
                Core Identity Information
                <span className="flex-1 h-px bg-primary/10" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Name</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">NIC Number</span></label>
                  <input type="text" value={formData.nic} className="input input-ghost font-bold text-lg bg-base-content/5 rounded-2xl h-14 italic opacity-50" disabled />
                </div>
                <div className="form-control">
                  <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Age Group</span></label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Gender Identity</span></label>
                  <input type="text" value={formData.gender} className="input input-ghost font-bold text-lg bg-base-content/5 rounded-2xl h-14 italic opacity-50" disabled />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTACT INFORMATION --- */}
        <div className="settings-card glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40 shadow-xl shadow-base-content/5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-8 flex items-center gap-3">
            Clinical Communication Data
            <span className="flex-1 h-px bg-secondary/10" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Mobile Phone</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>
            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Email Address</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>
            <div className="form-control md:col-span-2">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Home Residence</span></label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="textarea textarea-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl min-h-[120px] p-4"></textarea>
            </div>
          </div>
        </div>

        {/* --- SECURITY --- */}
        <div className="settings-card glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40 shadow-xl shadow-base-content/5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-error mb-8 flex items-center gap-3">
            System Security Protocol
            <span className="flex-1 h-px bg-error/10" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Current Password</span></label>
              <input type="password" placeholder="••••••••" className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>
            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">New Intelligence Key</span></label>
              <input type="password" placeholder="Leave blank to maintain" className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="save-btn flex justify-end items-center gap-6">
          <button type="button" className="text-xs font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Reset Changes</button>
          <button type="submit" className="btn btn-primary h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 border-none text-xs">
            Save Intelligence
          </button>
        </div>

      </form>
    </div>
  );
}