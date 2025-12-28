import brain from "../assets/brain-clipart.png";

export default function GetStarted() {
  return (
    <div className="min-h-screen w-screen bg-bg-primary text-text-primary font-sans">
      {/* Full screen container */}
      <div className="min-h-screen w-full flex flex-col">
        {/* Main content stretches */}
        <div className="flex-1 w-full flex flex-col lg:flex-row">
          {/* LEFT PANEL */}
          <div className="w-full lg:w-1/2 flex items-center pl-20">
            <div className="w-full px-6 sm:px-10 lg:px-14 py-10 lg:py-0 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full bg-bg-card border border-border px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-green" />
                <p className="text-xs text-text-secondary">Radiology • AI Assisted</p>
              </div>

              <h1 className="mt-6 text-3xl sm:text-4xl xl:text-6xl font-semibold leading-tight">
                Generate <span className="text-brand-blue">editable</span>{" "}
                reports with <span className="text-brand-indigo">DL models</span>.
              </h1>

              <p className="mt-5 text-text-secondary text-sm sm:text-base xl:text-lg leading-relaxed max-w-2xl">
                Upload studies, run models, and refine findings into clinician-ready
                reports — fast, consistent, and reviewable.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  className="
                    w-full sm:w-auto
                    rounded-xl bg-brand-blue text-white px-7 py-3.5 font-medium
                    hover:opacity-95 transition
                  "
                  onClick={() => alert("Next: Dashboard (we’ll build it)")}
                >
                  Get Started
                </button>

                <button
                  className="
                    w-full sm:w-auto
                    rounded-xl bg-bg-card border border-border px-7 py-3.5 font-medium
                    hover:bg-bg-secondary transition
                  "
                  onClick={() => alert("Demo flow (we’ll build it)")}
                >
                  Try Demo
                </button>
              </div>

              {/* Chips */}
              <div className="mt-7 flex flex-wrap gap-2">
                {["DICOM/PNG/JPG", "Segmentation", "Detection", "Editable report"].map((t) => (
                  <span
                    key={t}
                    className="text-xs sm:text-sm rounded-full px-3 py-1.5 border border-border bg-bg-card text-text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
            <div className="w-full h-full flex items-center justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-0">
              {/* This box scales with screen */}
              <div>
                <img
                  src={brain}
                  alt="AI Brain"
                  className="w-[85%] h-[85%] object-contain"
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER pinned to bottom */}
        <footer className="w-full border-t border-border bg-bg-card/40 px-6 sm:px-10 lg:px-14 py-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-xs text-text-muted">
            <p>© {new Date().getFullYear()} Radio-One AI</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
