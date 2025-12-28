import React, { useState, useEffect } from "react";
import RadiographerSidebar from "../../component/Radiographer/RadiographerSidebar";
import RadiographerBreadcrumbs from "../../component/Radiographer/RadiographerBreadcrumbs";

export default function RadiographerLayout({ children }) {
  // ... (Keep existing state and theme logic unchanged) ...
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  // ... (End of existing logic) ...

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* --- MAIN CONTENT AREA --- */}
      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        
        {/* ... (Keep Navbar code exactly as is) ... */}
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-30">
             {/* ... (Navbar content: Hamburger, Title, Theme Toggle, Avatar) ... */}
             <div className="flex-none lg:hidden">
                <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </label>
             </div>
             <div className="flex-1 px-2 mx-2">
                <span className="text-lg font-bold text-base-content/70">Radiographer</span>
             </div>
             <div className="flex-none gap-2">
                <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
                   {/* ... (Theme Icons) ... */}
                   {theme === 'dark' ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                   ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                   )}
                </button>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full border border-base-300">
                      <img alt="Admin" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" /> 
                    </div>
                  </div>
                </div>
             </div>
        </div>

        {/* Page Content */}
        <main className="p-6 flex-grow">
          {/* ADD BREADCRUMBS HERE */}
          <RadiographerBreadcrumbs />
          
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