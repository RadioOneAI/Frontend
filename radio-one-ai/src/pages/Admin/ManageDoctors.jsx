import React, { useState } from "react";
import DoctorDetailsModal from "../../component/Admin/DoctorDetailsModal";
import TablePagination from "../../component/TablePagination";
import ConfirmationModal from "../../component/Admin/ConfirmationModal";
import ExportButton from "../../component/ExportButton";
import Toast from "../../component/Toast"; // <--- 1. Import Toast

export default function ManageDoctors() {
  // 1. Dummy Data
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Sarah Jenkins", email: "sarah.j@cityhospital.com", spec: "Neurologist", regNo: "SLMC-8901", phone: "077-123-4567", status: "Active", img: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" },
    { id: 2, name: "Dr. Amal Perera", email: "amal.p@general.lk", spec: "Oncologist", regNo: "SLMC-3321", phone: "071-987-6543", status: "Active", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
    { id: 3, name: "Dr. Kasun Silva", email: "kasun.s@medcare.lk", spec: "General Physician", regNo: "SLMC-1122", phone: "076-555-0101", status: "Inactive", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpec, setFilterSpec] = useState("All"); 
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Track which doctor is being deleted
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  // 2. New State for Toast Notification
  const [toast, setToast] = useState(null);

  // Filter Logic
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = filterSpec === "All" || doc.spec === filterSpec;
    return matchesSearch && matchesSpec;
  });

  // Handle Add Doctor
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
      img: `https://ui-avatars.com/api/?name=${form.name.value}&background=random`
    };
    setDoctors([...doctors, newDoc]);
    document.getElementById("add_doctor_modal").close();
    form.reset();

    // 3. Trigger Success Toast
    setToast({ message: "New Doctor registered successfully!", type: "success" });
  };

  // Handle View Details
  const handleViewDetails = (doc) => {
    setSelectedDoctor(doc);
    setTimeout(() => document.getElementById("view_doctor_modal").showModal(), 0);
  };

  // Handle Delete Click
  const handleDeleteClick = (doc) => {
    setDoctorToDelete(doc);
    setTimeout(() => document.getElementById("delete_confirm_modal").showModal(), 0);
  };

  // Confirm Delete Action
  const confirmDelete = () => {
    if (doctorToDelete) {
      setDoctors(doctors.filter(d => d.id !== doctorToDelete.id));
      setDoctorToDelete(null);
      // 4. Trigger Delete Toast (using 'error' type for visual distinction)
      setToast({ message: "Doctor account deleted.", type: "error" });
    }
  };

  // Handle Export
  const handleExport = () => {
    // 5. Trigger Export Toast
    setToast({ message: "Exporting doctor list to CSV...", type: "success" });
  };

  return (
    <div className="space-y-6">
      
      {/* 6. Render Toast Component if active */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Doctors</h1>
          <p className="text-base-content/70">View and onboard medical professionals.</p>
        </div>
        
        {/* --- ACTION BUTTONS --- */}
        <div className="flex gap-3">
          {/* Export Button Component */}
          <ExportButton onExport={handleExport} />
          
          <button className="btn btn-primary" onClick={() => document.getElementById("add_doctor_modal").showModal()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add New Doctor
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4 bg-base-100 p-4 rounded-xl shadow-sm">
        <div className="form-control flex-1">
          <input type="text" placeholder="Search by Name or SLMC Reg No..." className="input input-bordered w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="form-control w-full sm:w-auto">
          <select className="select select-bordered w-full" value={filterSpec} onChange={(e) => setFilterSpec(e.target.value)}>
            <option value="All">All Specializations</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Oncologist">Oncologist</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="General Physician">General Physician</option>
            <option value="Surgeon">Surgeon</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full align-middle text-lg">
          <thead>
            <tr>
              <th>Name & Contact</th>
              <th>Specialization</th>
              <th>SLMC Reg No</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar"><div className="mask mask-squircle w-12 h-12"><img src={doc.img} alt={doc.name} /></div></div>
                      <div><div className="font-bold">{doc.name}</div><div className="text-sm opacity-50">{doc.email}</div><div className="text-xs opacity-50">{doc.phone}</div></div>
                    </div>
                  </td>
                  <td><span className="badge badge-ghost badge-sm font-medium">{doc.spec}</span></td>
                  <td className="font-mono text-sm">{doc.regNo}</td>
                  <td>{doc.status === "Active" ? <div className="badge badge-success gap-2 text-white badge-sm">Active</div> : <div className="badge badge-error gap-2 text-white badge-sm">Inactive</div>}</td>
                  <th>
                    <div className="flex gap-2">
                      <div className="tooltip" data-tip="View Details">
                        <button className="btn btn-square btn-ghost btn-sm bg-base-200" onClick={() => handleViewDetails(doc)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </div>
                      <div className="tooltip" data-tip="Delete Doctor">
                        <button className="btn btn-square btn-ghost btn-sm text-error bg-base-200 hover:bg-error hover:text-white" onClick={() => handleDeleteClick(doc)}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-4 text-base-content/50">No doctors found matching your search.</td></tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <TablePagination />
      </div>

      {/* --- MODALS --- */}
      <dialog id="add_doctor_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
          <h3 className="font-bold text-lg mb-4">Onboard New Doctor</h3>
          <div className="divider my-0"></div>
          <form onSubmit={handleAddDoctor} className="space-y-4 mt-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="form-control"><label className="label"><span className="label-text">Full Name</span></label><input name="name" type="text" placeholder="Dr. First Last" className="input input-bordered w-full" required /></div>
               <div className="form-control"><label className="label"><span className="label-text">SLMC Registration No</span></label><input name="regNo" type="text" placeholder="Ex: SLMC-1234" className="input input-bordered w-full" required /></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="form-control"><label className="label"><span className="label-text">Specialization</span></label><select name="spec" className="select select-bordered w-full"><option disabled selected>Select Specialization</option><option>Neurologist</option><option>Oncologist</option><option>Cardiologist</option><option>General Physician</option><option>Surgeon</option></select></div>
               <div className="form-control"><label className="label"><span className="label-text">Phone Number</span></label><input name="phone" type="tel" placeholder="+94 7X XXX XXXX" className="input input-bordered w-full" required /></div>
             </div>
             <div className="divider text-xs uppercase opacity-50">Login Credentials</div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="form-control"><label className="label"><span className="label-text">Email (Username)</span></label><input name="email" type="email" placeholder="doctor@hospital.com" className="input input-bordered w-full" required /></div>
               <div className="form-control"><label className="label"><span className="label-text">Temporary Password</span></label><input type="password" placeholder="••••••••" className="input input-bordered w-full" required /></div>
             </div>
             <div className="modal-action"><button type="submit" className="btn btn-primary w-full md:w-auto">Create Account</button></div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      <DoctorDetailsModal doctor={selectedDoctor} />
      
      <ConfirmationModal 
        id="delete_confirm_modal" 
        title="Delete Doctor" 
        message={`Are you sure you want to remove ${doctorToDelete?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete} 
      />

    </div>
  );
}