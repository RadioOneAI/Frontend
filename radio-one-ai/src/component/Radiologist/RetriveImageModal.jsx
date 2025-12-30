import React, { useEffect, useState } from "react";

/**
 * Demo retrieval:
 * - If no images exist, we generate demo preview images.
 * - Replace mockFetchImages() with your real API call later.
 */
function mockFetchImages(requestId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: `${requestId}-IMG-1`,
          name: "Slice 01",
          url: "https://img.daisyui.com/images/stock/photo-1551963831-b3b1ca40c98e.webp",
          modality: "MRI",
        },
        {
          id: `${requestId}-IMG-2`,
          name: "Slice 02",
          url: "https://img.daisyui.com/images/stock/photo-1522770179533-24471fcdba45.webp",
          modality: "MRI",
        },
        {
          id: `${requestId}-IMG-3`,
          name: "Slice 03",
          url: "https://img.daisyui.com/images/stock/photo-1523275335684-37898b6baf30.webp",
          modality: "MRI",
        },
      ]);
    }, 700);
  });
}

export default function RetrieveImageModal({ modalId, appointment, onClose, onSaveImages }) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!appointment) return;
    setImages(appointment.images || []);
  }, [appointment]);

  const handleRetrieve = async () => {
    if (!appointment) return;
    setLoading(true);
    try {
      const fetched = await mockFetchImages(appointment.requestId);
      setImages(fetched);
      onSaveImages?.(appointment.requestId, fetched);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-2xl">Retrieve Images</h3>
            <p className="text-base-content/70">
              {appointment ? `${appointment.requestId} • ${appointment.scanType} • ${appointment.organ}` : ""}
            </p>
          </div>

          <button
            className="btn btn-ghost btn-circle"
            onClick={() => {
              document.getElementById(modalId)?.close();
              onClose?.();
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="divider"></div>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <button className="btn btn-primary" onClick={handleRetrieve} disabled={loading || !appointment}>
            {loading ? <span className="loading loading-spinner"></span> : null}
            Retrieve Now
          </button>

          <div className="text-sm text-base-content/70">
            Images: <span className="font-semibold">{images.length}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.length === 0 ? (
            <div className="col-span-full text-base-content/60">
              No images loaded yet. Click <b>Retrieve Now</b>.
            </div>
          ) : (
            images.map((img) => (
              <div key={img.id} className="card bg-base-100 border border-base-300 shadow-sm">
                <figure className="px-4 pt-4">
                  <img src={img.url} alt={img.name} className="rounded-xl w-full h-40 object-cover" />
                </figure>
                <div className="card-body py-4">
                  <h4 className="card-title text-base">{img.name}</h4>
                  <div className="flex gap-2">
                    <span className="badge badge-info badge-outline">{img.modality}</span>
                    <span className="badge badge-outline">{appointment?.organ}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="modal-action">
          <button
            className="btn"
            onClick={() => {
              document.getElementById(modalId)?.close();
              onClose?.();
            }}
          >
            Close
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
