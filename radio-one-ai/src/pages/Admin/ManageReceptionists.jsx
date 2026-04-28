import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Toast from "../../component/Toast";
import ReceptionistDetailsModal from "../../component/Admin/ReceptionistDetailsModal";

const API_BASE = "http://127.0.0.1:5000";

export default function ManageReceptionists() {
  const container = useRef();
  const [receptionists, setReceptionists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [toast, setToast] = useState(null);

  useGSAP(
    () => {
      gsap.from(".page-header", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".filter-card", { y: -10, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.from(".table-card", { y: 20, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: container }
  );

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const mapApiUserToUi = (item) => ({
    id: item.id,
    name: item.name || "N/A",
    email: item.email || "N/A",
    phone: item.phone || "N/A",
    status: String(item.status || "").toLowerCase() === "active" ? "Active" : "Inactive",
    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || "Receptionist")}&background=random`,
    role: "RECEPTIONIST",
    staffId: item.username || item.id || "N/A",
    created_at: item.created_at || null,
    shift: item.shift || "General",
    username: item.username || item.id || "N/A",
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/staff?role=receptionist`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Failed to load receptionists.");
      const list = Array.isArray(json?.data) ? json.data : [];
      setReceptionists(list.map(mapApiUserToUi));
    } catch (error) {
      setToast({ message: error.message || "Unable to fetch receptionists.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = receptionists.filter((r) => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (r) => {
    setSelectedReceptionist(r);
    setTimeout(() => { document.getElementById("view_receptionist_modal").showModal(); }, 0);
  };

  return (
    <div ref={container} className="space-y-8 p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Manage <span className="text-gradient">Receptionists</span>
          </h1>
          <p className="text-base-content/50 font-medium">Manage front-desk staff and coordination team.</p>
        </div>
        <button className="btn btn-primary rounded-2xl font-black px-8 shadow-xl shadow-primary/20 text-xs tracking-widest">
          ADD RECEPTIONIST
        </button>
      </div>

      <div className="filter-card glass-card p-4 rounded-3xl border border-base-content/5 max-w-2xl relative bg-base-100/40">
        <input 
          type="text" 
          placeholder="Search by Name or Email..." 
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
                <th className="py-6 px-8 text-left">Staff Identity</th>
                <th className="py-6">Contact Number</th>
                <th className="py-6">Status</th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-bold text-sm">
              {isLoading ? (
                <tr><td colSpan="4" className="py-20"><span className="loading loading-spinner loading-lg text-primary" /></td></tr>
              ) : filtered.length > 0 ? (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-base-200/50 transition-colors group border-b border-base-content/5 last:border-0">
                    <td className="py-5 px-8 text-left">
                      <div className="flex items-center gap-3">
                        <div className="avatar"><div className="mask mask-squircle w-11 h-11"><img src={r.img} alt={r.name} /></div></div>
                        <div>
                          <div className="font-black text-base-content/80 text-base">{r.name}</div>
                          <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-mono font-black text-xs text-info bg-info/5 px-3 py-1.5 rounded-lg border border-info/10">{r.phone}</span></td>
                    <td>
                      <div className={`badge badge-md font-black px-4 py-3 rounded-xl border-none uppercase text-[10px] shadow-lg shadow-success/10 ${
                        r.status === 'Active' ? 'badge-success text-white' : 'badge-error text-white'
                      }`}>
                        {r.status}
                      </div>
                    </td>
                    <td className="px-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleViewDetails(r)} className="btn btn-ghost btn-xs rounded-lg font-black hover:bg-base-300">VIEW</button>
                        <button className="btn btn-ghost btn-xs rounded-lg font-black text-error hover:bg-error/10">DELETE</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="py-20 text-center opacity-30 font-black uppercase tracking-[0.3em] text-xs">No records matched</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReceptionistDetailsModal user={selectedReceptionist} onClose={() => setSelectedReceptionist(null)} />
    </div>
  );
}
