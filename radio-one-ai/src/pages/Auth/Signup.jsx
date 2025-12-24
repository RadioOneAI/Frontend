import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-base-100 px-4 py-8">
      <div className="card w-full max-w-lg shadow-2xl bg-base-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
          
          <form className="space-y-4">
            {/* Name Fields Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input 
                  type="text" 
                  placeholder="John" 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Doe" 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>
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

            {/* Confirm Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Confirm your password" 
                className="input input-bordered w-full" 
                required 
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button className="btn btn-success text-base-100 w-full font-bold text-lg">
                Register
              </button>
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