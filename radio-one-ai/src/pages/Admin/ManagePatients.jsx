import React, { useEffect, useState, useRef } from "react";
import PatientDetailsModal from "../../component/Admin/PatientDetailsModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Toast from "../../component/Toast";

const API_BASE = "http://127.0.0.1:5000";

export default function ManagePatients() {
  const container = useRef();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [toast, setToast] = useState(null);

  useGSAP(
    () => {
      gsap.from(".page-header", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".filter-card", {
        y: -10,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.from(".table-card", {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
      });
    },
    { scope: container },
  );

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
    status:
      String(item.status || "").toLowerCase() === "active"
        ? "Active"
        : "Inactive",
    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || "Patient")}&background=random`,
    address: item.address || "N/A",
    registeredDate: item.created_at
      ? String(item.created_at).split("T")[0]
      : "N/A",
  });

  const fetchPatients = async () => {
    setIsLoadingPatients(true);
    try {
      const res = await fetch(`${API_BASE}/api/patients`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Failed to load patients.");
      const list = Array.isArray(json?.data) ? json.data : [];
      setPatients(list.map(mapApiPatientToUi));
    } catch (error) {
      setToast({
        message: error.message || "Unable to fetch patients.",
        type: "error",
      });
    } finally {
      setIsLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (pt) =>
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.nic.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setTimeout(() => {
      document.getElementById("view_patient_modal").showModal();
    }, 0);
  };

  return (
    <div ref={container} className="space-y-8 p-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Manage <span className="text-gradient">Patients</span>
          </h1>
          <p className="text-base-content/50 font-medium">
            Overview of registered patients and clinical history.
          </p>
        </div>
        <button className="btn btn-primary rounded-2xl font-black px-8 shadow-xl shadow-primary/20 text-xs tracking-widest">
          REGISTER PATIENT
        </button>
      </div>

      {/* --- FILTERS --- */}
      <div className="filter-card glass-card p-4 rounded-3xl border border-base-content/5 max-w-2xl relative bg-base-100/40">
        <input
          type="text"
          placeholder="Search by Name or NIC..."
          className="input input-ghost w-full focus:bg-transparent text-lg font-bold pl-12 h-14"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="w-6 h-6 absolute left-8 top-1/2 -translate-y-1/2 text-base-content/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* --- TABLE --- */}
      <div className="table-card glass-card rounded-[2.5rem] border border-base-content/5 overflow-hidden shadow-xl shadow-base-content/5 bg-base-100/40">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr className="text-base-content/40 uppercase tracking-widest text-[10px] font-black border-b border-base-content/5">
                <th className="py-6 px-8 text-left">Patient Identity</th>
                <th className="py-6">Personal Info</th>
                <th className="py-6">Reg Date</th>
                <th className="py-6">Status</th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-bold text-sm">
              {isLoadingPatients ? (
                <tr>
                  <td colSpan="5" className="py-20">
                    <span className="loading loading-spinner loading-lg text-primary" />
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((pt) => (
                  <tr
                    key={pt.id}
                    className="hover:bg-base-200/50 transition-colors group border-b border-base-content/5 last:border-0"
                  >
                    <td className="py-5 px-8 text-left">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-11 h-11">
                            <img src={pt.img} alt={pt.name} />
                          </div>
                        </div>
                        <div>
                          <div className="font-black text-base-content/80 text-base">
                            {pt.name}
                          </div>
                          <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                            {pt.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-black text-base-content/70">
                        {pt.nic}
                      </div>
                      <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                        {pt.gender}, {pt.age}Y
                      </div>
                    </td>
                    <td>
                      <span className="font-mono font-black text-xs opacity-50">
                        {pt.registeredDate}
                      </span>
                    </td>
                    <td>
                      <div
                        className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] shadow-lg shadow-success/10 ${
                          pt.status === "Active"
                            ? "badge-success text-white"
                            : "badge-error text-white"
                        }`}
                      >
                        {pt.status}
                      </div>
                    </td>
                    <td className="px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(pt)}
                          className="btn btn-secondary btn-sm rounded-xl font-bold px-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(217,70,239,0.23)] hover:bg-secondary focus:outline-none transition-all duration-200"
                        >
                          VIEW
                        </button>
                        <button className="btn btn-primary btn-sm rounded-xl font-bold px-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] hover:bg-primary focus:outline-none transition-all duration-200">
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-20 text-center opacity-30 font-black uppercase tracking-[0.3em] text-xs"
                  >
                    No records matched
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PatientDetailsModal patient={selectedPatient} />
    </div>
  );
}
