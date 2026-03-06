// src/pages/Receptionist/ManagePatients.jsx
import React, { useEffect, useRef, useState } from "react";
import PatientDetailsModal from "../../component/Receptionist/PatientDetailsModal";

const API_BASE = "http://127.0.0.1:5000";

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });

  // ✅ Ref to the TOP HEADER area ("Manage Patients")
  const pageTopRef = useRef(null);

  const mapApiPatientToUi = (item) => ({
    id: item.id,
    name: item.name || "N/A",
    nic: item.username || "N/A",
    gender: item.gender
      ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1)
      : "N/A",
    age: Number.isFinite(item.age) ? item.age : null,
    phone: item.phone || "N/A",
    email: item.email || "N/A",
    status: String(item.status || "").toLowerCase() === "active" ? "Active" : "Inactive",
    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      item.name || "Patient"
    )}&background=random`,
    address: item.address || "N/A",
    registeredDate: item.created_at ? String(item.created_at).split("T")[0] : "N/A",
    dateOfBirth: item.date_of_birth || null,
    role: item.role || "patient",
    registeredBy: item.registered_by || null,
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchPatients = async () => {
    setIsLoadingPatients(true);
    try {
      const res = await fetch(`${API_BASE}/api/patients`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load patients.");
      }

      const list = Array.isArray(json?.data) ? json.data : [];
      setPatients(list.map(mapApiPatientToUi));
    } catch (error) {
      setApiMessage({
        type: "error",
        text: error.message || "Unable to fetch patients.",
      });
    } finally {
      setIsLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // 2. Filter Logic
  const filteredPatients = patients.filter(
    (pt) =>
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Handle Add Patient
  const handleAddPatient = async (e) => {
    e.preventDefault();
    const form = e.target;
    const dobRaw = form.date_of_birth.value;

    const payload = {
      name: form.name.value.trim(),
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      gender: form.gender.value.toLowerCase(),
      date_of_birth: dobRaw,
      password: form.password.value,
    };

    setIsSubmitting(true);
    setApiMessage({ type: "", text: "" });
    try {
      const res = await fetch(`${API_BASE}/api/patients`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Patient registration failed.");
      }

      const createdPatient = json?.data;
      const newPt = createdPatient
        ? mapApiPatientToUi(createdPatient)
        : {
            id: Date.now(),
            name: payload.name,
            nic: payload.username,
            gender: payload.gender.charAt(0).toUpperCase() + payload.gender.slice(1),
            age: null,
            phone: payload.phone,
            email: payload.email,
            status: "Active",
            img: `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name)}&background=random`,
            address: payload.address || "N/A",
            registeredDate: new Date().toISOString().split("T")[0],
            dateOfBirth: payload.date_of_birth,
          };

      setPatients((prev) => [newPt, ...prev]);
      setApiMessage({ type: "success", text: "Patient registered successfully." });
      document.getElementById("add_patient_modal")?.close();
      form.reset();
      fetchPatients();
    } catch (error) {
      setApiMessage({
        type: "error",
        text: error.message || "Unable to register patient.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ View Details: show details AND scroll to top where "Manage Patients" is visible
  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);

    setTimeout(() => {
      pageTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  // ✅ Back to Patients: hide details and scroll back to table
  const handleBackToPatients = () => {
    setSelectedPatient(null);

    setTimeout(() => {
      document
        .getElementById("patients_table_section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    // ✅ Base text increased to next scale
    <div className="space-y-6 text-base">
      {/* --- HEADER --- */}
      <div
        ref={pageTopRef}
        className="flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <div>
          {/* text-3xl -> text-4xl */}
          <h1 className="text-4xl font-bold">Manage Patients</h1>
          {/* text-base-content/70 default p size -> text-lg */}
          <p className="text-base-content/70 text-lg">
            View registered patients and manage accounts.
          </p>
        </div>

        <button
          className="btn btn-primary text-lg"
          onClick={() => document.getElementById("add_patient_modal")?.showModal()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Register Patient
        </button>
      </div>

      {apiMessage.text ? (
        <div
          className={`alert ${
            apiMessage.type === "error" ? "alert-error" : "alert-success"
          }`}
        >
          <span>{apiMessage.text}</span>
        </div>
      ) : null}

      {/* ✅ INLINE DETAILS */}
      <PatientDetailsModal patient={selectedPatient} onBack={handleBackToPatients} />

      {/* --- SEARCH --- */}
      <div className="form-control">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search by Name or Username..."
            className="input input-bordered w-full max-w-2xl text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE --- */}
      <div
        id="patients_table_section"
        className="card bg-base-100 shadow-xl overflow-x-auto"
      >
        {/* table text increased */}
        <table className="table w-full align-middle text-lg">
          <thead>
            <tr className="text-lg">
              <th>Name & Contact</th>
              <th>Username & Personal</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoadingPatients ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-base-content/50 text-lg">
                  Loading patients...
                </td>
              </tr>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((pt) => (
                <tr key={pt.id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-14 h-14">
                          <img src={pt.img} alt={pt.name} />
                        </div>
                      </div>
                      <div>
                        {/* name bigger */}
                        <div className="font-bold text-xl">{pt.name}</div>
                        {/* text-sm -> text-base */}
                        <div className="text-base opacity-50">{pt.email}</div>
                        {/* text-xs -> text-sm */}
                        <div className="text-sm opacity-50">{pt.phone}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="font-bold font-mono text-xl">{pt.nic}</div>
                    <div className="text-base opacity-50">
                      {pt.age !== null ? `${pt.gender}, ${pt.age} Years` : pt.gender}
                    </div>
                  </td>

                  <td>
                    {pt.status === "Active" ? (
                      <div className="badge badge-success gap-2 text-white badge-md text-base">
                        Active
                      </div>
                    ) : (
                      <div className="badge badge-error gap-2 text-white badge-md text-base">
                        Inactive
                      </div>
                    )}
                  </td>

                  <th>
                    <div className="flex gap-2">
                      <div className="tooltip" data-tip="View Details">
                        <button
                          className="btn btn-square btn-ghost btn-md bg-base-200"
                          onClick={() => handleViewDetails(pt)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-base-content/50 text-lg">
                  No patients found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD PATIENT MODAL --- */}
      <dialog id="add_patient_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl text-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-xl mb-4">Register New Patient</h3>
          <div className="divider my-0"></div>

          <form onSubmit={handleAddPatient} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg">Full Name</span>
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Patient Name"
                  className="input input-bordered w-full text-lg"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg">Username</span>
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="input input-bordered w-full text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg">Gender</span>
                </label>
                <select
                  name="gender"
                  className="select select-bordered w-full text-lg"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg">Date of Birth</span>
                </label>
                <input
                  name="date_of_birth"
                  type="date"
                  className="input input-bordered w-full text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg">Phone Number</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  className="input input-bordered w-full text-lg"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg">Email Address</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  className="input input-bordered w-full text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg">Address</span>
                </label>
                <input
                  name="address"
                  type="text"
                  placeholder="Address"
                  className="input input-bordered w-full text-lg"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg">Password</span>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full text-lg"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary w-full md:w-auto text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register Patient"}
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
