import React from "react";
import ZoomableImage from "./ZoomableImage";

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-base-200 py-2 last:border-b-0">
      <span className="text-sm text-base-content/70">{label}</span>
      <span className="text-sm font-semibold text-right">{value ?? "N/A"}</span>
    </div>
  );
}

function SummaryCard({
  title,
  badgeClass = "badge-primary",
  badgeText,
  children,
}) {
  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <h3 className="card-title text-lg">{title}</h3>
          {badgeText ? (
            <span className={`badge ${badgeClass}`}>{badgeText}</span>
          ) : null}
        </div>
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

function SummaryView({ data, originalImage }) {
  const s = data?.summary || {};
  const cls = s?.classification || {};
  const det = s?.detection || {};
  const seg = s?.segmentation || {};

  const clsImages = data?.classification?._images || {};
  const detImages = data?.detection?._images || {};
  const segImages = data?.segmentation?._images || {};

  const detected = Boolean(s?.tumor_detected);

  const predictedClass = cls?.predicted_class
    ? cls.predicted_class.charAt(0).toUpperCase() + cls.predicted_class.slice(1)
    : "N/A";

  const confidence =
    cls?.confidence_pct != null ? `${cls.confidence_pct}%` : "N/A";

  const detections = det?.num_detections != null ? det.num_detections : "N/A";

  const area =
    seg?.area_cm2 != null && seg?.area_cm2 !== "N/A"
      ? `${seg.area_cm2} cm²`
      : "N/A";

  const volume =
    seg?.volume_ml != null && seg?.volume_ml !== "N/A"
      ? `${seg.volume_ml} mL`
      : "N/A";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 ">
        {originalImage && (
          <ImageBox>
            <ZoomableImage
              src={`data:image/png;base64,${originalImage}`}
              label="Original MRI"
            />
          </ImageBox>
        )}

        {clsImages.sidu && (
          <ImageBox>
            <ZoomableImage
              src={`data:image/png;base64,${clsImages.sidu}`}
              label="SIDU Saliency"
            />
          </ImageBox>
        )}

        {detImages.clinical_overlay && (
          <ImageBox>
            <ZoomableImage
              src={`data:image/png;base64,${detImages.clinical_overlay}`}
              label="Detection Overlay"
            />
          </ImageBox>
        )}

        {segImages.clinical_overlay && (
          <ImageBox>
            <ZoomableImage
              src={`data:image/png;base64,${segImages.clinical_overlay}`}
              label="Segmentation Overlay"
            />
          </ImageBox>
        )}
      </div>

      <div className="flex justify-center">
        <div className="card bg-base-100 shadow-md border border-base-200 w-full max-w-2xl">
          <div className="card-body items-center text-center ">
            <div
              className={`badge text-black  text-lg badge-lg badge-warning ${detected ? "badge-error" : "badge-success"}`}
            >
              {detected ? "Tumor Detected" : "No Tumor Detected"}
            </div>
            <p className="text-lg text-base-content/70 mt-1.5">
              {detected
                ? "The AI pipeline found suspicious tumor-related findings."
                : "The AI pipeline did not find obvious tumor-related abnormalities."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SummaryCard title="Classification" badgeClass="badge-secondary">
          <InfoRow label="Predicted Class" value={predictedClass} />
          <InfoRow label="Confidence" value={confidence} />
        </SummaryCard>

        <SummaryCard title="Detection" badgeClass="badge-accent">
          <InfoRow label="Detections" value={detections} />
          <InfoRow label="Risk Level" value={det?.risk_level || "N/A"} />
          <InfoRow label="RECIST Class" value={det?.recist_class || "N/A"} />
          <InfoRow label="Hemisphere" value={det?.hemisphere || "N/A"} />
        </SummaryCard>

        <SummaryCard title="Segmentation" badgeClass="badge-success">
          <InfoRow label="Area" value={area} />
          <InfoRow label="Volume" value={volume} />
          <InfoRow
            label="Lateralization"
            value={seg?.lateralization || "N/A"}
          />
          <InfoRow label="Margin" value={seg?.margin_type || "N/A"} />
          <InfoRow label="Size Class" value={seg?.size_class || "N/A"} />
        </SummaryCard>
      </div>
    </div>
  );
}

export default SummaryView;
