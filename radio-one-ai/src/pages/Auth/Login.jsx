import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Brain from "../../assets/images/Brain.json";

const API_BASE = "http://127.0.0.1:5000";

const ROLE_ROUTES = {
  admin: "/admin",
  receptionist: "/receptionist",
  doctor: "/doctor",
  radiologist: "/radiologist",
  radiographer: "/radiographer",
};

export default function Login() {
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
      setError("Please enter identifier and password.");
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
        setError(json?.message || "Login failed. Try again.");
        return;
      }

      const data = json?.data;
      const accessToken = data?.access_token;
      const refreshToken = data?.refresh_token;
      const user = data?.user;

      if (!accessToken || !user?.role) {
        setError("Invalid login response. Token or role missing.");
        return;
      }

      // ✅ Save in localStorage
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect by role
      const role = String(user.role || "").toLowerCase();
      const target = ROLE_ROUTES[role] || "/";

      navigate(target, { replace: true });
    } catch (err) {
      setError("Server error. Check backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
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

          {/* Error */}
          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            {/* Identifier */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Username / Email / Phone
                </span>
              </label>
              <input
                type="text"
                placeholder="recep01 or recep01@gmail.com or 0779998887"
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
                placeholder="********"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <label className="label">
                <Link
                  to="/forgot-password"
                  className="label-text-alt link link-hover text-primary"
                >
                  Forgot password?
                </Link>
              </label>
            </div>

            {/* Button */}
            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner" /> : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="link link-primary font-semibold">
              Sign up
            </Link>
          </p>

          {/* small helper */}
          <div className="divider">Demo</div>
          <div className="text-sm text-base-content/70">
            Example identifier: <span className="font-mono">recep01</span>
          </div>
        </div>
      </div>
    </div>
  );
}
