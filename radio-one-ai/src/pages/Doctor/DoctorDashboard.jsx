import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DashboardCharts from "../../component/Admin/DashboardCharts"; 
import DoctorReportModal from "../../component/Doctor/DoctorReportModal";
import gsap from "gsap";

export default function DoctorDashboard() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // gsap.from(".stat-card", {
      //   y: 30,
      //   opacity: 0,
      //   duration: 0.8,
      //   stagger: 0.1,
      //   ease: "power3.out",
      // });
      gsap.from(".dashboard-section", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { title: "Patients Today", value: "12", desc: "4 New scans received", color: "from-blue-500 to-cyan-400", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { title: "Critical Findings", value: "2", desc: "Action Required", color: "from-rose-500 to-pink-400", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
    { title: "Active Patients", value: "48", desc: "In treatment cycle", color: "from-emerald-500 to-teal-400", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
  ];

  return (
    <div ref={containerRef} className="space-y-8 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Clinical <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-base-content/60 font-medium">Welcome back, Dr. Jenkins. Here is your dashboard.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-base-100/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 text-sm font-mono opacity-70 shadow-sm hidden md:flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {new Date().toLocaleDateString()}
          </div>
          <Link to="/doctor/settings" className="btn btn-primary btn-sm rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Settings
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="stat-card group relative overflow-hidden glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-sm font-bold uppercase tracking-widest text-base-content/50">{s.title}</div>
                <div className="text-4xl font-black text-base-content">{s.value}</div>
              </div>
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
            </div>
            <div className="mt-4 text-sm font-medium flex items-center gap-2">
              <span className={s.desc.includes("Critical") ? "text-error" : "text-base-content/40"}>{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Processed Scans Table */}
      <div className="dashboard-section glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tight">Pending <span className="text-secondary">Review</span></h2>
          <Link to="/doctor/patients" className="btn btn-sm btn-ghost rounded-xl hover:bg-white/5">View All Patients</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-base-content/80">
            <thead>
              <tr className="border-b border-white/5 text-base-content/50 uppercase tracking-widest text-[10px]">
                <th className="py-5 pl-8">Patient</th>
                <th>Scan Info</th>
                <th>AI Findings (Preliminary)</th>
                <th className="pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { 
                  name: "Kamal Gunawardena", 
                  ref: "#REQ-8821", 
                  scan: "MRI - Brain", 
                  date: "24 Oct 2023", 
                  finding: "Meningioma Detected", 
                  sub: "Size: 2.4cm x 1.8cm | Loc: Left Frontal", 
                  status: "Review Now", 
                  critical: true 
                },
                { 
                  name: "Sita Kumari", 
                  ref: "#REQ-8822", 
                  scan: "MRI - Spine", 
                  date: "23 Oct 2023", 
                  finding: "No Abnormalities", 
                  sub: "Normal spinal alignment.", 
                  status: "Details", 
                  critical: false 
                },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                  <td className="py-5 pl-8">
                    <div className="font-black text-base-content">{row.name}</div>
                    <div className="text-xs font-mono opacity-50">{row.ref}</div>
                  </td>
                  <td>
                    <div className="font-bold opacity-80">{row.scan}</div>
                    <div className="text-[10px] uppercase font-bold tracking-wider opacity-40">{row.date}</div>
                  </td>
                  <td>
                    <div className={`font-black ${row.critical ? 'text-error' : 'text-success'}`}>{row.finding}</div>
                    <div className="text-xs font-medium opacity-60">{row.sub}</div>
                  </td>
                  <td className="pr-8 text-right">
                    <button className={`btn btn-sm rounded-xl font-bold transition-all hover:scale-105 ${row.critical ? 'btn-primary shadow-lg shadow-primary/20' : 'btn-ghost bg-base-200/50'}`}>
                      {row.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="dashboard-section glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-xl">
        <DashboardCharts />
      </div>
    </div>
  );
}