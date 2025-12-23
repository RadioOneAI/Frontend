import React from "react";
import logo from "../assets/images/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content">
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
        {/* Top section */}
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Radio One AI logo" className="w-10 h-10 object-contain" />
              <span className="text-2xl font-semibold">Radio One AI</span>
            </div>
            <p className="opacity-80 text-sm leading-relaxed">
              Build fast, clean UI with React + Tailwind + daisyUI.
            </p>
            <div className="flex gap-2 pt-1">
              <a className="btn btn-ghost btn-sm" href="#">Privacy</a>
              <a className="btn btn-ghost btn-sm" href="#">Terms</a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h6 className="footer-title">Product</h6>
            <nav className="grid gap-2 text-sm">
              <a className="link link-hover" href="#">Features</a>
              <a className="link link-hover" href="#">Pricing</a>
              <a className="link link-hover" href="#">Docs</a>
              <a className="link link-hover" href="#">Changelog</a>
            </nav>
          </div>

          {/* Newsletter / Social */}
          <div className="space-y-4">
            <h6 className="footer-title">Stay connected</h6>
            <label className="join w-full" aria-label="Subscribe to newsletter">
              <input
                type="email"
                placeholder="Email address"
                className="input input-bordered join-item w-full"
              />
              <button className="btn btn-primary join-item">Subscribe</button>
            </label>

            <div className="flex items-center gap-3">
              <a className="btn btn-ghost btn-circle" aria-label="X" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2H21l-6.53 7.46L22.5 22h-6.68l-5.23-6.82L4.6 22H2l7.04-8.04L1.5 2h6.8l4.73 6.1L18.244 2zM16.7 20h1.6L7.2 4H5.5l11.2 16z" />
                </svg>
              </a>
              <a className="btn btn-ghost btn-circle" aria-label="GitHub" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.11 3.29 9.44 7.86 10.97.58.11.79-.25.79-.56v-2.1c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.14 1.18.91-.25 1.88-.38 2.84-.38.96 0 1.93.13 2.84.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.18c0 .31.21.68.8.56 4.56-1.54 7.85-5.86 7.85-10.97C23.5 5.74 18.27.5 12 .5z" />
                </svg>
              </a>
              <a className="btn btn-ghost btn-circle" aria-label="LinkedIn" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3A2 2 0 0121 5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.34 18.34V10.9H5.67v7.44h2.67zM7 9.67a1.55 1.55 0 10-1.55-1.55A1.55 1.55 0 007 9.67zM18.34 18.34v-4.06c0-2.17-1.16-3.18-2.7-3.18a2.33 2.33 0 00-2.12 1.17V10.9h-2.6c.03.9 0 7.44 0 7.44h2.6v-4.15a1.73 1.73 0 011.67-1.88c.89 0 1.25.67 1.25 1.66v4.37h2.9z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="divider my-0"></div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm opacity-80">
          <p>© {year} RadioOneAI. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="link link-hover" href="#">Status</a>
            <a className="link link-hover" href="#">Security</a>
            <a className="link link-hover" href="#">Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
