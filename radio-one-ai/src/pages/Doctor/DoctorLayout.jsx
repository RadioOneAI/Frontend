import React from "react";
import DoctorSidebar from "../../component/DoctorSidebar";
import { Link } from "react-router-dom";

export default function DoctorLayout({ children }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="doctor-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        
        {/* Simple Top Bar */}
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-30 lg:hidden">
          <div className="flex-none">
            <label htmlFor="doctor-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold">Doctor Portal</div>
        </div>

        <main className="p-6 flex-grow">
           {children}
        </main>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="doctor-drawer" className="drawer-overlay"></label>
        <DoctorSidebar />
      </div>
    </div>
  );
}