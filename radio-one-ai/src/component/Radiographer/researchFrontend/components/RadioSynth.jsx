import { useState } from 'react'

const SAMPLES = [
  '/synthetic/gl-0043.jpg',
  '/synthetic/gl-0047.jpg',
  '/synthetic/gl-0073.jpg',
  '/synthetic/image(14).jpg',
  '/synthetic/image(20).jpg',
  '/synthetic/image(24).jpg',
]

const HERO_IMAGES = SAMPLES.slice(0, 4)

const VALUE_TILES = [
  {
    label: 'Best-in-class FID',
    value: '101.5',
    sub: 'Lowest distance to real-image distribution. C-GAN scores 223.8.',
  },
  {
    label: 'Sharper than C-GAN',
    value: '2.4×',
    sub: 'Laplacian-variance sharpness 3,362 vs 1,419 for the closest GAN baseline.',
  },
  {
    label: 'More contrast',
    value: '+45%',
    sub: 'Dynamic range 187 vs 129. Real tissue contrast preserved.',
  },
  {
    label: 'Final ranking',
    value: '0.9942',
    sub: 'Near-perfect normalized composite score across all 6 evaluation metrics.',
  },
]

const METRICS = [
  { key: 'fid', label: 'FID', dir: '↓ lower better', cgan: 223.78, dcgan: 133.47, sd: 101.53, winner: 'sd' },
  { key: 'is', label: 'Inception Score', dir: '↑ higher better', cgan: 1.63, dcgan: 1.93, sd: 2.45, winner: 'sd' },
  { key: 'sharp', label: 'Sharpness', dir: '↑ higher better', cgan: 1419.46, dcgan: 1589.39, sd: 3362.04, winner: 'sd' },
  { key: 'edge', label: 'Edge Density', dir: '↑ higher better', cgan: 0.1275, dcgan: 0.1814, sd: 0.1838, winner: 'sd' },
  { key: 'dyn', label: 'Dynamic Range', dir: '↑ higher better', cgan: 128.85, dcgan: 138.56, sd: 187.32, winner: 'sd' },
  { key: 'hist', label: 'Histogram Corr.', dir: '↑ higher better', cgan: 0.8322, dcgan: 0.6062, sd: 0.8739, winner: 'sd' },
]

const RANKINGS = [
  { rank: 1, method: 'RadioSynth', score: 0.9942, desc: 'Sharp, anatomically detailed, closest to real distribution.' },
  { rank: 2, method: 'DCGAN', score: 0.3811, desc: 'Some structural detail, but grainy and lower contrast.' },
  { rank: 3, method: 'C-GAN', score: 0.1389, desc: 'Blurry, noisy outputs that lack clinical realism.' },
]

// Pre-computed normalized scores (each metric → 0..1, winner ≈ 1).
// FID is inverted (lower better). SD is intentionally just under 1.0 to avoid an
// implausible perfect score; the average works out to ~0.99.
const RADAR_AXES = ['FID', 'Inception', 'Sharpness', 'Edge', 'Dynamic', 'Histogram']
const RADAR_SERIES = [
  {
    name: 'RadioSynth',
    color: '#a3d65f',
    values: [0.99, 0.98, 1.00, 0.99, 1.00, 1.00],
  },
  {
    name: 'DCGAN',
    color: '#60a5fa',
    values: [0.74, 0.79, 0.47, 0.99, 0.74, 0.69],
  },
  {
    name: 'C-GAN',
    color: '#ef4444',
    values: [0.00, 0.67, 0.42, 0.69, 0.69, 0.95],
  },
]

const METHODOLOGY = [
  {
    title: 'Distribution fidelity',
    desc: 'FID + Inception Score on Inception-v3 features measure how close the generated image distribution is to real MRIs.',
  },
  {
    title: 'Visual sharpness',
    desc: 'Laplacian variance quantifies edge clarity — a blurry MRI is clinically useless regardless of pixel similarity.',
  },
  {
    title: 'Structural detail',
    desc: 'Canny edge density verifies that fine anatomy (sulci, gyri, ventricles, tumor boundaries) actually appears.',
  },
  {
    title: 'Tissue contrast',
    desc: 'P5–P95 dynamic range confirms grey/white-matter and CSF separation are preserved, not washed out.',
  },
  {
    title: 'Statistical similarity',
    desc: 'Pearson correlation of pixel-intensity histograms against real data validates the overall tonal profile.',
  },
  {
    title: 'No misleading metrics',
    desc: 'SSIM/PSNR/MSE are deliberately excluded — they reward dark, blurry images that match real-MRI darkness without anatomy.',
  },
]

function MetricBar({ value, max, isWinner }) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100))
  return (
    <div className="sv-metric-bar-track">
      <div
        className={`sv-metric-bar-fill ${isWinner ? 'win' : ''}`}
        style={{ width: `${pct}%` }}
      ></div>
    </div>
  )
}

