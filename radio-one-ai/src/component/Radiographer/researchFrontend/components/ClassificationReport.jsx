import React from "react";
import ZoomableImage from "./ZoomableImage";

function InfoRow({ label, value, capitalize = false }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-base-200 py-2 last:border-b-0">
      <span className="text-sm text-base-content/70">{label}</span>
      <span
        className={`text-sm font-semibold text-right ${
          capitalize ? "capitalize" : ""
        }`}
      >
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

function ClassificationReport({ data, originalImage }) {
  if (!data) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body">
          <p>No classification data available.</p>
        </div>
      </div>
    );
  }

  const probs = data.all_probabilities || {};
  const sortedProbs = Object.entries(probs).sort((a, b) => b[1] - a[1]);
  const topClass = data.predicted_class || "unknown";

  const images = data._images || {};
  const modelAnalysis = data.model_analysis || {};
  const gradcamMetrics = data.gradcam_metrics || {};
  const siduMetrics = data.sidu_metrics || {};
  const imageProps = data.image_properties || {};

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

        {images.gradcam && (
          <ImageBox>
            <ZoomableImage
              src={`data:image/png;base64,${images.gradcam}`}
              label="Grad-CAM Attention"
            />
          </ImageBox>
        )}

        {images.sidu && (
          <ImageBox>
            <ZoomableImage
              src={`data:image/png;base64,${images.sidu}`}
              label="SIDU Saliency"
            />
          </ImageBox>
        )}

        {!images.gradcam && data.gradcam_image && (
          <ImageBox>
            <ZoomableImage
              src={`data:image/png;base64,${data.gradcam_image}`}
              label="Grad-CAM Attention Map"
            />
          </ImageBox>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <ReportCard title="Prediction">
          <InfoRow
            label="Predicted Class"
            value={data.predicted_class || "N/A"}
            capitalize
          />
          <InfoRow
            label="Confidence"
            value={
              data.confidence_pct != null ? `${data.confidence_pct}%` : "N/A"
            }
          />
          <InfoRow
            label="Confidence Level"
            value={data.confidence_level || "N/A"}
          />
          <InfoRow
            label="Inference Time"
            value={
              data.inference_time_ms != null
                ? `${data.inference_time_ms} ms`
                : "N/A"
            }
          />
        </ReportCard>

        <ReportCard title="Model Analysis">
          <InfoRow
            label="Top-1 Class"
            value={modelAnalysis.top1_class || "N/A"}
            capitalize
          />
          <InfoRow
            label="Top-2 Class"
            value={modelAnalysis.top2_class || "N/A"}
            capitalize
          />
          <InfoRow
            label="Confidence Margin"
            value={
              modelAnalysis.confidence_margin != null
                ? `${modelAnalysis.confidence_margin}%`
                : "N/A"
            }
          />
          <InfoRow
            label="Prediction Entropy"
            value={modelAnalysis.entropy ?? "N/A"}
          />
          <InfoRow
            label="Uncertainty Index"
            value={
              modelAnalysis.uncertainty_pct != null
                ? `${modelAnalysis.uncertainty_pct}%`
                : "N/A"
            }
          />
        </ReportCard>

        <ReportCard title="Grad-CAM Metrics">
          <InfoRow
            label="Mean Activation"
            value={gradcamMetrics.mean_activation ?? "N/A"}
          />
          <InfoRow
            label="Peak Activation"
            value={gradcamMetrics.peak_activation ?? "N/A"}
          />
          <InfoRow
            label="Attention Coverage"
            value={
              gradcamMetrics.attention_coverage_pct != null
                ? `${gradcamMetrics.attention_coverage_pct}%`
                : "N/A"
            }
          />
        </ReportCard>

        <ReportCard title="SIDU Metrics">
          <InfoRow
            label="Mean Saliency"
            value={siduMetrics.mean_saliency ?? "N/A"}
          />
          <InfoRow
            label="Peak Saliency"
            value={siduMetrics.peak_saliency ?? "N/A"}
          />
          <InfoRow
            label="Saliency Coverage"
            value={
              siduMetrics.saliency_coverage_pct != null
                ? `${siduMetrics.saliency_coverage_pct}%`
                : "N/A"
            }
          />
        </ReportCard>

        <ReportCard title="Image Properties">
          <InfoRow
            label="Resolution"
            value={imageProps.resolution || "N/A"}
          />
          <InfoRow
            label="Mean Intensity"
            value={imageProps.mean_intensity ?? "N/A"}
          />
          <InfoRow
            label="Intensity Std Dev"
            value={imageProps.std_intensity ?? "N/A"}
          />
        </ReportCard>

        <div className="card bg-base-100 shadow-md border border-base-200 lg:col-span-2 xl:col-span-1">
          <div className="card-body">
            <h3 className="card-title text-lg font-bold text-black">
              Class Probabilities
            </h3>

            <div className="space-y-4">
              {sortedProbs.length > 0 ? (
                sortedProbs.map(([name, pct]) => (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm capitalize text-base-content/70">
                        {name}
                      </span>
                      <span className="text-sm font-semibold">
                        {pct}%
                      </span>
                    </div>

                    <progress
                      className={`progress w-full ${
                        name === topClass ? "progress-primary" : "progress-secondary"
                      }`}
                      value={Math.max(pct, 1)}
                      max="100"
                    ></progress>
                  </div>
                ))
              ) : (
                <p className="text-sm text-base-content/70">
                  No probability data available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassificationReport;