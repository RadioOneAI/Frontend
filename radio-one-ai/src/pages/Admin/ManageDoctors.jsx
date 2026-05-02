import React, { useEffect, useState, useRef } from "react";
import DoctorDetailsModal from "../../component/Admin/DoctorDetailsModal";
import ConfirmationModal from "../../component/Admin/ConfirmationModal";
import Toast from "../../component/Toast";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const API_BASE = "http://127.0.0.1:5000";

export default function ManageDoctors() {
  const container = useRef();
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpec, setFilterSpec] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
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

  const mapApiDoctorToUi = (item) => ({
    id: item.id,
    name: item.name || "N/A",
    email: item.email || "N/A",
    spec: item.specialization || item.role || "Doctor",
    regNo: item.license_number || "N/A",
    phone: item.phone || "N/A",
    status:
      String(item.status || "").toLowerCase() === "active"
        ? "Active"
        : "Inactive",
    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || "Doctor")}&background=random`,
    address: item.address || "N/A",
  });

  const fetchDoctors = async () => {
    setIsLoadingDoctors(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token. Please log in again.");

      const res = await fetch(`${API_BASE}/api/admin/staff?role=doctor`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.success === false)
        throw new Error(json?.message || "Failed to load doctors.");

      const list = Array.isArray(json?.data) ? json.data : [];
      setDoctors(list.map(mapApiDoctorToUi));
    } catch (error) {
      setToast({
        message: error.message || "Unable to fetch doctors.",
        type: "error",
      });
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = filterSpec === "All" || doc.spec === filterSpec;
    return matchesSearch && matchesSpec;
  });

  const handleViewDetails = (doc) => {
    setSelectedDoctor(doc);
    setTimeout(
      () => document.getElementById("view_doctor_modal").showModal(),
      0,
    );
  };

  const handleDeleteClick = (doc) => {
    setDoctorToDelete(doc);
    setTimeout(
      () => document.getElementById("delete_confirm_modal").showModal(),
      0,
    );
  };

  const confirmDelete = () => {
    if (doctorToDelete) {
      setDoctors(doctors.filter((d) => d.id !== doctorToDelete.id));
      setDoctorToDelete(null);
      setToast({ message: "Doctor account deleted.", type: "error" });
    }
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
            Manage <span className="text-gradient">Doctors</span>
          </h1>
          <p className="text-base-content/50 font-medium">
            Onboard and manage medical professionals within the system.
          </p>
        </div>
        <button className="btn btn-primary rounded-2xl font-black px-8 shadow-xl shadow-primary/20">
          ADD DOCTOR
        </button>
      </div>

      {/* --- FILTERS --- */}
      <div className="filter-card glass-card p-4 rounded-3xl border border-base-content/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 relative">
          <input
            type="text"
            placeholder="Search by Name or SLMC Reg No..."
            className="input input-ghost w-full focus:bg-transparent text-lg font-medium pl-12 h-14"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30"
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
        <div className="md:col-span-4">
          <select
            className="select select-ghost w-full h-14 rounded-2xl font-bold bg-base-content/5 border-none"
            value={filterSpec}
            onChange={(e) => setFilterSpec(e.target.value)}
          >
            <option value="All">All Specializations</option>
            <option>Neurologist</option>
            <option>Oncologist</option>
            <option>Cardiologist</option>
            <option>General Physician</option>
            <option>Surgeon</option>
          </select>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="table-card glass-card rounded-[2.5rem] border border-base-content/5 overflow-hidden shadow-xl shadow-base-content/5 bg-base-100/40">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-center">
            <thead>
              <tr className="text-base-content/40 uppercase tracking-widest text-[10px] font-black border-b border-base-content/5">
                <th className="py-6 px-8 text-left">Doctor Identity</th>
                <th className="py-6">Specialization</th>
                <th className="py-6">License No</th>
                <th className="py-6">Status</th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-bold text-sm">
              {isLoadingDoctors ? (
                <tr>
                  <td colSpan="5" className="py-20">
                    <span className="loading loading-spinner loading-lg text-primary" />
                  </td>
                </tr>
              ) : filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-base-200/50 transition-colors group border-b border-base-content/5 last:border-0"
                  >
                    <td className="py-5 px-8 text-left">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-11 h-11">
                            <img src={doc.img} alt={doc.name} />
                          </div>
                        </div>
                        <div>
                          <div className="font-black text-base-content/80 text-base">
                            {doc.name}
                          </div>
                          <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                            {doc.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] bg-base-content/5 text-base-content/60 shadow-sm">
                        {doc.spec}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono font-black text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                        {doc.regNo}
                      </span>
                    </td>
                    <td>
                      <div
                        className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] ${
                          doc.status === "Active"
                            ? "badge-success text-white shadow-lg shadow-success/20"
                            : "badge-error text-white shadow-lg shadow-error/20"
                        }`}
                      >
                        {doc.status}
                      </div>
                    </td>
                    <td className="px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(doc)}
                          className="btn btn-secondary btn-sm rounded-xl font-bold px-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(217,70,239,0.23)] hover:bg-secondary focus:outline-none transition-all duration-200"
                        >
                          VIEW
                        </button>
                        <button
                          onClick={() => handleDeleteClick(doc)}
                          className="btn btn-primary btn-sm rounded-xl font-bold px-4 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] hover:bg-primary focus:outline-none transition-all duration-200"
                        >
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

      <DoctorDetailsModal doctor={selectedDoctor} />
      <ConfirmationModal
        id="delete_confirm_modal"
        title="Delete Doctor"
        message={`Are you sure you want to remove ${doctorToDelete?.name}?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
