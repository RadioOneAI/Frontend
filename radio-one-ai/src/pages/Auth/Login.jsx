import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Brain from "../../assets/images/Brain.json";

const API_BASE = "http://127.0.0.1:5000";

const ROLE_ROUTES = {
  admin: "/admin/dashboard",
  receptionist: "/receptionist/dashboard",
  doctor: "/doctor/dashboard",
  radiologist: "/radiologist/dashboard",
  radiographer: "/radiographer/dashboard",
  patient: "/patient/dashboard"
};

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Toast state
  const [toast, setToast] = useState(null); // { type: "success"|"error"|"info", message: string }

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // auto hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      const msg = "Please enter identifier and password.";
      setError(msg);
      showToast("error", msg);
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
        showToast("error", msg);
        return;
      }

      const data = json?.data;
      const accessToken = data?.access_token;
      const refreshToken = data?.refresh_token;
      const user = data?.user;

      if (!accessToken || !user?.role) {
        const msg = "Invalid login response. Token or role missing.";
        setError(msg);
        showToast("error", msg);
        return;
      }

      // ✅ Save in localStorage
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ toast success
      showToast("success", `Welcome ${user?.name || ""}! Redirecting...`);

      // ✅ Redirect by role
      const role = String(user.role || "").toLowerCase();
      const target = ROLE_ROUTES[role] || "/";

      // tiny delay so toast is visible
      setTimeout(() => navigate(target, { replace: true }), 1200);
    } catch (err) {
      const msg = "Server error. Check backend is running.";
      setError(msg);
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      {/* ✅ Toast UI */}
      {toast && (
        <div className="toast toast-top toast-end z-[999]">
          <div
            className={`alert ${
              toast.type === "success"
                ? "alert-success"
                : toast.type === "error"
                ? "alert-error"
                : "alert-info"
            } shadow`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300">
        <div className="card-body">
          {/* Lottie */}
          <div className="flex justify-center -mb-2">
            <Lottie animationData={Brain} className="w-40 h-auto" />
          </div>

          <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
          <p className="text-center text-base-content/60">
            Login with username, email, or phone
          </p>

          {/* Optional inline error */}
          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            {/* Identifier */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input input-bordered w-full"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <label className="label w-full">
                <Link
                  to="/forgot-password"
                  className="label-text-alt link link-hover text-primary"
                >
                  Forgot password?
                </Link>
              </label>
            </div>

            {/* Button */}
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? <span className="loading loading-spinner" /> : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="link link-primary font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
