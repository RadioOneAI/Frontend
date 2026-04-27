import React, { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const container = useRef();

  useGSAP(
    () => {
      // Hero entrance
      gsap.from(".features-hero-content", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Feature cards animation
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
      });

      // Showcase sections
      gsap.from(".showcase-content", {
        scrollTrigger: {
          trigger: ".showcase-section",
          start: "top 70%",
        },
        x: (i) => (i % 2 === 0 ? -50 : 50),
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    },
    { scope: container }
  );

  const coreFeatures = [
    {
      title: "AI-Powered Diagnostics",
      desc: "State-of-the-art deep learning models that analyze medical images with 98%+ accuracy.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "primary"
    },
    {
      title: "Real-time Collaboration",
      desc: "Instantly share findings and reports with colleagues for second opinions and multi-disciplinary reviews.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "secondary"
    },
    {
      title: "Automated Reporting",
      desc: "Generate comprehensive, clinician-ready reports from image findings in seconds, not minutes.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "accent"
    },
    {
      title: "Seamless Integration",
      desc: "Easily integrates with existing PACS and RIS systems via standard HL7 and FHIR protocols.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2 2 2 0 01-2-2V4zm-2 14a2 2 0 012-2h2a2 2 0 012 2v1a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 10l-4 4m0 0l4 4m-4-4h18" />
        </svg>
      ),
      color: "primary"
    },
    {
      title: "Secure & Compliant",
      desc: "Fully HIPAA and GDPR compliant with end-to-end encryption for all patient data.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "success"
    },
    {
      title: "Customizable Workflows",
      desc: "Tailor the platform to match your institution's specific clinical requirements and protocols.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      color: "warning"
    }
  ];

  return (
    <div ref={container} className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-mesh py-24 lg:py-40 overflow-hidden border-b border-base-content/5">
        <div className="max-w-7xl mx-auto px-6 text-center features-hero-content">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-widest mb-8">
            Platform Capabilities
          </div>
          <h1 className="text-5xl lg:text-8xl font-black leading-[1.1] tracking-tight mb-8">
            Next-Gen Tools for <br />
            <span className="text-gradient">Modern Radiology</span>
          </h1>
          <p className="text-xl lg:text-2xl text-base-content/60 max-w-3xl mx-auto leading-relaxed">
            Everything you need to supercharge your diagnostic workflow, 
            from AI-assisted image analysis to automated clinical reporting.
          </p>
          <div className="flex justify-center gap-6 pt-12">
            <button className="btn btn-primary btn-lg px-10 h-16 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
              Start Free Trial
            </button>
            <button className="btn btn-ghost btn-lg px-10 h-16 rounded-full border-2 border-base-content/10 hover:bg-base-200 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* --- CORE FEATURES GRID --- */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold">Core Features</h2>
          <p className="text-xl text-base-content/50 max-w-2xl mx-auto">Built by experts, used by professionals worldwide.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 features-grid">
          {coreFeatures.map((feature, i) => (
            <div key={i} className="feature-card glass-card p-10 rounded-[2.5rem] group hover:bg-base-100/40 transition-all duration-500">
              <div className={`w-16 h-16 rounded-2xl bg-${feature.color}/10 text-${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-lg text-base-content/60 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- DETAILED SHOWCASE --- */}
      <section className="py-32 bg-base-200/50 showcase-section">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {/* Showcase 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center showcase-content">
            <div className="order-2 lg:order-1 space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Explainable AI for <br />
                <span className="text-primary">Clinical Confidence</span>
              </h2>
              <p className="text-xl text-base-content/60 leading-relaxed">
                Our AI doesn't just give results; it explains them. Heatmaps and 
                probability scores help you understand the model's reasoning, 
                ensuring you remain the final authority on every diagnosis.
              </p>
              <ul className="space-y-4">
                {["Saliency maps for visual verification", "Probability distribution charts", "Model confidence scoring"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-semibold text-base-content/80">
                    <div className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative">
               <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-3xl opacity-30" />
               <div className="aspect-video bg-base-300 rounded-[3rem] relative z-10 overflow-hidden shadow-2xl flex items-center justify-center text-base-content/20 font-black text-4xl uppercase tracking-widest">
                  Preview Image
               </div>
            </div>
          </div>

          {/* Showcase 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center showcase-content">
            <div className="relative">
               <div className="absolute inset-0 bg-secondary/20 rounded-[3rem] blur-3xl opacity-30" />
               <div className="aspect-video bg-base-300 rounded-[3rem] relative z-10 overflow-hidden shadow-2xl flex items-center justify-center text-base-content/20 font-black text-4xl uppercase tracking-widest">
                  Preview Image
               </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Universal Compatibility <br />
                <span className="text-secondary">Cloud-Native Architecture</span>
              </h2>
              <p className="text-xl text-base-content/60 leading-relaxed">
                Access your studies and reports from anywhere, on any device. 
                Our cloud-native platform ensures high availability and 
                performance without the need for expensive on-premise hardware.
              </p>
              <ul className="space-y-4">
                {["DICOM & NIfTI support", "Zero-footprint web viewer", "Auto-scaling infrastructure"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-semibold text-base-content/80">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto glass-card p-16 lg:p-24 rounded-[4rem] text-center space-y-10 relative overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10">
          <h2 className="text-5xl lg:text-7xl font-black tracking-tight">Experience the Power <br /> of RadioOneAI</h2>
          <p className="text-xl lg:text-2xl text-base-content/60 max-w-2xl mx-auto">
            Ready to elevate your clinical practice with AI? Join our 
            growing community of forward-thinking radiologists.
          </p>
          <div className="pt-8">
            <Link to="/signup" className="btn btn-primary btn-xl px-16 h-20 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
