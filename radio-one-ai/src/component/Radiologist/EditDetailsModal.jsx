import React, { useEffect, useState } from "react";

export default function EditDetailsModal({ modalId, appointment, onClose, onSaveReport }) {
  const [form, setForm] = useState({ findings: "", impression: "", notes: "" });

  useEffect(() => {
    if (!appointment) return;
    setForm({
      findings: appointment.report?.findings || "",
      impression: appointment.report?.impression || "",
      notes: appointment.report?.notes || "",
    });
  }, [appointment]);

  const save = () => {
    if (!appointment) return;
    onSaveReport?.(appointment.requestId, form);
    document.getElementById(modalId)?.close();
    onClose?.();
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-2xl">Edit Report Details</h3>
            <p className="text-base-content/70">
              {appointment ? `${appointment.requestId} • ${appointment.patient}` : ""}
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

        <div className="space-y-4">
          <label className="form-control">
            <div className="label">
              <span className="label-text font-semibold">Findings</span>
            </div>
            <textarea
              className="textarea textarea-bordered min-h-24"
              value={form.findings}
              onChange={(e) => setForm((p) => ({ ...p, findings: e.target.value }))}
              placeholder="Describe key findings..."
            />
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text font-semibold">Impression</span>
            </div>
            <textarea
              className="textarea textarea-bordered min-h-20"
              value={form.impression}
              onChange={(e) => setForm((p) => ({ ...p, impression: e.target.value }))}
              placeholder="Write impression/summary..."
            />
          </label>

          <label className="form-control">
            <div className="label">
              <span className="label-text font-semibold">Notes</span>
            </div>
            <textarea
              className="textarea textarea-bordered min-h-20"
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Any additional notes..."
            />
          </label>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={() => (document.getElementById(modalId)?.close(), onClose?.())}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={save}>
            Save
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
