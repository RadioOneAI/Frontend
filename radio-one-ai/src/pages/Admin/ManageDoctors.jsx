import React, { useState } from "react";

export default function ManageDoctors() {
  // 1. Dummy Data (Simulating Database)
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Sarah Jenkins", email: "sarah.j@cityhospital.com", spec: "Neurologist", regNo: "SLMC-8901", phone: "077-123-4567", status: "Active" },
    { id: 2, name: "Dr. Amal Perera", email: "amal.p@general.lk", spec: "Oncologist", regNo: "SLMC-3321", phone: "071-987-6543", status: "Active" },
    { id: 3, name: "Dr. Kasun Silva", email: "kasun.s@medcare.lk", spec: "General Physician", regNo: "SLMC-1122", phone: "076-555-0101", status: "Inactive" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // 2. Filter Logic
  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.regNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Handle Add Doctor (Frontend simulation)
  const handleAddDoctor = (e) => {
    e.preventDefault();
    const form = e.target;
    const newDoc = {
      id: doctors.length + 1,
      name: form.name.value,
      email: form.email.value,
      spec: form.spec.value,
      regNo: form.regNo.value,
      phone: form.phone.value,
      status: "Active",
    };
    setDoctors([...doctors, newDoc]);
    document.getElementById("add_doctor_modal").close();
    form.reset();
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Doctors</h1>
          <p className="text-base-content/70">View and onboard medical professionals.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => document.getElementById("add_doctor_modal").showModal()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add New Doctor
        </button>
      </div>

      {/* --- SEARCH & FILTER --- */}
      <div className="form-control">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Search by Name or SLMC Reg No..." 
            className="input input-bordered w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full">
          {/* Table Head */}
          <thead>
            <tr>
              <th>Name & Contact</th>
              <th>Specialization</th>
              <th>SLMC Reg No</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={`https://ui-avatars.com/api/?name=${doc.name}&background=random`} alt="Avatar" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{doc.name}</div>
                        <div className="text-sm opacity-50">{doc.email}</div>
                        <div className="text-xs opacity-50">{doc.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-ghost badge-sm">{doc.spec}</span>
                  </td>
                  <td className="font-mono text-sm">{doc.regNo}</td>
                  <td>
                    {doc.status === "Active" ? (
                      <div className="badge badge-success gap-2 text-white">Active</div>
                    ) : (
                      <div className="badge badge-error gap-2 text-white">Inactive</div>
                    )}
                  </td>
                  <th>
                    <button className="btn btn-ghost btn-xs">Details</button>
                    <button className="btn btn-ghost btn-xs text-error">Delete</button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-base-content/50">
                  No doctors found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD DOCTOR MODAL --- */}
      <dialog id="add_doctor_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          
          <h3 className="font-bold text-lg mb-4">Onboard New Doctor</h3>
          <div className="divider my-0"></div>

          <form onSubmit={handleAddDoctor} className="space-y-4 mt-4">
            
            {/* Row 1: Name & Reg No */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Full Name</span></label>
                <input name="name" type="text" placeholder="Dr. First Last" className="input input-bordered w-full" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">SLMC Registration No</span></label>
                <input name="regNo" type="text" placeholder="Ex: SLMC-1234" className="input input-bordered w-full" required />
              </div>
            </div>

            {/* Row 2: Specialization & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Specialization</span></label>
                <select name="spec" className="select select-bordered w-full">
                  <option disabled selected>Select Specialization</option>
                  <option>Neurologist</option>
                  <option>Oncologist</option>
                  <option>Cardiologist</option>
                  <option>General Physician</option>
                  <option>Surgeon</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Phone Number</span></label>
                <input name="phone" type="tel" placeholder="+94 7X XXX XXXX" className="input input-bordered w-full" required />
              </div>
            </div>

            <div className="divider text-xs uppercase opacity-50">Login Credentials</div>

            {/* Row 3: Email & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Email (Username)</span></label>
                <input name="email" type="email" placeholder="doctor@hospital.com" className="input input-bordered w-full" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Temporary Password</span></label>
                <input type="password" placeholder="••••••••" className="input input-bordered w-full" required />
              </div>
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary w-full md:w-auto">Create Account</button>
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