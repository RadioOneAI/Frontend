import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-base-100 px-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-4">Create Account</h2>

          <form className="space-y-4">
            {/* Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="input input-bordered w-full" 
                required 
              />
            </div>

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
                placeholder="Create a password" 
                className="input input-bordered w-full" 
                required 
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button className="btn btn-success text-base-100 w-full">Register</button>
            </div>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}