import React from "react";
import ZoomableImage from "./ZoomableImage";

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-base-200 py-2 last:border-b-0">
      <span className="text-sm capitalize text-base-content/70">{label}</span>
      <span className="text-sm font-semibold text-right">
        {value ?? "N/A"}
      </span>
    </div>
  );
}

function ReportCard({ title, children }) {
  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body">
        <h3 className="card-title text-lg font-bold text-black">{title}</h3>
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}

function ImageBox({ children }) {
  return (
    <div className="border-2 border-black rounded-xl overflow-hidden bg-white">
      {children}
    </div>
  );
}

function formatValue(v) {
  if (v === null || v === undefined) return "N/A";
  if (typeof v === "number") return Number(v.toFixed(4));
  return String(v);
}

function renderDataGroup(title, obj) {
  if (!obj || typeof obj !== "object") return null;

  const flat = {};

  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      for (const [k2, v2] of Object.entries(v)) {
        if (typeof v2 !== "object" || v2 === null) {
          flat[`${k} > ${k2}`] = v2;
        }
      }
    } else {
      flat[k] = v;
    }
  }

  const entries = Object.entries(flat).filter(
    ([, v]) => typeof v !== "object" || v === null
  );

  if (entries.length === 0) return null;

  return (
    <ReportCard title={title}>
      {entries.map(([k, v]) => (
        <InfoRow
          key={k}
          label={k.replace(/_/g, " ")}
          value={formatValue(v)}
        />
      ))}
    </ReportCard>
  );
}

function SegmentationReport({ data, originalImage }) {
  if (!data) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body">
          <p>No segmentation data available.</p>
        </div>
      </div>
    );
  }

  const allImages = data._images || {};
  const hiddenKeys = ["clinical_report", "segmented_comparison", "json_report"];

  const images = Object.fromEntries(
    Object.entries(allImages).filter(([key]) => !hiddenKeys.includes(key))
  );

  const sections = [
    ["Morphometrics 2D", data.morphometrics_2d],
    ["Volume 3D", data.volume_3d],
    ["Spatial Analysis", data.spatial_analysis],
    ["Intensity Analysis", data.intensity_analysis],
    ["Boundary Analysis", data.boundary_analysis],
    ["Clinical Assessment", data.clinical_assessment],
    ["Segmentation", data.segmentation],
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {originalImage && (
          <ImageBox>
            <ZoomableImage
              src={`data:image/png;base64,${originalImage}`}
              label="Original MRI"
            />
          </ImageBox>
        )}

        {Object.entries(images).map(([key, b64]) => (
          <ImageBox key={key}>
            <ZoomableImage
              src={`data:image/png;base64,${b64}`}
              label={key.replace(/_/g, " ")}
            />
          </ImageBox>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {sections.map(([title, obj]) => (obj ? renderDataGroup(title, obj) : null))}
      </div>
    </div>
  );
}

export default SegmentationReport;