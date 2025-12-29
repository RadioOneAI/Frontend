import React from "react";
import { Link, useLocation } from "react-router-dom";
// Import the logo image
import logo from "../../assets/images/logo.png"; 

export default function RadiologistSidebar() {
  const location = useLocation();

  // Helper to check active state
  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "bg-primary text-primary-content shadow-md" 
      : "text-base-content/70 hover:bg-base-200 hover:text-base-content";
  };

  return (
    <div className="h-full flex flex-col bg-base-100 w-80 border-r border-base-300">
      
      {/* --- BRAND HEADER --- */}
      <div className="p-6 flex items-center gap-3">
        {/* REPLACED THE "R" BOX WITH THE LOGO IMAGE */}
        <img src={logo} alt="RadioOneAI Logo" className="w-10 h-10 object-contain" />
        <div>
          {/* UPDATED TEXT TO "RadioOneAI" */}
          <h1 className="text-xl font-bold tracking-tight">RadioOneAI</h1>
          <p className="text-xs text-base-content/50 uppercase tracking-widest font-semibold">Radiographer</p>
        </div>
      </div>

      {/* --- NAVIGATION MENU --- */}
      <ul className="menu flex-grow px-4 gap-2 text-base font-medium">
        {/* Patients */}
        <li>
          <Link to="/radiolo/appointments" className={`rounded-xl p-3 ${getLinkClass("/radiographer/appointments")}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Appointments
          </Link>
        </li>
      </ul>

      {/* --- BOTTOM SECTION (Settings & Logout) --- */}
      <div className="p-4 mt-auto">
        <div className="bg-base-200/50 rounded-2xl p-2 space-y-1">
          
          <ul className="menu text-sm">
            <li>
              <Link to="/login" className="text-error hover:bg-error/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </Link>
            </li>
          </ul>

        </div>
      </div>

    </div>
  );
}