import React, { useEffect, useRef, useState } from "react";
import PatientDetailsModal from "../../component/Receptionist/PatientDetailsModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Toast from "../../component/Toast";

const API_BASE = "http://127.0.0.1:5000";

export default function ManagePatients() {
  const container = useRef();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [toast, setToast] = useState(null);

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".filter-card", { y: -10, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.from(".table-card", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: container }
  );

  const mapApiPatientToUi = (item) => ({
    id: item.id,
    name: item.name || "N/A",
    nic: item.username || "N/A",
    gender: item.gender ? item.gender.charAt(0).toUpperCase() + item.gender.slice(1) : "N/A",
    age: Number.isFinite(item.age) ? item.age : null,
    phone: item.phone || "N/A",
    email: item.email || "N/A",
    status: String(item.status || "").toLowerCase() === "active" ? "Active" : "Inactive",
    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || "Patient")}&background=random`,
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
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Failed to load patients.");
      const list = Array.isArray(json?.data) ? json.data : [];
      setPatients(list.map(mapApiPatientToUi));
    } catch (error) {
      setToast({ message: error.message || "Unable to fetch patients.", type: "error" });
    } finally {
      setIsLoadingPatients(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const filteredPatients = patients.filter((pt) =>
    pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      gender: form.gender.value.toLowerCase(),
      date_of_birth: form.date_of_birth.value,
      password: form.password.value,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/patients`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Patient registration failed.");
      
      setToast({ message: "Patient registered successfully.", type: "success" });
      document.getElementById("add_patient_modal")?.close();
      form.reset();
      fetchPatients();
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    // Scroll handling is now handled by the modal's presence
  };

  return (
    <div ref={container} className="space-y-8 p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Patient <span className="text-gradient">Coordination</span>
          </h1>
          <p className="text-base-content/50 font-medium">Manage clinical registration and admission records.</p>
        </div>
        <button 
          onClick={() => document.getElementById("add_patient_modal")?.showModal()}
          className="btn btn-primary rounded-2xl font-black px-8 shadow-xl shadow-primary/20 text-xs tracking-widest"
        >
          REGISTER PATIENT
        </button>
      </div>

      {!selectedPatient && (
        <>
          <div className="filter-card glass-card p-4 rounded-3xl border border-base-content/5 max-w-2xl relative bg-base-100/40">
            <input 
              type="text" 
              placeholder="Search by Patient Name or NIC..." 
              className="input input-ghost w-full focus:bg-transparent text-lg font-bold pl-12 h-14" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="table-card glass-card rounded-[2.5rem] border border-base-content/5 overflow-hidden shadow-xl shadow-base-content/5 bg-base-100/40">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-center">
                <thead>
                  <tr className="text-base-content/40 uppercase tracking-widest text-[10px] font-black border-b border-base-content/5">
                    <th className="py-6 px-8 text-left">Patient Identity</th>
                    <th className="py-6">Clinical Metadata</th>
                    <th className="py-6">Status</th>
                    <th className="py-6 px-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-bold text-sm">
                  {isLoadingPatients ? (
                    <tr><td colSpan="4" className="py-20"><span className="loading loading-spinner loading-lg text-primary" /></td></tr>
                  ) : filteredPatients.length > 0 ? (
                    filteredPatients.map((pt) => (
                      <tr key={pt.id} className="hover:bg-base-200/50 transition-colors group border-b border-base-content/5 last:border-0">
                        <td className="py-5 px-8 text-left">
                          <div className="flex items-center gap-3">
                            <div className="avatar"><div className="mask mask-squircle w-11 h-11"><img src={pt.img} alt={pt.name} /></div></div>
                            <div>
                              <div className="font-black text-base-content/80 text-base">{pt.name}</div>
                              <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{pt.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                           <div className="font-black text-base-content/70">{pt.nic}</div>
                           <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{pt.gender}, {pt.age}Y</div>
                        </td>
                        <td>
                          <div className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] shadow-lg shadow-success/10 ${
                            pt.status === 'Active' ? 'badge-success text-white' : 'badge-error text-white'
                          }`}>
                            {pt.status}
                          </div>
                        </td>
                        <td className="px-8 text-right">
                          <button onClick={() => handleViewDetails(pt)} className="btn btn-ghost btn-xs rounded-lg font-black hover:bg-base-300">OPEN FILE</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="py-20 text-center opacity-30 font-black uppercase tracking-[0.3em] text-xs">No patient records matched</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedPatient && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <PatientDetailsModal patient={selectedPatient} onBack={() => setSelectedPatient(null)} />
        </div>
      )}

      {/* --- PREMIUM REGISTRATION MODAL --- */}
      <dialog id="add_patient_modal" className="modal overflow-hidden">
        <div className="modal-box w-11/12 max-w-2xl p-0 rounded-[3rem] border-none bg-white shadow-2xl overflow-hidden relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-8 top-8 z-50 bg-base-200/50 hover:bg-base-200 transition-colors">✕</button>
          </form>

          <div className="p-12 space-y-8">
            <div>
               <h3 className="text-3xl font-black tracking-tighter text-slate-900 leading-tight">Patient Registration</h3>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Create new clinical admission record</p>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Name</span></label>
                  <input name="name" type="text" placeholder="Patient Name" className="input input-ghost font-bold bg-slate-50 focus:bg-slate-100 rounded-2xl h-14" required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">NIC Number / Username</span></label>
                  <input name="username" type="text" placeholder="NIC Number" className="input input-ghost font-bold bg-slate-50 focus:bg-slate-100 rounded-2xl h-14" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Gender</span></label>
                  <select name="gender" className="select select-ghost font-bold bg-slate-50 focus:bg-slate-100 rounded-2xl h-14" required defaultValue="">
                    <option value="" disabled>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Date of Birth</span></label>
                  <input name="date_of_birth" type="date" className="input input-ghost font-bold bg-slate-50 focus:bg-slate-100 rounded-2xl h-14" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Phone Number</span></label>
                  <input name="phone" type="tel" placeholder="Mobile Phone" className="input input-ghost font-bold bg-slate-50 focus:bg-slate-100 rounded-2xl h-14" required />
                </div>
                <div className="form-control">
                  <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Email Address</span></label>
                  <input name="email" type="email" placeholder="email@example.com" className="input input-ghost font-bold bg-slate-50 focus:bg-slate-100 rounded-2xl h-14" required />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Home Address</span></label>
                <input name="address" type="text" placeholder="Complete Street Address" className="input input-ghost font-bold bg-slate-50 focus:bg-slate-100 rounded-2xl h-14" required />
              </div>

              <div className="form-control">
                <label className="label"><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Account Password</span></label>
                <input name="password" type="password" placeholder="Min 6 characters" className="input input-ghost font-bold bg-slate-50 focus:bg-slate-100 rounded-2xl h-14" required minLength={6} />
              </div>

              <div className="pt-6">
                <button type="submit" className="btn btn-primary w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 border-none text-xs" disabled={isSubmitting}>
                  {isSubmitting ? "REGISTERING..." : "FINALIZE REGISTRATION"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-slate-900/40 backdrop-blur-md">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
