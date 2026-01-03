import React, { useEffect, useMemo, useState } from "react";
import EditDetailsModal from "../../component/Radiologist/EditDetailsModal";
import AnalyzeModal from "../../component/Radiologist/AnalyzeModal";
import DoctorReportModal from "../../component/Radiologist/Radiologistmodel.jsx";

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
      patient: "Nimali Perera",
      scanType: "MRI",
      radiographer: "Radiographer I. Perera",
      organ: "Brain",
      status: "Active",
      report: { findings: "", impression: "", notes: "" },
      analysis: null,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(null); // "edit" | "analyze" | "report" | null

  const editModalId = "edit_details_modal";
  const analyzeModalId = "analyze_modal";
  const reportModalId = "doctor_report_modal";

  const filteredAppointments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter(
      (a) =>
        a.requestId.toLowerCase().includes(q) ||
        a.patient.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.scanType.toLowerCase().includes(q) ||
        a.organ.toLowerCase().includes(q)
    );
  }, [appointments, searchTerm]);

  // Stats summary
  const stats = useMemo(() => {
    const total = appointments.length;
    const analyzed = appointments.filter((a) => !!a.analysis).length;
    const active = appointments.filter((a) => !a.analysis).length;
    return { total, analyzed, active };
  }, [appointments]);

  // Open modal dynamically
  useEffect(() => {
    if (!selected || !openModal) return;
    const id =
      openModal === "edit"
        ? editModalId
        : openModal === "analyze"
        ? analyzeModalId
        : reportModalId;
    const dialog = document.getElementById(id);
    if (dialog && !dialog.open) dialog.showModal();
  }, [selected, openModal]);

  const openEdit = (appt) => {
    setSelected(appt);
    setOpenModal("edit");
  };

  const openAnalyze = (appt) => {
    setSelected(appt);
    setOpenModal("analyze");
  };

  const openReport = (appt) => {
    setSelected(appt);
    setOpenModal("report");
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
    if (a.analysis)
      return (
        <div className="badge badge-secondary badge-md text-white">
          Analyzed
        </div>
      );
    return (
      <div className="badge badge-success badge-md text-white">Active</div>
    );
  };

  return (
    <div className="space-y-6 text-base">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Radiologist Appointments</h1>
          <p className="text-base-content/70 text-lg">
            Edit report details, run AI analysis, or view finalized reports.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="stat bg-base-100 rounded-2xl border border-base-300 shadow-sm py-3">
            <div className="stat-title text-sm">Total</div>
            <div className="stat-value text-2xl">{stats.total}</div>
          </div>
          <div className="stat bg-base-100 rounded-2xl border border-base-300 shadow-sm py-3">
            <div className="stat-title text-sm">Active</div>
            <div className="stat-value text-2xl text-success">
              {stats.active}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-2xl border border-base-300 shadow-sm py-3">
            <div className="stat-title text-sm">Analyzed</div>
            <div className="stat-value text-2xl text-primary">
              {stats.analyzed}
            </div>
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
            <tr className="text-sm">
              <th>Request ID</th>
              <th>Created</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Radiographer</th>
              <th>Organ</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((a) => (
                <tr key={a.requestId} className="hover:bg-base-300 text-sm">
                  <td>{a.requestId}</td>
                  <td>{a.createdAt}</td>
                  <td>{a.doctor}</td>
                  <td className="font-semibold">{a.patient}</td>
                  <td>{a.radiographer}</td>
                  <td>{a.organ}</td>
                  <td>{getStatusBadge(a)}</td>

                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-outline btn-md"
                        onClick={() => openReport(a)}
                      >
                        View Report
                      </button>
                      <button
                        className="btn btn-ghost btn-md"
                        onClick={() => openEdit(a)}
                      >
                        Edit Details
                      </button>
                      <button
                        className="btn btn-primary btn-md"
                        onClick={() => openAnalyze(a)}
                      >
                        Analyze
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-6 text-base-content/50 text-lg"
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
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

      <DoctorReportModal
        modalId={reportModalId}
        appointment={selected}
        onClose={closeAll}
      />
    </div>
  );
}
