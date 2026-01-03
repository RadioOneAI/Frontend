import React, { useState, useEffect } from "react";
import PatientSidebar from "../../component/Patient/PatientSidebar";
import PatientBreadcrumbs from "../../component/Patient/PatientBreadcrumbs";

export default function PatientLayout({ children }) {
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
      <input id="patient-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-40 px-4">
             <div className="flex-none lg:hidden">
               <label htmlFor="patient-drawer" className="btn btn-square btn-ghost">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
               </label>
             </div>
             <div className="flex-1 px-2 mx-2">
               <span className="text-lg font-bold text-base-content/70">Patient Portal </span>
             </div>
             <div className="flex-none gap-11">
               <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
                   {theme === 'dark' ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                   ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                   )}
               </button>
               <div className="avatar">
                 <div className="w-10 rounded-full border border-base-300">
                   <img alt="User" src="https://ui-avatars.com/api/?name=Kamal+G&background=random" /> 
                 </div>
               </div>
             </div>
        </div>

      <main className="p-6 flex-grow">
                {/* ADD BREADCRUMBS HERE */}
                <PatientBreadcrumbs />
                
                {children}
              </main>
            </div>
      

      <div className="drawer-side z-40">
        <label htmlFor="patient-drawer" className="drawer-overlay"></label>
        <PatientSidebar />
      </div>
    </div>
  );
}