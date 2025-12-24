import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./component/header";
import Footer from "./component/footer";
import Hero from "./pages/Hero/hero";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// Layout component to handle conditional rendering
function Layout({ children }) {
  const location = useLocation();
  // Define which paths should hide the Header/Footer
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
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}