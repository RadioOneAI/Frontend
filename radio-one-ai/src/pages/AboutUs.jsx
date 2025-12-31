import React from "react";
import { Link } from "react-router-dom";
// 1. Import the new image
import aboutHeroImage from "../assets/images/about_hero.png"; 

export default function AboutUs() {
  return (
    <div className="min-h-svh bg-base-100">

      {/* --- MODERN HERO SECTION --- */}
      <div className="hero bg-base-200 min-h-[70vh]">
        <div className="hero-content flex-col lg:flex-row gap-12 max-w-7xl mx-auto px-4 py-12">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Pioneering the Future of <span className="text-primary">Medical Imaging</span>
            </h1>
            <p className="py-2 text-xl text-base-content/70 leading-relaxed mb-6">
              At RadioOneAI, we bridge the gap between advanced deep learning and clinical workflows. Our mission is to empower radiologists with precision, speed, and confidence.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
               <Link to="/contact" className="btn btn-primary btn-lg">Partner With Us</Link>
               <Link to="/signup" className="btn btn-outline btn-lg">Try Demo</Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1">
            <img 
              src={aboutHeroImage} 
              alt="Future of Radiology Team" 
              className="w-full rounded-2xl shadow-2xl hover:scale-[1.01] transition-transform duration-500 object-cover" 
            />
          </div>

        </div>
      </div>

      {/* --- MISSION & VISION --- */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Why We Exist</h2>
            <p className="text-base-content/60 mt-2">Driven by technology, grounded in healthcare.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="card bg-base-100 shadow-xl border border-primary/20 hover:border-primary transition-colors duration-300">
            <div className="card-body">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="card-title text-2xl mb-2">Our Mission</h2>
              <p className="text-base-content/70 leading-relaxed">
                To revolutionize medical imaging by integrating state-of-the-art AI diagnostics directly into the hands of healthcare professionals, ensuring early detection and better patient outcomes worldwide.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-secondary/20 hover:border-secondary transition-colors duration-300">
            <div className="card-body">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h2 className="card-title text-2xl mb-2">Our Vision</h2>
              <p className="text-base-content/70 leading-relaxed">
                A future where AI is an invisible, trusted partner in every reading room, reducing burnout for doctors and providing clarity for patients through transparent, explainable AI reports.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="bg-neutral text-neutral-content py-20">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-content/20">
                <div className="p-4">
                    <div className="text-5xl font-black text-primary mb-2">98%</div>
                    <div className="text-sm opacity-80 uppercase tracking-widest font-semibold">Diagnostic Accuracy</div>
                </div>
                <div className="p-4">
                    <div className="text-5xl font-black text-secondary mb-2">50+</div>
                    <div className="text-sm opacity-80 uppercase tracking-widest font-semibold">Partner Hospitals</div>
                </div>
                <div className="p-4">
                    <div className="text-5xl font-black text-accent mb-2">10k+</div>
                    <div className="text-sm opacity-80 uppercase tracking-widest font-semibold">Scans Processed</div>
                </div>
            </div>
        </div>
      </div>

      {/* --- TEAM/CTA SECTION --- */}
      <div className="max-w-4xl mx-auto text-center py-24 px-4">
        <h2 className="text-4xl font-bold mb-6">Ready to transform your workflow?</h2>
        <p className="mb-10 text-xl opacity-70">Join the thousands of radiologists who trust RadioOneAI.</p>
        <Link to="/contact" className="btn btn-primary btn-xl px-12 rounded-full shadow-lg hover:shadow-primary/50 transition-all">
            Get in Touch
        </Link>
      </div>

    </div>
  );
}