import { useEffect } from "react";

function InvalidImageModal({ onClose }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invalid-image-title"
      aria-describedby="invalid-image-description"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-rose-200/25 bg-glassy text-slate-100 shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h-1.5 bg-primary" />

        <div className="p-7 sm:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 ring-1 ring-rose-300/40">
            <span className="text-3xl font-black text-rose-300">!</span>
          </div>

          <h2 id="invalid-image-title" className="text-center text-2xl font-bold tracking-tight">
            Not a Brain MRI
          </h2>

          <p id="invalid-image-description" className="mt-3 text-center text-sm leading-6 text-slate-300">
            Please upload a valid <strong className="text-white">brain MRI</strong> image to continue analysis.
          </p>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs text-slate-300">
            Supported scans should clearly show the brain region and MRI modality.
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:brightness-110 active:scale-[0.99]"
            onClick={onClose}
            autoFocus
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvalidImageModal;
