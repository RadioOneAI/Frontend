import React, { useEffect, useMemo, useState } from "react";
import DoctorReportModal from "../../component/Doctor/DoctorReportModal";
import PdfReportModal from "../../component/Radiographer/PdfReportModal";

const API_BASE = "http://127.0.0.1:5000";

function getLoggedDoctorId() {
  try {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    return user?.id ?? null;
  } catch {
    return null;
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function formatRemaining(ms) {
  if (ms == null) return "-";
  if (ms <= 0) return "Overdue";

  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m ${secs}s`;
}

function statusBadge(status) {
  const s = String(status || "").toLowerCase();

  if (s.includes("ready") || s.includes("completed")) {
    return <div className="badge badge-info text-white">Report Ready</div>;
  }
  if (s.includes("critical") || s.includes("urgent")) {
    return <div className="badge badge-error text-white">Critical Finding</div>;
  }
  if (s.includes("image uploaded")) {
    return <div className="badge badge-success text-white">Image Uploaded</div>;
  }

  return <div className="badge badge-ghost">Pending Radiologist</div>;
}

function mapPrescriptionToPatientRow(item) {
  return {
    id: String(
      item?.patient?.username ||
        item?.patient?.id ||
        item?.patient_id ||
        item?.id ||
        "-"
    ),
    name: item?.patient?.name || `Patient #${item?.patient_id ?? "-"}`,
    age: item?.patient?.age ?? "N/A",
    condition:
      item?.description ||
      `${item?.scan_type || "Scan"} - ${item?.organ || "N/A"}`,
    scanDate: item?.created_at
      ? new Date(item.created_at).toLocaleString()
      : "N/A",
    status: item?.status || "pending",
    urgency: "Medium",

    requestId: item?.scan_req_id || `REQ-${item?.id ?? "-"}`,
    scanRequestId: item?.scan_req_id || item?.scan_request_id || null,
    createdAt: item?.created_at
      ? new Date(item.created_at).toLocaleString()
      : "N/A",
    receptionist: item?.created_by?.name || "N/A",
    doctor: item?.doctor?.name || `Doctor #${item?.doctor_id ?? "-"}`,
    doctorId: item?.doctor_id ?? item?.doctor?.id ?? null,
    patient: item?.patient?.name || `Patient #${item?.patient_id ?? "-"}`,
    patientId: item?.patient_id ?? item?.patient?.id ?? null,
    scanType: item?.scan_type || "N/A",
    organ: item?.organ || "N/A",
    imagesCount: item?.images_count ?? 0,
    prescriptionId: item?.id ?? null,
    reportId: item?.report_id ?? item?.report?.id ?? null,
    description: item?.description || "",
    priority: "pending",
    dueAt: null,
  };
}

export default function DoctorPatients() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [now, setNow] = useState(Date.now());

  const [pdfReportState, setPdfReportState] = useState({
    loading: false,
    error: "",
    requestedId: null,
    resolvedId: null,
    report: null,
  });

  const pdfModalId = "doctor_pdf_report_modal";

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const loadMyPatients = async () => {
      setIsLoading(true);
      setApiMessage("");

      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Missing access token. Please log in again.");

        const doctorId = getLoggedDoctorId();
        if (!doctorId) throw new Error("Doctor ID not found in localStorage user.");

        const res = await fetch(`${API_BASE}/api/prescriptions`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const json = await res.json().catch(() => ({}));

        if (res.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }

        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to load prescriptions.");
        }

        const list = Array.isArray(json?.data) ? json.data : [];
        const mine = list.filter(
          (item) =>
            Number(item?.doctor_id ?? item?.doctor?.id) === Number(doctorId)
        );

        setPatients(mine.map(mapPrescriptionToPatientRow));
      } catch (error) {
        setApiMessage(error?.message || "Unable to load my patients.");
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMyPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return patients;

    return patients.filter(
      (a) =>
        a.requestId.toLowerCase().includes(q) ||
        a.patient.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.receptionist.toLowerCase().includes(q) ||
        a.scanType.toLowerCase().includes(q) ||
        a.organ.toLowerCase().includes(q) ||
        String(a.status || "").toLowerCase().includes(q)
    );
  }, [searchTerm, patients]);

  const extractReportFromPayload = (payload, requestedId) => {
    const dataRoot = payload?.data ?? payload;
    const rows = Array.isArray(dataRoot) ? dataRoot : dataRoot ? [dataRoot] : [];
    if (!rows.length) return null;

    const reqNum = Number(requestedId);
    const exact = rows.find((r) => Number(r?.id) === reqNum);
    return exact || rows[0] || null;
  };

  const openPdfReportModal = async (p) => {
    const reportId = p?.reportId ?? null;

    if (reportId == null) {
      setApiMessage("Can't display report. Report ID is missing for this record.");
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
      const fetchReportById = async (id) => {
        const res = await fetch(
          `${API_BASE}/api/reports/${encodeURIComponent(String(id))}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        const json = await res.json().catch(() => ({}));

        if (res.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }
        if (!res.ok || json?.success === false) return null;

        return extractReportFromPayload(json, id);
      };

      let report = null;
      let resolvedReportId = reportId ?? null;

      if (resolvedReportId != null) {
        report = await fetchReportById(resolvedReportId);
      }

      if (!report) {
        const listRes = await fetch(`${API_BASE}/api/reports`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const listJson = await listRes.json().catch(() => ({}));

        if (listRes.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        }
        if (!listRes.ok || listJson?.success === false) {
          throw new Error(listJson?.message || "Failed to load report list.");
        }

        const rows = Array.isArray(listJson?.data) ? listJson.data : [];
        const scanReq = p?.scanRequestId || p?.requestId || null;

        const byPrescription = rows.filter(
          (r) =>
            Number(r?.prescription_id) === Number(p?.prescriptionId) &&
            p?.prescriptionId != null
        );

        const byScanReq = rows.filter(
          (r) =>
            (r?.scan_req_id && r.scan_req_id === scanReq) ||
            (r?.scan_request_id && r.scan_request_id === scanReq)
        );

        const byDoctorAndPatient = rows.filter(
          (r) =>
            Number(r?.doctor_id ?? r?.doctor?.id) === Number(p?.doctorId) &&
            Number(r?.patient_id ?? r?.patient?.id) === Number(p?.patientId) &&
            p?.doctorId != null &&
            p?.patientId != null
        );

        const byDoctorOnly = rows.filter(
          (r) =>
            Number(r?.doctor_id ?? r?.doctor?.id) === Number(p?.doctorId) &&
            p?.doctorId != null
        );

        let candidates = [];
        if (byPrescription.length) candidates = byPrescription;
        else if (byScanReq.length) candidates = byScanReq;
        else if (byDoctorAndPatient.length) candidates = byDoctorAndPatient;
        else candidates = byDoctorOnly;

        const sorted = [...candidates].sort((a, b) => {
          const ta = new Date(a?.created_at || 0).getTime();
          const tb = new Date(b?.created_at || 0).getTime();
          return tb - ta;
        });

        const best = sorted[0] || null;
        resolvedReportId = best?.id ?? null;
        report = best;

        if (resolvedReportId != null) {
          const full = await fetchReportById(resolvedReportId);
          if (full) report = full;
        }
      }

      if (!report) throw new Error("Report details not found.");

      setPdfReportState({
        loading: false,
        error: "",
        requestedId: resolvedReportId ?? reportId,
        resolvedId: report.id ?? resolvedReportId ?? null,
        report,
      });
    } catch (error) {
      setPdfReportState({
        loading: false,
        error: error?.message || "Unable to load report details.",
        requestedId: reportId,
        resolvedId: null,
        report: null,
      });
    }
  };

  const getRemaining = (a) =>
    a.dueAt ? formatRemaining(new Date(a.dueAt).getTime() - now) : "-";

  return (
    <div className="space-y-6 text-base">
      <div>
        <h1 className="text-4xl font-bold">My Patients</h1>
        <p className="text-base-content/60">
          View scan requests, uploaded data, and AI/diagnostic reports
        </p>
      </div>

      {apiMessage ? (
        <div className="alert alert-error">
          <span>{apiMessage}</span>
        </div>
      ) : null}

      <input
        className="input input-bordered w-full max-w-2xl text-lg"
        placeholder="Search by Request ID / Patient / Doctor / Receptionist / Scan / Organ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="card bg-base-100 shadow-xl overflow-x-auto border border-base-300">
        <table className="table w-full text-sm text-center">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Doctor Name</th>
              <th>Receptionist Name</th>
              <th>Patient Name</th>
              <th>Scan Type</th>
              <th>Organ</th>
              <th>Images</th>
              <th>Time Left</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="11" className="text-center py-6 text-base-content/50">
                  Loading prescriptions...
                </td>
              </tr>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <tr key={`${p.requestId}-${p.id}`} className="hover">
                  <td className="font-mono font-bold">{p.requestId}</td>
                  <td>{p.doctor}</td>
                  <td>{p.receptionist}</td>
                  <td>{p.patient}</td>
                  <td>{p.scanType}</td>
                  <td>{p.organ}</td>
                  <td>{p.imagesCount}</td>
                  <td>{getRemaining(p)}</td>
                  <td>{statusBadge(p.status)}</td>
                  <td>{p.createdAt}</td>

                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => openPdfReportModal(p)}
                      >
                        Diagnostics Report
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-6 text-base-content/50">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedPatient ? (
        <DoctorReportModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      ) : null}

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