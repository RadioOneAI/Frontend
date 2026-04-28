import React, { useRef } from "react";
import Lottie from "lottie-react";
import Brain from "../../assets/images/Brain.json";
import CountUp from "react-countup";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const container = useRef();

  useGSAP(
    () => {
      // Entrance animations
      gsap.from(".hero-title", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power4.out",
      });

      gsap.from(".hero-description", {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      });

      gsap.from(".hero-btns", {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        delay: 0.7,
        ease: "back.out(1.7)",
      });

      gsap.from(".hero-visual", {
        x: 50,
        opacity: 0,
        duration: 1.2,
        delay: 0.4,
        ease: "power2.out",
      });

      // Floating animation for lottie
      gsap.to(".hero-visual", {
        y: 15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Background blob animations
      gsap.to(".blob-1", {
        x: "20%",
        y: "10%",
        scale: 1.1,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".blob-2", {
        x: "-15%",
        y: "-20%",
        scale: 1.2,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".blob-3", {
        x: "10%",
        y: "25%",
        scale: 1.15,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="min-h-screen flex flex-col bg-base-100 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-mesh pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="blob-1 absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
          <div className="blob-2 absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]" />
          <div className="blob-3 absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[110px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="hero-title text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight">
              <span className="text-gradient block">Generate Editable</span>
              Reports With{" "}
              <span className="text-primary relative inline-block">
                DL Models
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0 7C20 7 30 2 50 2C70 2 80 7 100 7" stroke="currentColor" strokeWidth="3" fill="none" className="opacity-30" />
                </svg>
              </span>
            </h1>

            <p className="hero-description py-6 text-xl lg:text-2xl text-base-content/70 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Upload studies, run models, and refine findings into
              clinician-ready reports — <span className="text-base-content font-bold border-b-2 border-primary/20">fast, consistent, and reviewable.</span>
            </p>

            <div className="hero-btns flex flex-wrap justify-center lg:justify-start gap-6">
              <button className="btn btn-primary btn-lg px-10 h-16 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="btn btn-ghost btn-lg px-10 h-16 rounded-full border-2 border-base-content/10 hover:bg-base-200 transition-all active:scale-95">
                Learn More
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl">
            <div className="hero-visual relative group">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
              <div className="relative z-10 transition-transform duration-700 group-hover:scale-105">
                <Lottie animationData={Brain} className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY / STATS SECTION */}
      <section className="py-20 bg-base-200/50 border-y border-base-content/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-base-content/30 mb-16">
            Empowering Modern Radiology
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Accuracy", value: 99.9, suffix: "%" },
              { label: "Reports Generated", value: 50, suffix: "k+" },
              { label: "Active Doctors", value: 1200, suffix: "+" },
              { label: "Faster Workflow", value: 4, suffix: "x" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-6xl font-black text-primary mb-3 transition-transform group-hover:scale-110">
                  <CountUp end={stat.value} duration={3} decimals={stat.value % 1 !== 0 ? 1 : 0} enableScrollSpy />
                  {stat.suffix}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-base-content/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK FEATURES SECTION */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
          <div className="flex-1 space-y-8">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">
              Innovation
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">Why choose RadioOne AI?</h2>
            <p className="text-xl text-base-content/60 leading-relaxed">
              Our platform bridges the gap between complex AI models and clinical practice,
              providing tools that feel natural and improve patient outcomes.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                "Instant AI findings detection",
                "Automated report drafting",
                "Full clinician control",
                "Seamless PACS integration"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 font-semibold text-base-content/80">
                  <div className="w-8 h-8 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full lg:max-w-md">
            <div className="glass-card rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl transition-transform group-hover:scale-150" />
              <blockquote className="relative z-10">
                <p className="text-2xl font-medium italic text-base-content leading-relaxed">
                  "RadioOne has transformed our department's efficiency overnight. The accuracy and speed are unparalleled."
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary" />
                  <div>
                    <cite className="block font-bold not-italic text-lg">Dr. Sarah Johnson</cite>
                    <span className="text-sm font-medium text-base-content/50 uppercase tracking-widest">Lead Radiologist</span>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
