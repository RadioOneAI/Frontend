import React, { useEffect, useState } from "react";
// Import the new component
import RadiologistDetailsModal from "../../component/Admin/RadiologistDetailsModal";

const API_BASE = "http://127.0.0.1:5000";

export default function ManageRadiologists() {
  const [radiologists, setRadiologists] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpec, setFilterSpec] = useState("All");
  const [isLoadingRadiologists, setIsLoadingRadiologists] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  
  // New State for Selection
  const [selectedRadiologist, setSelectedRadiologist] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const mapApiRadiologistToUi = (item) => ({
    id: item.id,
    name: item.name || "N/A",
    email: item.email || "N/A",
    spec: item.specialization || item.role || "Radiologist",
    regNo: item.license_number || "N/A",
    phone: item.phone || "N/A",
    status: String(item.status || "").toLowerCase() === "active" ? "Active" : "Inactive",
    img: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      item.name || "Radiologist"
    )}&background=random`,
    address: item.address || "N/A",
    age: item.age ?? null,
    gender: item.gender || null,
    date_of_birth: item.date_of_birth || null,
    username: item.username || null,
    created_at: item.created_at || null,
  });

  const fetchRadiologists = async () => {
    setIsLoadingRadiologists(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Missing access token. Please log in again.");
      }

      const res = await fetch(`${API_BASE}/api/admin/staff?role=radiologist`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load radiologists.");
      }

      const list = Array.isArray(json?.data) ? json.data : [];
      setRadiologists(list.map(mapApiRadiologistToUi));
      setApiMessage({ type: "", text: "" });
    } catch (error) {
      setApiMessage({
        type: "error",
        text: error.message || "Unable to fetch radiologists.",
      });
    } finally {
      setIsLoadingRadiologists(false);
    }
  };

  useEffect(() => {
    fetchRadiologists();
  }, []);

  // 2. Filter Logic
  const filteredRadiologists = radiologists.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpec = filterSpec === "All" || doc.spec === filterSpec;

    return matchesSearch && matchesSpec;
  });

  // 3. Handle Add Radiologist
  const handleAddRadiologist = (e) => {
    e.preventDefault();
    const form = e.target;
    const newRad = {
      id: radiologists.length + 1,
      name: form.name.value,
      email: form.email.value,
      spec: form.spec.value,
      regNo: form.regNo.value,
      phone: form.phone.value,
      status: "Active",
      img: `https://ui-avatars.com/api/?name=${form.name.value}&background=random`
    };
    setRadiologists([...radiologists, newRad]);
    document.getElementById("add_radiologist_modal").close();
    form.reset();
  };

  // 4. Handle View Details
  const handleViewDetails = (rad) => {
    setSelectedRadiologist(rad);
    setTimeout(() => {
      document.getElementById("view_radiologist_modal").showModal();
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Radiologists</h1>
          <p className="text-base-content/70">View and onboard imaging specialists.</p>
        </div>

      </div>

      {apiMessage.text ? (
        <div className="alert alert-error">
          <span>{apiMessage.text}</span>
        </div>
      ) : null}

      {/* --- SEARCH & FILTER SECTION --- */}
      <div className="flex flex-col sm:flex-row gap-4 bg-base-100 p-4 rounded-xl shadow-sm">
        <div className="form-control flex-1">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Search by Name or SLMC Reg No..." 
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="form-control w-full sm:w-auto">
          <select 
            className="select select-bordered w-full" 
            value={filterSpec} 
            onChange={(e) => setFilterSpec(e.target.value)}
          >
            <option value="All">All Specializations</option>
            <option value="Neuroradiology">Neuroradiology</option>
            <option value="Pediatric Radiology">Pediatric Radiology</option>
            <option value="Interventional">Interventional</option>
            <option value="Musculoskeletal">Musculoskeletal</option>
            <option value="General Radiology">General Radiology</option>
          </select>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto">
        <table className="table w-full align-middle">
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
            {isLoadingRadiologists ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-base-content/50">
                  Loading radiologists...
                </td>
              </tr>
            ) : filteredRadiologists.length > 0 ? (
              filteredRadiologists.map((rad) => (
                <tr key={rad.id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={rad.img} alt={rad.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{rad.name}</div>
                        <div className="text-sm opacity-50">{rad.email}</div>
                        <div className="text-xs opacity-50">{rad.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-ghost badge-sm font-medium">{rad.spec}</span>
                  </td>
                  <td className="font-mono text-sm">{rad.regNo}</td>
                  <td>
                    {rad.status === "Active" ? (
                      <div className="badge badge-success gap-2 text-white badge-sm">Active</div>
                    ) : (
                      <div className="badge badge-error gap-2 text-white badge-sm">Inactive</div>
                    )}
                  </td>
                  <th>
                    <div className="flex gap-2">
                      {/* View Details Button (CONNECTED) */}
                      <div className="tooltip" data-tip="View Details">
                        <button 
                          className="btn btn-square btn-ghost btn-sm bg-base-200"
                          onClick={() => handleViewDetails(rad)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </div>
                      
                      <div className="tooltip" data-tip="Delete Account">
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
                <td colSpan="5" className="text-center py-4 text-base-content/50">
                  No radiologists found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- ADD RADIOLOGIST MODAL (Unchanged) --- */}
      <dialog id="add_radiologist_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          
          <h3 className="font-bold text-lg mb-4">Onboard New Radiologist</h3>
          <div className="divider my-0"></div>

          <form onSubmit={handleAddRadiologist} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Full Name</span></label>
                <input name="name" type="text" placeholder="Dr. First Last" className="input input-bordered w-full" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">SLMC Registration No</span></label>
                <input name="regNo" type="text" placeholder="Ex: SLMC-5566" className="input input-bordered w-full" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Specialization</span></label>
                <select name="spec" className="select select-bordered w-full">
                  <option disabled selected>Select Specialization</option>
                  <option>Neuroradiology</option>
                  <option>Pediatric Radiology</option>
                  <option>Interventional</option>
                  <option>Musculoskeletal</option>
                  <option>General Radiology</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Phone Number</span></label>
                <input name="phone" type="tel" placeholder="+94 7X XXX XXXX" className="input input-bordered w-full" required />
              </div>
            </div>

            <div className="divider text-xs uppercase opacity-50">Login Credentials</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Email (Username)</span></label>
                <input name="email" type="email" placeholder="radiologist@hospital.com" className="input input-bordered w-full" required />
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

      {/* --- RENDER THE NEW DETAILS MODAL --- */}
      <RadiologistDetailsModal radiologist={selectedRadiologist} />

    </div>
  );
}
