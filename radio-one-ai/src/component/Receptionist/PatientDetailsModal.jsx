import React, { useEffect, useMemo, useState } from "react";
import PrescriptionFormModal from "./PrescriptionFormModal";

const API_BASE = "http://127.0.0.1:5000";

export default function PatientDetailsModal({ patient, onBack }) {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [prescriptionsByPatient, setPrescriptionsByPatient] = useState({});

  const scanTypes = useMemo(
    () => ["MRI", "CT", "X-Ray", "Ultrasound", "Mammogram"],
    [],
  );
  const organs = useMemo(
    () => ["brain", "lungs", "breast", "abdominal", "other"],
    [],
  );
  const addModalId = "add_prescription_modal";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token. Please log in again.");

      const res = await fetch(`${API_BASE}/api/patients/doctors/active`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 401)
        throw new Error("Unauthorized. Please log in again.");
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to load doctors.");
      }

      const list = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json?.doctors)
          ? json.doctors
          : Array.isArray(json)
            ? json
            : [];
      setDoctors(
        list
          .map((d) => ({
            id: d.id ?? d.doctor_id ?? d.user_id,
            name:
              d.name || d.full_name || d.user?.name || `Doctor #${d.id ?? "?"}`,
          }))
          .filter((d) => d.id !== undefined && d.id !== null),
      );
    } catch (error) {
      setApiMessage({
        type: "error",
        text: error.message || "Unable to fetch doctors.",
      });
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (!patient) return null;
  const handleAddPrescription = async (data) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token. Please log in again.");

      const formData = new FormData();

      // patient id is already in URL, but safe to send too if backend needs it
      formData.append("patient_id", String(patient.id));

      formData.append("scan_type", data.scanType); // "MRI"
      formData.append("organ", data.organ); // "brain"
      formData.append("doctor_id", String(data.doctorId));
      formData.append("description", data.description || "description");
      formData.append("status", "pending");

      if (data.prescriptionFile) {
        formData.append("prescription_images", data.prescriptionFile); // ✅ correct key
      }

      const res = await fetch(
        `${API_BASE}/api/patients/${patient.id}/prescriptions`,
        {
          method: "POST",
          headers: getAuthHeaders(), // ✅ only Authorization
          body: formData,
        },
      );

      const json = await res.json().catch(() => ({}));

      if (res.status === 401)
        throw new Error("Unauthorized. Please log in again.");
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to add prescription.");
      }

      setApiMessage({
        type: "success",
        text: json?.message || "Prescription added successfully.",
      });
      return true;
    } catch (error) {
      setApiMessage({
        type: "error",
        text: error.message || "Unable to add prescription.",
      });
      return false;
    }
  };

  const prescriptions = prescriptionsByPatient[patient.id] || [];

  return (
    <div
      id="patient_details_section"
      className="card bg-base-100 shadow-xl text-base"
    >
      <div className="card-body">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-3xl font-bold">Patient Details</h3>
            <p className="text-base-content/70 text-base">
              Registered: {patient.registeredDate}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-md btn-primary text-base"
              onClick={() => document.getElementById(addModalId)?.showModal()}
            >
              + Add a prescription
            </button>
            <button
              type="button"
              className="btn btn-md btn-outline text-base"
              onClick={onBack}
            >
              Back to Patients
            </button>
          </div>
        </div>

        {apiMessage.text ? (
          <div
            className={`alert mt-3 ${apiMessage.type === "error" ? "alert-error" : "alert-success"}`}
          >
            <span>{apiMessage.text}</span>
          </div>
        ) : null}

        <div className="divider my-2" />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={patient.img} alt={patient.name} />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold">{patient.name}</h4>
                <span
                  className={`badge mt-1 text-base ${
                    patient.status === "Active"
                      ? "badge-success text-white"
                      : "badge-error text-white"
                  }`}
                >
                  {patient.status} Account
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-xl border-b pb-2">Contact Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-base">
              <div>
                <span className="block opacity-50 text-sm uppercase font-bold">
                  Mobile
                </span>
                <span>{patient.phone}</span>
              </div>
              <div>
                <span className="block opacity-50 text-sm uppercase font-bold">
                  Email
                </span>
                <span>{patient.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-bold text-xl">Prescriptions</h4>
            <span className="text-base text-base-content/60">
              Total: {prescriptions.length}
            </span>
          </div>
          <div className="divider my-2" />

          {prescriptions.length === 0 ? (
            <div className="text-base text-base-content/60">
              No prescriptions added yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-base">
                <thead>
                  <tr className="text-base">
                    <th>Request ID</th>
                    <th>Created Date & Time</th>
                    <th>Doctor</th>
                    <th>Scan Type</th>
                    <th>Organ</th>
                    <th>Images</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((p) => (
                    <tr key={p.requestId} className="text-base">
                      <td className="font-mono font-bold">{p.requestId}</td>
                      <td>{p.createdAt}</td>
                      <td>{p.doctor}</td>
                      <td>{p.scanType}</td>
                      <td>{p.organ}</td>
                      <td>{p.imagesCount}</td>
                      <td>
                        <span className="badge badge-warning text-white">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
    </div>
  );
}
