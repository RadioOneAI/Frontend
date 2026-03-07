import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:5000";

export default function AddUsers() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    role: "receptionist",
    license_number: "",
    username: "",
    email: "",
    phone: "",
    gender: "male",
    date_of_birth: "",
    address: "",
    password: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage({ type: "", text: "" });
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Missing access token. Please log in again.");
      }

      const res = await fetch(`${API_BASE}/api/admin/staff`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "User creation failed.");
      }

      setApiMessage({
        type: "success",
        text: json?.message || "User created successfully.",
      });

      setFormData({
        name: "",
        role: "receptionist",
        license_number: "",
        username: "",
        email: "",
        phone: "",
        gender: "male",
        date_of_birth: "",
        address: "",
        password: "",
      });
    } catch (error) {
      setApiMessage({
        type: "error",
        text: error.message || "Unable to create user.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Add User</h1>
          <p className="text-base-content/70">
            Create doctors, radiologists, radiographers, and receptionists.
          </p>
        </div>
      </div>

      {apiMessage.text && (
        <div
          className={`alert mb-6 shadow-md ${
            apiMessage.type === "error" ? "alert-error" : "alert-success"
          }`}
        >
          <span>{apiMessage.text}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 text-secondary">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Role</span>
                  </label>
                  <select
                    name="role"
                    className="select select-bordered w-full focus:select-primary"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="receptionist">Receptionist</option>
                    <option value="doctor">Doctor</option>
                    <option value="radiologist">Radiologist</option>
                    <option value="radiographer">Radiographer</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Gender</span>
                  </label>
                  <select
                    name="gender"
                    className="select select-bordered w-full focus:select-primary"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Date of Birth</span>
                  </label>
                  <input
                    name="date_of_birth"
                    type="date"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-secondary">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Username</span>
                  </label>
                  <input
                    name="username"
                    type="text"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    minLength={6}
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-secondary">
                Professional & Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">License Number</span>
                  </label>
                  <input
                    name="license_number"
                    type="text"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.license_number}
                    onChange={handleChange}
                    placeholder="SLMC-665544"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Phone</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="input input-bordered w-full focus:input-primary"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Address</span>
                  </label>
                  <textarea
                    name="address"
                    className="textarea textarea-bordered w-full focus:textarea-primary"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className={`btn btn-primary px-8 ${isSubmitting ? "btn-disabled" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}
