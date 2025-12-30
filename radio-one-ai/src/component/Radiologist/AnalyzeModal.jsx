import React, { useEffect, useState } from "react";

/**
 * Demo analysis:
 * - Simulates progress
 * - Generates a simple "analysis" object
 * Replace runFakeAnalysis() with a real API call later.
 */
function runFakeAnalysis(appointment) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        model: "DL-v1",
        summary: "Auto-analysis completed. Review suggested highlights and finalize report.",
        confidence: 0.92,
        flags: [
          { label: "Quality Check", value: "Passed" },
          { label: "Artifacts", value: "Low" },
          { label: "Needs Review", value: "Yes" },
        ],
        createdAt: new Date().toLocaleString(),
      });
    }, 1400);
  });
}

export default function AnalyzeModal({ modalId, appointment, onClose, onSaveAnalysis }) {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!appointment) return;
    setResult(appointment.analysis || null);
    setRunning(false);
    setProgress(0);
  }, [appointment]);

  const start = async () => {
    if (!appointment) return;

    setRunning(true);
    setResult(null);
    setProgress(10);

    // progress animation
    const timer = setInterval(() => {
      setProgress((p) => (p >= 90 ? 90 : p + 10));
    }, 200);

    try {
      const out = await runFakeAnalysis(appointment);
      setResult(out);
      onSaveAnalysis?.(appointment.requestId, out);
      setProgress(100);
    } finally {
      clearInterval(timer);
      setRunning(false);
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box w-11/12 max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-2xl">Analyze Data</h3>
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

        <button className="btn btn-primary w-full" onClick={start} disabled={!appointment || running}>
          {running ? <span className="loading loading-spinner"></span> : null}
          Run Analysis
        </button>

        <div className="mt-4">
          <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
          <div className="mt-2 text-sm text-base-content/70">Progress: {progress}%</div>
        </div>

        <div className="mt-5">
          {!result ? (
            <div className="text-base-content/60">
              {running ? "Analyzing… please wait." : "Click Run Analysis to generate results."}
            </div>
          ) : (
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">Model: {result.model}</div>
                  <div className="badge badge-secondary badge-outline">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </div>
                </div>

                <p className="text-base-content/80">{result.summary}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {result.flags.map((f) => (
                    <div key={f.label} className="badge badge-outline">
                      {f.label}: <span className="ml-1 font-semibold">{f.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-sm text-base-content/60">
                  Generated: {result.createdAt}
                </div>
              </div>
            </div>
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
