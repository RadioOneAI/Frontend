import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Public Components
import Header from "./component/Header";
import Footer from "./component/Footer";
import Hero from "./pages/Hero/hero";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import UserProfile from "./pages/UserProfile";
import ContactUs from "./pages/ContactUs"; 
import AboutUs from "./pages/AboutUs";

// Admin Components
import AdminLayout from "./pages/Admin/AdminLayout";
import DashboardHome from "./pages/Admin/DashboardHome";
import Settings from "./pages/Admin/Settings"; 
import ManageDoctors from "./pages/Admin/ManageDoctors"; 
import ManageRadiologists from "./pages/Admin/ManageRadiologists"; 
import ManageRadiographers from "./pages/Admin/ManageRadiographers"; // <--- 1. IMPORT ADDED
import ManagePatients from "./pages/Admin/ManagePatients"; 
import ManageReceptionists from "./pages/Admin/ManageReceptionists";
import SystemLogs from "./pages/Admin/SystemLogs"; 

// Receptionist Components
import ReceptionistLayout from "./pages/Receptionist/ReceptionistLayout"
import ReceptionistSettings from "./pages/Receptionist/Settings";
import ReceptionistManagePatients from "./pages/Receptionist/ManagePatients";
import ReceptionistSystemLogs from "./pages/Receptionist/SystemLogs";
import ReceptionistDashboard from "./pages/Receptionist/ReceptionistDashboard";

// Radiographer Components
import RadiographerLayout from "./pages/Radiographer/RadiographerLayout";
import RadiographerAppointments from "./pages/Radiographer/Appointments";
import RadiographerSettings from "./pages/Radiographer/Settings";
import RadiographerSystemLogs from "./pages/Radiographer/SystemLogs";
import RadiographerDashboard from "./pages/Radiographer/RadiographerDashboard";

// Radiologist Components
import RadiologistDashboard from "./pages/Radiologist/RadiologistDashboard";
import RadiologisAppointment from "./pages/Radiologist/Radiologistretrieve";
import RadiologisrLayout from "./pages/Radiologist/RadiologisrLayout";
import RadiologistSettings from "./pages/Radiologist/Settings";
import RadiologistSystemLogs from "./pages/Radiologist/SystemLogs";

// Doctor Components
import DoctorLayout from "./pages/Doctor/DoctorLayout";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorPatients from "./pages/Doctor/DoctorPatients";
import DoctorSettings from "./pages/Doctor/DoctorSettings";

// Patient Components
import PatientLayout from "./pages/Patient/PatientLayout";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import PatientReports from "./pages/Patient/PatientReports";
import PatientSettings from "./pages/Patient/PatientSettings";


// 1. Create a Layout component to handle conditional rendering
function Layout({ children }) {
  const location = useLocation();

  // --- ADMIN LAYOUT LOGIC ---
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // --- RECEPTIONIST LAYOUT LOGIC ---
  const isReceptionistRoute = location.pathname.startsWith("/receptionist");

  if (isReceptionistRoute) {
    return <ReceptionistLayout>{children}</ReceptionistLayout>;
  }

  // --- RADIOGRAPHER LAYOUT LOGIC ---
  const isRadiographerRoute = location.pathname.startsWith("/radiographer");

  if (isRadiographerRoute) {
    return <RadiographerLayout>{children}</RadiographerLayout>;
  }

  // --- RADIOLOGIST LAYOUT LOGIC ---
  const isRadiologistRoute = location.pathname.startsWith("/radiologist");

  if (isRadiologistRoute) {
    return <RadiologisrLayout>{children}</RadiologisrLayout>;
  }

  // --- DOCTOR LAYOUT LOGIC ---
  const isDoctorRoute = location.pathname.startsWith("/doctor");

  if (isDoctorRoute) {
    return <DoctorLayout>{children}</DoctorLayout>;
  }

  // --- PATIENT LAYOUT LOGIC ---
  const isPatientRoute = location.pathname.startsWith("/patient");

  if (isPatientRoute) {
    return <PatientLayout>{children}</PatientLayout>;
  }

  // --- PUBLIC LAYOUT LOGIC ---
  const hideOnPaths = ["/login", "/signup"];
  const showHeaderFooter = !hideOnPaths.includes(location.pathname);

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          
          {/* --- Public Routes --- */}
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />

          {/* --- Admin Routes --- */}
          <Route path="/admin/dashboard" element={<DashboardHome />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/doctors" element={<ManageDoctors />} />
          <Route path="/admin/radiologists" element={<ManageRadiologists />} />
          <Route path="/admin/radiographers" element={<ManageRadiographers />} /> {/* <--- 2. ROUTE ADDED */}
          <Route path="/admin/patients" element={<ManagePatients />} />
          <Route path="/admin/receptionists" element={<ManageReceptionists />} />
          <Route path="/admin/logs" element={<SystemLogs />} />


          {/* --- Receptionist Routes --- */}
          <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
          <Route path="/receptionist/patients" element={<ReceptionistManagePatients />} />
          <Route path="/receptionist/settings" element={<ReceptionistSettings />} />
          <Route path="/receptionist/logs" element={<ReceptionistSystemLogs />} />


          {/* --- Radiographer Routes --- */}
          <Route path="/radiographer/dashboard" element={<RadiographerDashboard />} />
          <Route path="/radiographer/appointments" element={<RadiographerAppointments />} />
          <Route path="/radiographer/settings" element={<RadiographerSettings />} />
          <Route path="/radiographer/logs" element={<RadiographerSystemLogs />} />

          {/* --- Radiologist Routes --- */}
          <Route path="/radiologist/dashboard" element={<RadiologistDashboard />} />
          <Route path="/radiologist/appointments" element={<RadiologisAppointment/>} />
          <Route path="/radiologist/settings" element={<RadiologistSettings />} />
          <Route path="/radiologist/logs" element={<RadiologistSystemLogs />} />

          {/* --- Doctor Routes --- */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/settings" element={<DoctorSettings />} />

          {/* --- Patient Routes --- */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/reports" element={<PatientReports />} />
          <Route path="/patient/settings" element={<PatientSettings />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}