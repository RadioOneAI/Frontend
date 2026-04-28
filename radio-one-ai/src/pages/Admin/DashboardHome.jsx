import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import DashboardCharts from "../../component/Admin/DashboardCharts";
import gsap from "gsap";

export default function DashboardHome() {
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
    { title: "Radiographers", value: "12", desc: "3 on shift now", color: "from-amber-500 to-orange-400", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.896 1.618-2 2a4 4 0 01-4-4 2 2 0 014-4 2 2 0 012 2v2"></path></svg> },
    { title: "Receptionists", value: "5", desc: "Front Desk A & B", color: "from-emerald-500 to-teal-400", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
    { title: "Total Patients", value: "1,250", desc: "↗︎ 15 new registrations", color: "from-pink-500 to-rose-400", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> },
    { title: "AI Scans", value: "3.4K", desc: "Server Load: 45%", color: "from-sky-500 to-blue-400", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> },
  ];

  return (
    <div ref={containerRef} className="space-y-8 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Dashboard  <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-base-content/60 font-medium mt-1">Welcome back, Admin. System status is nominal.</p>
        </div>
        <div className="flex items-center gap-3 bg-base-100/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 text-sm font-mono opacity-70 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Last updated: Today, 10:45 AM
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <span className={s.desc.includes("↗︎") ? "text-success" : "text-base-content/40"}>{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="dashboard-section glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-xl">
        <DashboardCharts />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 dashboard-section glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tight">Recent <span className="text-secondary">Activity</span></h2>
            <Link to="/admin/logs" className="btn btn-sm btn-ghost rounded-xl hover:bg-white/5">View Full Log</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-base-content/80">
              <thead>
                <tr className="border-b border-white/5 text-base-content/50 uppercase tracking-widest text-[10px]">
                  <th className="py-5 pl-8">User / Event</th>
                  <th>Action Details</th>
                  <th>Time</th>
                  <th className="pr-8">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: "System AI", action: "Batch processing completed (MRI-Brain)", time: "Just now", status: "Success", color: "badge-success" },
                  { user: "Dr. Sarah Jenkins", action: "Verified Report #RP-8821", time: "15 mins ago", status: "Logged", color: "badge-info" },
                  { user: "Kamal G.", action: "New Patient Registration", time: "1 hour ago", status: "Pending", color: "badge-warning" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 pl-8"><span className="font-bold text-base-content">{row.user}</span></td>
                    <td>{row.action}</td>
                    <td className="text-sm opacity-60 font-medium">{row.time}</td>
                    <td className="pr-8"><span className={`badge ${row.color} badge-sm font-bold shadow-sm`}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & System Health */}
        <div className="space-y-8">
          <div className="dashboard-section glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl">
            <h2 className="text-xl font-black mb-6 tracking-tight">Quick <span className="text-accent">Actions</span></h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { to: "/admin/doctors", label: "Add Doctor", color: "hover:bg-blue-500/10 hover:text-blue-400" },
                { to: "/admin/radiologists", label: "Add Radiologist", color: "hover:bg-purple-500/10 hover:text-purple-400" },
                { to: "/admin/radiographers", label: "Add Radiographer", color: "hover:bg-amber-500/10 hover:text-amber-400" },
                { to: "/admin/receptionists", label: "Add Receptionist", color: "hover:bg-emerald-500/10 hover:text-emerald-400" },
                { to: "/admin/patients", label: "New Patient", color: "hover:bg-pink-500/10 hover:text-pink-400" },
                { to: "/admin/logs", label: "System Logs", color: "hover:bg-slate-500/10 hover:text-slate-400" },
              ].map((link, idx) => (
                <Link key={idx} to={link.to} className={`btn btn-outline border-white/10 rounded-2xl h-auto py-4 flex flex-col gap-1 transition-all duration-300 ${link.color}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="dashboard-section glass bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-base-content/40 mb-6">System Health</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest opacity-60">
                  <span>AI Latency</span>
                  <span className="text-success">24ms</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5 shadow-inner">
                  <div className="bg-gradient-to-r from-success to-emerald-400 h-full w-1/5 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest opacity-60">
                  <span>Storage Usage</span>
                  <span className="text-warning">78%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5 shadow-inner">
                  <div className="bg-gradient-to-r from-warning to-amber-400 h-full w-[78%] rounded-full shadow-[0_0_10px_rgba(fb,bf,24,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}