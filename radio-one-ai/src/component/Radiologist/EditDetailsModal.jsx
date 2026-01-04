import React, { useEffect, useState } from "react";

export default function EditDetailsModal({
  modalId,
  appointment,
  onClose,
  onSaveReport,
}) {
  const [diagnosis, setDiagnosis] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(null);

  // 🔒 HARD-CODED PRIORITY
  const PRIORITY = "critical"; // 🔴 change here if needed
  const CRITICAL_TIME_SECONDS = 15 * 60; // 15 minutes

  // Load diagnosis + start timer
  useEffect(() => {
    if (!appointment) return;

    setDiagnosis(appointment?.report?.diagnosis || "");

    if (PRIORITY === "critical") {
      setSecondsLeft(CRITICAL_TIME_SECONDS);
    }
  }, [appointment?.requestId]);

  // Countdown logic
  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  if (!appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSaveReport?.(appointment.requestId, {
      ...appointment.report,
      diagnosis,
    });

    document.getElementById(modalId)?.close();
    onClose?.();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box max-w-4xl text-lg relative">

        {/* ❌ Close */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-2xl mb-1">
          Edit Radiologist Details
        </h3>

        <p className="text-base-content/60 mb-4">
          Request <b>{appointment.requestId}</b> • Patient{" "}
          <b>{appointment.patient}</b>
        </p>

        <div className="divider" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= LEFT CONTENT ================= */}
          <div className="lg:col-span-2 space-y-4">

            {/* READ-ONLY INFO */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><b>Doctor:</b> {appointment.doctor}</div>
              <div><b>Radiographer:</b> {appointment.radiographer}</div>
              <div><b>Scan Type:</b> {appointment.scanType}</div>
              <div><b>Organ:</b> {appointment.organ}</div>
            </div>

            {/* DIAGNOSIS */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-bold">
                    Diagnosis / Tentative Diagnosis
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full min-h-[130px]"
                  placeholder="Enter radiologist diagnosis..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full">
                Save Diagnosis
              </button>
            </form>
          </div>

          {/* ================= RIGHT SIDE TIMER ================= */}
          {PRIORITY === "critical" && secondsLeft !== null && (
            <div className="bg-error/10 border border-error rounded-xl p-4 h-fit">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-error text-white">
                  CRITICAL
                </span>
                <span className="font-bold text-error">
                  Time Remaining
                </span>
              </div>

              <div className="text-4xl font-mono font-bold text-error text-center">
                {formatTime(secondsLeft)}
              </div>

              <p className="text-xs text-error/70 text-center mt-2">
                Immediate attention required
              </p>
            </div>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
