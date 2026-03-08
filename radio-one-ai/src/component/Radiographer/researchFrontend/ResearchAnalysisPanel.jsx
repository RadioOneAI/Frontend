import React, { useEffect, useRef, useState } from "react";

import SummaryView from "./components/SummaryView";
import ClassificationReport from "./components/ClassificationReport";
import DetectionReport from "./components/DetectionReport";
import SegmentationReport from "./components/SegmentationReport";
import VLMReport from "./components/VLMReport";

const API_URL = "http://localhost:5001";
const REPORTS_API_URL = "http://127.0.0.1:5000/api/reports";

export default function ResearchAnalysisPanel({
  initialFile = null,
  autoAnalyze = false,
  appointment = null,
}) {
  const [selectedFile, setSelectedFile] = useState(initialFile);
  const [preview, setPreview] = useState(
    initialFile ? URL.createObjectURL(initialFile) : null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [dragOver, setDragOver] = useState(false);
  const [reportSending, setReportSending] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const toCleanBase64 = (value) => {
    if (!value || typeof value !== "string") return value;
    if (!value.startsWith("data:image")) return value;
    const parts = value.split(",");
    return parts.length > 1 ? parts[1] : value;
  };

  const buildReportPayload = (analysisData) => {
    const classification = analysisData?.classification || {};
    const detection = analysisData?.detection || {};
    const segmentation = analysisData?.segmentation || {};
    let loggedInRadiographerId = null;

    try {
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      loggedInRadiographerId = user?.id ?? null;
    } catch {
      loggedInRadiographerId = null;
    }

    return {
      analysis_time_ms: analysisData?.summary?.total_pipeline_ms ?? null,
      classification,
      detection,
      segmentation,
      summary: analysisData?.summary || {},
      images: {
        original_mri: toCleanBase64(analysisData?.original_image),
        gradcam: toCleanBase64(
          classification?._images?.gradcam || classification?.gradcam_image,
        ),
        sidu: toCleanBase64(classification?._images?.sidu),
        detection_overlay: toCleanBase64(
          detection?._images?.clinical_overlay ||
            detection?._images?.detection_overlay,
        ),
        segmentation_overlay: toCleanBase64(
          segmentation?._images?.clinical_overlay ||
            segmentation?._images?.segmentation_overlay,
        ),
      },
      scan_req_id: appointment?.scanRequestId || appointment?.requestId || null,
      scan_request_id:
        appointment?.scanRequestId || appointment?.requestId || null,
      prescription_id: appointment?.prescriptionId ?? null,
      patient_id: appointment?.patientId ?? null,
      doctor_id: appointment?.doctorId ?? null,
      radiographer_id:
        loggedInRadiographerId ?? appointment?.radiographerId ?? null,
      scan_type: appointment?.scanType || "MRI",
      organ: appointment?.organ || "brain",
      status: "pending",
    };
  };

  const postAnalysisReport = async (analysisData) => {
    const payload = buildReportPayload(analysisData);
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found. Please log in again.");
    }

    const res = await fetch(REPORTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const errData = await res.json().catch(() => ({}));

    if (res.status === 401) {
      const apiMessage = String(
        errData?.message || errData?.error || "Unauthorized",
      ).toLowerCase();
      const isExpired =
        apiMessage.includes("token has expired") ||
        apiMessage.includes("expired") ||
        apiMessage.includes("unauthorized");

      if (isExpired) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }

      throw new Error("Session expired (401). Please log in again.");
    }

    if (!res.ok) {
      throw new Error(
        errData.message || `Failed to save report (${res.status})`,
      );
    }

    return errData;
  };

  const handleSendReport = async () => {
    if (!results || reportSending) return;

    setReportSending(true);
    setReportStatus(null);

    try {
      const response = await postAnalysisReport(results);
      setReportStatus({
        type: "success",
        text: response?.message || "Report created successfully",
      });
    } catch (err) {
      setReportStatus({
        type: "error",
        text: err?.message || "Failed to save report",
      });
    } finally {
      setReportSending(false);
    }
  };

  useEffect(() => {
    if (!initialFile) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(initialFile);
    setSelectedFile(initialFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [initialFile]);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
    setResults(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  };

  const handleAnalyze = async (fileToAnalyze = null) => {
    const file = fileToAnalyze || selectedFile;
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setResults(data);
      setActiveTab("summary");
      setReportStatus(null);
    } catch (err) {
      setError(err.message || "Failed to connect to AI server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoAnalyze && initialFile) {
      handleAnalyze(initialFile);
    }
  }, [autoAnalyze, initialFile]);

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
    setActiveTab("summary");
    setReportStatus(null);
    setReportSending(false);
  };

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "classification", label: "Classification" },
    { id: "detection", label: "Detection" },
    { id: "segmentation", label: "Segmentation" },
    { id: "vlm", label: "AI Explanation" },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-4">
      {error && (
        <div className="alert alert-error shadow-lg mb-4">
          <div>
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      {!results && !loading && (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div
              className={`card-body items-center text-center ${dragOver ? "border-2 border-primary border-dashed" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="card-title">Upload Brain MRI Scan</h2>
              <p className="text-sm opacity-70">
                Drag and drop an MRI image or click to browse
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />

              {!selectedFile ? (
                <button
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Image
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => handleAnalyze()}
                >
                  Analyze Scan
                </button>
              )}

              {preview && (
                <div className="mt-4">
                  <figure className="px-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="rounded-lg shadow-md max-h-48"
                    />
                  </figure>
                  <div className="text-sm mt-2 opacity-70">
                    {selectedFile?.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
  <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div 
      className="
        bg-white/15 
        backdrop-blur-2xl 
        border border-white/20 
        rounded-2xl 
        shadow-2xl 
        p-10 
        w-full 
        max-w-lg 
        mx-6 
        text-white/95
        overflow-hidden
        relative
      "
    >
      {/* Optional subtle shine/gradient overlay for premium liquid-glass feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />

      {/* Header / Branding */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-semibold">RadioOne AI</h2>
            <p className="text-xs text-white/60">Advanced MRI Diagnostics</p>
          </div>
        </div>
        <span className="text-xs text-white/50">v2.1.0</span>
      </div>

      {/* Main Loading Content */}
      <div className="flex items-start gap-6 mb-8 relative z-10">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 border-4 border-white/30 border-t-blue-400 rounded-full animate-spin shadow-lg"></div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-medium mb-2">
            Analyzing MRI Scan
          </h3>
          <p className="text-sm text-white/70 mb-6">
            Scan ID: MRI-{Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>

          {/* Progress Steps – glassy style */}
          <div className="space-y-5">
            <div className="flex items-center gap-4 text-sm">
              <div className="w-6 h-6 rounded-full bg-green-500/30 backdrop-blur-sm border border-green-400/40 flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white/80">DICOM validation & preprocessing</span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-500/40 border-4 border-blue-400/60 animate-pulse shadow-md"></div>
              <span className="font-medium text-white">AI classification & abnormality scoring</span>
            </div>

            <div className="flex items-center gap-4 text-sm opacity-60">
              <div className="w-6 h-6 rounded-full border-2 border-white/30"></div>
              <span className="text-white/70">Lesion detection & localization</span>
            </div>

            <div className="flex items-center gap-4 text-sm opacity-60">
              <div className="w-6 h-6 rounded-full border-2 border-white/30"></div>
              <span className="text-white/70">Segmentation & volumetric analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / ETA */}
      <div className="pt-6 border-t border-white/10 text-xs text-white/50 flex justify-between items-center relative z-10">
        <span>Estimated time remaining: ~15–45 seconds</span>
        <span>Powered by multimodal AI pipeline</span>
      </div>
    </div>
  </div>
)}

      {results && (
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Analysis Report</h2>
            <button className="btn btn-lg btn-primary" onClick={handleReset}>
              Upload Image
            </button>
          </div>

          {/* Glassy Tab Bar */}
          <div className="bg-base-100/50 backdrop-blur-lg rounded-2xl shadow-lg p-2 mb-6 border border-base-300/50">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={`flex-1 text-lg btn btn-md ${activeTab === t.id ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${t.color} mr-2`}
                  ></span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {activeTab === "summary" && (
                <SummaryView
                  data={results}
                  originalImage={results.original_image}
                  onSendData={handleSendReport}
                  sending={reportSending}
                  sendStatus={reportStatus}
                />
              )}
              {activeTab === "classification" && (
                <ClassificationReport
                  data={results.classification}
                  originalImage={results.original_image}
                />
              )}
              {activeTab === "detection" && (
                <DetectionReport
                  data={results.detection}
                  originalImage={results.original_image}
                />
              )}
              {activeTab === "segmentation" && (
                <SegmentationReport
                  data={results.segmentation}
                  originalImage={results.original_image}
                />
              )}
              {activeTab === "vlm" && <VLMReport data={results.vlm} />}
            </div>
          </div>

          <div className="text-sm opacity-70 mt-4 text-right">
            Total Pipeline Time: {results.summary?.total_pipeline_ms || "—"} ms
          </div>
        </div>
      )}
    </div>
  );
}
