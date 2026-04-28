import React, { useRef } from "react";
import DateTimeDisplay from "../DateTimeModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Navbar({ title, theme, toggleTheme, user = {}, drawerId = "admin-drawer" }) {
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(".nav-content > *", {
        y: -10,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="sticky top-0 z-40 p-4 md:p-6 pb-0 pointer-events-none">
      <div className="nav-content glass-card h-20 px-8 rounded-[2rem] border border-white/10 shadow-2xl shadow-primary/5 flex items-center justify-between pointer-events-auto relative overflow-hidden group">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        {/* Mobile Menu Toggle */}
        <div className="flex-none lg:hidden">
          <label htmlFor={drawerId} className="btn btn-square btn-ghost rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
        </div>

        {/* Title & Status */}
        <div className="flex-1 px-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1 animate-pulse">Live Session</span>
            <h2 className="text-xl font-black tracking-tighter text-base-content/90">
              {title.split(" ")[0]} <span className="text-gradient">{title.split(" ").slice(1).join(" ")}</span>
            </h2>
          </div>
        </div>

        {/* Actions Container */}
        <div className="flex items-center gap-6">
          
          {/* Live Clock Section */}
          {/* <div className="hidden lg:flex items-center gap-4 bg-base-content/5 px-6 py-2.5 rounded-2xl border border-base-content/5">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <DateTimeDisplay compact />
          </div> */}

          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-circle bg-base-content/5 hover:bg-base-content/10 transition-all duration-500 hover:rotate-[360deg] border border-transparent hover:border-primary/20"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning fill-warning/20" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary fill-primary/20" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User Profile Hook */}
          <div className="flex items-center gap-4 pl-6 border-l border-base-content/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-base-content/90 tracking-tight leading-none mb-1.5">{user.name || "User Account"}</p>
              <div className="flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Active</p>
              </div>
            </div>
            <div className="avatar group cursor-pointer relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 rounded-2xl border-2 border-white/10 ring-4 ring-primary/5 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 overflow-hidden relative z-10">
                <img src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"} alt="Avatar" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
