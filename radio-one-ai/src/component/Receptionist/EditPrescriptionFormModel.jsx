import React, { useEffect, useState } from "react";

export default function EditPrescriptionFormModal({
  modalId = "edit_prescription_modal",
  doctors = [],
  scanTypes = [],
  organs = [],
  initialData, // <-- the row to edit
  onSubmit,
}) {
  const [formState, setFormState] = useState({
    doctor: "",
    scanType: "",
    organ: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormState({
        doctor: initialData.doctor || "",
        scanType: initialData.scanType || "",
        organ: initialData.organ || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!initialData) return;

    const payload = {
      requestId: initialData.requestId,
      doctor: formState.doctor,
      scanType: formState.scanType,
      organ: formState.organ,
      status: initialData.status ?? "Active",
    };

    onSubmit?.(payload);

    document.getElementById(modalId)?.close();
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        {/* X button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg">Edit Prescription</h3>
        <p className="text-sm text-base-content/70 mt-1">
          Update the details and save.
        </p>

        <div className="divider my-3" />

        {!initialData ? (
          <div className="text-base text-base-content/60">
            Select a prescription row to edit.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Request ID (read-only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Request ID</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full font-mono"
                value={initialData.requestId}
                disabled
                readOnly
              />
            </div>

            {/* Created At (read-only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Created Date &amp; Time</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={initialData.createdAt}
                disabled
                readOnly
              />
            </div>

            {/* Doctor */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Doctor</span>
              </label>
              <select
                className="select select-bordered w-full"
                required
                value={formState.doctor}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, doctor: e.target.value }))
                }
              >
                <option value="" disabled>
                  Select a doctor
                </option>
                {doctors.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Scan type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Scan Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                required
                value={formState.scanType}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, scanType: e.target.value }))
                }
              >
                <option value="" disabled>
                  Select scan type
                </option>
                {scanTypes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Organ */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Organ</span>
              </label>
              <select
                className="select select-bordered w-full"
                required
                value={formState.organ}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, organ: e.target.value }))
                }
              >
                <option value="" disabled>
                  Select an organ
                </option>
                {organs.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Status (read-only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={initialData.status ?? "Active"}
                disabled
                readOnly
              />
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary w-full md:w-auto">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Click background to close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
