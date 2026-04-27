import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function DoctorDetailsModal({ doctor }) {
  const container = useRef();

  useGSAP(
    () => {
      if (doctor) {
        gsap.from(".profile-section", { x: -30, opacity: 0, duration: 0.6, ease: "power3.out" });
        gsap.from(".details-section > div", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.2, ease: "power3.out" });
      }
    },
    { scope: container, dependencies: [doctor] }
  );

  if (!doctor) return null;

  return (
    <dialog id="view_doctor_modal" className="modal overflow-hidden">
      <div ref={container} className="modal-box w-11/12 max-w-4xl p-0 rounded-[2.5rem] border border-base-content/10 bg-base-100 shadow-2xl overflow-hidden relative">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-6 top-6 z-50 bg-base-content/5 hover:bg-base-content/10 transition-colors">✕</button>
        </form>

        <div className="flex flex-col lg:flex-row min-h-[500px]">
          
          {/* --- LEFT SIDE: PREMIUM PROFILE CARD --- */}
          <div className="lg:w-2/5 p-12 flex flex-col items-center justify-center relative profile-section bg-linear-to-br from-primary/5 via-transparent to-primary/10">
            <div className="absolute inset-0 bg-primary/5 opacity-20 blur-3xl rounded-full scale-150 -z-10" />
            
            <div className="relative group mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
              <div className="avatar">
                <div className="w-40 h-40 rounded-full ring-4 ring-primary/20 ring-offset-4 ring-offset-base-100 shadow-2xl overflow-hidden">
                  <img src={doctor.img} alt={doctor.name} className="transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>
            </div>

            <h3 className="text-3xl font-black tracking-tight text-center mb-2">{doctor.name}</h3>
            <div className="badge badge-primary font-black uppercase text-[10px] tracking-[0.2em] px-4 py-3 rounded-xl shadow-lg shadow-primary/20">
              {doctor.spec}
            </div>

            <div className="mt-8 w-full space-y-4">
              <div className="glass-card p-4 rounded-2xl border border-primary/10 bg-primary/5 text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Status</div>
                <div className={`text-sm font-black uppercase ${doctor.status === 'Active' ? 'text-success' : 'text-error'}`}>
                   {doctor.status} Account
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: DETAILED INFORMATION --- */}
          <div className="flex-1 p-12 lg:p-16 details-section space-y-12">
            
            {/* Professional Grid */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 flex items-center gap-3">
                Professional Credentials
                <span className="flex-1 h-px bg-base-content/5" />
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">SLMC Reg No</span>
                  <p className="font-mono font-black text-xl text-primary tracking-tight">{doctor.regNo}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">Specialization</span>
                  <p className="font-black text-lg text-base-content/80">{doctor.spec}</p>
                </div>
              </div>
            </div>

            {/* Contact Grid */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 flex items-center gap-3">
                Contact Information
                <span className="flex-1 h-px bg-base-content/5" />
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">Mobile Phone</span>
                  <p className="font-black text-lg text-base-content/80">{doctor.phone}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">Email Address</span>
                  <p className="font-black text-lg text-base-content/80 truncate">{doctor.email}</p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/30 flex items-center gap-3">
                System Metadata
                <span className="flex-1 h-px bg-base-content/5" />
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">Username</span>
                  <p className="font-black text-base-content/60 italic">@{doctor.username || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest">Account Created</span>
                  <p className="font-black text-base-content/60">{doctor.created_at ? new Date(doctor.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 flex gap-4">
              <button className="btn btn-ghost flex-1 rounded-2xl h-14 font-black bg-base-content/5 hover:bg-base-content/10 border-none transition-all uppercase tracking-widest text-[10px]">Edit Profile</button>
              <button className="btn btn-error flex-1 rounded-2xl h-14 font-black text-white shadow-xl shadow-error/20 border-none transition-all uppercase tracking-widest text-[10px]">Revoke Access</button>
            </div>
          </div>

        </div>
      </div>
      
      <form method="dialog" className="modal-backdrop bg-base-content/20 backdrop-blur-sm">
        <button>close</button>
      </form>
    </dialog>
  );
}