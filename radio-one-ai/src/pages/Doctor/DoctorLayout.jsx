import React, { useState, useEffect } from "react";
import DoctorSidebar from "../../component/Doctor/DoctorSidebar";
import DoctorBreadcrumbs from "../../component/Doctor/DoctorBreadcrumbs";
import Navbar from "../../component/Common/Navbar";

export default function DoctorLayout({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const doctorUser = {
    name: "Doctor",
    avatar: "https://ui-avatars.com/api/?name=D&background=random"
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="doctor-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        
        {/* PREMIUM COMMON NAVBAR */}
        <Navbar 
          title="Doctor Portal" 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={doctorUser}
          drawerId="doctor-drawer"
        />

        <main className="p-6 md:p-10 flex-grow">
          {/* BREADCRUMBS */}
          <div className="mb-6 px-2">
            <DoctorBreadcrumbs />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="doctor-drawer" className="drawer-overlay"></label>
        <DoctorSidebar />
      </div>
    </div>
  );
}
