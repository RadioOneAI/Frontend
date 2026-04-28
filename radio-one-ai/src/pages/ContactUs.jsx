import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ContactUs() {
  const container = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  useGSAP(
    () => {
      // Entrance animations
      gsap.from(".contact-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // gsap.from(".contact-info-card", {
      //   x: -30,
      //   opacity: 0,
      //   stagger: 0.2,
      //   duration: 0.8,
      //   delay: 0.2,
      //   ease: "power3.out",
      // });

      gsap.from(".contact-form-container", {
        x: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      });
    },
    { scope: container }
  );

  const contactDetails = [
    {
      title: "Email Support",
      value: "support@radiooneai.com",
      desc: "Our technical team is here for you 24/7.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "primary"
    },
    {
      title: "Call Us",
      value: "+1 (888) RADIO-AI",
      desc: "Mon-Fri from 9am to 6pm EST.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: "secondary"
    },
    {
      title: "Visit Our Office",
      value: "Innovation Hub, Silicon Valley",
      desc: "123 AI Boulevard, Tech Suite 404.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "accent"
    }
  ];

  return (
    <div ref={container} className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* --- HEADER --- */}
      <section className="relative bg-mesh pt-24 pb-20 border-b border-base-content/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 contact-header text-center lg:text-left">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-widest mb-6">
            Contact Us
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            How can we <span className="text-gradient">help you?</span>
          </h1>
          <p className="text-xl lg:text-2xl text-base-content/60 max-w-2xl leading-relaxed">
            Have questions about our AI models or want to schedule a demo? 
            Our team of clinical AI experts is ready to assist you.
          </p>
        </div>
      </section>

      {/* --- CONTENT --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            {contactDetails.map((detail, i) => (
              <div key={i} className="contact-info-card glass-card p-8 rounded-3xl group hover:bg-base-100/40 transition-all duration-500">
                <div className="flex gap-6 items-center">
                  <div className={`w-14 h-14 rounded-2xl bg-${detail.color}/10 text-${detail.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {detail.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-widest text-base-content/40 mb-1">{detail.title}</h3>
                    <p className="text-xl font-bold text-base-content mb-1">{detail.value}</p>
                    <p className="text-base-content/50">{detail.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Support Box */}
            <div className="contact-info-card p-10 rounded-[2.5rem] bg-linear-to-br from-primary to-secondary text-primary-content relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Enterprise Support</h3>
                <p className="text-lg opacity-90 mb-8 leading-relaxed">
                  Looking for custom integration or hospital-wide deployment? 
                  Speak directly with our clinical solutions architects.
                </p>
                <button className="btn btn-ghost bg-white/20 border-none text-white hover:bg-white/30 rounded-full px-8">
                  Schedule a Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 contact-form-container">
            <div className="glass-card p-10 lg:p-16 rounded-[3rem] shadow-2xl border border-base-content/5">
              <h2 className="text-3xl font-bold mb-10 tracking-tight">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-base-content/40 ml-1">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane" 
                      className="input input-bordered w-full h-16 rounded-2xl bg-base-200/50 border-base-content/5 focus:bg-base-100 transition-all text-lg font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest text-base-content/40 ml-1">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      className="input input-bordered w-full h-16 rounded-2xl bg-base-200/50 border-base-content/5 focus:bg-base-100 transition-all text-lg font-medium" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-base-content/40 ml-1">Work Email</label>
                  <input 
                    type="email" 
                    placeholder="jane@hospital.com" 
                    className="input input-bordered w-full h-16 rounded-2xl bg-base-200/50 border-base-content/5 focus:bg-base-100 transition-all text-lg font-medium" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-base-content/40 ml-1">How can we help?</label>
                  <select className="select select-bordered w-full h-16 rounded-2xl bg-base-200/50 border-base-content/5 focus:bg-base-100 transition-all text-lg font-medium">
                    <option disabled selected>Select a topic</option>
                    <option>Product Inquiry</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-base-content/40 ml-1">Message</label>
                  <textarea 
                    placeholder="Tell us about your needs..." 
                    className="textarea textarea-bordered w-full min-h-[180px] rounded-[1.5rem] bg-base-200/50 border-base-content/5 focus:bg-base-100 transition-all text-lg font-medium p-6"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-full h-20 rounded-full text-xl font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Send Message
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
