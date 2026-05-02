import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Brain from "../../assets/images/Brain.json";

const API_BASE = "http://127.0.0.1:5000";

const ROLE_ROUTES = {
  admin: "/admin/dashboard",
  receptionist: "/receptionist/dashboard",
  doctor: "/doctor/dashboard",
  radiologist: "/radiologist/dashboard",
  radiographer: "/radiographer/dashboard",
  patient: "/patient/dashboard",
};

export default function Login() {
  const container = useRef(null);
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier || !password) {
      const msg = "Please enter username/email and password.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: cleanIdentifier,
          password,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.success === false) {
        const msg = json?.message || "Login failed. Try again.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      const data = json?.data;
      const accessToken = data?.access_token;
      const refreshToken = data?.refresh_token;
      const user = data?.user;

      if (!accessToken || !user?.role) {
        const msg = "Invalid login response. Token or role missing.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      localStorage.setItem("access_token", accessToken);

      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      localStorage.setItem("user", JSON.stringify(user));

      const username =
        user?.name ||
        user?.username ||
        user?.email ||
        "User";

      toast.success(`Welcome ${username}! Login successful.`, {
        autoClose: 2200,
      });

      const role = String(user.role || "").toLowerCase();
      const target = ROLE_ROUTES[role] || "/";

      setTimeout(() => {
        setLoading(false);
        navigate(target, { replace: true });
      }, 2500);
    } catch (err) {
      const msg = "Server error. Check backend is running.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div
      ref={container}
      className="min-h-screen bg-mesh flex items-center justify-center px-4 relative overflow-hidden"
    >
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        style={{ zIndex: 999999 }}
      />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="login-card glass-card w-full max-w-md p-8 lg:p-12 rounded-[2.5rem] shadow-2xl relative z-10 border border-base-content/5">
        <div className="w-full">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4 group login-item">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all" />
              <Lottie animationData={Brain} className="w-24 h-24 relative z-10" />
            </div>

            <h2 className="text-3xl font-black tracking-tight login-item">
              Welcome <span className="text-gradient">Back</span>
            </h2>

            <p className="text-base-content/50 font-medium text-center mt-2 login-item">
              Sign in to your secure dashboard
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-6 rounded-2xl border-none bg-error/10 text-error font-semibold login-item">
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2 login-item">
              <label className="text-xs font-bold uppercase tracking-widest text-base-content/40 ml-1">
                Username / Email
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="clinician_user"
                  className="input input-bordered w-full h-12 rounded-xl bg-base-200/50 border-base-content/5 focus:bg-base-100 transition-all font-medium pl-10"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />

                <svg
                  className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2 login-item">
              <label className="text-xs font-bold uppercase tracking-widest text-base-content/40 ml-1">
                Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full h-12 rounded-xl bg-base-200/50 border-base-content/5 focus:bg-base-100 transition-all font-medium pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <svg
                  className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <div className="flex justify-end pr-1">
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-primary hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              className={`btn btn-primary w-full h-14 rounded-full text-lg font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1 active:scale-95 login-item ${
                loading ? "loading" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center login-item">
            <p className="text-sm text-base-content/50 font-medium">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}