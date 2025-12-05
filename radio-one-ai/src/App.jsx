function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Top bar */}
      <header className="bg-bg-card border-b border-border px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-brand-blue">
              Radio-One AI
            </h1>
            <p className="text-sm text-text-muted">
              Radiology report generation & AI-assisted imaging.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">Dr. Jayasinghe</span>
            <div className="h-8 w-8 rounded-full bg-brand-indigo/80 flex items-center justify-center text-xs text-white">
              DJ
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
          {/* Left: info / actions */}
          <section className="col-span-1 bg-bg-card border border-border rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              New Study
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              Start by selecting a patient study or uploading imaging data.
            </p>

            <button className="w-full rounded-lg bg-brand-blue text-white py-2.5 text-sm font-medium hover:bg-brand-cyan transition">
              + Create Report
            </button>

            <button className="mt-3 w-full rounded-lg border border-brand-blue/40 text-brand-blue py-2.5 text-sm font-medium bg-bg-elevated hover:bg-bg-secondary transition">
              Upload DICOM / Images
            </button>
          </section>

          {/* Middle: recent reports */}
          <section className="col-span-2 bg-bg-card border border-border rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-text-primary">
              Recent Reports
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              Quickly access your latest AI-assisted radiology reports.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-bg-elevated px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    MRI Brain – Suspected Glioma
                  </p>
                  <p className="text-xs text-text-muted">
                    Patient: PT-000341 · 12 mins ago · AI confidence: 92%
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-green/10 text-brand-green">
                  Finalized
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-bg-elevated px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    MRI Brain – Suspected Glioma
                  </p>
                  <p className="text-xs text-text-muted">
                    Patient: PT-000289 · 26 mins ago · AI confidence: 78%
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow">
                  Pending Review
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
