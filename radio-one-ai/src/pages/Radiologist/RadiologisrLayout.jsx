import React, { useEffect, useState } from "react";
import RadiologistSidebar from "../../component/Radiologist/RadiologistSidebar";
import RadiologistBreadcrumbs from "../../component/Radiologist/RadiologistBreadcrumbs";
import DateTimeDisplay from "../../component/DateTimeModal";

export default function RadiologisrLayout({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        {/* NAVBAR */}
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-30">
          {/* Hamburger */}
          <div className="flex-none lg:hidden">
            <label htmlFor="admin-drawer" className="btn btn-ghost btn-square">
              ☰
            </label>
          </div>

          {/* Title */}
          <div className="flex-1 px-2">
            <h1 className="text-lg font-bold text-base-content/70">
              Radiologist Portal
            </h1>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* DATE & TIME (LIVE) */}
            

            <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
              {/* ... (Theme Icons) ... */}
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-warning"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-base-content"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <DateTimeDisplay compact />

            {/* AVATAR */}
            <div className="avatar">
              <div className="w-9 rounded-full border">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="User"
                />
              </div>
            </div>
            
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="p-6 flex-grow">
          <RadiologistBreadcrumbs />
          {children}
        </main>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side z-40">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <RadiologistSidebar />
      </div>
    </div>
  );
}
