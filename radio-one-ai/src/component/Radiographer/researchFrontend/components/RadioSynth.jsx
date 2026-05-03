import { useState } from "react";

const withBase = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const SAMPLES = [
  withBase("/synthetic/gl-0043.jpg"),
  withBase("/synthetic/gl-0047.jpg"),
  withBase("/synthetic/gl-0073.jpg"),
  withBase("/synthetic/image(14).jpg"),
  withBase("/synthetic/image(20).jpg"),
  withBase("/synthetic/image(24).jpg"),
];

const HERO_IMAGES = SAMPLES.slice(0, 4);

const VALUE_TILES = [
  {
    label: "Best-in-class FID",
    value: "101.5",
    sub: "Lowest distance to real-image distribution. C-GAN scores 223.8.",
  },
  {
    label: "Sharper than C-GAN",
    value: "2.4x",
    sub: "Laplacian-variance sharpness 3,362 vs 1,419 for the closest GAN baseline.",
  },
  {
    label: "More contrast",
    value: "+45%",
    sub: "Dynamic range 187 vs 129. Real tissue contrast preserved.",
  },
  {
    label: "Final ranking",
    value: "0.9942",
    sub: "Near-perfect normalized composite score across all 6 evaluation metrics.",
  },
];

const METRICS = [
  {
    key: "fid",
    label: "FID",
    dir: "lower better",
    cgan: 223.78,
    dcgan: 133.47,
    sd: 101.53,
  },
  {
    key: "is",
    label: "Inception Score",
    dir: "higher better",
    cgan: 1.63,
    dcgan: 1.93,
    sd: 2.45,
  },
  {
    key: "sharp",
    label: "Sharpness",
    dir: "higher better",
    cgan: 1419.46,
    dcgan: 1589.39,
    sd: 3362.04,
  },
  {
    key: "edge",
    label: "Edge Density",
    dir: "higher better",
    cgan: 0.1275,
    dcgan: 0.1814,
    sd: 0.1838,
  },
  {
    key: "dyn",
    label: "Dynamic Range",
    dir: "higher better",
    cgan: 128.85,
    dcgan: 138.56,
    sd: 187.32,
  },
  {
    key: "hist",
    label: "Histogram Corr.",
    dir: "higher better",
    cgan: 0.8322,
    dcgan: 0.6062,
    sd: 0.8739,
  },
];

const RADAR_AXES = METRICS.map((m) => m.label);

const normalizeMetric = (metric, value) => {
  const values = [metric.cgan, metric.dcgan, metric.sd];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 1;
  if (metric.dir === "lower better") return (max - value) / (max - min);
  return (value - min) / (max - min);
};

const RADAR_SERIES = [
  {
    name: "C-GAN",
    color: "#f59e0b",
    values: METRICS.map((m) => normalizeMetric(m, m.cgan)),
  },
  {
    name: "DCGAN",
    color: "#38bdf8",
    values: METRICS.map((m) => normalizeMetric(m, m.dcgan)),
  },
  {
    name: "RadioSynth",
    color: "#22c55e",
    values: METRICS.map((m) => normalizeMetric(m, m.sd)),
  },
];

const RANKINGS = [
  {
    rank: 1,
    method: "RadioSynth",
    score: 0.9942,
    desc: "Sharp, anatomically detailed, closest to real distribution.",
  },
  {
    rank: 2,
    method: "DCGAN",
    score: 0.3811,
    desc: "Some structural detail, but grainy and lower contrast.",
  },
  {
    rank: 3,
    method: "C-GAN",
    score: 0.1389,
    desc: "Blurry, noisy outputs that lack clinical realism.",
  },
];

