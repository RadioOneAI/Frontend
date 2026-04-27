import React, { useState, useEffect } from "react";
import ReceptionistSidebar from "../../component/Receptionist/ReceptionistSidebar";
import ReceptionistBreadcrumbs from "../../component/Receptionist/ReceptionistBreadcrumbs";
import Navbar from "../../component/Common/Navbar";

export default function ReceptionistLayout({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const receptionistUser = {
    name: "Receptionist",
    avatar: "https://ui-avatars.com/api/?name=R&background=random"
  };

  return (
    <div className="drawer lg:drawer-open overflow-hidden">
      <input id="receptionist-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        
        {/* PREMIUM COMMON NAVBAR */}
        <Navbar 
          title="Receptionist Portal" 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={receptionistUser}
          drawerId="receptionist-drawer"
        />

        <main className="p-6 md:p-10 flex-grow">
          {/* BREADCRUMBS */}
          <div className="mb-6 px-2">
            <ReceptionistBreadcrumbs />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="receptionist-drawer" className="drawer-overlay"></label>
        <ReceptionistSidebar />
      </div>
    </div>
  );
}
