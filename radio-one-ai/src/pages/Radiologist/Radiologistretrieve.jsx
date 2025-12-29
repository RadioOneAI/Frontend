import React, { useEffect, useMemo, useState } from "react";
import RetrieveImageModal from "../../component/Radiologist/RetriveImageModal";
import EditDetailsModal from "../../component/Radiologist/EditDetailsModal";
import AnalyzeModal from "../../component/Radiologist/AnalyzeModal";

export default function Radiologistretrieve() {
  const [appointments, setAppointments] = useState([
    {
      requestId: "REQ-1-0001",
      createdAt: "12/20/2025, 10:15 AM",
      doctor: "Dr. Nimal Perera",
      patient: "Kamal Gunawardena",
      scanType: "MRI",
      radiographer: "Radiographer A. Silva",
      organ: "Brain",
      status: "Active",
      images: [],
      report: {
        findings: "",
        impression: "",
        notes: "",
      },
      analysis: null,
    },
    {
      requestId: "REQ-1-0002",
      createdAt: "12/22/2025, 02:40 PM",
      doctor: "Dr. Shalini Fernando",
      patient: "Sita Kumari",
      scanType: "CT",
      radiographer: "Radiographer I. Perera",
      organ: "Abdominal",
      status: "Active",
      images: [],
      report: { findings: "", impression: "", notes: "" },
      analysis: null,
    },
    {
      requestId: "REQ-1-0003",
      createdAt: "12/26/2025, 09:05 AM",
      doctor: "Dr. Kasun Jayasinghe",
      patient: "Mohamed Riaz",
      scanType: "X-Ray",
      radiographer: "Radiographer M. Fernando",
      organ: "Lungs",
      status: "Active",
      images: [],
      report: { findings: "", impression: "", notes: "" },
      analysis: null,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selected, setSelected] = useState(null);

  const [openModal, setOpenModal] = useState(null); // "retrieve" | "edit" | "analyze" | null

  const retrieveModalId = "retrieve_images_modal";
  const editModalId = "edit_details_modal";
  const analyzeModalId = "analyze_modal";

  const filteredAppointments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter((a) => {
      return (
        a.requestId.toLowerCase().includes(q) ||
        a.patient.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.scanType.toLowerCase().includes(q) ||
        a.organ.toLowerCase().includes(q)
      );
    });
  }, [appointments, searchTerm]);

  // Summary stats
  const stats = useMemo(() => {
    const total = appointments.length;
    const mri = appointments.filter((a) => a.scanType === "MRI").length;
    const withImages = appointments.filter((a) => (a.images?.length || 0) > 0).length;
    const analyzed = appointments.filter((a) => !!a.analysis).length;
    return { total, mri, withImages, analyzed };
  }, [appointments]);

  // Open modal AFTER render
  useEffect(() => {
    if (!selected || !openModal) return;

    const id =
      openModal === "retrieve"
        ? retrieveModalId
        : openModal === "edit"
        ? editModalId
        : analyzeModalId;

    const dialog = document.getElementById(id);
    if (dialog && !dialog.open) dialog.showModal();
  }, [selected, openModal]);

  const openRetrieve = (appt) => {
    setSelected(appt);
    setOpenModal("retrieve");
  };

  const openEdit = (appt) => {
    setSelected(appt);
    setOpenModal("edit");
  };

  const openAnalyze = (appt) => {
    setSelected(appt);
    setOpenModal("analyze");
  };

  const closeAll = () => {
    setSelected(null);
    setOpenModal(null);
  };

  const updateAppointment = (requestId, patch) => {
    setAppointments((prev) =>
      prev.map((a) => (a.requestId === requestId ? { ...a, ...patch } : a))
    );
  };

  const getStatusBadge = (a) => {
    if (a.analysis) return <div className="badge badge-secondary badge-md text-white">Analyzed</div>;
    if ((a.images?.length || 0) > 0)
      return <div className="badge badge-info badge-md text-white">Images Ready</div>;
    return <div className="badge badge-success badge-md text-white">Active</div>;
  };

  return (
    <div className="space-y-6 text-base">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Radiologist Appointments</h1>
          <p className="text-base-content/70 text-lg">
            Retrieve images, edit report details, and run AI analysis.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="stat bg-base-100 rounded-2xl border border-base-300 shadow-sm py-3">
            <div className="stat-title text-sm">Total</div>
            <div className="stat-value text-2xl">{stats.total}</div>
          </div>
          <div className="stat bg-base-100 rounded-2xl border border-base-300 shadow-sm py-3">
            <div className="stat-title text-sm">MRI</div>
            <div className="stat-value text-2xl text-primary">{stats.mri}</div>
          </div>
          <div className="stat bg-base-100 rounded-2xl border border-base-300 shadow-sm py-3">
            <div className="stat-title text-sm">With Images</div>
            <div className="stat-value text-2xl">{stats.withImages}</div>
          </div>
          <div className="stat bg-base-100 rounded-2xl border border-base-300 shadow-sm py-3">
            <div className="stat-title text-sm">Analyzed</div>
            <div className="stat-value text-2xl">{stats.analyzed}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="form-control">
        <input
          type="text"
          placeholder="Search by Request ID / Patient / Doctor / Scan Type / Organ..."
          className="input input-bordered w-full max-w-2xl text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-x-auto border border-base-300">
        <table className="table w-full align-middle text-lg">
          <thead>
            <tr className="text-lg">
              <th>Request ID</th>
              <th>Created</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Scan</th>
              <th>Radiographer</th>
              <th>Organ</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((a) => (
                <tr key={a.requestId} className="hover">
                  <td className="font-mono font-bold text-xl">{a.requestId}</td>
                  <td className="text-base">{a.createdAt}</td>
                  <td className="text-base">{a.doctor}</td>
                  <td className="text-base font-semibold">{a.patient}</td>
                  <td className="text-base">{a.scanType}</td>
                  <td className="text-base">{a.radiographer}</td>
                  <td className="text-base">{a.organ}</td>
                  <td>{getStatusBadge(a)}</td>

                  <td className="text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button className="btn btn-outline btn-md" onClick={() => openRetrieve(a)}>
                        Retrieve Images
                      </button>
                      <button className="btn btn-ghost btn-md" onClick={() => openEdit(a)}>
                        Edit Details
                      </button>
                      <button className="btn btn-primary btn-md" onClick={() => openAnalyze(a)}>
                        Analyze
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-base-content/50 text-lg">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <RetrieveImageModal
        modalId={retrieveModalId}
        appointment={selected}
        onClose={closeAll}
        onSaveImages={(requestId, images) => {
          updateAppointment(requestId, { images });
        }}
      />

      <EditDetailsModal
        modalId={editModalId}
        appointment={selected}
        onClose={closeAll}
        onSaveReport={(requestId, report) => {
          updateAppointment(requestId, { report });
        }}
      />

      <AnalyzeModal
        modalId={analyzeModalId}
        appointment={selected}
        onClose={closeAll}
        onSaveAnalysis={(requestId, analysis) => {
          updateAppointment(requestId, { analysis });
        }}
      />
    </div>
  );
}
