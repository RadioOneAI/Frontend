import React, { useEffect, useRef, useState } from "react";

import SummaryView from "./components/SummaryView";
import ClassificationReport from "./components/ClassificationReport";
import DetectionReport from "./components/DetectionReport";
import SegmentationReport from "./components/SegmentationReport";
import DiagnosisReports from "./components/DiagnosisReports";
import RadioSynth from "./components/RadioSynth";
import InvalidImageModal from "./components/InvalidImageModal";

const API_URL = "http://localhost:5001";
const REPORTS_API_URL = "http://127.0.0.1:5000/api/reports";

export default function ResearchAnalysisPanel({
  initialFile = null,
  autoAnalyze = false,
  appointment = null,
}) {
  const [selectedFile, setSelectedFile] = useState(initialFile);
  const [preview, setPreview] = useState(
    initialFile ? URL.createObjectURL(initialFile) : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [dragOver, setDragOver] = useState(false);
  const [reportSending, setReportSending] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);
  const [view, setView] = useState("analysis");
  const [invalidImage, setInvalidImage] = useState(null);

  const fileInputRef = useRef(null);

  const handleContact = () => {
    window.location.href =
      "mailto:hiihealth.dev@gmail.com?subject=RadioSynth%20enquiry";
  };

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
          classification?._images?.gradcam || classification?.gradcam_image
        ),
        sidu: toCleanBase64(classification?._images?.sidu),
        detection_overlay: toCleanBase64(
          detection?._images?.clinical_overlay ||
          detection?._images?.detection_overlay
        ),
        segmentation_overlay: toCleanBase64(
          segmentation?._images?.clinical_overlay ||
          segmentation?._images?.segmentation_overlay
        ),
      },
      scan_req_id: appointment?.scanRequestId || appointment?.requestId || null,
      scan_request_id: appointment?.scanRequestId || appointment?.requestId || null,
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
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      throw new Error("Session expired (401). Please log in again.");
    }

    if (!res.ok) {
      throw new Error(
        errData.message || `Failed to save report (${res.status})`
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

  useEffect(() => {
    if (autoAnalyze && initialFile) {
      handleAnalyze(initialFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAnalyze, initialFile]);

  const handleFileSelect = (file) => {
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
    setResults(null);
    setInvalidImage(null);
    setReportStatus(null);
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
    setInvalidImage(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));

        if (errData.error_type === "invalid_image") {
          setInvalidImage(errData.validation || { reason: errData.message });
          return;
        }

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

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
    setInvalidImage(null);
    setReportStatus(null);
    setActiveTab("summary");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "classification", label: "Classification" },
    { id: "detection", label: "Detection" },
    { id: "segmentation", label: "Segmentation" },
    { id: "diagnosis", label: "Diagnosis Report" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 lg:p-8 bg-gradient-to-br from-base-300 via-base-200 to-base-100 text-base-content relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              AI Research Analysis
            </h1>
            <p className="text-base-content/70 text-lg">
              Advanced multi-modal MRI diagnostics and visualization
            </p>
          </div>

          {/* <div className="flex gap-3">
            <button
              className={`btn ${view === "analysis" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setView("analysis")}
            >
              Analysis
            </button>
            <button
              className={`btn ${view === "synth" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setView("synth")}
            >
              Synthetic Data
            </button>
          </div> */}

          {results && view === "analysis" && (
            <button
              className="btn btn-primary btn-outline hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20"
              onClick={handleReset}
            >
              Upload New Scan
            </button>
          )}
        </div>

        {view === "synth" && <RadioSynth onContact={handleContact} />}

        {view === "analysis" && (
          <>
            {error && (
              <div className="alert alert-error shadow-lg mb-8 rounded-2xl">
                <div>
                  <h3 className="font-bold">Analysis Error</h3>
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            )}

            {!results && !loading && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div
                  className={`group relative w-full max-w-2xl rounded-3xl transition-all duration-500 ease-out ${dragOver ? "scale-[1.02]" : "hover:scale-[1.01]"
                    }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-xl opacity-20 transition-opacity duration-500 ${dragOver ? "opacity-40" : "group-hover:opacity-30"
                      }`}
                  />

                  <div
                    className={`relative bg-base-100/40 backdrop-blur-xl border-2 rounded-3xl p-12 text-center shadow-2xl transition-all duration-300 ${dragOver
                      ? "border-primary bg-primary/5"
                      : "border-base-content/10 hover:border-primary/50 hover:bg-base-100/60"
                      }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <div className="mb-8 relative inline-block">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border border-white/10 relative z-10">
                        <span className="text-5xl filter drop-shadow-lg">🧠</span>
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4 text-base-content">
                      Upload MRI Scan
                    </h2>
                    <p className="text-lg text-base-content/60 mb-8 max-w-md mx-auto">
                      Drag and drop your MRI image file here, or click to browse
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                    />

                    <div className="flex flex-col items-center gap-6">
                      {!selectedFile ? (
                        <button
                          className="btn btn-primary btn-lg rounded-full px-8 shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Select Image
                        </button>
                      ) : (
                        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                          <div className="relative group mb-6 inline-block">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                            <img
                              src={preview}
                              alt="Preview"
                              className="relative rounded-xl shadow-2xl max-h-64 object-contain border border-white/10 bg-base-300/50"
                            />
                          </div>

                          <div className="flex items-center gap-3 bg-base-300/50 px-4 py-2 rounded-full mb-6 border border-white/5">
                            <span className="text-sm font-medium opacity-80">
                              {selectedFile.name}
                            </span>
                          </div>

                          <button
                            className="btn btn-primary btn-lg rounded-full px-10 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-105 transition-all duration-300"
                            onClick={() => handleAnalyze()}
                          >
                            Run AI Analysis
                          </button>

                          <button
                            className="btn btn-ghost mt-3"
                            onClick={handleReset}
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="fixed inset-0 bg-base-300/80 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-500">
                <div className="bg-base-100/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-10 w-full max-w-lg mx-6 text-base-content text-center">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-base-content/10 border-t-primary animate-spin mb-6" />
                  <h2 className="text-2xl font-bold mb-2">Analyzing Scan</h2>
                  <p className="opacity-60">
                    Running Classification, Detection, and Segmentation pipeline
                  </p>
                </div>
              </div>
            )}

            {results && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-base-100/40 backdrop-blur-xl rounded-2xl shadow-xl p-2 mb-8 border border-white/5 relative z-20">
                  <div className="flex flex-wrap lg:flex-nowrap gap-2">
                    {tabs.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`relative flex-1 px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${activeTab === t.id
                          ? "bg-gradient-to-r from-primary to-accent text-primary-content shadow-lg"
                          : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
                          }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-base-100/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden transition-all duration-500 min-h-[500px]">
                  <div className="p-6 lg:p-8 relative z-10">
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

                    {activeTab === "diagnosis" && (
                      <DiagnosisReports
                        data={
                          results.diagnosis_reports ||
                          results.diagnoses ||
                          results.vlm
                        }
                        tumors={results.segmentation?.tumors || results.tumors || []}
                        summary={results.summary}
                        classification={results.classification}
                        detection={results.detection}
                        segmentation={results.segmentation}
                        originalImage={results.original_image}
                      />
                    )}


                  </div>
                </div>


              </div>
            )}
          </>
        )}

        {invalidImage && <InvalidImageModal onClose={handleReset} />}
      </div>
    </div>
  );
}