import { useState } from 'react'
import ZoomableImage from './ZoomableImage'
import { renderMarkdown } from './markdown'

const PALETTE = ['#ef4444', '#22c55e', '#60a5fa', '#e879f9', '#f59e0b', '#3b82f6', '#a855f7', '#14b8a6']

const SOURCE_LABELS = {
  detection: 'Detection',
  'detection+segmentation': 'Detection + Segmentation',
  segmentation_fallback: 'Segmentation (back-fill)',
}

const VERSIONS = [
  {
    key: 'patient',
    label: 'Patient',
    icon: '👨‍👩‍👧',
    color: '#22c55e',
    blurb: 'Plain-language summary written for the patient and their family.',
  },
  {
    key: 'clinical',
    label: 'Clinical',
    icon: '🩺',
    color: '#6366f1',
    blurb: 'Structured radiology-style report for the treating physician.',
  },
  {
    key: 'technical',
    label: 'Technical',
    icon: '📊',
    color: '#f59e0b',
    blurb: 'Model-output focused report for ML researchers and computational radiologists.',
  },
]

function previewLine(body) {
  if (!body) return 'No content generated.'
  const stripped = body
    .split('\n')
    .map((l) => l.replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/^[-*]\s+/, '').trim())
    .filter(Boolean)
  const first = stripped.find((l) => l.length > 20) || stripped[0] || ''
  return first.length > 140 ? first.slice(0, 137) + '...' : first
}

function fmtBbox(b) {
  if (!b) return '—'
  return `(${b.x}, ${b.y}) · ${b.width}×${b.height}px`
}

function fmtCentroid(c) {
  if (!c) return '—'
  return `(${c.x}, ${c.y})`
}