const METHODOLOGY = [
  {
    title: "Distribution fidelity",
    desc: "FID + Inception Score on Inception-v3 features measure how close the generated image distribution is to real MRIs.",
  },
  {
    title: "Visual sharpness",
    desc: "Laplacian variance quantifies edge clarity; blurry MRI is clinically useless regardless of pixel similarity.",
  },
  {
    title: "Structural detail",
    desc: "Canny edge density verifies that fine anatomy (sulci, gyri, ventricles, tumor boundaries) actually appears.",
  },
  {
    title: "Tissue contrast",
    desc: "P5-P95 dynamic range confirms grey/white-matter and CSF separation are preserved, not washed out.",
  },
  {
    title: "Statistical similarity",
    desc: "Pearson correlation of pixel-intensity histograms against real data validates the overall tonal profile.",
  },
  {
    title: "No misleading metrics",
    desc: "SSIM/PSNR/MSE are excluded because they can reward dark, blurry outputs without anatomy.",
  },
];

function MetricBar({ value, max, isWinner }) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100));
  return (
    <div className="h-2 w-full rounded-full bg-base-300">
      <div
        className={`h-2 rounded-full ${isWinner ? "bg-success" : "bg-primary/60"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function FinalScoreBars({ rankings }) {
  const max = Math.max(...rankings.map((r) => r.score));
  return (
    <div className="space-y-4">
      {rankings.map((r) => {
        const pct = (r.score / max) * 100;
        return (
          <div key={r.method} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold">
                #{r.rank} {r.method}
              </span>
              <span className="font-mono">{r.score.toFixed(4)}</span>
            </div>
            <progress
              className={`progress w-full ${r.rank === 1 ? "progress-success" : r.rank === 2 ? "progress-info" : "progress-warning"}`}
              value={pct}
              max="100"
            />
            <p className="text-xs text-base-content/60">{r.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

function RadarChart({ axes, series, size = 360, levels = 5 }) {
  const center = size / 2;
  const radius = size * 0.34;
  const angleStep = (Math.PI * 2) / axes.length;

  const pointAt = (index, value = 1) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const r = radius * value;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
    };
  };

  const polygonPath = (values) =>
    values
      .map((v, i) => {
        const p = pointAt(i, v);
        return `${p.x},${p.y}`;
      })
      .join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[440px] mx-auto"
        role="img"
        aria-label="Radar chart comparing synthetic MRI generation methods"
      >
        {Array.from({ length: levels }, (_, i) => {
          const scale = (i + 1) / levels;
          const ring = Array.from({ length: axes.length }, (_, axisIndex) => {
            const p = pointAt(axisIndex, scale);
            return `${p.x},${p.y}`;
          }).join(" ");
          return (
            <polygon
              key={scale}
              points={ring}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
          );
        })}

        {axes.map((axis, i) => {
          const outer = pointAt(i, 1);
          const label = pointAt(i, 1.15);
          return (
            <g key={axis}>
              <line
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="1"
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fill="currentColor"
                opacity="0.75"
              >
                {axis}
              </text>
            </g>
          );
        })}

        {series.map((s) => (
          <g key={s.name}>
            <polygon
              points={polygonPath(s.values)}
              fill={s.color}
              fillOpacity="0.12"
              stroke={s.color}
              strokeWidth="2"
            />
            {s.values.map((v, i) => {
              const p = pointAt(i, v);
              return (
                <circle
                  key={`${s.name}-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r="3"
                  fill={s.color}
                />
              );
            })}
          </g>
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap gap-3 justify-center text-xs">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function RadioSynth({ onContact }) {
  const [tab, setTab] = useState("comparison");

  return (
    <div className="space-y-8">
      <section className="hero bg-base-200 rounded-3xl border border-base-300">
        <div className="hero-content flex-col lg:flex-row gap-8 py-12">
          <div className="max-w-2xl">
            <div className="badge badge-primary badge-outline mb-4">
              RadioSynth - Synthetic Medical Imaging
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Overcome tough data challenges with{" "}
              <span className="text-primary">RadioSynth</span>
            </h1>
            <p className="py-5 text-base-content/75">
              High-quality synthetic brain MRI generation for realistic, sharp,
              anatomically faithful datasets.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onContact}
              >
                Talk to our team
              </button>
              <a className="btn btn-ghost" href="#sv-comparison">
                See the evidence
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {HERO_IMAGES.map((src, i) => (
              <div
                key={src}
                className="rounded-2xl overflow-hidden border border-base-300 shadow bg-base-300/40 aspect-square flex items-center justify-center p-2"
              >
                <img
                  src={src}
                  alt={`Synthetic brain MRI ${i + 1}`}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {VALUE_TILES.map((tile) => (
          <div
            key={tile.label}
            className="card bg-base-100 border border-base-300 shadow-sm"
          >
            <div className="card-body">
              <p className="text-2xl font-black text-primary">{tile.value}</p>
              <h3 className="font-bold">{tile.label}</h3>
              <p className="text-sm text-base-content/70">{tile.sub}</p>
            </div>
          </div>
        ))}
      </section>
      {/* ── VISUAL COMPARISON (charts) ──────────────────── */}
      <section className="sv-section">
        <div className="sv-section-head">
          <h2>Visual comparison</h2>
          <p>
            Radar shows normalized score per metric — outer edge = best. Bar
            chart shows the composite ranking across all six metrics.
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
              Composite = mean of six metrics, each min-max normalised.
              RadioSynth is the only method to lead on every dimension.
            </div>
          </div>
        </div>
      </section>

      <section
        className="card bg-base-100 border border-base-300 shadow-sm"
        id="sv-comparison"
      >
        <div className="card-body">
          <h2 className="card-title">Method comparison</h2>
          <p className="text-base-content/70">
            RadioSynth wins all six evaluation metrics.
          </p>

          <div role="tablist" className="tabs tabs-boxed w-fit">
            <button
              role="tab"
              className={`tab ${tab === "comparison" ? "tab-active" : ""}`}
              onClick={() => setTab("comparison")}
            >
              Per-metric scores
            </button>
            <button
              role="tab"
              className={`tab ${tab === "ranking" ? "tab-active" : ""}`}
              onClick={() => setTab("ranking")}
            >
              Final ranking
            </button>
          </div>

          {tab === "comparison" && (
            <div className="overflow-x-auto mt-4">
              <table className="table table-zebra">
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
                    const max = Math.max(m.cgan, m.dcgan, m.sd);
                    return (
                      <tr key={m.key}>
                        <td className="font-semibold">{m.label}</td>
                        <td className="text-xs uppercase tracking-wide text-base-content/60">
                          {m.dir}
                        </td>
                        <td>
                          <div className="space-y-1 min-w-32">
                            <span className="text-sm">{m.cgan}</span>
                            <MetricBar value={m.cgan} max={max} />
                          </div>
                        </td>
                        <td>
                          <div className="space-y-1 min-w-32">
                            <span className="text-sm">{m.dcgan}</span>
                            <MetricBar value={m.dcgan} max={max} />
                          </div>
                        </td>
                        <td>
                          <div className="space-y-1 min-w-32">
                            <span className="text-sm font-bold text-success">
                              {m.sd}
                            </span>
                            <MetricBar value={m.sd} max={max} isWinner />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === "ranking" && (
            <div className="mt-4">
              <FinalScoreBars rankings={RANKINGS} />
            </div>
          )}
        </div>
      </section>

      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Sample synthetic images</h2>
          <p className="text-base-content/70">
            Generated by RadioSynth for downstream MRI AI tasks.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {SAMPLES.map((src, i) => (
              <div
                key={src}
                className="rounded-xl overflow-hidden border border-base-300 bg-base-200"
              >
                <div className="aspect-square flex items-center justify-center bg-base-300/40 p-2">
                  <img
                    src={src}
                    alt={`Synthetic MRI sample ${i + 1}`}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="px-3 py-2 text-xs text-base-content/70 border-t border-base-300">
                  Synthetic #{String(i + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">How we evaluate quality</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-1">
            {METHODOLOGY.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-base-300 p-4 bg-base-200/40"
              >
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-base-content/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default RadioSynth;
