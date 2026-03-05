import React, { useEffect, useRef, useState } from "react";

const API_BASE = "http://127.0.0.1:5000";

export default function ViewReportModal({
  modalId,
  appointment,
  onSubmit,
  onClose,
}) {
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [priority, setPriority] = useState("normal");
  const [sendToRadiologist, setSendToRadiologist] = useState(true);
  const [sendToPhysician, setSendToPhysician] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [readBackYes, setReadBackYes] = useState(false);
  const [readBackNo, setReadBackNo] = useState(false);

  const [imgBlobUrls, setImgBlobUrls] = useState({});

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  const [previewName, setPreviewName] = useState("");

  const resolveApiUrl = (rawUrl) => {
    if (!rawUrl) return "";
    if (/^https?:\/\//i.test(rawUrl) || rawUrl.startsWith("blob:"))
      return rawUrl;
    if (rawUrl.startsWith("/")) return `${API_BASE}${rawUrl}`;
    return `${API_BASE}/${rawUrl}`;
  };

  const getAuthOnlyHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const openPreview = (src, name) => {
    if (!src) return;
    setPreviewSrc(src);
    setPreviewName(name || "Image");
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewSrc("");
    setPreviewName("");
  };

  // Reset form when appointment changes
  useEffect(() => {
    setFiles([]);
    setPriority("normal");
    setSendToRadiologist(true);
    setSendToPhysician(false);
    setDiagnosis("");
    setReadBackYes(false);
    setReadBackNo(false);
    closePreview();

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [appointment?.requestId]);

  // Load protected images as blobs (because <img> can't send Authorization header)
  useEffect(() => {
    let cancelled = false;

    const loadBlobs = async () => {
      if (!appointment?.apiImages?.length) return;

      const token = localStorage.getItem("access_token");
      if (!token) return;

      const entries = await Promise.all(
        appointment.apiImages.map(async (img) => {
          const rawUrl = img.url || img.file_path;
          const fullUrl = resolveApiUrl(rawUrl);
          if (!fullUrl) return [img.id, ""];

          try {
            const res = await fetch(fullUrl, {
              method: "GET",
              headers: getAuthOnlyHeaders(),
            });
            if (!res.ok) return [img.id, ""];

            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            return [img.id, blobUrl];
          } catch {
            return [img.id, ""];
          }
        }),
      );

      if (cancelled) {
        entries.forEach(
          ([_, u]) => u && u.startsWith("blob:") && URL.revokeObjectURL(u),
        );
        return;
      }

      setImgBlobUrls((prev) => {
        Object.values(prev).forEach(
          (u) => u && u.startsWith("blob:") && URL.revokeObjectURL(u),
        );
        return Object.fromEntries(entries);
      });
    };

    loadBlobs();

    return () => {
      cancelled = true;
    };
  }, [appointment?.apiImages]);

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

  if (!appointment) return null;

  return (
    <>
      <dialog id={modalId} className="modal">
        <div className="modal-box w-[95vw] max-w-[1400px] max-h-[85vh] overflow-y-auto">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              x
            </button>
          </form>

          <h3 className="font-bold text-2xl mb-1">
            Contact Radiologist/Physician
          </h3>
          <p className="text-base-content/70 mb-4">
            Request <b>{appointment.requestId}</b> - Patient{" "}
            <b>{appointment.patient}</b>
          </p>

          <div className="mb-5">
            <h4 className="font-bold mb-2">Retrieved Images</h4>

            {appointment.loadingImages ? (
              <div className="text-base-content/60">Loading images...</div>
            ) : appointment.apiImages?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {appointment.apiImages.map((img) => (
                  <div
                    key={img.id}
                    className="rounded-lg border border-base-300 p-2 bg-base-200"
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => openPreview(imgBlobUrls[img.id], img.name)}
                    >
                      <img
                        src={imgBlobUrls[img.id] || ""}
                        alt={img.name || "Prescription image"}
                        className="w-full h-28 object-cover rounded cursor-zoom-in"
                      />
                    </button>

                    <div className="text-xs mt-2 truncate">
                      {img.name || "Image"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-base-content/60">
                No images found for this prescription.
              </div>
            )}
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

              <label className="label gap-2 cursor-pointer">
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
              Send to Physician
            </button>
          </div>
          {previewOpen ? (
            <div
              className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
              onClick={closePreview}
            >
              <div
                className="relative max-w-[95vw] max-h-[95vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-circle absolute -top-3 -right-3"
                  onClick={closePreview}
                >
                  ✕
                </button>

                <div className="text-white text-sm mb-2">{previewName}</div>

                <img
                  src={previewSrc}
                  alt={previewName}
                  className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg"
                />
              </div>
            </div>
          ) : null}
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </dialog>
    </>
  );
}
