import React, { useEffect, useRef, useState, useMemo } from "react";

import tumorImage from "../../assets/images/meningioma-segmentation.png";
import noTumorImage from "../../assets/images/clean-mri.png";

/**
 * Demo clinical profiles (frontend only)
 */
const DEMO_PATIENT_PROFILES = {
  "Kamal Gunawardena": {
    hasTumor: true,
  },
  "Sita Kumari": {
    hasTumor: false,
  },
  "Mohamed Riaz": {
    hasTumor: false,
  },
};

export default function ViewReportModal({
  modalId,
  appointment,
  onSubmit,
  onClose,
}) {
  const fileInputRef = useRef(null);

  /* ================= STATE ================= */
  const [files, setFiles] = useState([]); // kept intentionally
  const [showReport, setShowReport] = useState(true); // directly show report UI

  const [priority, setPriority] = useState("normal");

  const [sendToRadiologist, setSendToRadiologist] = useState(false);
  const [sendToPhysician, setSendToPhysician] = useState(true);

  const [diagnosis, setDiagnosis] = useState("");
  const [order, setOrder] = useState("");

  const [readBackYes, setReadBackYes] = useState(false);
  const [readBackNo, setReadBackNo] = useState(false);

  const patientProfile = useMemo(() => {
    if (!appointment) return null;
    return (
      DEMO_PATIENT_PROFILES[appointment.patient] || { hasTumor: false }
    );
  }, [appointment]);

  /* ================= RESET ================= */
  useEffect(() => {
    setFiles([]);
    setShowReport(true);
    setPriority("normal");
    setSendToRadiologist(true);
    setSendToPhysician(false);
    setDiagnosis("");
    setOrder("");
    setReadBackYes(false);
    setReadBackNo(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [appointment?.requestId]);

  if (!appointment) return null;

  /* ================= HANDLERS ================= */
  const handleFinalSubmit = () => {
    onSubmit?.({
      files,
      priority,
      sendToRadiologist,
      sendToPhysician,
      diagnosis,
      order,
      readBack: readBackYes ? "YES" : "NO",
    });

    document.getElementById(modalId)?.close();
    onClose?.();
  };

  /* ================= UI ================= */
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-[95vw] max-w-[1400px] max-h-[85vh] overflow-y-auto">

        {/* Close */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-2xl mb-1">Contact Radiologist/Physician</h3>
        <p className="text-base-content/70 mb-4">
          Request <b>{appointment.requestId}</b> • Patient{" "}
          <b>{appointment.patient}</b>
        </p>

        {/* ================= REPORT + FORM ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT — RESULTS */}
          <div>
            <div className="bg-base-200 rounded-xl p-4">
              <img
                src={patientProfile.hasTumor ? tumorImage : noTumorImage}
                className="rounded-xl w-full max-h-[420px] object-contain"
                alt="AI Result"
              />
              <div className="text-center mt-3">
                <h4 className="font-bold text-xl">AI Preliminary Result</h4>
                <p
                  className={`font-semibold ${
                    patientProfile.hasTumor
                      ? "text-error"
                      : "text-success"
                  }`}
                >
                  {patientProfile.hasTumor
                    ? "Tumor Detected"
                    : "No Abnormality Detected"}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — DETAILS + FORM */}
          <div className="space-y-4">


            {/* Routing */}
            <div className="flex gap-6">
              <label className="label gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={sendToRadiologist}
                  disabled
                  onChange={(e) =>
                    setSendToRadiologist(e.target.checked)
                  
                  }
                />
                <span>Sent to Radiologist</span>
              </label>

              <label className="label gap-2 cursor-not-allowed opacity-60">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={sendToPhysician}
                  onChange={(e) =>
                    setSendToPhysician(e.target.checked)
                  
                  }
                />
                <span>Send to Physician</span>
              </label>
            </div>

            {/* Diagnosis */}
            <h5 className="font-bold">Diagnosis</h5>
            <textarea
              className="w-full pb-2 textarea textarea-bordered"
              value={diagnosis}
              placeholder="Based on the patient's presentation of progressive headaches, new-onset focal seizures, and right-sided weakness, along with MRI findings revealing a contrast-enhancing mass with significant edema in the left parietal lobe, the tentative diagnosis is a primary brain tumor, most likely a high-grade glioma such as a glioblastoma. This working diagnosis will remain until a histopathological confirmation is obtained via biopsy or surgical resection."
            />

           
            <h5 className="font-bold pt-5">Order</h5>
            <span className="w-full pb-2" value={order}>
              Activate the Rapid Response/Neuro Emergency. My patient is showing signs of cerebral herniation. I need the following done immediately.
            </span>
    
            {/* Read back */}
            <div>
              <div className="font-bold mb-1 pt-5">
                Read back & Verification performed
              </div>
              <div className="flex gap-6">
                <label className="label gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={readBackYes}
                    onChange={() => {
                      setReadBackYes(true);
                      setReadBackNo(false);
                    }}
                  />
                  <span>Yes</span>
                </label>

                
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-base-200 rounded p-3 text-sm">
              <b>Received By:</b> Namal Soyza <br />
              <b>Designation:</b> Radiographer
            </div>

            <button
              className="btn btn-success btn-lg w-full"
              disabled={!readBackYes && !readBackNo}
              onClick={handleFinalSubmit}
            >
              Send to Physician
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
