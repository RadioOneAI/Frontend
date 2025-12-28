import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Public Components
import Header from "./component/Header";
import Footer from "./component/Footer";
import Hero from "./pages/Hero/hero";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import UserProfile from "./pages/UserProfile";

// Admin Components
import AdminLayout from "./pages/Admin/AdminLayout";
import DashboardHome from "./pages/Admin/DashboardHome";
import Settings from "./pages/Admin/Settings"; // Import the Settings page
import ManageDoctors from "./pages/Admin/ManageDoctors"; // Import Manage Doctors page
import ManageRadiologists from "./pages/Admin/ManageRadiologists"; // Import Manage Radiologists page
import ManagePatients from "./pages/Admin/ManagePatients"; // Import Manage Patients page
import SystemLogs from "./pages/Admin/SystemLogs"; // Import System Logs page

// Receptionist Components
import ReceptionistLayout from "./pages/Receptionist/ReceptionistLayout"
import ReceptionistSettings from "./pages/Receptionist/Settings";
import ReceptionistManagePatients from "./pages/Receptionist/ManagePatients";
import ReceptionistSystemLogs from "./pages/Receptionist/SystemLogs";

// 1. Create a Layout component to handle conditional rendering
function Layout({ children }) {
  const location = useLocation();

  // --- ADMIN LAYOUT LOGIC ---
  // Check if the user is visiting an Admin page (any URL starting with /admin)
  const isAdminRoute = location.pathname.startsWith("/admin");

  // If it is an Admin route, render the AdminLayout (Sidebar + Content) instead of the public one
  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // --- RECEPTIONIST LAYOUT LOGIC ---
  // Check if the user is visiting a Receptionist page (any URL starting with /receptionist)
  const isReceptionistRoute = location.pathname.startsWith("/receptionist");

  // If it is a Receptionist route, render the ReceptionistLayout (Sidebar + Content)
  if (isReceptionistRoute) {
    return <ReceptionistLayout>{children}</ReceptionistLayout>;
  }

  // --- PUBLIC LAYOUT LOGIC ---
  // Define which public paths should hide the Header/Footer (Auth pages)
  const hideOnPaths = ["/login", "/signup"];
  
  // Check if current path is in the list
  const showHeaderFooter = !hideOnPaths.includes(location.pathname);

  return (
    <>
      {/* Show Header only if not on Login/Signup pages */}
      {showHeaderFooter && <Header />}
      
      {/* Render the Page Content */}
      {children}
      
      {/* Show Footer only if not on Login/Signup pages */}
      {showHeaderFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* 2. Wrap routes inside the Layout to handle the switching logic */}
      <Layout>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* --- Admin Routes --- */}
          <Route path="/admin/dashboard" element={<DashboardHome />} />
          
          {/* New Settings Route */}
          <Route path="/admin/settings" element={<Settings />} />
          
          {/* Manage Doctors Page */}
          <Route path="/admin/doctors" element={<ManageDoctors />} />
          
          {/* Manage Radiologists Page */}
          <Route path="/admin/radiologists" element={<ManageRadiologists />} />
          
          {/* Manage Patients Page */}
          <Route path="/admin/patients" element={<ManagePatients />} />
          
          {/* System Logs Page */}
          <Route path="/admin/logs" element={<SystemLogs />} />

          {/* Receptionist Settings Route */}
          <Route path="/receptionist/settings" element={<ReceptionistSettings />} />

          {/* Receptionist Manage Patients Page */}
          <Route path="/receptionist/patients" element={<ReceptionistManagePatients />} />

          {/* Receptionist System Logs Page */}
          <Route path="/receptionist/logs" element={<ReceptionistSystemLogs />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}