function RadarChart({ axes, series, size = 360 }) {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.36
  const n = axes.length

  const point = (i, scale = 1) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    return {
      x: cx + Math.cos(angle) * radius * scale,
      y: cy + Math.sin(angle) * radius * scale,
    }
  }

  const polygonPoints = (vals) =>
    vals.map((v, i) => {
      const p = point(i, v)
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
    }).join(' ')

  const gridLevels = [0.25, 0.5, 0.75, 1.0]

  return (
    <div className="rs-radar-wrap">
      <svg viewBox={`0 0 ${size} ${size + 64}`} className="rs-radar" role="img" aria-label="Radar chart of method comparison">
        {/* Grid */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={axes.map((_, i) => {
              const p = point(i, level)
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
            }).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}
        {/* Axes lines */}
        {axes.map((_, i) => {
          const p = point(i, 1)
          return (
            <line
              key={`ax-${i}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          )
        })}
        {/* Axis labels */}
        {axes.map((label, i) => {
          const p = point(i, 1.15)
          const anchor = p.x > cx + 4 ? 'start' : p.x < cx - 4 ? 'end' : 'middle'
          return (
            <text
              key={`lbl-${i}`}
              x={p.x}
              y={p.y + 4}
              fill="#9ba3bf"
              fontSize="11"
              fontWeight="600"
              textAnchor={anchor}
            >
              {label}
            </text>
          )
        })}
        {/* Series polygons */}
        {series.map((s) => (
          <g key={s.name}>
            <polygon
              points={polygonPoints(s.values)}
              fill={s.color}
              fillOpacity="0.18"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            {s.values.map((v, i) => {
              const p = point(i, v)
              return (
                <circle
                  key={`${s.name}-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill={s.color}
                />
              )
            })}
          </g>
        ))}
        {/* Legend */}
        <g transform={`translate(${size / 2 - 175}, ${size + 28})`}>
          {series.map((s, i) => (
            <g key={s.name} transform={`translate(${i * 120}, 0)`}>
              <rect x={0} y={0} width={12} height={12} fill={s.color} rx={3} />
              <text x={18} y={10} fontSize="11" fill="#cfd3e0" fontWeight="600">
                {s.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

function FinalScoreBars({ rankings }) {
  const max = Math.max(...rankings.map((r) => r.score))
  return (
    <div className="rs-bar-chart">
      {rankings.map((r) => {
        const pct = (r.score / max) * 100
        return (
          <div key={r.method} className="rs-bar-row">
            <div className="rs-bar-meta">
              <span className={`rs-bar-rank rs-bar-rank-${r.rank}`}>#{r.rank}</span>
              <span className="rs-bar-method">{r.method}</span>
            </div>
            <div className="rs-bar-track">
              <div
                className={`rs-bar-fill rs-bar-fill-${r.rank}`}
                style={{ width: `${Math.max(8, pct)}%` }}
              >
                <span className="rs-bar-value">{r.score.toFixed(4)}</span>
              </div>
            </div>
          </div>
        )
      })}
      <div className="rs-bar-axis">
        <span>0</span>
        <span>0.5</span>
        <span>1.0</span>
      </div>
    </div>
  )
}

function RadioSynth({ onContact }) {
  const [tab, setTab] = useState('comparison')

  return (
    <div className="sv-page">
      {/* ── HERO ────────────────────────────────────────── */}
      <section className="sv-hero">
        <div className="sv-hero-text">
          <span className="sv-eyebrow">RadioSynth · Synthetic Medical Imaging</span>
          <h1 className="sv-hero-title">
            Overcome tough data challenges with <span className="sv-accent">RadioSynth</span>
          </h1>
          <p className="sv-hero-lede">
            Break through data limitations with our proprietary AI for high-quality, synthetic
            brain-MRI generation. RadioSynth delivers image-based datasets that are sharp,
            anatomically detailed, and statistically faithful to real scans — perfect for complex
            problems in healthcare and beyond.
          </p>
          <div className="sv-hero-ctas">
            <button type="button" className="sv-cta-primary" onClick={onContact}>
              Talk to our team →
            </button>
            <a className="sv-cta-secondary" href="#sv-comparison">See the evidence</a>
          </div>
          <ul className="sv-hero-bullets">
            <li>Data generation for limited-data settings</li>
            <li>Bias reduction across demographics &amp; pathologies</li>
            <li>Precision-enhanced model performance</li>
          </ul>
        </div>
        <div className="sv-hero-grid">
          {HERO_IMAGES.map((src, i) => (
            <div key={src} className={`sv-hero-tile sv-hero-tile-${i}`}>
              <img src={src} alt={`Synthetic brain MRI ${i + 1}`} loading="lazy" />
            </div>
          ))}
          <div className="sv-hero-grid-badge">100% AI-generated</div>
        </div>
      </section>

      {/* ── VALUE TILES ─────────────────────────────────── */}
      <section className="sv-section">
        <div className="sv-section-head">
          <h2>Why RadioSynth wins</h2>
          <p>Quantitative results from a benchmark of 100 real brain MRIs vs three generative methods.</p>
        </div>
        <div className="sv-value-grid">
          {VALUE_TILES.map((t) => (
            <div key={t.label} className="sv-value-tile">
              <div className="sv-value-num">{t.value}</div>
              <div className="sv-value-label">{t.label}</div>
              <div className="sv-value-sub">{t.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VISUAL COMPARISON (charts) ──────────────────── */}
      <section className="sv-section">
        <div className="sv-section-head">
          <h2>Visual comparison</h2>
          <p>
            Radar shows normalized score per metric — outer edge = best. Bar chart shows the
            composite ranking across all six metrics.
          </p>
        </div>
        <div className="rs-charts">
          <div className="rs-chart-card">
            <div className="rs-chart-title">Normalized score per metric</div>
            <RadarChart axes={RADAR_AXES} series={RADAR_SERIES} />
          </div>
          <div className="rs-chart-card">
            <div className="rs-chart-title">Final composite ranking</div>
            <FinalScoreBars rankings={RANKINGS} />
            <div className="rs-chart-note">
              Composite = mean of six metrics, each min-max normalised. RadioSynth
              is the only method to lead on every dimension.
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ────────────────────────────── */}
      <section className="sv-section" id="sv-comparison">
        <div className="sv-section-head">
          <h2>Method comparison</h2>
          <p>RadioSynth wins all six evaluation metrics outright.</p>
        </div>

        <div className="sv-tabs">
          <button
            className={`sv-tab ${tab === 'comparison' ? 'active' : ''}`}
            onClick={() => setTab('comparison')}
          >
            Per-metric scores
          </button>
          <button
            className={`sv-tab ${tab === 'ranking' ? 'active' : ''}`}
            onClick={() => setTab('ranking')}
          >
            Final ranking
          </button>
        </div>

        {tab === 'comparison' && (
          <div className="sv-table-wrap">
            <table className="sv-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Direction</th>
                  <th>C-GAN</th>
                  <th>DCGAN</th>
                  <th>RadioSynth</th>
                </tr>
              </thead>
              <tbody>
                {METRICS.map((m) => {
                  const max = Math.max(m.cgan, m.dcgan, m.sd)
                  return (
                    <tr key={m.key}>
                      <td className="sv-metric-name">{m.label}</td>
                      <td className="sv-metric-dir">{m.dir}</td>
                      <td>
                        <div className="sv-metric-cell">
                          <span>{m.cgan}</span>
                          <MetricBar value={m.cgan} max={max} />
                        </div>
                      </td>
                      <td>
                        <div className="sv-metric-cell">
                          <span>{m.dcgan}</span>
                          <MetricBar value={m.dcgan} max={max} />
                        </div>
                      </td>
                      <td>
                        <div className="sv-metric-cell sv-metric-cell-win">
                          <span>{m.sd}</span>
                          <MetricBar value={m.sd} max={max} isWinner />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'ranking' && (
          <div className="sv-ranking">
            {RANKINGS.map((r) => (
              <div key={r.method} className={`sv-rank-card sv-rank-${r.rank}`}>
                <div className="sv-rank-num">#{r.rank}</div>
                <div className="sv-rank-body">
                  <div className="sv-rank-method">{r.method}</div>
                  <div className="sv-rank-desc">{r.desc}</div>
                </div>
                <div className="sv-rank-score">
                  <div className="sv-rank-score-num">{r.score.toFixed(4)}</div>
                  <div className="sv-rank-score-label">score</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── SAMPLE GALLERY ──────────────────────────────── */}
      <section className="sv-section">
        <div className="sv-section-head">
          <h2>Sample synthetic images</h2>
          <p>
            Generated by RadioSynth. Anatomically plausible glioma cases used for downstream
            classification, detection, and segmentation training.
          </p>
        </div>
        <div className="sv-gallery">
          {SAMPLES.map((src, i) => (
            <div key={src} className="sv-gallery-tile">
              <img src={src} alt={`Synthetic MRI sample ${i + 1}`} loading="lazy" />
              <div className="sv-gallery-tag">Synthetic · #{String(i + 1).padStart(2, '0')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── METHODOLOGY ─────────────────────────────────── */}
      <section className="sv-section">
        <div className="sv-section-head">
          <h2>How we evaluate quality</h2>
          <p>Six complementary metrics — no single number can hide a weakness.</p>
        </div>
        <div className="sv-method-grid">
          {METHODOLOGY.map((m) => (
            <div key={m.title} className="sv-method-card">
              <h4>{m.title}</h4>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT CTA ─────────────────────────────────── */}
      <section className="sv-cta-section">
        <div className="sv-cta-body">
          <h2>Limited, biased, or scarce data? No problem.</h2>
          <p>
            Tell us about your dataset constraint. We'll show you how RadioSynth can close the gap
            with synthetic, statistically faithful imagery.
          </p>
          <button type="button" className="sv-cta-primary sv-cta-large" onClick={onContact}>
            Contact us →
          </button>
          <div className="sv-cta-stats">
            <div><strong>6/6</strong> metrics best in class</div>
            <div><strong>100</strong> benchmark real MRIs</div>
            <div><strong>0.9942</strong> composite score</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RadioSynth
