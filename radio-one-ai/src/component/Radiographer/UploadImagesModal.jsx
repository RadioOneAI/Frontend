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
    <dialog id={modalId} className="modal modal-bottom sm:modal-middle backdrop-blur-md bg-base-300/40">
      <div className="modal-box w-full sm:w-[95vw] max-w-[1500px] max-h-[90vh] overflow-y-auto glass bg-base-100/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] rounded-t-3xl sm:rounded-3xl p-6 sm:p-10 relative">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 hover:bg-base-200/50 hover:text-error transition-colors">
            ✕
          </button>
        </form>

        <div className="mb-8">
          <h3 className="font-black text-4xl mb-2 tracking-tight">Upload Scan <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Images</span></h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-base-content/70">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              Request <b className="text-base-content font-mono">{appointment.requestId}</b>
            </span>
            <span className="hidden sm:inline opacity-30">•</span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Patient <b className="text-base-content">{appointment.patient}</b>
            </span>
          </div>
        </div>

        {!showResearchPanel && (
          <form onSubmit={handleSubmitUpload} className="space-y-8 animate-fade-in">
            <div
              className="group relative border-2 border-dashed border-primary/30 rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-primary hover:bg-primary/5 bg-base-200/30 backdrop-blur-sm overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-black mb-1 text-base-content/90">Drop clinical images here</div>
                  <div className="text-base-content/50 font-medium">or click to browse from your device</div>
                </div>

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
              <div className="bg-base-200/40 rounded-3xl p-6 border border-white/5">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="badge badge-primary">{files.length}</span> Ready for analysis
                </h4>
                <div className="flex gap-4 flex-wrap">
                  {files.map((f, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                      <img
                        src={URL.createObjectURL(f)}
                        alt="preview"
                        className="relative w-32 h-32 object-cover rounded-xl border border-white/10 shadow-lg group-hover:scale-[1.02] transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button className="btn btn-primary btn-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 font-bold px-10" disabled={!files.length}>
                Continue to AI Analysis
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </form>
        )}

        {showResearchPanel && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-base-200/40 rounded-3xl border border-white/5 overflow-hidden shadow-inner p-2">
              <ResearchAnalysisPanel
                initialFile={files[0] || null}
                autoAnalyze={true}
                appointment={appointment}
              />
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="h-px bg-base-content/10 flex-1"></div>
              <span className="font-black text-sm uppercase tracking-[0.2em] text-base-content/40">Radiographer Workflow</span>
              <div className="h-px bg-base-content/10 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="glass-panel bg-base-100/50 p-6 rounded-3xl border border-white/10 shadow-sm">
                  <div className="font-bold text-lg mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                    Priority Level
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["critical", "urgent", "routine", "normal"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`btn rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${
                          priority === p 
                            ? p === 'critical' ? 'bg-error text-error-content hover:bg-error border-none shadow-[0_4px_15px_rgba(248,113,113,0.4)] scale-105'
                            : p === 'urgent' ? 'bg-warning text-warning-content hover:bg-warning border-none shadow-[0_4px_15px_rgba(250,204,21,0.4)] scale-105'
                            : 'bg-primary text-primary-content hover:bg-primary border-none shadow-[0_4px_15px_rgba(56,189,248,0.4)] scale-105'
                            : 'btn-outline border-base-content/20 text-base-content/60 hover:bg-base-200 hover:border-base-content/40'
                        }`}
                        onClick={() => setPriority(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-panel bg-base-100/50 p-6 rounded-3xl border border-white/10 shadow-sm">
                  <div className="font-bold text-lg mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    Routing
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className={`flex-1 flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${sendToRadiologist ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(56,189,248,0.1)]' : 'bg-base-200/50 border-white/5 hover:bg-base-200'}`}>
                      <span className={`font-bold ${sendToRadiologist ? 'text-primary' : 'text-base-content/70'}`}>Radiologist</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={sendToRadiologist}
                        onChange={(e) => setSendToRadiologist(e.target.checked)}
                      />
                    </label>

                    <label className="flex-1 flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-base-200/30 opacity-60 cursor-not-allowed">
                      <span className="font-bold text-base-content/50">Physician</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-disabled"
                        checked={sendToPhysician}
                        disabled
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-panel bg-base-100/50 p-6 rounded-3xl border border-white/10 shadow-sm h-full flex flex-col">
                  <div className="font-bold text-lg mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Clinical Notes
                  </div>
                  <textarea
                    className="textarea textarea-bordered bg-base-200/50 border-white/10 focus:bg-base-100 focus:border-primary w-full flex-1 rounded-2xl text-base p-4 resize-none mb-6 shadow-inner"
                    placeholder="Enter tentative diagnosis or preliminary observations..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />

                  <div className="bg-base-200/80 rounded-2xl p-5 border border-white/5">
                    <div className="font-bold mb-3 text-base-content/80">
                      Read back & Verification
                    </div>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl cursor-pointer font-bold transition-all ${readBackYes ? 'bg-success/20 text-success border border-success/30' : 'bg-base-100 border border-white/5 hover:bg-base-300'}`}>
                        <input
                          type="radio"
                          name="readback"
                          className="radio radio-success radio-sm"
                          checked={readBackYes}
                          onChange={() => {
                            setReadBackYes(true);
                            setReadBackNo(false);
                          }}
                        />
                        Yes
                      </label>

                      <label className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl cursor-pointer font-bold transition-all ${readBackNo ? 'bg-error/20 text-error border border-error/30' : 'bg-base-100 border border-white/5 hover:bg-base-300'}`}>
                        <input
                          type="radio"
                          name="readback"
                          className="radio radio-error radio-sm"
                          checked={readBackNo}
                          onChange={() => {
                            setReadBackNo(true);
                            setReadBackYes(false);
                          }}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-base-200/40 p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12 h-12 shadow-md">
                    <span className="font-bold">NS</span>
                  </div>
                </div>
                <div>
                  <div className="font-black text-lg">Namal Soyza</div>
                  <div className="text-sm font-bold text-base-content/50 uppercase tracking-widest">Radiographer</div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 font-black px-10 w-full sm:w-auto"
                disabled={!readBackYes && !readBackNo}
                onClick={handleFinalSubmit}
              >
                Submit & Start Timer
                <svg className="w-6 h-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <form method="dialog" className="modal-backdrop bg-base-300/40 backdrop-blur-sm">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
