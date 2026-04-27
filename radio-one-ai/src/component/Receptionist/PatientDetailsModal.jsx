import React, { useEffect, useMemo, useState, useRef } from "react";
import PrescriptionFormModal from "./PrescriptionFormModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const API_BASE = "http://127.0.0.1:5000";

export default function PatientDetailsModal({ patient, onBack }) {
  const container = useRef();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [prescriptionsByPatient, setPrescriptionsByPatient] = useState({});

  const scanTypes = useMemo(() => ["MRI", "CT", "X-Ray", "Ultrasound", "Mammogram"], []);
  const organs = useMemo(() => ["brain", "lungs", "breast", "abdominal", "other"], []);
  const addModalId = "add_prescription_modal";

  useGSAP(
    () => {
      if (patient) {
        gsap.from(".profile-column", { x: -30, opacity: 0, duration: 0.6, ease: "power3.out" });
        gsap.from(".info-column > div", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.2, ease: "power3.out" });
      }
    },
    { scope: container, dependencies: [patient] }
  );

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const res = await fetch(`${API_BASE}/api/patients/doctors/active`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Failed to load doctors.");
      const list = Array.isArray(json?.data) ? json.data : Array.isArray(json?.doctors) ? json.doctors : [];
      setDoctors(list.map((d) => ({ id: d.id ?? d.doctor_id ?? d.user_id, name: d.name || d.full_name || d.user?.name || "Doctor" })));
    } catch (error) {
      setApiMessage({ type: "error", text: error.message });
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  if (!patient) return null;

  const handleAddPrescription = async (data) => {
    try {
      const formData = new FormData();
      formData.append("patient_id", String(patient.id));
      formData.append("scan_type", data.scanType);
      formData.append("organ", data.organ);
      formData.append("doctor_id", String(data.doctorId));
      formData.append("description", data.description || "description");
      formData.append("status", "pending");
      if (data.prescriptionFile) formData.append("prescription_images", data.prescriptionFile);

      const res = await fetch(`${API_BASE}/api/patients/${patient.id}/prescriptions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Failed to add prescription.");
      
      setApiMessage({ type: "success", text: "Prescription added successfully." });
      return true;
    } catch (error) {
      setApiMessage({ type: "error", text: error.message });
      return false;
    }
  };

  const prescriptions = prescriptionsByPatient[patient.id] || [];

  return (
    <div ref={container} className="glass-card rounded-[3rem] border border-base-content/5 bg-base-100/40 shadow-2xl overflow-hidden relative min-h-[700px]">
      
      {/* Top Controls */}
      <div className="absolute top-8 right-8 flex gap-3 z-50">
        <button onClick={() => document.getElementById(addModalId)?.showModal()} className="btn btn-primary h-12 px-6 rounded-2xl font-black text-xs tracking-widest shadow-xl shadow-primary/20">ADD PRESCRIPTION</button>
        <button onClick={onBack} className="btn btn-ghost h-12 px-6 rounded-2xl font-black text-xs tracking-widest bg-base-content/5 border-none">CLOSE FILE</button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[700px]">
        {/* Left Column - Profile */}
        <div className="lg:w-[35%] p-12 flex flex-col items-center justify-center relative profile-column bg-linear-to-b from-base-100 to-base-200/30 border-r border-base-content/5">
          <div className="w-48 h-48 rounded-[3rem] border-[6px] border-white shadow-2xl bg-indigo-50 flex items-center justify-center mb-8 relative group overflow-hidden">
             <img src={patient.img} alt={patient.name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-4xl font-black tracking-tighter text-slate-900 text-center mb-4 leading-tight">{patient.name}</h3>
          <div className="bg-slate-900 text-white font-black uppercase text-[11px] tracking-[0.2em] px-6 py-2 rounded-full mb-12 shadow-lg">
            PATIENT FILE
          </div>
          <div className="w-full max-w-[240px] bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-50 text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Account Status</div>
              <div className={`text-[13px] font-black uppercase tracking-wider ${patient.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}`}>
                 {patient.status === 'Active' ? 'ACTIVE ACCOUNT' : 'INACTIVE ACCOUNT'}
              </div>
          </div>
        </div>

        {/* Right Column - Details & Prescriptions */}
        <div className="flex-1 p-12 lg:p-20 info-column space-y-12 overflow-y-auto max-h-[700px]">
          
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-4">Personal Identifiers<span className="flex-1 h-px bg-slate-100" /></h4>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-2">
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">NIC Number</span>
                <p className="font-black text-2xl text-red-800 tracking-tighter">{patient.nic}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Age / Gender</span>
                <p className="font-black text-2xl text-slate-700 tracking-tighter">{patient.gender}, {patient.age}Y</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-4">Communication Details<span className="flex-1 h-px bg-slate-100" /></h4>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-2">
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Mobile Phone</span>
                <p className="font-black text-2xl text-slate-700 tracking-tighter">{patient.phone}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Email Address</span>
                <p className="font-black text-xl text-slate-700 tracking-tighter truncate">{patient.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-4">Clinical Prescriptions<span className="flex-1 h-px bg-slate-100" /></h4>
            <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-100/50">
               {prescriptions.length === 0 ? (
                 <div className="p-12 text-center text-xs font-black uppercase tracking-widest text-slate-300">No prescriptions found in file</div>
               ) : (
                 <table className="table w-full text-center">
                    <thead>
                       <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-50">
                          <th className="py-4">Req ID</th>
                          <th className="py-4">Scan / Organ</th>
                          <th className="py-4">Status</th>
                       </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                       {prescriptions.map((p) => (
                         <tr key={p.requestId} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                            <td className="font-mono text-xs py-4">{p.requestId}</td>
                            <td className="py-4">{p.scanType} - {p.organ}</td>
                            <td className="py-4"><span className="badge badge-warning text-[10px] font-black uppercase tracking-widest h-6 border-none">{p.status}</span></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               )}
            </div>
          </div>
        </div>
      </div>

      <PrescriptionFormModal
        modalId={addModalId}
        doctors={doctors}
        scanTypes={scanTypes}
        organs={organs}
        loadingDoctors={loadingDoctors}
        onSubmit={handleAddPrescription}
      />
    </div>
  );
}
