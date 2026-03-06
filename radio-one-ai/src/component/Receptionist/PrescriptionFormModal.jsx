import React, { useState } from "react";

export default function PrescriptionFormModal({
  modalId = "add_prescription_modal",
  doctors = [],
  scanTypes = [],
  organs = [],
  loadingDoctors = false,
  onSubmit,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [formError, setFormError] = useState("");

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const raw = String(reader.result || "");
        const base64 = raw.includes(",") ? raw.split(",")[1] : raw;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setIsSubmitting(true);
    setFormError("");

    try {
      const imageFile = form.prescriptionImage.files?.[0];
      if (!imageFile) {
        setFormError("Prescription image is required.");
        return;
      }

      const payload = {
        doctorId: form.doctorId.value,
        scanType: form.scanType.value,
        organ: form.organ.value,
        description: form.description.value || "description",
        prescriptionFile: imageFile, // ✅ send File, not base64
      };

      const ok = await onSubmit?.(payload);
      if (ok) {
        document.getElementById(modalId)?.close();
        form.reset();
        setSelectedFileName("");
      } else {
        setFormError(
          "Failed to submit prescription. Check API error message above.",
        );
      }
    } catch (error) {
      setFormError(error.message || "Unable to process prescription image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            x
          </button>
        </form>

        <h3 className="font-bold text-lg">Add a Prescription</h3>
        <p className="text-sm text-base-content/70 mt-1">
          Fill fields and upload image.
        </p>

        <div className="divider my-3" />

        {formError ? (
          <div className="alert alert-error mb-3">
            <span>{formError}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select Doctor</span>
            </label>
            <select
              name="doctorId"
              className="select select-bordered w-full"
              required
              defaultValue=""
            >
              <option value="" disabled>
                {loadingDoctors ? "Loading doctors..." : "Select a doctor"}
              </option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

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
                Select organ
              </option>
              {organs.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="description"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Prescription Image</span>
            </label>
            <input
              name="prescriptionImage"
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              required
              onChange={(e) =>
                setSelectedFileName(e.target.files?.[0]?.name || "")
              }
            />
            {selectedFileName ? (
              <span className="text-xs text-base-content/60 mt-1">
                {selectedFileName}
              </span>
            ) : null}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value="pending"
              disabled
              readOnly
            />
          </div>

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Prescription"}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
