import React, { useState, memo } from "react";
import ZoomableImage from "./ZoomableImage";
import { renderMarkdown } from "./markdown";

const PALETTE = [
  "#ef4444",
  "#22c55e",
  "#60a5fa",
  "#e879f9",
  "#f59e0b",
  "#3b82f6",
  "#a855f7",
  "#14b8a6",
];

// ---------- HELPERS ----------
const getTumorCount = (data) =>
  data?.detection?.num_tumors ??
  data?.detection?.num_detections ??
  data?.tumors?.length ??
  0;

const getPrimaryImage = (data, isMulti) => {
  const imgs = data?._images || {};
  return isMulti
    ? imgs.multi_detection_overlay || imgs.clinical_overlay
    : imgs.clinical_overlay || imgs.multi_detection_overlay;
};

function flatten(obj) {
  const flat = {};
  if (!obj || typeof obj !== "object") return flat;
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      for (const [k2, v2] of Object.entries(v)) {
        if (typeof v2 !== "object" || v2 === null) flat[`${k} > ${k2}`] = v2;
      }
    } else {
      flat[k] = v;
    }
  }
  return flat;
}

// ---------- DATA GROUP ----------
function DataGroup({ title, obj, accentColor }) {
  const flat = flatten(obj);
  const entries = Object.entries(flat).filter(
    ([, v]) => typeof v !== "object" || v === null,
  );
  if (entries.length === 0) return null;

  return (
    <div
      className="card bg-base-100/40 backdrop-blur-md border shadow-xl transition-all duration-300 hover:shadow-primary/10"
      style={{
        borderColor: accentColor ? accentColor : "rgba(255,255,255,0.05)",
      }}
    >
      <div className="card-body p-5">
        <h4
          className="text-lg font-bold mb-3 border-b border-white/10 pb-2"
          style={{
            color: accentColor ? accentColor : "var(--color-primary)",
          }}
        >
          {title}
        </h4>
        <div className="flex flex-col gap-2">
          {entries.map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between items-start gap-4 text-sm group"
            >
              <span className="text-base-content/60 capitalize group-hover:text-base-content/80 transition-colors">
                {k.replace(/_/g, " ")}
              </span>
              <span className="font-medium text-right text-base-content/90">
                {v == null
                  ? "N/A"
                  : typeof v === "number"
                    ? Number(v.toFixed(4))
                    : String(v)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- PER TUMOR CARD ----------
const PerTumorCard = memo(({ tumor, color }) => {
  const id = tumor.tumor_id ?? tumor.instance_id;

  const rows = [
    ["Class", tumor.class_name || "—"],
    [
      "Confidence",
      tumor.confidence != null
        ? `${(tumor.confidence * 100).toFixed(1)}%`
        : "—",
    ],
    [
      "Longest Diameter",
      tumor.longest_diameter_mm != null
        ? `${tumor.longest_diameter_mm} mm`
        : "—",
    ],
    [
      "Volume",
      tumor.volume_ellipsoid_ml != null
        ? `${tumor.volume_ellipsoid_ml} mL`
        : "—",
    ],
    ["Side", tumor.lateralization || "—"],
    [
      "Centroid",
      tumor.centroid ? `(${tumor.centroid.x}, ${tumor.centroid.y}) px` : "—",
    ],
  ];

  return (
    <div
      className="card bg-base-100/40 backdrop-blur-md border shadow-xl transition-all duration-300 hover:shadow-primary/10"
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: color,
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      <div className="card-body p-5">
        <h4 className="text-lg font-bold mb-4 flex items-center gap-3">
          <span
            className="badge border-none text-white shadow-sm"
            style={{ background: color }}
          >
            #{id}
          </span>
          Tumor {id}
        </h4>

        {tumor._image && (
          <div className="rounded-xl overflow-hidden border border-white/10 mb-4 bg-base-300/30">
            <ZoomableImage
              src={`data:image/png;base64,${tumor._image}`}
              label={`Tumor #${id}`}
              className="w-full object-cover hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          {rows.map(([lbl, val]) => (
            <div
              key={lbl}
              className="flex justify-between items-start gap-4 text-sm group"
            >
              <span className="text-base-content/60 capitalize group-hover:text-base-content/80 transition-colors">
                {lbl}
              </span>
              <span className="font-medium text-right text-base-content/90">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ---------- MAIN ----------
function DetectionReport({ data, originalImage }) {
  const [showPerTumor, setShowPerTumor] = useState(false);

  if (!data)
    return (
      <div className="alert alert-info shadow-lg backdrop-blur-md bg-info/10 border border-info/20 text-info-content rounded-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>No detection data available.</span>
      </div>
    );

  const tumors = data.tumors || [];
  const numTumors = getTumorCount(data);
  const isMulti = numTumors > 1;
  const aggregate = data.aggregate;

  const primaryImage = getPrimaryImage(data, isMulti);
  const allImages = data._images || {};
  const hiddenKeys = [
    "clinical_report",
    "comparison",
    "json_report",
    "multi_detection_overlay",
    "clinical_overlay",
  ];
  const extraImages = Object.fromEntries(
    Object.entries(allImages).filter(([k]) => !hiddenKeys.includes(k)),
  );

  const sections = [
    ["RECIST / WHO", data.recist_who],
    ["Volumetrics", data.volumetrics],
    ["Hemispheric Symmetry", data.hemispheric_symmetry],
    ["ROI Radiomics", data.roi_radiomics],
    ["Perilesional Profile", data.perilesional_profile],
    ["Enhancement Grading", data.enhancement_grading],
    ["Detection Reliability", data.detection_reliability],
    ["Risk Stratification", data.risk_stratification],
    ["Detection", data.detection],
  ];

  const vlm = data.vlm_report;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Detection Analysis
        </h3>
      </div>

      {/* BANNER */}
      {numTumors === 0 ? (
        <div className="alert shadow-lg backdrop-blur-md bg-base-200/50 border border-white/10 rounded-2xl flex gap-4">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-success"></div>
          </div>
          <div>
            <h3 className="font-bold">No tumor detected</h3>
            <div className="text-xs opacity-70">
              Clear scan based on detection model
            </div>
          </div>
        </div>
      ) : isMulti ? (
        <div className="alert shadow-lg backdrop-blur-md bg-warning/10 border border-warning/20 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-warning shrink-0 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-warning">Multi-tumor detected</h3>
              <div className="text-sm opacity-80">
                {numTumors} tumors found across regions
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-warning btn-outline"
            onClick={() => setShowPerTumor((v) => !v)}
          >
            {showPerTumor ? "Hide details" : "View tumor-by-tumor details"}
          </button>
        </div>
      ) : (
        <div className="alert shadow-lg backdrop-blur-md bg-info/10 border border-info/20 rounded-2xl flex gap-4">
          <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-info animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold text-info">Single tumor detected</h3>
            <div className="text-xs opacity-70">
              Localized lesion identified
            </div>
          </div>
        </div>
      )}

      {/* IMAGES */}
      {(originalImage ||
        primaryImage ||
        Object.keys(extraImages).length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {originalImage && (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-base-300/30 backdrop-blur-sm shadow-xl group">
              <div className="bg-base-200/50 p-3 border-b border-white/5 text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                Original MRI
              </div>
              <div className="p-2 relative">
                <ZoomableImage
                  src={`data:image/png;base64,${originalImage}`}
                  label="Original MRI"
                  className="rounded-xl w-full object-cover shadow-inner hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </div>
          )}

          {primaryImage && (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-base-300/30 backdrop-blur-sm shadow-xl group">
              <div className="bg-base-200/50 p-3 border-b border-white/5 text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                {isMulti
                  ? `Multi-Tumor Overlay (${numTumors})`
                  : "Detection Overlay"}
              </div>
              <div className="p-2 relative">
                <ZoomableImage
                  src={`data:image/png;base64,${primaryImage}`}
                  label={
                    isMulti
                      ? `Multi-Tumor Detection (${numTumors})`
                      : "Detection Overlay"
                  }
                  className="rounded-xl w-full object-cover shadow-inner hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </div>
          )}

          {Object.entries(extraImages).map(([key, b64]) => (
            <div
              key={key}
              className="rounded-2xl overflow-hidden border border-white/10 bg-base-300/30 backdrop-blur-sm shadow-xl group"
            >
              <div className="bg-base-200/50 p-3 border-b border-white/5 text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                {key.replace(/_/g, " ")}
              </div>
              <div className="p-2 relative">
                <ZoomableImage
                  src={`data:image/png;base64,${b64}`}
                  label={key}
                  className="rounded-xl w-full object-cover shadow-inner hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OVERALL SUMMARY */}
      {numTumors > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h4 className="text-xl font-bold">Overall Summary</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isMulti && aggregate && (
              <DataGroup
                title="Aggregate (All Tumors)"
                obj={{
                  tumor_count: aggregate.tumor_count,
                  total_volume_ml: aggregate.total_volume_ml,
                  max_longest_diameter_mm: aggregate.max_longest_diameter_mm,
                  lateralization: aggregate.lateralization,
                  multifocal: aggregate.is_multifocal ? "Yes" : "No",
                }}
                accentColor="#f59e0b"
              />
            )}

            {sections.map(([title, obj]) =>
              obj ? <DataGroup key={title} title={title} obj={obj} /> : null,
            )}
          </div>
        </div>
      )}

      {/* PER-TUMOR DETAILS */}
      {isMulti && showPerTumor && tumors.length > 0 && (
        <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h4 className="text-xl font-bold">Per-Tumor Details</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tumors.map((t, i) => (
              <PerTumorCard
                key={t.tumor_id ?? t.instance_id ?? i}
                tumor={t}
                color={PALETTE[i % PALETTE.length]}
              />
            ))}
          </div>
        </div>
      )}

      {/* VLM REPORT */}
      {vlm && (
        <div className="card bg-base-100/40 backdrop-blur-md border border-white/5 shadow-xl">
          <div className="card-body p-5">
            <h4 className="text-lg font-bold text-primary mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              VLM Report
            </h4>
            <div className="text-sm text-base-content/80 leading-relaxed">
              {vlm.body ? renderMarkdown(vlm.body) : "No content"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetectionReport;
