import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminLayout({ children }) {
  const location = useLocation();
  
  // 1. Theme State (Defaults to light if nothing is saved)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // 2. Apply theme to HTML tag whenever state changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  // 3. Toggle Function
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Helper to highlight active menu item
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Page Content */}
      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        {/* Mobile Header */}
        <div className="navbar bg-base-100 lg:hidden shadow-sm">
          <div className="flex-none">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Admin Panel</a>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-20">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r border-base-300">
          {/* Logo / Brand */}
          <li className="mb-8">
            <Link to="/" className="text-2xl font-bold text-primary px-4 hover:bg-transparent">
              RadioOne<span className="text-base-content">Admin</span>
            </Link>
          </li>

          {/* Navigation */}
          <li><Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>Dashboard Overview</Link></li>
          
          <div className="divider my-2 text-xs opacity-50 font-bold uppercase text-left px-4">User Management</div>
          
          <li><Link to="/admin/doctors" className={isActive("/admin/doctors")}>Manage Doctors</Link></li>
          <li><Link to="/admin/radiologists" className={isActive("/admin/radiologists")}>Manage Radiologists</Link></li>
          
          {/* Theme Toggle Section (New) */}
          <div className="divider my-2"></div>
          
          <li>
            <button onClick={toggleTheme} className="flex gap-4">
              {/* Sun Icon */}
              {theme === 'dark' ? (
                 <>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                   Switch to Light Mode
                 </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  Switch to Dark Mode
                </>
              )}
            </button>
          </li>

          <div className="mt-auto"></div>
          <li><Link to="/login" className="text-error bg-base-200 mt-4">Logout</Link></li>
        </ul>
      </div>
    </div>
  );
}