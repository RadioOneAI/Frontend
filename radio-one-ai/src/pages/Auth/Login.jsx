import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-base-100 px-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-4">Welcome Back</h2>
          
          <form className="space-y-4">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="input input-bordered w-full" 
                required 
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="********" 
                className="input input-bordered w-full" 
                required 
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover text-primary">
                  Forgot password?
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button className="btn btn-primary w-full">Login</button>
            </div>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="link link-primary font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}