function DiagnosisReports({ data, tumors, summary, classification, detection, segmentation, originalImage }) {
  const [active, setActive] = useState('patient')

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-base-100/40 backdrop-blur-xl rounded-3xl border border-white/5">
        <span className="text-4xl mb-4 opacity-50">📄</span>
        <h3 className="text-xl font-bold text-base-content/70">Diagnosis Reports</h3>
        <p className="text-base-content/50">No diagnosis data available.</p>
      </div>
    )
  }

  const status = data.status || 'unknown'
  const activeMeta = VERSIONS.find((v) => v.key === active) || VERSIONS[0]
  const activeVersion = data[active] || {}

  const mt = summary?.multi_tumor || {}
  const tumorList = tumors || []
  const detImages = detection?._images || {}
  const segImages = segmentation?._images || {}
  const clsImages = classification?._images || {}

  const SECTION_PATIENT = ['patient']
  const SECTION_CLINICAL = ['clinical']
  const SECTION_TECHNICAL = ['technical']
  const SECTION_ALL = ['patient', 'clinical', 'technical']
  const SECTION_CLIN_TECH = ['clinical', 'technical']
  const SECTION_TECH_ONLY = ['technical']

  const galleryImages = [
    originalImage && {
      key: 'original',
      label: 'Original MRI',
      src: `data:image/png;base64,${originalImage}`,
      sections: SECTION_ALL,
    },
    segImages.intensity_heatmap && {
      key: 'seg_heat',
      label: 'Tumor Intensity Heatmap',
      src: `data:image/png;base64,${segImages.intensity_heatmap}`,
      sections: SECTION_ALL,
    },
    detImages.clinical_overlay && {
      key: 'det_clinical',
      label: 'Detection — Primary Lesion',
      src: `data:image/png;base64,${detImages.clinical_overlay}`,
      sections: SECTION_CLIN_TECH,
    },
    clsImages.gradcam && {
      key: 'cls_grad',
      label: 'Classification XAI — Grad-CAM',
      src: `data:image/png;base64,${clsImages.gradcam}`,
      sections: SECTION_CLIN_TECH,
    },
    segImages.multi_tumor_overlay && {
      key: 'seg_multi',
      label: `Tumor Segmentation${mt.segmentation_count ? ` (${mt.segmentation_count})` : ''}`,
      src: `data:image/png;base64,${segImages.multi_tumor_overlay}`,
      sections: SECTION_CLIN_TECH,
    },
    detImages.multi_detection_overlay && {
      key: 'det_multi',
      label: `Multi-Tumor Detection (${mt.detection_count || 0})`,
      src: `data:image/png;base64,${detImages.multi_detection_overlay}`,
      sections: SECTION_TECH_ONLY,
    },
    clsImages.sidu && {
      key: 'cls_sidu',
      label: 'Classification XAI — SIDU',
      src: `data:image/png;base64,${clsImages.sidu}`,
      sections: SECTION_TECH_ONLY,
    },
  ].filter(Boolean)

  const visibleImages = galleryImages.filter((img) => img.sections.includes(active))

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100/40 backdrop-blur-xl p-6 lg:p-8 rounded-3xl border border-white/5 shadow-lg">
        <div>
          <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-warning to-error mb-2">
            Diagnosis Reports
          </h3>
          <p className="text-base-content/70">
            Three views of the same findings — choose the audience that fits your needs.
          </p>
        </div>
        
        {status === 'success' && (
          <div className="badge badge-success badge-outline gap-2 px-4 py-3 shadow-sm bg-success/5 border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            Generated by OpenAI VLM
          </div>
        )}
        {status === 'error' && (
          <div className="badge badge-error badge-outline gap-2 px-4 py-3 shadow-sm bg-error/5 border-error/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            VLM service encountered an error
          </div>
        )}
        {status === 'empty' && (
          <div className="badge badge-warning badge-outline gap-2 px-4 py-3 shadow-sm bg-warning/5 border-warning/20">
            VLM returned an empty response
          </div>
        )}
      </div>

      {/* Multi-tumor stats strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-base-100/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:bg-base-100/60 transition-colors">
          <div className="text-4xl font-bold text-primary mb-1">{mt.tumor_count ?? tumorList.length}</div>
          <div className="text-sm text-base-content/60 font-medium uppercase tracking-wider">Tumors Total</div>
        </div>
        <div className="bg-base-100/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:bg-base-100/60 transition-colors">
          <div className="text-4xl font-bold text-info mb-1">{mt.detection_count ?? '—'}</div>
          <div className="text-sm text-base-content/60 font-medium uppercase tracking-wider">By Detection</div>
        </div>
        <div className="bg-base-100/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:bg-base-100/60 transition-colors">
          <div className="text-4xl font-bold text-secondary mb-1">{mt.segmentation_count ?? '—'}</div>
          <div className="text-sm text-base-content/60 font-medium uppercase tracking-wider">By Segmentation</div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {VERSIONS.map((v) => {
          const ver = data[v.key] || {}
          const isActive = v.key === active
          return (
            <button
              type="button"
              key={v.key}
              onClick={() => setActive(v.key)}
              className={`
                text-left flex flex-col h-full rounded-3xl p-6 transition-all duration-300 relative overflow-hidden group border
                ${isActive 
                  ? 'bg-base-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.02] border-transparent' 
                  : 'bg-base-100/40 hover:bg-base-100/60 border-white/5 hover:border-white/10 backdrop-blur-md'}
              `}
            >
              {isActive && (
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `linear-gradient(to bottom right, ${v.color}, transparent)` }}></div>
              )}
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: v.color }}></div>
              )}
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner bg-base-200/50 border border-white/5" style={isActive ? { boxShadow: `0 0 20px ${v.color}40` } : {}}>
                  {v.icon}
                </div>
                <h4 className="text-xl font-bold text-base-content">{v.label}</h4>
              </div>
              
              <div className="mb-2 text-sm font-semibold text-base-content/90 relative z-10">
                {ver.title || `${v.label} Diagnosis`}
              </div>
              <p className="text-xs text-base-content/60 mb-4 line-clamp-2 relative z-10">
                {ver.audience || v.blurb}
              </p>
              
              <div className="bg-base-300/30 rounded-xl p-3 text-xs text-base-content/70 italic line-clamp-3 mb-4 flex-grow relative z-10 border border-white/5">
                "{previewLine(ver.body)}"
              </div>
              
              <div className="mt-auto relative z-10 flex items-center text-sm font-medium" style={{ color: isActive ? v.color : 'currentColor', opacity: isActive ? 1 : 0.5 }}>
                {isActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: v.color }}></span>
                    Currently viewing
                  </>
                ) : (
                  <span className="group-hover:translate-x-1 transition-transform">
                    View full report →
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Content Area */}
      <div className="bg-base-100/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: activeMeta.color }}></div>
        
        {/* Background glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ backgroundColor: activeMeta.color }}></div>

        <div className="p-8 lg:p-12 relative z-10">
          <div className="flex items-start gap-6 mb-10 pb-8 border-b border-white/10">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl bg-base-200 shadow-inner border border-white/5 shrink-0" style={{ boxShadow: `0 10px 30px ${activeMeta.color}30` }}>
              {activeMeta.icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2 text-base-content">
                {activeVersion.title || `${activeMeta.label} Diagnosis`}
              </h2>
              <p className="text-lg text-base-content/60">
                {activeVersion.audience || activeMeta.blurb}
              </p>
            </div>
          </div>

          <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-base-content prose-headings:font-bold prose-p:text-base-content/80 prose-strong:text-base-content prose-li:text-base-content/80 prose-blockquote:border-l-4 prose-blockquote:border-white/20 prose-blockquote:bg-base-200/30 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-a:text-primary">
            {activeVersion.body ? (
              renderMarkdown(activeVersion.body)
            ) : (
              <div className="flex flex-col items-center justify-center py-12 opacity-50">
                <span className="text-4xl mb-4">📭</span>
                <p>No content generated for this version.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Gallery */}
      {visibleImages.length > 0 && (
        <section className="bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl">
          <div className="mb-8">
            <h4 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <span className="text-2xl">🖼️</span> Visual Analysis — {activeMeta.label} View
            </h4>
            <p className="text-base-content/60">
              Showing {visibleImages.length} relevant scan{visibleImages.length === 1 ? '' : 's'} for this section · Click to zoom
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleImages.map((img) => (
              <ZoomableImage key={img.key} src={img.src} label={img.label} />
            ))}
          </div>
        </section>
      )}

      {/* Per-tumor table */}
      {tumorList.length > 0 && (
        <section className="bg-base-100/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h4 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <span className="text-2xl">🦠</span> Per-Tumor Findings ({tumorList.length})
              </h4>
              <p className="text-base-content/60">
                Reconciled metrics across detection and segmentation pipelines
              </p>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-base-200/30">
            <table className="table table-zebra w-full text-sm">
              <thead className="bg-base-300/50 text-base-content">
                <tr>
                  <th className="rounded-tl-xl font-bold">#</th>
                  <th className="font-bold">Source</th>
                  <th className="font-bold">Side</th>
                  <th className="font-bold">Area</th>
                  <th className="font-bold">Longest D.</th>
                  <th className="font-bold">Bounding Box</th>
                  <th className="font-bold">Centroid</th>
                  <th className="rounded-tr-xl font-bold">Conf.</th>
                </tr>
              </thead>
              <tbody>
                {tumorList.map((t, i) => (
                  <tr key={t.tumor_id ?? i} className="hover:bg-base-200/50 transition-colors border-b border-white/5 last:border-0">
                    <td>
                      <span 
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white shadow-sm"
                        style={{ background: PALETTE[i % PALETTE.length] }}
                      >
                        {t.tumor_id ?? i + 1}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-sm badge-ghost border-white/10 font-medium">
                        {SOURCE_LABELS[t.source] || t.source || '—'}
                      </span>
                    </td>
                    <td className="capitalize text-base-content/80">{t.lateralization || '—'}</td>
                    <td className="font-mono text-base-content/80">{t.area_cm2 != null ? `${t.area_cm2} cm²` : '—'}</td>
                    <td className="font-mono text-base-content/80">{t.longest_diameter_mm != null ? `${t.longest_diameter_mm} mm` : '—'}</td>
                    <td className="font-mono text-xs opacity-70">{fmtBbox(t.bbox)}</td>
                    <td className="font-mono text-xs opacity-70">{fmtCentroid(t.centroid)}</td>
                    <td>
                      {t.confidence != null ? (
                        <div className="flex items-center gap-2">
                          <progress className="progress progress-primary w-12" value={t.confidence * 100} max="100"></progress>
                          <span className="text-xs font-mono">{(t.confidence * 100).toFixed(0)}%</span>
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <div className="text-center text-xs text-base-content/40 max-w-3xl mx-auto mt-4 px-6">
        <p>
          <strong>Notice:</strong> These diagnosis reports were generated by an AI language model and are intended for educational and research purposes only. They must not be used as a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>

    </div>
  )
}

export default DiagnosisReports
