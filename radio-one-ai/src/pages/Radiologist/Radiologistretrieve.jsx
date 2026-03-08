import React, { useEffect, useMemo, useState } from "react";
import EditDetailsModal from "../../component/Radiologist/EditDetailsModal";
import PdfReportModal from "../../component/Radiographer/PdfReportModal";

const API_BASE = "http://127.0.0.1:5000";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function mapApiPrescriptionToUi(item) {
  return {
    requestId: item.scan_req_id || `REQ-${item.id}`,
    scanRequestId: item.scan_req_id || item.scan_request_id || null,
    createdAt: item.created_at
      ? new Date(item.created_at).toLocaleString()
      : "N/A",
    doctor: item.doctor?.name || `Doctor #${item.doctor_id ?? "-"}`,
    patient: item.patient?.name || `Patient #${item.patient_id ?? "-"}`,
    scanType: item.scan_type || "N/A",
    radiographer: item.created_by?.name || "N/A",
    organ: item.organ || "N/A",
    status: item.status || "pending",
    prescriptionId: item.id ?? null,
    reportId: item.report_id ?? item.report?.id ?? null,
    report: {
      findings: "",
      impression: "",
      notes: "",
    },
    analysis: null,
  };
}

function extractReportFromPayload(payload, requestedId) {
  const dataRoot = payload?.data ?? payload;
  const rows = Array.isArray(dataRoot) ? dataRoot : dataRoot ? [dataRoot] : [];
  if (!rows.length) return null;

  const reqNum = Number(requestedId);
  const exact = rows.find((r) => Number(r?.id) === reqNum);
  return exact || rows[0] || null;
}

export default function Radiologistretrieve() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(null); // "edit" | "analyze" | null
  const [pdfReportState, setPdfReportState] = useState({
    loading: false,
    error: "",
    requestedId: null,
    resolvedId: null,
    report: null,
  });

  const editModalId = "edit_details_modal";
  const analyzeModalId = "analyze_modal";
  const pdfModalId = "radiologist_pdf_report_modal";

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("access_token");
        if (!token)
          throw new Error("Missing access token. Please log in again.");

        const res = await fetch(`${API_BASE}/api/prescriptions`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        const json = await res.json().catch(() => ({}));

        if (res.status === 401)
          throw new Error("Unauthorized. Please log in again.");
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to load prescriptions.");
        }

        const list = Array.isArray(json?.data) ? json.data : [];
        setAppointments(list.map(mapApiPrescriptionToUi));
        setApiMessage({ type: "", text: "" });
      } catch (error) {
        setApiMessage({
          type: "error",
          text: error.message || "Unable to load prescriptions.",
        });
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const filteredAppointments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter(
      (a) =>
        a.requestId.toLowerCase().includes(q) ||
        a.patient.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.radiographer.toLowerCase().includes(q) ||
        String(a.status || "")
          .toLowerCase()
          .includes(q) ||
        a.scanType.toLowerCase().includes(q) ||
        a.organ.toLowerCase().includes(q),
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
    const id = openModal === "edit" ? editModalId : analyzeModalId;
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

  const openPdfReportModal = async (a) => {
    const reportId = a?.reportId ?? null;

    if (reportId == null) {
      setApiMessage({
        type: "error",
        text: "Can't display report. Report ID is missing for this record.",
      });
      return;
    }

    setPdfReportState({
      loading: true,
      error: "",
      requestedId: reportId,
      resolvedId: null,
      report: null,
    });
    setTimeout(() => document.getElementById(pdfModalId)?.showModal(), 0);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token. Please log in again.");
      const res = await fetch(
        `${API_BASE}/api/reports/${encodeURIComponent(String(reportId))}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );
      const json = await res.json().catch(() => ({}));

      if (res.status === 401)
        throw new Error("Unauthorized. Please log in again.");
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load report details.");
      }

      const report = extractReportFromPayload(json, reportId);
      if (!report) throw new Error("Report details not found.");

      setPdfReportState({
        loading: false,
        error: "",
        requestedId: reportId,
        resolvedId: report.id ?? null,
        report,
      });
    } catch (error) {
      setPdfReportState({
        loading: false,
        error: error.message || "Unable to load report details.",
        requestedId: reportId,
        resolvedId: null,
        report: null,
      });
    }
  };

  const closeAll = () => {
    setSelected(null);
    setOpenModal(null);
  };

  const updateAppointment = (requestId, patch) => {
    setAppointments((prev) =>
      prev.map((a) => (a.requestId === requestId ? { ...a, ...patch } : a)),
    );
  };

  const getStatusBadge = (a) => {
    const s = String(a.status || "").toLowerCase();
    if (a.analysis || s.includes("completed") || s.includes("ready"))
      return (
        <div className="badge badge-secondary badge-md text-white">
          Report Ready
        </div>
      );
    return (
      <div className="badge badge-success badge-md text-white">Pending</div>
    );
  };

  return (
    <div className="space-y-6 text-base">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">Radiologist Appointments</h1>
          <p className="text-base-content/60">
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

      {apiMessage.text ? (
        <div className="alert alert-error">
          <span>{apiMessage.text}</span>
        </div>
      ) : null}

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
        <table className="table w-full align-middle text-lg text-center">
          <thead>
            <tr className="text-sm">
              <th>Request ID</th>
              <th>Created</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Scan Type</th>
              <th>Radiographer</th>
              <th>Organ</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-6 text-base-content/50 text-lg"
                >
                  Loading prescriptions...
                </td>
              </tr>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((a) => (
                <tr key={a.requestId} className="hover:bg-base-300 text-sm">
                  <td>{a.requestId}</td>
                  <td>{a.createdAt}</td>
                  <td>{a.doctor}</td>
                  <td className="font-semibold">{a.patient}</td>
                  <td>{a.scanType}</td>
                  <td>{a.radiographer}</td>
                  <td>{a.organ}</td>
                  <td>{a.status}</td>

                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-outline btn-md"
                        onClick={() => openPdfReportModal(a)}
                      >
                        Diagnostic report
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

      <PdfReportModal
        modalId={pdfModalId}
        state={pdfReportState}
        onClose={() =>
          setPdfReportState({
            loading: false,
            error: "",
            requestedId: null,
            resolvedId: null,
            report: null,
          })
        }
      />
    </div>
  );
}
