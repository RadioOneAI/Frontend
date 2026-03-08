import React from "react";
import Lottie from "lottie-react";
import Brain from "../../assets/images/Brain.json";
import CountUp from "react-countup";

export default function Hero() {
  return (
    <div className="min-h-svh flex flex-col bg-base-100">
        {/* HERO */}
        <section className="hero bg-base-100">
          <div className="hero-content w-full max-w-7xl mx-auto px-4 py-12 flex-col lg:flex-row gap-40">
            <Lottie animationData={Brain} className="w-full h-auto" />
            <div className="max-w-xl">
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <span className="badge badge-success badge-outline text-xl">
                    Radiology{" "}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning badge-outline text-xl">
                    Doctor
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-error badge-outline text-xl">
                    Patient
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-info badge-outline text-xl">
                    AI Assisted
                  </span>
                </div>
              </div>

              <h1 className="mt-7 text-3xl sm:text-4xl xl:text-6xl font-bold leading-tight">
                <span className="text-brand-blue"> Generate Editable</span>{" "}
                Reports With {""}
                <span className="text-primary">DL Models</span>
              </h1>

              <p className="py-12 text-muted text-2xl">
                Upload studies, run models, and refine findings into
                clinician-ready reports — fast, consistent, and reviewable.
              </p>

              <div className="flex flex-wrap gap-3 mt-4 gap-6">
                <button className="btn btn-dash btn-primary btn-xl">
                  Get Started
                </button>
                <button className="btn btn-dash btn-outline btn-xl">
                    Learn More
                </button>
              </div>
            </div>
          </div>
        </section>     
    </div>
  );
}
