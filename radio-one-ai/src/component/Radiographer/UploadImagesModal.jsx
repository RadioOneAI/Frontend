import React, { useEffect, useRef, useState } from "react";
import ResearchAnalysisPanel from "./researchFrontend/ResearchAnalysisPanel";

export default function UploadImagesModal({
  modalId,
  appointment,
  onSubmit,
  onClose,
}) {
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [showResearchPanel, setShowResearchPanel] = useState(false);

  const [priority, setPriority] = useState("normal");
  const [sendToRadiologist, setSendToRadiologist] = useState(true);
  const [sendToPhysician, setSendToPhysician] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [order, setOrder] = useState("");
  const [readBackYes, setReadBackYes] = useState(false);
  const [readBackNo, setReadBackNo] = useState(false);

  useEffect(() => {
    setFiles([]);
    setShowResearchPanel(false);
    setPriority("normal");
    setSendToRadiologist(true);
    setSendToPhysician(false);
    setDiagnosis("");
    setOrder("");
    setReadBackYes(false);
    setReadBackNo(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [appointment?.requestId]);

  if (!appointment) return null;

  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    setFiles(list);
  };

  const handleSubmitUpload = (e) => {
    e.preventDefault();
    if (!files.length) return;
    setShowResearchPanel(true);
  };

  const handleFinalSubmit = () => {
    onSubmit?.({
      files,
      priority,
      sendToRadiologist,
      sendToPhysician,
      diagnosis,
      order,
      readBack: readBackYes ? "YES" : readBackNo ? "NO" : "",
    });

    document.getElementById(modalId)?.close();
    onClose?.();
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-[95vw] max-w-[1500px] max-h-[90vh] overflow-y-auto">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-2xl mb-1">Upload Scan Images</h3>
        <p className="text-base-content/70 mb-4">
          Request <b>{appointment.requestId}</b> • Patient <b>{appointment.patient}</b>
        </p>

        {!showResearchPanel && (
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
                Continue to AI Analysis
              </button>
            </div>
          </form>
        )}

        {showResearchPanel && (
          <div className="space-y-6">
            <ResearchAnalysisPanel
              initialFile={files[0] || null}
              autoAnalyze={true}
              appointment={appointment}
            />

            <div className="divider">Radiographer Workflow</div>

            <div className="space-y-4">
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

              <div className="flex gap-6 flex-wrap">
                <label className="label gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={sendToRadiologist}
                    onChange={(e) => setSendToRadiologist(e.target.checked)}
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

              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Diagnosis / Tentative Diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />

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

                  <label className="label gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={readBackNo}
                      onChange={() => {
                        setReadBackNo(true);
                        setReadBackYes(false);
                      }}
                    />
                    <span>No</span>
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
