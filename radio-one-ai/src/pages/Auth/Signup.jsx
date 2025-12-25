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

            {/* Age and Gender Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-1/3">
                <label className="label">
                  <span className="label-text">Age</span>
                </label>
                <input 
                  type="number" 
                  placeholder="25" 
                  className="input input-bordered w-full" 
                  min="1"
                  required 
                />
              </div>
              <div className="form-control w-full sm:w-2/3">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select className="select select-bordered w-full" defaultValue="" required>
                  <option value="" disabled>Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* NIC and DOB Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">NIC</span>
                </label>
                <input 
                  type="text" 
                  placeholder="National ID" 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Date of Birth</span>
                </label>
                <input 
                  type="date" 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>
            </div>

            {/* Address Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea 
                className="textarea textarea-bordered h-24" 
                placeholder="123 Main St, City, Country" 
                required
              ></textarea>
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