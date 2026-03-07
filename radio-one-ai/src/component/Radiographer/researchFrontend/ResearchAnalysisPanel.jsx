import React, { useEffect, useRef, useState } from "react";

import SummaryView from "./components/SummaryView";
import ClassificationReport from "./components/ClassificationReport";
import DetectionReport from "./components/DetectionReport";
import SegmentationReport from "./components/SegmentationReport";
import VLMReport from "./components/VLMReport";

const API_URL = "http://localhost:5001";

export default function ResearchAnalysisPanel({
  initialFile = null,
  autoAnalyze = false,
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
  const fileInputRef = useRef(null);

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
  };

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "classification", label: "Classification" },
    { id: "detection", label: "Detection" },
    { id: "segmentation", label: "Segmentation"},
    { id: "vlm", label: "AI Explanation"},
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
              className={`card-body items-center text-center ${dragOver ? 'border-2 border-primary border-dashed' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="card-title">Upload Brain MRI Scan</h2>
              <p className="text-sm opacity-70">Drag and drop an MRI image or click to browse</p>

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
                <button className="btn btn-primary" onClick={() => handleAnalyze()}>
                  Analyze Scan
                </button>
              )}

              {preview && (
                <div className="mt-4">
                  <figure className="px-4">
                    <img src={preview} alt="Preview" className="rounded-lg shadow-md max-h-48" />
                  </figure>
                  <div className="text-sm mt-2 opacity-70">{selectedFile?.name}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card bg-base-100 shadow-xl p-8 text-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <h2 className="text-xl font-bold mb-2">Analyzing MRI Scan...</h2>
            <p className="text-sm opacity-70">Running Classification, Detection, and Segmentation pipeline</p>
          </div>
        </div>
      )}

      {results && (
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Analysis Report</h2>
            <button
              className="btn btn-lg btn-primary"
              onClick={handleReset}
            >
              Upload Image
            </button>
          </div>

          {/* Glassy Tab Bar */}
          <div className="bg-base-100/50 backdrop-blur-lg rounded-2xl shadow-lg p-2 mb-6 border border-base-300/50">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={`flex-1 text-lg btn btn-md ${activeTab === t.id ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <span className={`w-2 h-2 rounded-full ${t.color} mr-2`}></span>
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