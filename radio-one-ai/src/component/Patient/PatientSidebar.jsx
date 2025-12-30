import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function PatientSidebar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "bg-primary text-primary-content shadow-md"
      : "text-base-content/70 hover:bg-base-200 hover:text-base-content";
  };

  return (
    <div className="h-full flex flex-col bg-base-100 w-80 border-r border-base-300">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <img src={logo} alt="RadioOneAI Logo" className="w-10 h-10 object-contain" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">RadioOneAI</h1>
          <p className="text-xs text-base-content/50 uppercase tracking-widest font-semibold">Patient Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <ul className="menu flex-grow px-4 gap-2 text-base font-medium">
        <li>
          <Link to="/patient/dashboard" className={`rounded-xl p-3 ${getLinkClass("/patient/dashboard")}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            My Dashboard
          </Link>
        </li>
        
        <li className="menu-title mt-4">
          <span className="text-xs font-bold text-base-content/40 tracking-widest uppercase">Medical Records</span>
        </li>
        
        <li>
          <Link to="/patient/reports" className={`rounded-xl p-3 ${getLinkClass("/patient/reports")}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            My Scans & Reports
          </Link>
        </li>

        <li className="menu-title mt-4">
          <span className="text-xs font-bold text-base-content/40 tracking-widest uppercase">System</span>
        </li>

        {/* Added Settings Option */}
        <li>
          <Link to="/patient/settings" className={`rounded-xl p-3 ${getLinkClass("/patient/settings")}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </li>
      </ul>

      {/* Logout */}
      <div className="p-4 mt-auto">
        <Link to="/login" className="btn btn-soft btn-error w-full gap-2">
          Logout
        </Link>
      </div>
    </div>
  );
}