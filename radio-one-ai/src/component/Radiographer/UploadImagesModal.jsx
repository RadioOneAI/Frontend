import React, { useEffect, useRef, useState } from "react";

export default function UploadImagesModal({ modalId, appointment, onSubmit, onClose }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [priority, setPriority] = useState("normal");

  // reset when appointment changes
  useEffect(() => {
    setFiles([]);
    setPriority(appointment?.priority || "normal");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [appointment?.requestId]);

  if (!appointment) return null;

  const closeModal = () => {
    document.getElementById(modalId)?.close();
  };

  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    setFiles(list);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
    if (list.length > 0) setFiles(list);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ files, priority });

    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    closeModal();
  };

  return (
    <dialog id={modalId} className="modal" onClose={() => onClose?.()}>
      <div className="modal-box w-11/12 max-w-3xl text-lg">
        {/* Top right close */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <h3 className="font-bold text-2xl mb-1">Upload Scan Images</h3>

        <p className="text-base-content/70 text-base mb-4">
          Request: <span className="font-mono font-bold">{appointment.requestId}</span>
          {" "}• Patient: <span className="font-semibold">{appointment.patient}</span>
        </p>

        <div className="divider my-2" />

        {/* ✅ Priority Buttons */}
        <div className="space-y-2">
          <div className="font-bold">Select Priority</div>

          <div className="join w-full">
            <button
              type="button"
              className={`btn join-item flex-1 ${priority === "critical" ? "btn-error" : "btn-outline"}`}
              onClick={() => setPriority("critical")}
            >
              Critical (15 min)
            </button>
            <button
              type="button"
              className={`btn join-item flex-1 ${priority === "urgent" ? "btn-warning" : "btn-outline"}`}
              onClick={() => setPriority("urgent")}
            >
              Urgent (24h)
            </button>
            <button
              type="button"
              className={`btn join-item flex-1 ${priority === "routine" ? "btn-info" : "btn-outline"}`}
              onClick={() => setPriority("routine")}
            >
              Routine (48h)
            </button>
            <button
              type="button"
              className={`btn join-item flex-1 ${priority === "normal" ? "btn-neutral text-white" : "btn-outline"}`}
              onClick={() => setPriority("normal")}
            >
              Normal
            </button>
          </div>

          <div className="text-sm text-base-content/60">
            Time countdown will start after you submit.
          </div>
        </div>

        <div className="divider my-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drop Zone */}
          <div
            className="border-2 border-dashed border-base-300 rounded-xl p-6 cursor-pointer hover:bg-base-200 transition"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="text-xl font-bold">Drop images here</div>
              <div className="text-base-content/70 text-base">
                or click to browse (JPG, PNG, etc.)
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

          {/* ✅ Preview thumbnails before submit */}
          <div className="bg-base-200 rounded-xl p-4">
            <div className="font-bold text-lg mb-2">Preview</div>

            {files.length === 0 ? (
              <div className="text-base-content/60 text-base">No images selected yet.</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {files.map((f, idx) => (
                  <div key={`${f.name}-${idx}`} className="card bg-base-100 border border-base-300 w-40">
                    <figure className="px-3 pt-3">
                      <img
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        className="rounded-xl w-full h-24 object-cover"
                        onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)} // ✅ avoid memory leak for preview
                      />
                    </figure>
                    <div className="card-body p-3">
                      <div className="text-xs font-semibold truncate">{f.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="modal-action">
            <button type="submit" className="btn btn-primary text-lg" disabled={files.length === 0}>
              Submit Upload
            </button>
          </div>
        </form>
      </div>

      {/* backdrop close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
