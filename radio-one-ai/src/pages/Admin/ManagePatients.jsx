import React, { useState } from "react";

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
      img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    { 
      id: 3, 
      name: "Mohamed Riaz", 
      nic: "200112345678",
      gender: "Male",
      age: 23,
      phone: "076-555-6666",
      email: "m.riaz@outlook.com",
      status: "Inactive",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // 2. Filter Logic (Search by Name or NIC)
  const filteredPatients = patients.filter((pt) =>
    pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Handle Add Patient (Manually adding a patient as Admin)
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
      img: `https://ui-avatars.com/api/?name=${form.name.value}&background=random`
    };
    setPatients([...patients, newPt]);
    document.getElementById("add_patient_modal").close();
    form.reset();
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Patients</h1>
          <p className="text-base-content/70">View registered patients and manage accounts.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => document.getElementById("add_patient_modal").showModal()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Register Patient
        </button>
      </div>

      {/* --- SEARCH --- */}
      <div className="form-control">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Search by Name or NIC Number..." 
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
                    <div className="text-sm opacity-50">{pt.gender}, {pt.age} Years</div>
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
                        <button className="btn btn-square btn-ghost btn-sm bg-base-200">
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

      {/* --- ADD PATIENT MODAL --- */}
      <dialog id="add_patient_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          
          <h3 className="font-bold text-lg mb-4">Register New Patient</h3>
          <div className="divider my-0"></div>

          <form onSubmit={handleAddPatient} className="space-y-4 mt-4">
            
            {/* Row 1: Name & NIC */}
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

            {/* Row 2: Gender & Age */}
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

            {/* Row 3: Contact Info */}
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

    </div>
  );
}