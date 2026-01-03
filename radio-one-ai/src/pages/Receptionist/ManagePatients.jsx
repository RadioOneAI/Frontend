// src/pages/Receptionist/ManagePatients.jsx
import React, { useRef, useState } from "react";
import PatientDetailsModal from "../../component/Receptionist/PatientDetailsModal";

export default function ManagePatients() {
  // 1. Dummy Data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Kamal Gunawardena",
      nic: "851234567V",
      gender: "Male",
      age: 45,
      phone: "077-111-2222",
      email: "kamal.g@gmail.com",
      status: "Active",
      img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      address: "123, Galle Road, Colombo 03",
      registeredDate: "2023-10-15",
    },
    {
      id: 2,
      name: "Sita Kumari",
      nic: "925678123V",
      gender: "Female",
      age: 32,
      phone: "071-333-4444",
      email: "sita.k@yahoo.com",
      status: "Active",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      address: "45/A, Temple Road, Kandy",
      registeredDate: "2023-11-02",
    },
    {
      id: 3,
      name: "Mohamed Riaz",
      nic: "200112345678",
      gender: "Male",
      age: 23,
      phone: "076-555-6666",
      email: "m.riaz@outlook.com",
      status: "Active",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      address: "89, Main Street, Matara",
      registeredDate: "2024-01-10",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ✅ Ref to the TOP HEADER area ("Manage Patients")
  const pageTopRef = useRef(null);

  // 2. Filter Logic
  const filteredPatients = patients.filter(
    (pt) =>
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
      age: Number(form.age.value),
      phone: form.phone.value,
      email: form.email.value,
      status: "Active",
      img: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        form.name.value
      )}&background=random`,
      address: "N/A",
      registeredDate: new Date().toISOString().split("T")[0],
    };

    setPatients([...patients, newPt]);
    document.getElementById("add_patient_modal")?.close();
    form.reset();
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

      {/* ✅ INLINE DETAILS */}
      <PatientDetailsModal patient={selectedPatient} onBack={handleBackToPatients} />

      {/* --- SEARCH --- */}
      <div className="form-control">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search by Name or NIC Number..."
            className="input input-bordered w-full max-w-md text-lg"
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
              <th>NIC & Personal</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
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
                      {pt.gender}, {pt.age} Years
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
                  <span className="label-text text-lg">NIC Number</span>
                </label>
                <input
                  name="nic"
                  type="text"
                  placeholder="NIC Number"
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
                  <span className="label-text text-lg">Age</span>
                </label>
                <input
                  name="age"
                  type="number"
                  placeholder="Age"
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

            <div className="modal-action">
              <button type="submit" className="btn btn-primary w-full md:w-auto text-lg">
                Register Patient
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
