import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  // Helper to highlight active menu item
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r border-base-300">
      {/* Logo */}
      <li className="mb-8">
        <Link to="/" className="text-2xl font-bold text-primary px-4 hover:bg-transparent">
          RadioOne<span className="text-base-content">Admin</span>
        </Link>
      </li>

      {/* Main Links */}
      <li>
        <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>
          Dashboard Overview
        </Link>
      </li>
      
      <div className="divider my-2 text-xs opacity-50 font-bold uppercase text-left px-4">User Management</div>
      
      <li>
        <Link to="/admin/doctors" className={isActive("/admin/doctors")}>
          Manage Doctors
        </Link>
      </li>
      <li>
        <Link to="/admin/radiologists" className={isActive("/admin/radiologists")}>
          Manage Radiologists
        </Link>
      </li>
      
      <div className="divider my-2 text-xs opacity-50 font-bold uppercase text-left px-4">System</div>

      <li>
        <Link to="/admin/settings" className={isActive("/admin/settings")}>
          Settings
        </Link>
      </li>

      {/* Logout */}
      <div className="mt-auto"></div>
      <li>
        <Link to="/login" className="text-error bg-base-200 mt-4">
          Logout
        </Link>
      </li>
    </ul>
  );
}