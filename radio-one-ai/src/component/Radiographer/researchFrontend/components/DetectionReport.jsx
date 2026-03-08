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

  const entries = Object.entries(obj).filter(
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

function DetectionReport({ data, originalImage }) {
  if (!data) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body">
          <p>No detection data available.</p>
        </div>
      </div>
    );
  }

  const allImages = data._images || {};
  const hiddenKeys = ["clinical_report", "comparison", "json_report"];

  const images = Object.fromEntries(
    Object.entries(allImages).filter(([key]) => !hiddenKeys.includes(key))
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

export default DetectionReport;