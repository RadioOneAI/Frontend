import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:5000";

export default function AddUsers() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    role: "receptionist",
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

      setApiMessage({ type: "success", text: json?.message || "User created successfully." });
      setFormData({
        name: "",
        role: "receptionist",
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
      <div>
        <h1 className="text-3xl font-bold">Add User</h1>
        <p className="text-base-content/70">
          Create doctors, radiologists, radiographers, and receptionists.
        </p>
      </div>

      {apiMessage.text ? (
        <div className={`alert ${apiMessage.type === "error" ? "alert-error" : "alert-success"}`}>
          <span>{apiMessage.text}</span>
        </div>
      ) : null}

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  name="name"
                  type="text"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  name="role"
                  className="select select-bordered"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  name="username"
                  type="text"
                  className="input input-bordered"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  name="email"
                  type="email"
                  className="input input-bordered"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  className="input input-bordered"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  name="gender"
                  className="select select-bordered"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date of Birth</span>
                </label>
                <input
                  name="date_of_birth"
                  type="date"
                  className="input input-bordered"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  name="password"
                  type="password"
                  className="input input-bordered"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                name="address"
                type="text"
                className="input input-bordered"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
