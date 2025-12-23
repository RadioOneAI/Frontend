import React from "react";
import Lottie from "lottie-react";
import Brain from "../../assets/images/Brain.json";
import CountUp from "react-countup";

export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <main className="flex-1">
        {/* HERO */}
        <section className="hero bg-base-100">
          <div className="hero-content w-full max-w-7xl mx-auto px-4 py-12 flex-col lg:flex-row gap-10">
            <Lottie animationData={Brain} />

            <div className="max-w-xl">
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <span className="badge badge-success badge-outline">
                    Radiology{" "}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning badge-outline">
                    Doctor
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-error badge-outline">
                    Patient
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-info badge-outline">
                    AI Assisted
                  </span>
                </div>
              </div>

              <h1 className="mt-6 text-3xl sm:text-4xl xl:text-6xl font-semibold leading-tight">
                Generate <span className="text-brand-blue">Editable</span>{" "}
                Reports With <br />
                <span className="text-primary">DL models</span>
              </h1>

              <p className="py-5 text-muted text-base md:text-lg">
                Upload studies, run models, and refine findings into
                clinician-ready reports — fast, consistent, and reviewable.
              </p>

              <div className="flex flex-wrap gap-3">
                <button className="btn btn-soft btn-primary">
                  Get Started
                </button>
                <button className="btn">
                  <span className="loading loading-spinner"></span>
                  loading
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <span className="badge badge-success badge-outline">
                    Secure
                  </span>
                  <span>Role-based access</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-info badge-outline">Fast</span>
                  <span>Optimized UX</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning badge-outline">
                    Reliable
                  </span>
                  <span>Production-ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="bg-base-200 border-y border-base-300">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Stat 1 */}
              <div className="stat bg-base-100 rounded-2xl shadow-sm border border-base-300">
                <div className="stat-title text-muted">User Appointments</div>
                <div className="stat-value text-primary">
                  <CountUp end={1200} duration={1.8} separator="," />+
                </div>
                <div className="stat-desc text-muted">Managed monthly</div>
              </div>

              {/* Stat 2 */}
              <div className="stat bg-base-100 rounded-2xl shadow-sm border border-base-300">
                <div className="stat-title text-muted">Response Time</div>
                <div className="stat-value">
                  {"< "} <CountUp end={2} decimals={1} duration={1.6} />s
                </div>
                <div className="stat-desc text-muted">Fast UI experience</div>
              </div>

              {/* Stat 3 */}
              <div className="stat bg-base-100 rounded-2xl shadow-sm border border-base-300">
                <div className="stat-title text-muted">Uptime</div>
                <div className="stat-value">
                  <CountUp end={99.9} decimals={1} duration={1.8} />%
                </div>
                <div className="stat-desc text-muted">Reliable systems</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content">
              Everything you need in one place
            </h2>
            <p className="mt-3 text-muted">
              Build modules like patients, appointments, billing, and reports
              with a consistent UI.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Patient Management",
                desc: "Profiles, history, and secure records access.",
              },
              {
                title: "Appointments",
                desc: "Scheduling, reminders, and doctor availability.",
              },
              {
                title: "Analytics Dashboard",
                desc: "KPIs, charts, and smart insights.",
              },
              {
                title: "Role-Based Access",
                desc: "Admin, doctor, staff, and patient permissions.",
              },
              {
                title: "Fast UI Components",
                desc: "Reusable components with daisyUI.",
              },
              {
                title: "Clean Theme System",
                desc: "Hospital light theme + night dark mode.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card bg-base-200 border border-base-300 rounded-2xl"
              >
                <div className="card-body">
                  <h3 className="card-title">{f.title}</h3>
                  <p className="text-muted">{f.desc}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-sm btn-ghost">Learn more</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="card bg-primary text-primary-content rounded-2xl shadow-lg">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl md:text-3xl">
                Ready to build your system?
              </h2>
              <p className="opacity-90 max-w-2xl">
                Start with the main modules and expand step-by-step with a clean
                UI standard.
              </p>
              <div className="card-actions mt-3">
                <button className="btn btn-secondary">Create Account</button>
                <button className="btn btn-outline btn-ghost">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
