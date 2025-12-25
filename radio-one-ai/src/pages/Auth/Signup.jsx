import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100 px-4 py-8">
      <div className="card w-full max-w-2xl shadow-xl bg-base-200">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6 text-primary">Create Account</h2>
          
          <form className="space-y-6">
            
            {/* --- Personal Details Section --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-base-300 pb-2">Personal Details</h3>
              
              {/* Row: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input type="text" placeholder="John" className="input input-bordered w-full" required />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input type="text" placeholder="Doe" className="input input-bordered w-full" required />
                </div>
              </div>

              {/* Row: Age & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Age</span>
                  </label>
                  <input type="number" placeholder="25" className="input input-bordered w-full" min="1" required />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select className="select select-bordered w-full" defaultValue="" required>
                    <option value="" disabled>Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row: NIC & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">NIC</span>
                  </label>
                  <input type="text" placeholder="National ID" className="input input-bordered w-full" required />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date of Birth</span>
                  </label>
                  <input type="date" className="input input-bordered w-full" required />
                </div>
              </div>
            </div>

            {/* --- Contact Information Section --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-base-300 pb-2">Contact Information</h3>
              
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

              {/* Row: Mobile Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Mobile Number</span>
                  </label>
                  <input type="tel" placeholder="+94 77 123 4567" className="input input-bordered w-full" required />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input type="email" placeholder="email@example.com" className="input input-bordered w-full" required />
                </div>
              </div>
            </div>

            {/* --- Security Section --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-base-300 pb-2">Security</h3>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" placeholder="Create a password" className="input input-bordered w-full" required />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input type="password" placeholder="Confirm your password" className="input input-bordered w-full" required />
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8">
              <button className="btn btn-success text-white w-full font-bold text-lg shadow-md hover:scale-[1.01] transition-transform">
                Register
              </button>
            </div>
          </form>

          <p className="text-center text-sm mt-4 opacity-80">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}