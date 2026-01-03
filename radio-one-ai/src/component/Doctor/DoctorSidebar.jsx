import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function DoctorSidebar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "bg-primary text-primary-content shadow-md"
      : "text-base-content/70 hover:bg-base-200 hover:text-base-content";
  };

  return (
    <div className="h-full flex flex-col bg-base-100 w-50 border-r border-base-300">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <img
          src={logo}
          alt="RadioOneAI Logo"
          className="w-10 h-10 object-contain"
        />
        <div>
          <h1 className="text-xl font-bold tracking-tight">RadioOneAI</h1>
          <p className="text-xs text-base-content/50 uppercase tracking-widest font-semibold">
            Doctor 
          </p>
        </div>
      </div>

      {/* Navigation */}
      <ul className="menu flex-grow px-4 gap-2 text-base font-medium">
        <li>
          <Link
            to="/doctor/dashboard"
            className={`rounded-xl p-3 ${getLinkClass("/doctor/dashboard")}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Dashboard
          </Link>
        </li>

        <li className="menu-title mt-4">
          <span className="text-xs font-bold text-base-content/40 tracking-widest uppercase">
            Clinical
          </span>
        </li>

        <li>
          <Link
            to="/doctor/patients"
            className={`rounded-xl p-3 ${getLinkClass("/doctor/patients")}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            My Patients
          </Link>
        </li>
      </ul>

      {/* Bottom Actions */}
      <div className="p-4 mt-auto">
        <div className="bg-base-200/50 rounded-2xl p-2 space-y-1">
          <ul className="menu text-sm">
            <li className="menu-title px-2">
              <span className="text-xs font-bold text-base-content/40 tracking-widest uppercase">
                System
              </span>
            </li>
            <li>
              <Link
                to="/doctor/settings"
                className={`rounded-lg ${getLinkClass("/doctor/settings")}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </Link>
            </li>
            <li>
              <Link to="/" className="text-error hover:bg-error/10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
