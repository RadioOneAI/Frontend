import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ReceptionistDetailsModal({ user, onClose }) {
  const container = useRef();

  useGSAP(
    () => {
      if (user) {
        gsap.from(".profile-section", { x: -30, opacity: 0, duration: 0.6, ease: "power3.out" });
        gsap.from(".details-section > div", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.2, ease: "power3.out" });
      }
    },
    { scope: container, dependencies: [user] }
  );

  if (!user) return null;

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "RC";

  return (
    <dialog id="view_receptionist_modal" className="modal overflow-hidden">
      <div ref={container} className="modal-box w-11/12 max-w-4xl p-0 rounded-[3rem] border-none bg-white shadow-2xl overflow-hidden relative">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-8 top-8 z-50 bg-base-200/50 hover:bg-base-200 transition-colors" onClick={onClose}>✕</button>
        </form>

        <div className="flex flex-col lg:flex-row min-h-[550px]">
          <div className="lg:w-[40%] p-12 flex flex-col items-center justify-center relative profile-section bg-linear-to-b from-base-100 to-base-200/30">
            <div className="w-48 h-48 rounded-full border-[6px] border-white shadow-2xl bg-teal-50 flex items-center justify-center mb-8 relative group">
               <span className="text-6xl font-medium text-slate-700 tracking-tighter">{initials}</span>
            </div>
            <h3 className="text-4xl font-black tracking-tighter text-slate-900 text-center mb-4 leading-tight">{user.name}</h3>
            <div className="bg-red-900 text-white font-black uppercase text-[11px] tracking-[0.2em] px-6 py-2 rounded-full mb-12 shadow-lg shadow-red-900/20">
              {user.role || "RECEPTIONIST"}
            </div>
            <div className="w-full max-w-[240px] bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-50 text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Status</div>
                <div className="text-[13px] font-black uppercase text-emerald-500 tracking-wider">
                   {user.status === 'Active' ? 'ACTIVE ACCOUNT' : 'INACTIVE ACCOUNT'}
                </div>
            </div>
          </div>

          <div className="flex-1 p-12 lg:p-20 details-section space-y-12">
            <div className="space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-4">Reception Credentials<span className="flex-1 h-px bg-slate-100" /></h4>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Staff ID</span>
                  <p className="font-black text-2xl text-red-800 tracking-tighter">{user.staffId || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Assigned Shift</span>
                  <p className="font-black text-2xl text-slate-700 tracking-tighter">{user.shift || 'General'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-4">Contact Information<span className="flex-1 h-px bg-slate-100" /></h4>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Mobile Phone</span>
                  <p className="font-black text-2xl text-slate-700 tracking-tighter">{user.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Email Address</span>
                  <p className="font-black text-2xl text-slate-700 tracking-tighter truncate">{user.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-4">System Metadata<span className="flex-1 h-px bg-slate-100" /></h4>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Username</span>
                  <p className="font-black text-2xl text-slate-400 tracking-tighter italic">@{user.username || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Account Created</span>
                  <p className="font-black text-2xl text-slate-400 tracking-tighter">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="pt-12 flex gap-6">
              <button className="btn btn-ghost flex-1 rounded-2xl h-20 font-black bg-slate-50 hover:bg-slate-100 border-none transition-all uppercase tracking-widest text-xs text-slate-600">Edit Profile</button>
              <button className="btn btn-error flex-1 rounded-2xl h-20 font-black text-white shadow-2xl shadow-red-500/30 border-none transition-all uppercase tracking-widest text-xs bg-red-500 hover:bg-red-600">Revoke Access</button>
            </div>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-slate-900/40 backdrop-blur-md">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}