import React from "react";

export default function PrescriptionFormModal({
  modalId = "add_prescription_modal",
  doctors = [],
  scanTypes = [],
  organs = [],
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const payload = {
      doctor: form.doctor.value,
      scanType: form.scanType.value,
      organ: form.organ.value,
      status: "Active", // auto active
    };

    onSubmit?.(payload);

    // close modal + reset form
    document.getElementById(modalId)?.close();
    form.reset();
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

        <h3 className="font-bold text-lg">Add a Prescription</h3>
        <p className="text-sm text-base-content/70 mt-1">
          Select required options and submit.
        </p>

        <div className="divider my-3" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Doctor */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select Doctor</span>
            </label>
            <select
              name="doctor"
              className="select select-bordered w-full"
              required
              defaultValue=""
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
              name="scanType"
              className="select select-bordered w-full"
              required
              defaultValue=""
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
              name="organ"
              className="select select-bordered w-full"
              required
              defaultValue=""
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

          {/* Status */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value="Active"
              disabled
              readOnly
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary w-full md:w-auto">
              Submit Prescription
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
