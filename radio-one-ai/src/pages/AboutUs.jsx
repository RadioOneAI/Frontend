import React, { useRef } from "react";
import { Link } from "react-router-dom";
import aboutHeroImage from "../assets/images/about_hero.png"; 
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "react-countup";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const container = useRef();

  useGSAP(
    () => {
      // Hero animations
      gsap.from(".about-hero-text", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".about-hero-image", {
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });

      // Mission/Vision cards animation
      // gsap.from(".mission-card", {
      //   scrollTrigger: {
      //     trigger: ".mission-section",
      //     start: "top 80%",
      //   },
      //   y: 50,
      //   opacity: 0,
      //   stagger: 0.2,
      //   duration: 0.8,
      //   ease: "power2.out",
      // });

      // Stats animation
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 85%",
        },
        scale: 0.9,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative bg-mesh py-20 lg:py-32 overflow-hidden border-b border-base-content/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="about-hero-text space-y-8 text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-widest">
              Our Story
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Pioneering the Future of <span className="text-gradient">Medical Imaging</span>
            </h1>
            <p className="text-xl lg:text-2xl text-base-content/70 leading-relaxed max-w-xl mx-auto lg:mx-0">
              At RadioOneAI, we bridge the gap between advanced deep learning and clinical workflows. 
              Our mission is to empower radiologists with precision, speed, and confidence.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
               <Link to="/contact" className="btn btn-primary btn-lg px-10 h-16 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                 Partner With Us
               </Link>
               <Link to="/signup" className="btn btn-ghost btn-lg px-10 h-16 rounded-full border-2 border-base-content/10 hover:bg-base-200 transition-all">
                 Try Demo
               </Link>
            </div>
          </div>

          <div className="about-hero-image relative">
            <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-3xl transform rotate-3" />
            <img 
              src={aboutHeroImage} 
              alt="Future of Radiology" 
              className="relative z-10 w-full h-[500px] rounded-[2rem] shadow-2xl object-cover grayscale hover:grayscale-0 transition-all duration-700" 
            />
          </div>
        </div>
      </section>

      {/* --- MISSION & VISION SECTION --- */}
      <section className="mission-section py-32 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold">Why We Exist</h2>
            <p className="text-xl text-base-content/50 max-w-2xl mx-auto font-medium">Driven by technology, grounded in healthcare.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            {
              title: "Our Mission",
              desc: "To revolutionize medical imaging by integrating state-of-the-art AI diagnostics directly into the hands of healthcare professionals, ensuring early detection and better patient outcomes worldwide.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              color: "primary"
            },
            {
              title: "Our Vision",
              desc: "A future where AI is an invisible, trusted partner in every reading room, reducing burnout for doctors and providing clarity for patients through transparent, explainable AI reports.",
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
              color: "secondary"
            }
          ].map((item, i) => (
            <div key={i} className="mission-card glass-card p-10 rounded-[2.5rem] group hover:bg-base-100/40 transition-all duration-500">
              <div className={`w-16 h-16 rounded-2xl bg-${item.color}/10 text-${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-3xl font-bold mb-6">{item.title}</h3>
              <p className="text-lg text-base-content/60 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="stats-section py-24 bg-base-200/50 border-y border-base-content/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              {[
                { label: "Diagnostic Accuracy", value: 98.6, suffix: "%", color: "primary" },
                { label: "Partner Hospitals", value: 50, suffix: "+", color: "primary" },
                { label: "Scans Processed", value: 10, suffix: "k+", color: "primary" },
              ].map((stat, i) => (
                <div key={i} className="stat-item space-y-2">
                    <div className={`text-6xl font-black text-${stat.color}`}>
                      <CountUp end={stat.value} duration={3} decimals={stat.value % 1 !== 0 ? 1 : 0} enableScrollSpy />
                      {stat.suffix}
                    </div>
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-base-content/40">{stat.label}</div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6 max-w-5xl mx-auto">
        <div className="glass-card p-16 rounded-[3rem] text-center space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight relative z-10">Ready to transform your workflow?</h2>
          <p className="text-xl text-base-content/60 max-w-2xl mx-auto relative z-10">
            Join the thousands of radiologists who trust RadioOneAI for more efficient and accurate reporting.
          </p>
          <div className="pt-6 relative z-10">
            <Link to="/contact" className="btn btn-primary btn-xl px-12 h-20 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1 active:scale-95">
                Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
