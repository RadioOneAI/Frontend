import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Brain from "../assets/images/Brain.json";

const API_BASE = "http://127.0.0.1:5000";

const ROLE_ROUTES = {
  admin: "/admin/dashboard",
  receptionist: "/receptionist/dashboard",
  doctor: "/doctor/dashboard",
  radiologist: "/radiologist/dashboard",
  radiographer: "/radiographer/dashboard",
  patient: "/patient/dashboard",
};

export default function LoginForm({ onSuccess }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: cleanIdentifier,
          password,
        }),
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        const msg = json?.message || "Login failed. Try again.";
        setError(msg);
        toast.error(msg);
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
        return;
      }

      localStorage.setItem("access_token", accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Login successful. Welcome ${user?.name || "back"}!`);

      const role = String(user.role || "").toLowerCase();
      const target = ROLE_ROUTES[role] || "/";

      if (onSuccess) onSuccess();

      setTimeout(() => {
        navigate(target, { replace: true });
      }, 1200);
    } catch (err) {
      const msg = "Server error. Check backend is running.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

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

          <input
            type="text"
            placeholder="clinician_user"
            className="input input-bordered w-full h-12 rounded-xl bg-base-200/50 border-base-content/5 focus:bg-base-100 transition-all font-medium"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="space-y-2 login-item">
          <label className="text-xs font-bold uppercase tracking-widest text-base-content/40 ml-1">
            Password
          </label>

          <input
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full h-12 rounded-xl bg-base-200/50 border-base-content/5 focus:bg-base-100 transition-all font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

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
          {loading ? "" : "Sign In"}
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
  );
}