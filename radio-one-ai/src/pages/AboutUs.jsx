import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-svh bg-base-100">
      
      {/* Hero Section */}
      <div className="hero bg-base-200 py-20">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Pioneering AI in Radiology</h1>
            <p className="py-6 text-xl text-base-content/80">
              At RadioOneAI, we are dedicated to bridging the gap between advanced deep learning models and clinical workflow. Our mission is to empower radiologists with precision, speed, and confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="card bg-base-100 shadow-xl border border-primary/20">
            <div className="card-body">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="card-title text-2xl mb-2">Our Mission</h2>
              <p className="text-base-content/70 leading-relaxed">
                To revolutionize medical imaging by integrating state-of-the-art AI diagnostics directly into the hands of healthcare professionals, ensuring early detection and better patient outcomes worldwide.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-secondary/20">
            <div className="card-body">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h2 className="card-title text-2xl mb-2">Our Vision</h2>
              <p className="text-base-content/70 leading-relaxed">
                A future where AI is an invisible, trusted partner in every reading room, reducing burnout for doctors and providing clarity for patients through transparent, explainable AI reports.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-neutral text-neutral-content py-16">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                    <div className="text-4xl font-bold text-primary mb-2">98%</div>
                    <div className="text-sm opacity-80 uppercase tracking-wide">Accuracy Rate</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-secondary mb-2">50+</div>
                    <div className="text-sm opacity-80 uppercase tracking-wide">Partner Hospitals</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-accent mb-2">10k+</div>
                    <div className="text-sm opacity-80 uppercase tracking-wide">Scans Processed</div>
                </div>
            </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto text-center py-20 px-4">
        <h2 className="text-3xl font-bold mb-6">Join the Revolution</h2>
        <p className="mb-8 text-lg opacity-70">Experience the power of AI-assisted radiology today.</p>
        <Link to="/contact" className="btn btn-primary btn-lg px-8">Contact Our Team</Link>
      </div>

    </div>
  );
}