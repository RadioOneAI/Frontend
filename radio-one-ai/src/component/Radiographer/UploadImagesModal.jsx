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

export default function UploadImagesModal({
  modalId,
  appointment,
  onSubmit,
  onClose,
}) {
  const fileInputRef = useRef(null);

  /* ================= STATE ================= */
  const [files, setFiles] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const [priority, setPriority] = useState("normal");

  const [sendToRadiologist, setSendToRadiologist] = useState(true);
  const [sendToPhysician, setSendToPhysician] = useState(false);

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
    setShowReport(false);
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
  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    setFiles(list);
  };

  const handleSubmitUpload = (e) => {
    e.preventDefault();
    setShowReport(true);
  };

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

        <h3 className="font-bold text-2xl mb-1">Upload Scan Images</h3>
        <p className="text-base-content/70 mb-4">
          Request <b>{appointment.requestId}</b> • Patient{" "}
          <b>{appointment.patient}</b>
        </p>

        {/* ================= UPLOAD ================= */}
        {!showReport && (
          <form onSubmit={handleSubmitUpload} className="space-y-4">
            <div
              className="border-2 border-dashed border-base-300 rounded-xl p-6 cursor-pointer hover:bg-base-200 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <div className="text-xl font-bold">Drop images here</div>
                <div className="text-base-content/70">or click to browse</div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Preview before submit */}
            {files.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {files.map((f, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(f)}
                    alt="preview"
                    className="w-28 h-28 object-cover rounded border"
                  />
                ))}
              </div>
            )}

            <div className="modal-action">
              <button className="btn btn-primary btn-lg" disabled={!files.length}>
                Submit Upload
              </button>
            </div>
          </form>
        )}

        {/* ================= REPORT + FORM ================= */}
        {showReport && (
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

              {/* Priority */}
              <div>
                <div className="font-bold mb-1">Priority</div>
                <div className="join w-full">
                  {["critical", "urgent", "routine", "normal"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`btn join-item flex-1 ${
                        priority === p ? "btn-neutral text-white" : "btn-outline"
                      }`}
                      onClick={() => setPriority(p)}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Routing */}
              <div className="flex gap-6">
                <label className="label gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={sendToRadiologist}
                    onChange={(e) =>
                      setSendToRadiologist(e.target.checked)
                    }
                  />
                  <span>Send to Radiologist</span>
                </label>

                <label className="label gap-2 cursor-not-allowed opacity-60">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={sendToPhysician}
                    disabled
                  />
                  <span>Send to Physician</span>
                </label>
              </div>

              {/* Diagnosis */}
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Diagnosis / Tentative Diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />

              {/* Read back */}
              <div>
                <div className="font-bold mb-1">
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
                Submit & Start Timer
              </button>
            </div>
          </div>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
