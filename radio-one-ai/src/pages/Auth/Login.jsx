import React, { useRef } from "react";
import LoginForm from "../../component/LoginForm";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Login() {
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(".login-card", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".login-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });
    },
    { scope: container }
  );

  return (
    <div ref={container} className="min-h-screen bg-mesh flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="login-card glass-card w-full max-w-md p-8 lg:p-12 rounded-[2.5rem] shadow-2xl relative z-10 border border-base-content/5">
        <LoginForm />
      </div>
    </div>
  );
}
