import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Settings() {
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".settings-card", { y: 20, opacity: 0, stagger: 0.15, duration: 0.8, delay: 0.2, ease: "power3.out" });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="space-y-8 p-4 max-w-6xl mx-auto pb-20">
      
      {/* --- HEADER --- */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            System <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="text-base-content/50 font-medium italic">Configure your clinical identity and coordination protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- PROFILE SETTINGS --- */}
        <div className="settings-card glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40 shadow-xl shadow-base-content/5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
            Receptionist Identity
            <span className="flex-1 h-px bg-primary/10" />
          </h2>
          
          <div className="flex flex-col gap-6">
            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Professional Name</span></label>
              <input type="text" defaultValue="Receptionist Account" className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>

            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Clinical Email Handle</span></label>
              <input type="email" defaultValue="receptionist@radioone.ai" className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>

            <div className="pt-4">
              <button className="btn btn-primary w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-none shadow-lg shadow-primary/20">Update Profile</button>
            </div>
          </div>
        </div>

        {/* --- SECURITY SETTINGS --- */}
        <div className="settings-card glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40 shadow-xl shadow-base-content/5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-error mb-8 flex items-center gap-3">
            Access Protocols
            <span className="flex-1 h-px bg-error/10" />
          </h2>

          <div className="space-y-6">
            <div className="form-control">
              <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Current Password</span></label>
              <input type="password" placeholder="••••••••" className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">New Key</span></label>
                <input type="password" placeholder="••••••••" className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
              </div>
              <div className="form-control">
                <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Confirm</span></label>
                <input type="password" placeholder="••••••••" className="input input-ghost font-bold text-lg bg-base-content/5 focus:bg-base-content/10 rounded-2xl h-14" />
              </div>
            </div>

            <div className="pt-4">
              <button className="btn btn-outline btn-error w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2">Change Password</button>
            </div>
          </div>
        </div>

        {/* --- NOTIFICATIONS --- */}
        <div className="settings-card glass-card p-10 rounded-[2.5rem] border border-base-content/5 bg-base-100/40 shadow-xl shadow-base-content/5 lg:col-span-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-8 flex items-center gap-3">
            Coordination Notifications
            <span className="flex-1 h-px bg-secondary/10" />
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-base-content/5 rounded-2xl border border-base-content/5">
                <div>
                  <p className="font-black text-sm text-base-content/80">New Registration Alerts</p>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Email notification on patient entry</p>
                </div>
                <input type="checkbox" className="toggle toggle-primary toggle-lg" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-base-content/5 rounded-2xl border border-base-content/5">
                <div>
                  <p className="font-black text-sm text-base-content/80">System Health Logs</p>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Push notifications for sync errors</p>
                </div>
                <input type="checkbox" className="toggle toggle-primary toggle-lg" defaultChecked />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-primary/5 rounded-[2rem] border border-primary/10 text-center">
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Diagnostic Sync Status</div>
               <div className="text-3xl font-black text-primary mb-2 tracking-tighter">ALL SYSTEMS GO</div>
               <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-6 italic">Last Database Sync: 4m ago</p>
               <button className="btn btn-ghost btn-xs h-10 px-6 rounded-xl font-black uppercase tracking-widest bg-primary/10 text-primary border-none">Download Backup</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}