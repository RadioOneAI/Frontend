import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import RadioSynth from "../../component/Radiographer/researchFrontend/components/RadioSynth";

export default function Settings() {
  const container = useRef();
  const [showRadioSynth, setShowRadioSynth] = useState(false);
  const sectionColorClasses = {
    primary: "bg-primary/10 text-primary shadow-primary/5",
    secondary: "bg-secondary/10 text-secondary shadow-secondary/5",
    info: "bg-info/10 text-info shadow-info/5",
  };

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".settings-section", { y: 20, opacity: 0, stagger: 0.2, duration: 0.8, delay: 0.3, ease: "power3.out" });
    },
    { scope: container }
  );

  const SectionHeader = ({ title, subtitle, icon, color }) => (
    <div className="flex items-center gap-4 mb-8">
      <div
        className={`p-4 rounded-[2rem] shadow-lg ${
          sectionColorClasses[color] || sectionColorClasses.primary
        }`}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
        <p className="text-sm text-base-content/40 font-bold uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div ref={container} className="space-y-12 p-4">
      <div className="page-header">
        <h1 className="text-4xl font-black tracking-tight mb-2">
          System <span className="text-gradient">Settings</span>
        </h1>

        <button
          type="button"
          className="btn btn-ghost btn-sm rounded-lg font-black text-primary hover:bg-primary/10 border border-primary/20 hover:border-primary/40 mb-3"
          onClick={() => setShowRadioSynth((prev) => !prev)}
        >
          {showRadioSynth ? "Hide Synthetic Generatio" : "Open Synthetic Generation"}
        </button>

        <p className="text-base-content/50 font-medium">Manage your personal profile and global system configurations.</p>
      </div>

      {showRadioSynth && (
        <div className="settings-section glass-card p-6 rounded-[2rem] border border-base-content/10">
          <RadioSynth />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        
        {/* --- 1. PROFILE SECTION --- */}
        <div className="settings-section glass-card p-10 rounded-[2.5rem] border border-base-content/5 relative overflow-hidden">
          <SectionHeader 
            title="Profile Details" 
            subtitle="Personal Identity" 
            color="primary"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Full Legal Name</label>
              <input type="text" defaultValue="John Doe" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold focus:bg-base-content/10 transition-all px-6" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Email Address</label>
              <input type="email" defaultValue="john.doe@radioone.ai" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold focus:bg-base-content/10 transition-all px-6" />
            </div>
            <div className="flex justify-end pt-4">
              <button className="btn btn-primary rounded-2xl px-10 font-black shadow-xl shadow-primary/20">SAVE CHANGES</button>
            </div>
          </div>
        </div>

        {/* --- 2. SECURITY SECTION --- */}
        <div className="settings-section glass-card p-10 rounded-[2.5rem] border border-base-content/5">
          <SectionHeader 
            title="Security Center" 
            subtitle="Access & Protection" 
            color="secondary"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
          />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Current Password</label>
              <input type="password" placeholder="********" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold focus:bg-base-content/10 transition-all px-6" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">New Password</label>
                <input type="password" placeholder="Enter new" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold focus:bg-base-content/10 transition-all px-6" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-4">Confirm New</label>
                <input type="password" placeholder="Confirm" className="input input-ghost w-full bg-base-content/5 rounded-2xl h-14 font-bold focus:bg-base-content/10 transition-all px-6" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button className="btn btn-secondary rounded-2xl px-10 font-black shadow-xl shadow-secondary/20 uppercase tracking-tight">Update Password</button>
            </div>
          </div>
        </div>

        {/* --- 3. SYSTEM CONFIGURATION --- */}
        <div className="settings-section glass-card p-10 rounded-[2.5rem] border border-base-content/5 xl:col-span-2">
          <SectionHeader 
            title="System Preferences" 
            subtitle="Global Configuration" 
            color="info"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-8">
            {[
              { label: "Real-time AI Notifications", desc: "Get alerts when AI scans complete processing", checked: true },
              { label: "Automated Data Backup", desc: "System-wide database backup every 24 hours", checked: true },
              { label: "Email Audit Reports", desc: "Receive weekly PDF summaries of all system logs", checked: false },
              { label: "Dark Mode Interface", desc: "Enable low-light optimized UI by default", checked: true }
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-base-content/5 border border-base-content/5 hover:bg-base-content/10 transition-all cursor-pointer group">
                <div className="pr-4">
                  <p className="font-black text-base tracking-tight mb-1">{pref.label}</p>
                  <p className="text-[11px] font-bold opacity-40 uppercase tracking-widest leading-relaxed">{pref.desc}</p>
                </div>
                <input type="checkbox" className="toggle toggle-primary scale-125" defaultChecked={pref.checked} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
