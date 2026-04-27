import React, { useRef } from "react";
import DashboardCharts from "../../component/Admin/DashboardCharts";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function RadiographerDashboard() {
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(".dash-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".stat-card", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.from(".dash-content", { y: 40, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: container }
  );

  const stats = [
    {
      title: "Total Doctors",
      value: "24",
      desc: "↗︎ 2 added this month",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      shadowClass: "shadow-primary/20"
    },
    {
      title: "Radiologists",
      value: "8",
      desc: "All systems active",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      colorClass: "text-secondary",
      bgClass: "bg-secondary/10",
      shadowClass: "shadow-secondary/20"
    },
    {
      title: "Total Patients",
      value: "1,250",
      desc: "↗︎ 15 new registrations",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      colorClass: "text-accent",
      bgClass: "bg-accent/10",
      shadowClass: "shadow-accent/20"
    },
    {
      title: "AI Scans",
      value: "3.4K",
      desc: "Server Load: 45%",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      colorClass: "text-info",
      bgClass: "bg-info/10",
      shadowClass: "shadow-info/20"
    }
  ];

  return (
    <div ref={container} className="space-y-10 p-2">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center dash-header">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            System <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-base-content/60 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Radiographer Terminal • Active Session
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-sm font-black uppercase tracking-widest text-base-content/40 mb-1">Status Report</div>
          <div className="text-lg font-black font-mono text-base-content/80">Today, 10:45 AM</div>
        </div>
      </div>

      {/* --- STATS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card glass-card p-7 rounded-[2rem] group hover:bg-base-100 transition-all duration-500 border border-base-content/10 flex flex-col h-full shadow-xl shadow-base-content/5">
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-2xl ${stat.bgClass} ${stat.colorClass} group-hover:scale-110 transition-transform duration-500 shadow-lg ${stat.shadowClass}`}>
                {stat.icon}
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-base-content/50">{stat.title}</div>
            </div>
            <div className="mt-auto">
              <div className="text-4xl font-black mb-2 text-base-content tracking-tighter">{stat.value}</div>
              <div className={`font-black text-[10px] px-3 py-1.5 rounded-xl inline-block uppercase tracking-wider ${
                i < 3 ? 'bg-success/10 text-success' : 'bg-base-content/5 text-base-content/60'
              }`}>
                {stat.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="dash-content space-y-10">
        <div className="glass-card p-8 rounded-[2.5rem] border border-base-content/10 shadow-xl shadow-base-content/5 overflow-hidden relative bg-base-100/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <DashboardCharts />
        </div>

        {/* --- ACTIVITY & UPLOAD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Activity */}
          <div className="lg:col-span-8 glass-card rounded-[2.5rem] border border-base-content/10 shadow-xl shadow-base-content/5 overflow-hidden bg-base-100/40">
            <div className="p-8 border-b border-base-content/5 flex justify-between items-center">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                Recent Activity
                <span className="badge badge-primary badge-sm font-black px-3 py-3 rounded-lg">LIVE</span>
              </h2>
              <button className="btn btn-ghost btn-sm rounded-full bg-base-content/5 hover:bg-base-content/10 uppercase font-black text-[10px] tracking-widest px-4">Detailed Logs</button>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-center">
                <thead>
                  <tr className="text-base-content/40 uppercase tracking-widest text-[10px] font-black border-b border-base-content/5">
                    <th className="py-6 px-8 text-left">User / Event</th>
                    <th className="py-6">Action Details</th>
                    <th className="py-6">Time</th>
                    <th className="py-6 px-8 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="font-bold text-sm">
                  {[
                    { user: "AI", name: "System AI", action: "Batch processing completed (MRI-Brain)", time: "Just now", status: "Success", color: "primary" },
                    { user: "SJ", name: "Dr. Sarah Jenkins", action: "Verified Report #RP-8821", time: "15 mins ago", status: "Logged", color: "secondary" },
                    { user: "KG", name: "Kamal G.", action: "New Account Registration", time: "1 hour ago", status: "Pending", color: "accent" }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-base-200/50 transition-colors group border-b border-base-content/5 last:border-0">
                      <td className="py-5 px-8 text-left">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${
                            row.color === 'primary' ? 'bg-primary/10 text-primary' : 
                            row.color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                          }`}>{row.user}</div>
                          <span className="font-black text-base-content/80">{row.name}</span>
                        </div>
                      </td>
                      <td className="text-base-content/60">{row.action}</td>
                      <td className="text-base-content/40 text-xs uppercase tracking-tighter">{row.time}</td>
                      <td className="px-8 text-right">
                        <span className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] shadow-sm ${
                          row.status === 'Success' ? 'badge-success text-white' : 
                          row.status === 'Logged' ? 'badge-info text-white' : 'badge-warning text-white'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Upload & Health */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-8 rounded-[2.5rem] border border-base-content/10 shadow-xl shadow-base-content/5 relative overflow-hidden group bg-base-100/40">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h2 className="text-2xl font-black tracking-tight mb-8">Upload Scan</h2>
              <div className="border-2 border-dashed border-base-content/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center group-hover:border-primary/30 transition-all duration-500 bg-base-content/[0.02]">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/5">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="font-black text-base-content/80 text-sm mb-1">Drag & drop scans</p>
                <p className="text-[10px] font-black opacity-30 mb-8 uppercase tracking-widest">DICOM, PNG (Max 50MB)</p>
                <button className="btn btn-primary rounded-2xl px-10 shadow-xl shadow-primary/20 font-black">BROWSE FILES</button>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] border border-base-content/10 shadow-xl shadow-base-content/5 bg-base-100/60">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40 mb-10">System Health</h2>
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span className="opacity-40">AI Latency</span>
                    <span className="text-success bg-success/10 px-2 py-0.5 rounded-lg">24ms</span>
                  </div>
                  <div className="h-2.5 w-full bg-base-content/5 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full shadow-[0_0_12px_rgba(34,197,94,0.5)]" style={{ width: '20%' }} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span className="opacity-40">Storage</span>
                    <span className="text-warning bg-warning/10 px-2 py-0.5 rounded-lg">78% Full</span>
                  </div>
                  <div className="h-2.5 w-full bg-base-content/5 rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full shadow-[0_0_12px_rgba(234,179,8,0.5)]" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}