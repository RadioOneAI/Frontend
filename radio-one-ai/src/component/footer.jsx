import React from "react";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", path: "/features" },
        { name: "Solutions", path: "/solutions" },
        { name: "Pricing", path: "/pricing" },
        { name: "Updates", path: "/changelog" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", path: "/docs" },
        { name: "API Reference", path: "/api" },
        { name: "Help Center", path: "/help" },
        { name: "Community", path: "/community" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Contact", path: "/contact" },
        { name: "Partners", path: "/partners" },
      ],
    },
  ];

  return (
    <footer className="bg-base-200 border-t border-base-content/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="RadioOneAI Logo" className="w-12 h-12 object-contain" />
              <span className="font-black text-2xl tracking-tighter text-base-content">
                RadioOne<span className="text-base-content">AI</span>
              </span>
            </Link>
            <p className="text-base-content/60 text-lg max-w-sm leading-relaxed">
              Empowering radiology with state-of-the-art DL models for faster,
              more accurate, and clinician-ready reporting.
            </p>

          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="font-bold text-base uppercase tracking-widest text-base-content/40">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-base-content/70 hover:text-primary transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider opacity-5"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 text-sm font-semibold text-base-content/40 uppercase tracking-widest">
          <p>© {year} RadioOneAI. Built for clinicians by AI experts.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
