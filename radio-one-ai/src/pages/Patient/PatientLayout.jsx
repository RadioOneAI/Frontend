import React, { useState, useEffect } from "react";
import PatientSidebar from "../../component/Patient/PatientSidebar";
import PatientBreadcrumbs from "../../component/Patient/PatientBreadcrumbs";
import Navbar from "../../component/Common/Navbar";

export default function PatientLayout({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const patientUser = {
    name: "Kamal Gunawardena",
    avatar: "https://ui-avatars.com/api/?name=Kamal+G&background=random"
  };

  return (
    <div className="drawer lg:drawer-open overflow-hidden">
      <input id="patient-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        
        {/* PREMIUM COMMON NAVBAR */}
        <Navbar 
          title="Patient Portal" 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={patientUser}
          drawerId="patient-drawer"
        />

        <main className="p-6 md:p-10 flex-grow">
          {/* BREADCRUMBS */}
          <div className="mb-6 px-2">
            <PatientBreadcrumbs />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="patient-drawer" className="drawer-overlay"></label>
        <PatientSidebar />
      </div>
    </div>
  );
}
