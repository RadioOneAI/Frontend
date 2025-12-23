import React, { useEffect, useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme); // daisyUI theme
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <header className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl gap-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold">MySite</span>
        </a>
      </div>

      {/* Middle: Buttons */}
      <div className="navbar-center hidden md:flex">
        <div className="join">
          <a className="btn btn-ghost join-item">Home</a>
          <a className="btn btn-ghost join-item">Features</a>
          <a className="btn btn-ghost join-item">Pricing</a>
          <a className="btn btn-ghost join-item">Contact</a>
        </div>
      </div>

      {/* Right: Theme + Auth */}
      <div className="navbar-end gap-2">
        {/* Theme toggle */}
        <button className="btn btn-ghost btn-circle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? (
            // moon icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8 8 0 1010.586 10.586z" />
            </svg>
          ) : (
            // sun icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm0 10a3 3 0 100-6 3 3 0 000 6zm7-3a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM6 10a1 1 0 01-1 1H4a1 1 0 110-2h1a1 1 0 011 1zm9.657 5.657a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414zM6.464 6.464a1 1 0 01-1.414 0l-.707-.707A1 1 0 115.757 4.343l.707.707a1 1 0 010 1.414zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.243.95a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zm8.486-11.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Auth buttons */}
        <a className="btn btn-ghost">Login</a>
        <a className="btn btn-primary">Sign Up</a>

        {/* Mobile menu */}
        <div className="dropdown dropdown-end md:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Home</a></li>
            <li><a>Features</a></li>
            <li><a>Pricing</a></li>
            <li><a>Contact</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
}