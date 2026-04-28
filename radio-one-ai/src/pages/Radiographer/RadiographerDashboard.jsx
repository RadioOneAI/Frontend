import React, { useEffect, useRef } from "react";
import DashboardCharts from "../../component/Admin/DashboardCharts";
import gsap from "gsap";

export default function RadiographerDashboard() {
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
    { title: "Total Doctors", value: "24", desc: "↗︎ 2 added this month", color: "from-blue-500 to-cyan-400", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
    { title: "Radiologists", value: "8", desc: "All systems active", color: "from-purple-500 to-indigo-400", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> },
    { title: "Total Patients", value: "1,250", desc: "↗︎ 15 new registrations", color: "from-pink-500 to-rose-400", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> },
    { title: "AI Scans", value: "3.4K", desc: "Server Load: 45%", color: "from-sky-500 to-blue-400", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> },
  ];

  return (
    <div ref={containerRef} className="space-y-8 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            System <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-base-content/60 font-medium mt-1">Radiographer Terminal • Active Session</p>
        </div>
        <div className="flex items-center gap-3 bg-base-100/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 text-sm font-mono opacity-70 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="stat-card group relative overflow-hidden glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">{s.title}</div>
                <div className="text-3xl font-black text-base-content">{s.value}</div>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
            </div>
            <div className="mt-4 text-[11px] font-bold">
              <span className={s.desc.includes("↗︎") ? "text-success bg-success/10 px-2 py-0.5 rounded-lg" : "text-base-content/40"}>{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="dashboard-section glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-xl">
        <DashboardCharts />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-8 dashboard-section glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tight">Recent <span className="text-secondary">Activity</span></h2>
            <button className="btn btn-sm btn-ghost rounded-xl hover:bg-white/5 uppercase text-[10px] font-black tracking-widest">Detailed Logs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-base-content/80">
              <thead>
                <tr className="border-b border-white/5 text-base-content/50 uppercase tracking-widest text-[10px]">
                  <th className="py-5 pl-8">User / Event</th>
                  <th>Action Details</th>
                  <th>Time</th>
                  <th className="pr-8 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: "AI", name: "System AI", action: "Batch processing completed (MRI-Brain)", time: "Just now", status: "Success", color: "badge-success" },
                  { user: "SJ", name: "Dr. Sarah Jenkins", action: "Verified Report #RP-8821", time: "15 mins ago", status: "Logged", color: "badge-info" },
                  { user: "KG", name: "Kamal G.", action: "New Account Registration", time: "1 hour ago", status: "Pending", color: "badge-warning" }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors group">
                    <td className="py-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center font-bold text-xs">{row.user}</div>
                        <span className="font-black text-base-content">{row.name}</span>
                      </div>
                    </td>
                    <td className="font-medium text-sm">{row.action}</td>
                    <td className="text-xs opacity-60 font-medium uppercase">{row.time}</td>
                    <td className="pr-8 text-right"><span className={`badge ${row.color} badge-sm font-bold shadow-sm`}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Upload & System Health */}
        <div className="lg:col-span-4 space-y-8">
          <div className="dashboard-section glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl group">
            <h2 className="text-2xl font-black mb-6 tracking-tight">Quick <span className="text-primary">Upload</span></h2>
            <div className="border-2 border-dashed border-white/10 rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center group-hover:border-primary/30 transition-all duration-500 bg-white/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="font-black text-base-content/80 text-sm mb-1">Drag & drop scans</p>
              <p className="text-[10px] font-bold opacity-30 mb-6 uppercase tracking-widest">Max 50MB</p>
              <button className="btn btn-primary btn-sm rounded-xl px-8 font-black shadow-lg shadow-primary/20">BROWSE</button>
            </div>
          </div>

          <div className="dashboard-section glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40 mb-8">System Health</h2>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                  <span className="opacity-40">AI Latency</span>
                  <span className="text-success">24ms</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)]" style={{ width: '20%' }} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                  <span className="opacity-40">Storage Usage</span>
                  <span className="text-warning">78%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-warning to-amber-400 rounded-full shadow-[0_0_10px_rgba(fb,bf,24,0.4)]" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}