import React, { useEffect, useRef, useState } from "react";

export default function UploadImagesModal({ modalId, appointment, onSubmit, onClose }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  // reset files when opening a different appointment
  useEffect(() => {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [appointment?.requestId]);

  if (!appointment) return null;

  const closeModal = () => {
    const dialog = document.getElementById(modalId);
    dialog?.close();
  };

  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (list.length > 0) setFiles(list);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.({ files });

    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    closeModal();
  };

  return (
    <dialog
      id={modalId}
      className="modal"
      onClose={() => onClose?.()}
    >
      <div className="modal-box w-11/12 max-w-2xl text-lg">
        {/* Top right close */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-2xl mb-1">Upload Scan Images</h3>

        <p className="text-base-content/70 text-base mb-4">
          Request:{" "}
          <span className="font-mono font-bold">{appointment.requestId}</span>
          {" "}• Patient: <span className="font-semibold">{appointment.patient}</span>
        </p>

        <div className="divider my-2" />

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

          {/* Selected files */}
          <div className="bg-base-200 rounded-xl p-4">
            <div className="font-bold text-lg mb-2">Selected Images</div>

            {files.length === 0 ? (
              <div className="text-base-content/60 text-base">
                No images selected yet.
              </div>
            ) : (
              <ul className="list-disc ml-6 text-base">
                {files.map((f, idx) => (
                  <li key={`${f.name}-${idx}`}>
                    {f.name}{" "}
                    <span className="opacity-60">
                      ({Math.round(f.size / 1024)} KB)
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit */}
          <div className="modal-action">
            <button type="submit" className="btn btn-primary text-lg">
              Submit Upload
            </button>
          </div>
        </form>
      </div>

      {/* Click background to close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
