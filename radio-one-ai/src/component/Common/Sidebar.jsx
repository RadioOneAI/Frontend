import React, { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";


/**
 * Common Sidebar Component
 * @param {Object} props
 * @param {string} props.role - User role (e.g., "Admin", "Radiographer")
 * @param {Array} props.links - Array of objects { label, path, icon }
 * @param {Object} props.user - User info { name, avatar }
 */
export default function Sidebar({ role, links = [], user = {} }) {
  const location = useLocation();
  const container = useRef();
  let localUser = {};

  try {
    const rawUser = localStorage.getItem("user");
    localUser = rawUser ? JSON.parse(rawUser) : {};
  } catch (error) {
    localUser = {};
  }

  const displayName = localUser?.name || localUser?.username || user.name || "User Account";
  const displayEmail = localUser?.email || user.email || "No Email";

  

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
      : "text-base-content/60 hover:bg-base-content/5 hover:text-base-content hover:translate-x-1";
  };

  return (
    <div ref={container} className="h-screen sticky top-0 flex flex-col bg-base-100 border-r border-base-content/5 w-72 transition-all duration-300">
      {/* --- BRAND HEADER --- */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
            <img
              src={logo}
              alt="Logo"
              className="w-12 h-12 object-contain relative z-10 transition-transform duration-500 group-hover:rotate-[360deg]"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-none text-base-content">
              RadioOne<span className="text-base-content">AI</span>
            </h1>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 bg-primary/5 px-2 py-0.5 rounded-md mt-1 inline-block">
              {role} Panel
            </span>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-grow px-4 overflow-y-auto no-scrollbar">
        <div className="space-y-1.5">
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className={`nav-item flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${getLinkClass(
                link.path
              )}`}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {link.icon}
              </span>
              <span className="text-sm tracking-tight">{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* --- FOOTER / USER --- */}
      <div className="p-4 mt-auto">
        <div className="glass-card p-4 rounded-3xl border border-base-content/5 bg-base-200/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/10 shadow-inner">
              {displayName ? displayName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate">{displayName}</p>
              <p className="text-[10px] font-bold opacity-40 tracking-tight truncate">{displayEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Link
              to="/"
              className="btn btn-ghost btn-xs h-10 rounded-xl bg-error/10 hover:bg-error/20 text-error font-bold border-none"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
