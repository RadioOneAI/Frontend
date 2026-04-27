import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function RadiologistDetailsModal({ radiologist }) {
  const container = useRef();

  useGSAP(
    () => {
      if (radiologist) {
        gsap.from(".profile-section", { x: -30, opacity: 0, duration: 0.6, ease: "power3.out" });
        gsap.from(".details-section > div", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.2, ease: "power3.out" });
      }
    },
    { scope: container, dependencies: [radiologist] }
  );

  if (!radiologist) return null;

  // Get initials for the avatar if no image is available or as a fallback
  const initials = radiologist.name
    ? radiologist.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "RD";

  return (
    <dialog id="view_radiologist_modal" className="modal overflow-hidden">
      <div ref={container} className="modal-box w-11/12 max-w-4xl p-0 rounded-[3rem] border-none bg-white shadow-2xl overflow-hidden relative">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-8 top-8 z-50 bg-base-200/50 hover:bg-base-200 transition-colors">✕</button>
        </form>

        <div className="flex flex-col lg:flex-row min-h-[550px]">
          
          {/* --- LEFT SIDE: PROFILE CARD --- */}
          <div className="lg:w-[40%] p-12 flex flex-col items-center justify-center relative profile-section bg-linear-to-b from-base-100 to-base-200/30">
            
            {/* Avatar Circle with Initials */}
            <div className="w-48 h-48 rounded-full border-[6px] border-white shadow-2xl bg-cyan-50 flex items-center justify-center mb-8 relative group">
               <span className="text-6xl font-medium text-slate-700 tracking-tighter">{initials}</span>
               {/* Optional: if there's a real image, we could overlay it, but image shows initials */}
            </div>

            <h3 className="text-4xl font-black tracking-tighter text-slate-900 text-center mb-4 leading-tight">
              {radiologist.name}
            </h3>
            
            <div className="bg-red-900 text-white font-black uppercase text-[11px] tracking-[0.2em] px-6 py-2 rounded-full mb-12 shadow-lg shadow-red-900/20">
              {radiologist.role || "RADIOLOGIST"}
            </div>

            <div className="w-full max-w-[240px] bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-50 text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Status</div>
                <div className="text-[13px] font-black uppercase text-emerald-500 tracking-wider">
                   {radiologist.status === 'Active' ? 'ACTIVE ACCOUNT' : 'INACTIVE ACCOUNT'}
                </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: DETAILS GRID --- */}
          <div className="flex-1 p-12 lg:p-20 details-section space-y-12">
            
            {/* Professional Credentials Section */}
            <div className="space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-4">
                Professional Credentials
                <span className="flex-1 h-px bg-slate-100" />
              </h4>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">SLMC Reg No</span>
                  <p className="font-black text-2xl text-red-800 tracking-tighter">{radiologist.regNo || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Specialization</span>
                  <p className="font-black text-2xl text-slate-700 tracking-tighter">{radiologist.spec || 'radiologist'}</p>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-4">
                Contact Information
                <span className="flex-1 h-px bg-slate-100" />
              </h4>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Mobile Phone</span>
                  <p className="font-black text-2xl text-slate-700 tracking-tighter">{radiologist.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Email Address</span>
                  <p className="font-black text-2xl text-slate-700 tracking-tighter truncate">{radiologist.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* System Metadata Section */}
            <div className="space-y-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-4">
                System Metadata
                <span className="flex-1 h-px bg-slate-100" />
              </h4>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Username</span>
                  <p className="font-black text-2xl text-slate-400 tracking-tighter italic">@{radiologist.staffId || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Account Created</span>
                  <p className="font-black text-2xl text-slate-400 tracking-tighter">{radiologist.created_at ? new Date(radiologist.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-12 flex gap-6">
              <button className="btn btn-ghost flex-1 rounded-2xl h-20 font-black bg-slate-50 hover:bg-slate-100 border-none transition-all uppercase tracking-widest text-xs text-slate-600">Edit Profile</button>
              <button className="btn btn-error flex-1 rounded-2xl h-20 font-black text-white shadow-2xl shadow-red-500/30 border-none transition-all uppercase tracking-widest text-xs bg-red-500 hover:bg-red-600">Revoke Access</button>
            </div>
          </div>

        </div>
      </div>
      
      <form method="dialog" className="modal-backdrop bg-slate-900/40 backdrop-blur-md">
        <button>close</button>
      </form>
    </dialog>
  );
}