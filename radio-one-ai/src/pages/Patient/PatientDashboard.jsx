import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export default function PatientDashboard() {
  const containerRef = useRef(null);
  const [userName, setUserName] = useState("Patient");

  useEffect(() => {
    // Get user name from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.username || "Patient");
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }

    const ctx = gsap.context(() => {
      gsap.from(".hero-section", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      });
      gsap.from(".stat-card", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.4,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-10 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Hello, <span className="text-gradient">{userName}</span>!
          </h1>
          <p className="text-base-content/60 font-medium">Welcome to your health dashboard. Your system status is nominal.</p>
        </div>
        <div className="flex items-center gap-3 bg-base-100/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 text-sm font-mono opacity-70 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Status: Synchronized
        </div>
      </div>

      {/* Hero Action Section */}
      <div className="hero-section group relative overflow-hidden glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full -mr-48 -mt-48 group-hover:bg-primary/30 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
              Latest Result Available
            </div>
            <h2 className="text-5xl font-black tracking-tighter leading-tight">
              Your latest MRI scan <br/>
              is <span className="text-primary underline decoration-primary/30 underline-offset-8">ready for review</span>.
            </h2>
            <p className="text-lg font-medium text-base-content/60 max-w-xl">
              Processed on Oct 24, 2023. Dr. Jenkins has finalized your diagnostic report using AI-assisted analysis.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/patient/reports" className="btn btn-primary btn-lg rounded-2xl font-black px-10 shadow-xl shadow-primary/30 hover:scale-105 transition-transform">
                View My Results
              </Link>
              <button className="btn btn-ghost btn-lg rounded-2xl border border-white/5 bg-white/5 font-black px-10 hover:bg-white/10">
                Download PDF
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-primary to-secondary p-1 rotate-12 shadow-2xl shadow-primary/20 group-hover:rotate-6 transition-transform duration-700">
               <div className="w-full h-full rounded-[2.8rem] bg-base-100 flex items-center justify-center">
                  <svg className="w-20 h-20 text-primary opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Recent Activity */}
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-6">Recent <span className="text-secondary">Activity</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Appointment Card */}
          <div className="stat-card group glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-secondary/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="p-4 rounded-2xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">Appointments</span>
              </div>
              <h3 className="text-xl font-black mb-2">Upcoming Session</h3>
              <p className="text-sm font-medium text-base-content/60 mb-8">
                You have no upcoming appointments scheduled at this time.
              </p>
              <button className="mt-auto btn btn-outline border-white/10 rounded-2xl h-auto py-4 font-black uppercase tracking-widest text-[11px] hover:bg-secondary hover:text-white hover:border-secondary transition-all">
                Schedule Appointment
              </button>
            </div>
          </div>

          {/* Treatment Status */}
          <div className="stat-card group glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="p-4 rounded-2xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">Health Plan</span>
              </div>
              <h3 className="text-xl font-black mb-2">Treatment Cycle</h3>
              <p className="text-sm font-medium text-base-content/60 mb-6">
                Active Cycle: **Phase 1 Observations**
              </p>
              <div className="w-full bg-white/5 rounded-full h-1.5 mb-8">
                 <div className="bg-accent h-full w-1/4 rounded-full shadow-[0_0_10px_rgba(55,205,190,0.4)]"></div>
              </div>
              <button className="mt-auto btn btn-ghost bg-white/5 rounded-2xl h-auto py-4 font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all">
                View Care Plan
              </button>
            </div>
          </div>

          {/* Quick Support */}
          <div className="stat-card group glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">Support</span>
              </div>
              <h3 className="text-xl font-black mb-2">Direct Contact</h3>
              <p className="text-sm font-medium text-base-content/60 mb-8">
                Need clarification on your reports? Speak with our clinical coordinators.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button className="btn btn-primary rounded-2xl h-auto py-4 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                  Call Now
                </button>
                <button className="btn btn-ghost bg-white/5 rounded-2xl h-auto py-4 font-black uppercase tracking-widest text-[10px] hover:bg-white/10">
                  Message
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}