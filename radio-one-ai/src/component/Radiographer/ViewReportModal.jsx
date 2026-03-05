import React, { useEffect, useMemo, useRef, useState } from "react";
import tumorImage from "../../assets/images/meningioma-segmentation.png";
import noTumorImage from "../../assets/images/clean-mri.png";

const API_BASE = "http://127.0.0.1:5000";

const DEMO_PATIENT_PROFILES = {
  "Kamal Gunawardena": { hasTumor: true },
  "Sita Kumari": { hasTumor: false },
  "Mohamed Riaz": { hasTumor: false },
};

export default function ViewReportModal({ modalId, appointment, onSubmit, onClose }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [priority, setPriority] = useState("normal");
  const [sendToRadiologist, setSendToRadiologist] = useState(true);
  const [sendToPhysician, setSendToPhysician] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [readBackYes, setReadBackYes] = useState(false);
  const [readBackNo, setReadBackNo] = useState(false);

  const patientProfile = useMemo(() => {
    if (!appointment) return null;
    return DEMO_PATIENT_PROFILES[appointment.patient] || { hasTumor: false };
  }, [appointment]);

  useEffect(() => {
    setFiles([]);
    setPriority("normal");
    setSendToRadiologist(true);
    setSendToPhysician(false);
    setDiagnosis("");
    setReadBackYes(false);
    setReadBackNo(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [appointment?.requestId]);

  if (!appointment) return null;

  const resolveImageUrl = (rawUrl) => {
    if (!rawUrl) return "";
    if (/^https?:\/\//i.test(rawUrl) || rawUrl.startsWith("blob:")) return rawUrl;
    if (rawUrl.startsWith("/")) return `${API_BASE}${rawUrl}`;
    return `${API_BASE}/${rawUrl}`;
  };

  const handleFinalSubmit = () => {
    onSubmit?.({
      files,
      priority,
      sendToRadiologist,
      sendToPhysician,
      diagnosis,
      readBack: readBackYes ? "YES" : "NO",
    });

    document.getElementById(modalId)?.close();
    onClose?.();
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-[95vw] max-w-[1400px] max-h-[85vh] overflow-y-auto">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            x
          </button>
        </form>

        <h3 className="font-bold text-2xl mb-1">Contact Radiologist/Physician</h3>
        <p className="text-base-content/70 mb-4">
          Request <b>{appointment.requestId}</b> - Patient <b>{appointment.patient}</b>
        </p>

        <div className="mb-5">
          <h4 className="font-bold mb-2">Retrieved Images</h4>
          {appointment.loadingImages ? (
            <div className="text-base-content/60">Loading images...</div>
          ) : appointment.apiImages?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {appointment.apiImages.map((img) => (
                <div key={img.id} className="rounded-lg border border-base-300 p-2 bg-base-200">
                  <img
                    src={resolveImageUrl(img.url)}
                    alt={img.name}
                    className="w-full h-28 object-cover rounded"
                  />
                  <div className="text-xs mt-2 truncate">{img.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-base-content/60">No images found for this patient.</div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-base-200 rounded-xl p-4">
              <img
                src={patientProfile?.hasTumor ? tumorImage : noTumorImage}
                className="rounded-xl w-full max-h-[420px] object-contain"
                alt="AI Result"
              />
              <div className="text-center mt-3">
                <h4 className="font-bold text-xl">AI Preliminary Result</h4>
                <p className={`font-semibold ${patientProfile?.hasTumor ? "text-error" : "text-success"}`}>
                  {patientProfile?.hasTumor ? "Tumor Detected" : "No Abnormality Detected"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-6">
              <label className="label gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={sendToRadiologist}
                  disabled
                  onChange={(e) => setSendToRadiologist(e.target.checked)}
                />
                <span>Sent to Radiologist</span>
              </label>

              <label className="label gap-2 cursor-not-allowed opacity-60">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={sendToPhysician}
                  onChange={(e) => setSendToPhysician(e.target.checked)}
                />
                <span>Send to Physician</span>
              </label>
            </div>

            <h5 className="font-bold">Diagnosis</h5>
            <textarea
              className="w-full pb-2 textarea textarea-bordered"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter diagnosis"
            />

            <h5 className="font-bold pt-5">Order</h5>
            <span className="w-full pb-2">
              Activate the Rapid Response/Neuro Emergency. I need immediate action.
            </span>

            <div>
              <div className="font-bold mb-1 pt-5">Read back & Verification performed</div>
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
