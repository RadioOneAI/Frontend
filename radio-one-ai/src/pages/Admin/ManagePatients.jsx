import React, { useEffect, useState } from "react";
// Import the new component
import PatientDetailsModal from "../../component/Admin/PatientDetailsModal";

const API_BASE = "http://127.0.0.1:5000";

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

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
    registeredBy: item.registered_by || null,
  });

  const fetchPatients = async () => {
    setIsLoadingPatients(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Missing access token. Please log in again.");
      }

      const res = await fetch(`${API_BASE}/api/patients`, {
        method: "GET",
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
      setApiMessage({ type: "", text: "" });
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
  const filteredPatients = patients.filter((pt) =>
    pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Handle Add Patient
  const handleAddPatient = (e) => {
    e.preventDefault();
    const form = e.target;
    const newPt = {
      id: patients.length + 1,
      name: form.name.value,
      nic: form.nic.value,
      gender: form.gender.value,
      age: form.age.value,
      phone: form.phone.value,
      email: form.email.value,
      status: "Active",
      img: `https://ui-avatars.com/api/?name=${form.name.value}&background=random`,
      address: "N/A",
      registeredDate: new Date().toISOString().split('T')[0]
    };
    setPatients([...patients, newPt]);
    document.getElementById("add_patient_modal").close();
    form.reset();
  };

  // 4. Handle View Details Click
  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    // Slight delay to ensure state updates before showing modal
    setTimeout(() => {
      document.getElementById("view_patient_modal").showModal();
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Patients</h1>
          <p className="text-base-content/70">View registered patients and manage accounts.</p>
        </div>
      </div>

      {apiMessage.text ? (
        <div className="alert alert-error">
          <span>{apiMessage.text}</span>
        </div>
      ) : null}

      {/* --- SEARCH --- */}
      <div className="form-control">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Search by Name or Username..." 
            className="input input-bordered w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full align-middle">
          <thead>
            <tr>
              <th>Name & Contact</th>
              <th>Username & Personal</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingPatients ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-base-content/50">
                  Loading patients...
                </td>
              </tr>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((pt) => (
                <tr key={pt.id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={pt.img} alt={pt.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{pt.name}</div>
                        <div className="text-sm opacity-50">{pt.email}</div>
                        <div className="text-xs opacity-50">{pt.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold font-mono">{pt.nic}</div>
                    <div className="text-sm opacity-50">
                      {pt.age !== null ? `${pt.gender}, ${pt.age} Years` : pt.gender}
                    </div>
                  </td>
                  <td>
                    {pt.status === "Active" ? (
                      <div className="badge badge-success gap-2 text-white badge-sm">Active</div>
                    ) : (
                      <div className="badge badge-error gap-2 text-white badge-sm">Inactive</div>
                    )}
                  </td>
                  <th>
                    <div className="flex gap-2">
                      <div className="tooltip" data-tip="View Details">
                        <button 
                          className="btn btn-square btn-ghost btn-sm bg-base-200"
                          onClick={() => handleViewDetails(pt)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </div>
                      <div className="tooltip" data-tip="Delete/Ban User">
                        <button className="btn btn-square btn-ghost btn-sm text-error bg-base-200 hover:bg-error hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-base-content/50">
                  No patients found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD PATIENT MODAL (Kept inline as it's a form) --- */}
      <dialog id="add_patient_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          
          <h3 className="font-bold text-lg mb-4">Register New Patient</h3>
          <div className="divider my-0"></div>

          <form onSubmit={handleAddPatient} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Full Name</span></label>
                <input name="name" type="text" placeholder="Patient Name" className="input input-bordered w-full" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">NIC Number</span></label>
                <input name="nic" type="text" placeholder="NIC Number" className="input input-bordered w-full" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Gender</span></label>
                <select name="gender" className="select select-bordered w-full">
                  <option disabled selected>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Age</span></label>
                <input name="age" type="number" placeholder="Age" className="input input-bordered w-full" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Phone Number</span></label>
                <input name="phone" type="tel" placeholder="Phone Number" className="input input-bordered w-full" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Email Address</span></label>
                <input name="email" type="email" placeholder="email@example.com" className="input input-bordered w-full" required />
              </div>
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary w-full md:w-auto">Register Patient</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* --- RENDER THE NEW MODAL COMPONENT --- */}
      <PatientDetailsModal patient={selectedPatient} />

    </div>
  );
}
