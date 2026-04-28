import React, { useState, useEffect } from "react";
import RadiologistSidebar from "../../component/Radiologist/RadiologistSidebar";
import RadiologistBreadcrumbs from "../../component/Radiologist/RadiologistBreadcrumbs";
import Navbar from "../../component/Common/Navbar";

export default function RadiologisrLayout({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const radiologistUser = {
    name: "Radiologist",
    avatar: "https://ui-avatars.com/api/?name=R&background=random"
  };

  return (
    <div className="drawer lg:drawer-open overflow-hidden">
      <input id="radiologist-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        
        {/* PREMIUM COMMON NAVBAR */}
        <Navbar 
          title="Radiologist Portal" 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={radiologistUser}
          drawerId="radiologist-drawer"
        />

        <main className="p-6 md:p-10 flex-grow">
          {/* BREADCRUMBS */}
          <div className="mb-6 px-2">
            <RadiologistBreadcrumbs />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="radiologist-drawer" className="drawer-overlay"></label>
        <RadiologistSidebar />
      </div>
    </div>
  );
}
