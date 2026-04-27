import React, { useState, useEffect } from "react";
import RadiographerSidebar from "../../component/Radiographer/RadiographerSidebar";
import RadiographerBreadcrumbs from "../../component/Radiographer/RadiographerBreadcrumbs";
import Navbar from "../../component/Common/Navbar";

export default function RadiographerLayout({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* --- MAIN CONTENT AREA --- */}
      <div className="drawer-content flex flex-col min-h-screen bg-base-200/50">
        <Navbar 
          title="Radiographer Portal" 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={{ name: "John Doe", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" }} 
        />

        {/* Page Content */}
        <main className="p-8 flex-grow">
          <div className="mb-6">
            <RadiographerBreadcrumbs />
          </div>
          {children}
        </main>
      </div>

      {/* --- SIDEBAR --- */}
      <div className="drawer-side z-40">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <RadiographerSidebar />
      </div>
    </div>
  );
}
