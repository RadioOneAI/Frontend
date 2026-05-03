import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import { Link, useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";

export default function Header() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] w-full border-b border-base-content/5 bg-base-100/70 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-all" />
                  <img src={logo} alt="RadioOneAI Logo" className="w-12 h-12 object-contain relative z-10" />
                </div>
                <span className="font-black text-2xl tracking-tighter text-base-content">
                  RadioOne<span className="text-base-content">AI</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold transition-all hover:text-primary ${
                    location.pathname === link.path ? "text-primary" : "text-base-content/70"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Action Section */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                )}
              </button>

              {/* Auth Button */}
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="hidden sm:flex btn btn-primary px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              >
                Login
              </button>

              {/* Mobile Menu Toggle */}
              <div className="dropdown dropdown-end md:hidden">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-2xl bg-base-100 rounded-2xl w-64 border border-base-content/5">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="py-3 font-semibold">{link.name}</Link>
                    </li>
                  ))}
                  <div className="divider opacity-50 my-2"></div>
                  <li>
                    <button onClick={() => setIsLoginOpen(true)} className="btn btn-primary btn-sm rounded-xl">Login</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- LOGIN MODAL --- */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          {/* Backdrop with Blur */}
          <div 
            className="absolute inset-0 bg-base-300/40 backdrop-blur-xl transition-all duration-500"
            onClick={() => setIsLoginOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-[440px] glass-card p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 animate-modal-pop">
            {/* Close Button */}
            <button 
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-6 right-6 btn btn-ghost btn-circle btn-sm hover:rotate-90 transition-transform"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <LoginForm onSuccess={() => setIsLoginOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}