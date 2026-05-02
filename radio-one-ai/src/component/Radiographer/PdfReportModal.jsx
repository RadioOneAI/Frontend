import React from "react";
import logo from "../../assets/images/logo.png";

const API_BASE = "http://127.0.0.1:5000";

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-1 border-b border-base-300/60">
      <div className="font-semibold">{label}</div>
      <div className="md:col-span-2 break-words">{value ?? "-"}</div>
    </div>
  );
}

function toImageSrc(value) {
  if (!value || typeof value !== "string") return "";
  const raw = value.trim();
  if (!raw) return "";
  if (raw.startsWith("data:image")) return raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${API_BASE}${raw}`;
  if (/^[a-zA-Z]:\\/.test(raw) || raw.startsWith("\\\\")) return "";

  const isLikelyBase64 = /^[A-Za-z0-9+/=\r\n]+$/.test(raw) && raw.length > 120;
  if (isLikelyBase64) return `data:image/png;base64,${raw.replace(/\s+/g, "")}`;

  return `${API_BASE}/${raw.replace(/^\/+/, "")}`;
}

function safe(v) {
  if (v == null || v === "") return "-";
  return String(v);
}

function pickDiagnosisText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return (
      value.text ||
      value.report ||
      value.content ||
      value.markdown ||
      value.body ||
      ""
    );
  }
  return "";
}

function fmtNum(value, digits = 2) {
  if (value == null || value === "") return "-";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toFixed(digits);
}

function fmtDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function toTitleFromKey(key) {
  return String(key || "image")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function imagePriority(key = "", title = "") {
  const k = `${key} ${title}`.toLowerCase();
  if (k.includes("gradcam") || k.includes("grad cam")) return 1;
  if (k.includes("sidu")) return 2;
  if (k.includes("detection_overlay") || k.includes("detection overlay")) return 3;
  if (k.includes("segmentation_overlay") || k.includes("segmentation overlay")) return 4;
  return 100;
}

export default function PdfReportModal({ modalId, state, onClose }) {
  const loading = !!state?.loading;
  const error = state?.error || "";
  const report = state?.report || null;

  const classification = report?.classification || {};
  const detection = report?.detection || {};
  const segmentation = report?.segmentation || {};
  const summary = report?.summary || {};
  const images = report?.images || {};
  const segArea =
    segmentation?.area_cm2 ??
    segmentation?.morphometrics_2d?.area_cm2 ??
    summary?.segmentation?.area_cm2;
  const segVolume =
    segmentation?.volume_ml ??
    segmentation?.volume_3d?.volume_ml ??
    segmentation?.volume_3d?.ellipsoid_abc2?.volume_ml ??
    summary?.segmentation?.volume_ml;
  const segMargin =
    segmentation?.clinical_assessment?.margin_type ??
    segmentation?.clinical_assessment?.margin_characterization ??
    segmentation?.boundary_analysis?.margin_type ??
    summary?.segmentation?.margin_type;
  const segSizeClass =
    segmentation?.clinical_assessment?.size_class ??
    segmentation?.clinical_assessment?.size_classification ??
    summary?.segmentation?.size_class;

  const imageCards = (() => {
    const items = [];
    const pushItem = (key, value, title) => {
      const src = toImageSrc(value);
      if (!src) return;
      items.push({
        key: key || `img_${items.length + 1}`,
        title: title || toTitleFromKey(key),
        src,
      });
    };

    Object.entries(images || {}).forEach(([k, v]) => pushItem(k, v));

    const reportImages = Array.isArray(report?.report_images) ? report.report_images : [];
    reportImages.forEach((img, idx) => {
      if (!img) return;
      if (typeof img === "string") {
        pushItem(`report_image_${idx + 1}`, img, `Report Image ${idx + 1}`);
        return;
      }
      pushItem(
        img.key || img.type || img.name || `report_image_${idx + 1}`,
        img.data || img.image || img.base64 || img.url || img.path,
        img.name || img.label || `Report Image ${idx + 1}`,
      );
    });

    const sectionImages = [
      ...(classification?._images ? Object.entries(classification._images) : []),
      ...(detection?._images ? Object.entries(detection._images) : []),
      ...(segmentation?._images ? Object.entries(segmentation._images) : []),
    ];
    sectionImages.forEach(([k, v]) => pushItem(k, v));

    const seen = new Set();
    const filtered = items.filter((x) => {
      if (!x?.src) return false;
      if (String(x.key || "").toLowerCase() === "original_mri") return false;
      if (seen.has(x.src)) return false;
      seen.add(x.src);
      return true;
    });

    return filtered.sort((a, b) => {
      const pa = imagePriority(a?.key, a?.title);
      const pb = imagePriority(b?.key, b?.title);
      if (pa !== pb) return pa - pb;
      return String(a?.title || a?.key || "").localeCompare(
        String(b?.title || b?.key || ""),
      );
    });
  })();

  const escapeHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const buildPrintableHtml = () => {
    const imageBlocks = imageCards.length
      ? imageCards
          .map(
            (img) => `
          <div class="img-card">
            <div class="img-title">${safe(img.title)}</div>
            <img src="${img.src}" alt="${safe(img.title)}" />
          </div>
        `,
          )
          .join("")
      : `<div class="muted">No report images available.</div>`;

    const diagnoses = report?.diagnoses || {};
    const buildDiagnosisBlock = (title, value, accent) => {
      const text = pickDiagnosisText(value);
      if (!text) return "";
      return `
        <div class="dx-card" style="border-left:4px solid ${accent};">
          <div class="dx-title" style="color:${accent};">${escapeHtml(title)}</div>
          <div class="dx-body">${escapeHtml(text).replace(/\n/g, "<br/>")}</div>
        </div>
      `;
    };
    const diagnosisBlocks = [
      buildDiagnosisBlock("Patient-Friendly Summary", diagnoses.patient, "#10b981"),
      buildDiagnosisBlock("Clinical Report", diagnoses.clinical, "#0ea5e9"),
      buildDiagnosisBlock("Technical Report", diagnoses.technical, "#8b5cf6"),
    ].join("");

    const tumors = Array.isArray(report?.tumors) ? report.tumors : [];
    const tumorBlock = tumors.length
      ? `
        <div class="section-title">Per-Tumor Findings (${tumors.length})</div>
        <table class="tumor-table">
          <thead>
            <tr>
              <th>#</th><th>Source</th><th>Side</th>
              <th>Area (cm²)</th><th>Longest Ø (mm)</th><th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            ${tumors
              .map(
                (t, i) => `
              <tr>
                <td>${escapeHtml(t?.tumor_id ?? i + 1)}</td>
                <td>${escapeHtml(safe(t?.source))}</td>
                <td>${escapeHtml(safe(t?.lateralization))}</td>
                <td>${escapeHtml(fmtNum(t?.area_cm2))}</td>
                <td>${escapeHtml(fmtNum(t?.longest_diameter_mm))}</td>
                <td>${
                  t?.confidence != null
                    ? `${(Number(t.confidence) * (Number(t.confidence) <= 1 ? 100 : 1)).toFixed(1)}%`
                    : "-"
                }</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `
      : "";

    return `
      <html>
        <head>
          <title>RadioOne-AI Report ${safe(report?.id)}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; margin: 0; padding: 0; }
            .wrap { width: 100%; max-width: 800px; margin: 0 auto; }
            .head { display: flex; align-items: center; gap: 20px; border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 24px; }
            .head img { width: 80px; height: 80px; object-fit: contain; }
            .brand { font-weight: 900; font-size: 28px; letter-spacing: 1px; color: #0f172a; text-transform: uppercase; }
            .sub { font-size: 13px; margin-top: 5px; color: #64748b; font-weight: 500; }
            .contact { font-size: 11px; margin-top: 8px; color: #94a3b8; }
            .section-title { font-size: 16px; font-weight: 800; color: #0f172a; margin: 24px 0 12px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
            .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
            .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; break-inside: avoid; }
            .card h4 { margin: 0 0 12px; font-size: 14px; color: #0369a1; text-transform: uppercase; font-weight: 700; border-bottom: 1px dashed #cbd5e1; padding-bottom: 6px; }
            .row { display: grid; grid-template-columns: 45% 55%; border-bottom: 1px solid #f1f5f9; padding: 6px 0; font-size: 12px; align-items: center; }
            .row:last-child { border-bottom: none; padding-bottom: 0; }
            .k { font-weight: 700; color: #475569; }
            .v { font-weight: 600; color: #0f172a; }
            .imgs { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
            .img-card { border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; background: #fff; text-align: center; break-inside: avoid; }
            .img-title { font-size: 12px; font-weight: 700; margin-bottom: 8px; color: #334155; }
            .img-card img { width: 100%; height: 220px; object-fit: contain; background: #000; border-radius: 4px; }
            .muted { font-size: 12px; color: #94a3b8; font-style: italic; text-align: center; padding: 20px; }
            .foot { margin-top: 32px; border-top: 2px solid #e2e8f0; padding-top: 16px; font-size: 10px; color: #64748b; text-align: center; font-weight: 500; }
            .dx-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 16px; border-radius: 8px; margin-bottom: 12px; break-inside: avoid; }
            .dx-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
            .dx-body { font-size: 12px; color: #1f2937; line-height: 1.6; white-space: normal; }
            .tumor-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
            .tumor-table th, .tumor-table td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; }
            .tumor-table th { background: #f1f5f9; font-weight: 700; text-transform: uppercase; font-size: 10px; color: #475569; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="head">
              <img src="${logo}" alt="RadioOne-AI logo" />
              <div>
                <div class="brand">RadioOne-AI Diagnostics</div>
                <div class="sub">Advanced Brain Imaging & AI Assisted Reporting</div>
                <div class="contact">12 Main Street, Colombo | +94 11 000 0000 | reports@radioone.lk</div>
              </div>
            </div>

            <div class="grid2">
              <div class="card">
                <h4>Patient Information</h4>
                <div class="row"><div class="k">Patient Name</div><div class="v">${safe(report?.patient?.name)}</div></div>
                <div class="row"><div class="k">Patient ID</div><div class="v">${safe(report?.patient_id)}</div></div>
                <div class="row"><div class="k">Referring Doctor</div><div class="v">${safe(report?.doctor?.name)}</div></div>
                <div class="row"><div class="k">Radiographer</div><div class="v">${safe(report?.radiographer?.name)}</div></div>
                <div class="row"><div class="k">Request ID</div><div class="v">${safe(report?.scan_req_id || report?.scan_request_id)}</div></div>
              </div>
              <div class="card">
                <h4>Report Details</h4>
                <div class="row"><div class="k">Report ID</div><div class="v">${safe(report?.id)}</div></div>
                <div class="row"><div class="k">Date Generated</div><div class="v">${safe(fmtDate(report?.created_at))}</div></div>
                <div class="row"><div class="k">Last Updated</div><div class="v">${safe(fmtDate(report?.updated_at))}</div></div>
                <div class="row"><div class="k">Status</div><div class="v" style="color: #059669;">${safe(report?.status)}</div></div>
                <div class="row"><div class="k">AI Analysis Time</div><div class="v">${safe(report?.analysis_time_ms)} ms</div></div>
              </div>
            </div>

            <div class="section-title">AI Diagnostic Findings</div>
            <div class="grid3">
              <div class="card">
                <h4>Classification</h4>
                <div class="row"><div class="k">Predicted Class</div><div class="v">${safe(classification?.predicted_class)}</div></div>
                <div class="row"><div class="k">Confidence</div><div class="v">${safe(classification?.confidence_pct)}%</div></div>
                <div class="row"><div class="k">Level</div><div class="v">${safe(classification?.confidence_level)}</div></div>
              </div>
              <div class="card">
                <h4>Detection</h4>
                <div class="row"><div class="k">Detections Found</div><div class="v">${safe(detection?.num_detections ?? summary?.detection?.num_detections)}</div></div>
                <div class="row"><div class="k">RECIST Class</div><div class="v">${safe(detection?.recist_who?.recist_class ?? summary?.detection?.recist_class)}</div></div>
                <div class="row"><div class="k">Risk Stratification</div><div class="v">${safe(detection?.risk_stratification?.risk_level ?? summary?.detection?.risk_level)}</div></div>
              </div>
              <div class="card">
                <h4>Segmentation</h4>
                <div class="row"><div class="k">Total Area</div><div class="v">${safe(segArea)} cm²</div></div>
                <div class="row"><div class="k">Total Volume</div><div class="v">${safe(segVolume)} ml</div></div>
                <div class="row"><div class="k">Margin Type</div><div class="v">${safe(segMargin)}</div></div>
              </div>
            </div>

            ${
              diagnosisBlocks
                ? `<div class="section-title">AI Diagnostic Narrative</div>${diagnosisBlocks}`
                : ""
            }

            ${tumorBlock}

            <div class="section-title">Diagnostic Images</div>
            <div class="imgs">${imageBlocks}</div>

            <div class="foot">
              <strong>Disclaimer:</strong> This is an AI-assisted preliminary report generated by RADIOONE-AI. 
              <br/>Final clinical interpretation and diagnosis must be confirmed by a qualified medical specialist.
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleDownloadPdf = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.setAttribute("aria-hidden", "true");
    document.body.appendChild(iframe);

    const html = buildPrintableHtml();
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    const waitForImages = () =>
      new Promise((resolve) => {
        const imgs = Array.from(doc.images || []);
        if (!imgs.length) {
          resolve();
          return;
        }

        let pending = imgs.length;
        let finished = false;
        const done = () => {
          if (finished) return;
          finished = true;
          resolve();
        };

        const timer = setTimeout(done, 8000);
        const markOne = () => {
          pending -= 1;
          if (pending <= 0) {
            clearTimeout(timer);
            done();
          }
        };

        imgs.forEach((img) => {
          if (img.complete) {
            markOne();
          } else {
            img.addEventListener("load", markOne, { once: true });
            img.addEventListener("error", markOne, { once: true });
          }
        });
      });

    const runPrint = async () => {
      await waitForImages();

      const frameWindow = iframe.contentWindow;
      if (!frameWindow) {
        document.body.removeChild(iframe);
        return;
      }

      const cleanup = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };

      frameWindow.addEventListener("afterprint", cleanup, { once: true });
      frameWindow.focus();
      frameWindow.print();

      setTimeout(() => {
        cleanup();
      }, 3000);
    };

    setTimeout(runPrint, 100);
  };

  return (
    <dialog id={modalId} className="modal modal-bottom sm:modal-middle backdrop-blur-md bg-base-300/60 transition-all duration-300">
      <div className="modal-box w-[96vw] max-w-6xl max-h-[92vh] overflow-y-auto glass bg-base-100/70 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-t-[2rem] sm:rounded-[2rem] p-0 relative">
        <style>{`
          @media print {
            @page { size: A4; margin: 14mm; }
            body * { visibility: hidden; }
            .report-print, .report-print * { visibility: visible; }
            .report-print { position: absolute; left: 0; top: 0; width: 100%; background: white; color: black; }
            .no-print { display: none !important; }
          }
        `}</style>
        
        {/* Header Section */}
        <div className="sticky top-0 z-50 glass bg-base-100/80 backdrop-blur-xl border-b border-white/10 px-8 py-6 flex items-center justify-between no-print shadow-sm">
          <div>
            <h3 className="font-black text-3xl mb-1 flex items-center gap-3">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Professional MRI <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Report</span>
            </h3>
            <p className="text-sm font-medium text-base-content/60 flex items-center gap-2">
              <span className="opacity-70">Requested ID:</span> <code className="bg-base-200/50 px-2 py-0.5 rounded text-primary font-bold border border-white/5">{state?.requestedId ?? "-"}</code>
              <span className="mx-2 opacity-30">|</span>
              <span className="opacity-70">Resolved ID:</span> <code className="bg-base-200/50 px-2 py-0.5 rounded text-secondary font-bold border border-white/5">{state?.resolvedId ?? "-"}</code>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="btn btn-primary rounded-xl font-bold px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105" 
              type="button" 
              onClick={handleDownloadPdf}
              disabled={loading || !report}
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download PDF
            </button>
            <form method="dialog">
              <button className="btn btn-circle btn-ghost bg-base-200/50 hover:bg-error/20 hover:text-error transition-colors">✕</button>
            </form>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <span className="loading loading-ring loading-lg text-primary scale-150"></span>
              <p className="font-bold text-base-content/50 uppercase tracking-[0.2em] animate-pulse">Generating Report...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error rounded-2xl shadow-lg border-none bg-error/10 text-error backdrop-blur-md max-w-2xl mx-auto my-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-bold">{error}</span>
            </div>
          ) : report ? (
            <div className="report-print space-y-6 max-w-5xl mx-auto bg-base-100 rounded-3xl p-8 lg:p-12 shadow-inner border border-base-content/5">
              
              {/* Report Header */}
              <div className="border-b-2 border-base-content/10 pb-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center p-2 shadow-sm border border-base-content/5">
                    <img src={logo} alt="RadioOne-AI logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="text-3xl font-black tracking-tighter text-base-content">RADIOONE-AI DIAGNOSTICS</div>
                    <div className="text-primary font-bold tracking-wide uppercase text-xs mt-1">
                      Advanced Brain Imaging & AI Assisted Reporting
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-base-content/60 font-medium">
                  <p>12 Main Street, Colombo</p>
                  <p>+94 11 000 0000</p>
                  <p>reports@radioone.lk</p>
                </div>
              </div>

              {/* Top Meta Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-base-200/40 rounded-2xl p-6 border border-base-content/5">
                  <h4 className="font-black text-lg mb-4 text-primary uppercase tracking-wider text-sm border-b border-base-content/10 pb-2">Patient & Request Info</h4>
                  <div className="space-y-1 text-sm">
                    <InfoRow label="Patient Name" value={<span className="font-bold text-base">{report.patient?.name}</span>} />
                    <InfoRow label="Patient ID" value={report.patient_id} />
                    <InfoRow label="Referring Doctor" value={<span className="font-semibold">{report.doctor?.name}</span>} />
                    <InfoRow label="Radiographer" value={report.radiographer?.name} />
                    <InfoRow label="Request ID" value={<span className="font-mono text-xs bg-base-300 px-2 py-1 rounded">{report.scan_req_id || report.scan_request_id}</span>} />
                    <InfoRow label="Scan Details" value={<span className="uppercase font-bold opacity-80">{report.scan_type} • {report.organ}</span>} />
                  </div>
                </div>

                <div className="bg-base-200/40 rounded-2xl p-6 border border-base-content/5">
                  <h4 className="font-black text-lg mb-4 text-secondary uppercase tracking-wider text-sm border-b border-base-content/10 pb-2">Report Metadata</h4>
                  <div className="space-y-1 text-sm">
                    <InfoRow label="Report ID" value={<span className="font-mono text-xs">{report.id}</span>} />
                    <InfoRow label="Status" value={<span className="badge badge-success badge-sm font-bold">{report.status}</span>} />
                    <InfoRow label="Generated On" value={fmtDate(report.created_at)} />
                    <InfoRow label="Last Updated" value={fmtDate(report.updated_at)} />
                    <InfoRow label="AI Process Time" value={`${report.analysis_time_ms} ms`} />
                    <InfoRow label="Radiologist Note" value={<span className="italic opacity-80">{report.radiologist_text || "None provided"}</span>} />
                  </div>
                </div>
              </div>

              {/* AI Findings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="bg-base-100 rounded-2xl p-5 border-l-4 border-l-blue-500 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg></div>
                    <h4 className="font-black text-base uppercase tracking-wider">Classification</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center"><span className="opacity-60 font-semibold">Result</span><span className="font-bold text-blue-600">{classification.predicted_class || "-"}</span></div>
                    <div className="flex justify-between items-center"><span className="opacity-60 font-semibold">Confidence</span><span className="font-bold">{classification.confidence_pct || "-"}%</span></div>
                    <div className="w-full bg-base-300 rounded-full h-1.5 mt-1"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${classification.confidence_pct || 0}%` }}></div></div>
                  </div>
                </div>

                <div className="bg-base-100 rounded-2xl p-5 border-l-4 border-l-orange-500 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg></div>
                    <h4 className="font-black text-base uppercase tracking-wider">Detection</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center"><span className="opacity-60 font-semibold">Found</span><span className="font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">{detection.num_detections ?? summary?.detection?.num_detections ?? 0}</span></div>
                    <div className="flex justify-between items-center"><span className="opacity-60 font-semibold">RECIST</span><span className="font-bold">{detection?.recist_who?.recist_class ?? summary?.detection?.recist_class ?? "-"}</span></div>
                    <div className="flex justify-between items-center"><span className="opacity-60 font-semibold">Risk</span><span className="font-bold">{detection?.risk_stratification?.risk_level ?? summary?.detection?.risk_level ?? "-"}</span></div>
                  </div>
                </div>

                <div className="bg-base-100 rounded-2xl p-5 border-l-4 border-l-emerald-500 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg></div>
                    <h4 className="font-black text-base uppercase tracking-wider">Segmentation</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center"><span className="opacity-60 font-semibold">Area</span><span className="font-bold">{segArea ? `${segArea} cm²` : "-"}</span></div>
                    <div className="flex justify-between items-center"><span className="opacity-60 font-semibold">Volume</span><span className="font-bold">{segVolume ? `${segVolume} ml` : "-"}</span></div>
                    <div className="flex justify-between items-center"><span className="opacity-60 font-semibold">Margin</span><span className="font-bold">{segMargin || "-"}</span></div>
                  </div>
                </div>
              </div>

              {/* Summary Highlights */}
              <div className="bg-base-200/50 rounded-2xl p-5 border border-base-content/5 mt-4">
                 <div className="flex gap-6 justify-around text-center text-sm">
                    <div>
                      <div className="opacity-50 font-bold mb-1 uppercase text-[10px] tracking-widest">Tumor Detected</div>
                      <div className={`font-black text-lg ${summary?.tumor_detected ? 'text-error' : 'text-success'}`}>{summary?.tumor_detected ? "YES" : "NO"}</div>
                    </div>
                    <div>
                      <div className="opacity-50 font-bold mb-1 uppercase text-[10px] tracking-widest">Hemisphere</div>
                      <div className="font-black text-lg">{summary?.detection?.hemisphere || "-"}</div>
                    </div>
                    <div>
                      <div className="opacity-50 font-bold mb-1 uppercase text-[10px] tracking-widest">Lateralization</div>
                      <div className="font-black text-lg">{summary?.segmentation?.lateralization || "-"}</div>
                    </div>
                 </div>
              </div>

              {/* AI Diagnoses (Patient / Clinical / Technical) */}
              {(() => {
                const diagnoses = report?.diagnoses || {};
                const patientText = pickDiagnosisText(diagnoses.patient);
                const clinicalText = pickDiagnosisText(diagnoses.clinical);
                const technicalText = pickDiagnosisText(diagnoses.technical);
                const hasAny = patientText || clinicalText || technicalText;

                return (
                  <div className="pt-6">
                    <h4 className="font-black text-xl mb-4 flex items-center gap-2 border-b border-base-content/10 pb-3">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      AI Diagnostic Narrative
                    </h4>

                    {!hasAny ? (
                      <div className="bg-base-200/50 rounded-2xl p-8 text-center border border-base-300 border-dashed">
                        <p className="text-base-content/50 font-medium">
                          No AI diagnostic narrative is available for this report.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {patientText && (
                          <div className="bg-base-100 border-l-4 border-l-emerald-500 rounded-2xl p-5 shadow-sm">
                            <h5 className="font-black text-sm uppercase tracking-wider text-emerald-600 mb-2">
                              Patient-Friendly Summary
                            </h5>
                            <p className="text-sm leading-relaxed whitespace-pre-line text-base-content/80">
                              {patientText}
                            </p>
                          </div>
                        )}
                        {clinicalText && (
                          <div className="bg-base-100 border-l-4 border-l-blue-500 rounded-2xl p-5 shadow-sm">
                            <h5 className="font-black text-sm uppercase tracking-wider text-blue-600 mb-2">
                              Clinical Report
                            </h5>
                            <p className="text-sm leading-relaxed whitespace-pre-line text-base-content/80">
                              {clinicalText}
                            </p>
                          </div>
                        )}
                        {technicalText && (
                          <div className="bg-base-100 border-l-4 border-l-purple-500 rounded-2xl p-5 shadow-sm">
                            <h5 className="font-black text-sm uppercase tracking-wider text-purple-600 mb-2">
                              Technical Report
                            </h5>
                            <p className="text-sm leading-relaxed whitespace-pre-line text-base-content/80">
                              {technicalText}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Per-Tumor Findings */}
              {(() => {
                const tumors = Array.isArray(report?.tumors) ? report.tumors : [];
                if (!tumors.length) return null;

                return (
                  <div className="pt-6">
                    <h4 className="font-black text-xl mb-4 flex items-center gap-2 border-b border-base-content/10 pb-3">
                      <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      Per-Tumor Findings ({tumors.length})
                    </h4>
                    <div className="overflow-x-auto rounded-2xl border border-base-content/10">
                      <table className="table table-sm">
                        <thead className="bg-base-200/60 text-[10px] uppercase tracking-wider">
                          <tr>
                            <th>#</th>
                            <th>Source</th>
                            <th>Side</th>
                            <th>Area (cm²)</th>
                            <th>Longest Ø (mm)</th>
                            <th>Confidence</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {tumors.map((t, idx) => (
                            <tr key={t?.tumor_id ?? idx}>
                              <td className="font-bold">{t?.tumor_id ?? idx + 1}</td>
                              <td className="text-xs opacity-80">{safe(t?.source)}</td>
                              <td>{safe(t?.lateralization)}</td>
                              <td>{fmtNum(t?.area_cm2)}</td>
                              <td>{fmtNum(t?.longest_diameter_mm)}</td>
                              <td>
                                {t?.confidence != null
                                  ? `${(Number(t.confidence) * (Number(t.confidence) <= 1 ? 100 : 1)).toFixed(1)}%`
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* Feedbacks */}
              {(() => {
                const feedbacks = Array.isArray(report?.feedbacks) ? report.feedbacks : [];
                if (!feedbacks.length) return null;

                return (
                  <div className="pt-6 no-print">
                    <h4 className="font-black text-xl mb-4 flex items-center gap-2 border-b border-base-content/10 pb-3">
                      <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      Discussion & Feedback ({feedbacks.length})
                    </h4>
                    <div className="space-y-3">
                      {feedbacks.map((f) => (
                        <div key={f?.id} className="bg-base-200/40 rounded-2xl p-4 border border-base-content/5">
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{safe(f?.user_name)}</span>
                              {f?.user_role && (
                                <span className="badge badge-ghost badge-sm uppercase font-bold tracking-wider text-[10px]">
                                  {f.user_role}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] opacity-50 font-mono">{fmtDate(f?.created_at)}</span>
                          </div>
                          <p className="text-sm text-base-content/80 whitespace-pre-line leading-relaxed">
                            {safe(f?.message)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Images Section */}
              <div className="pt-6">
                <h4 className="font-black text-xl mb-6 flex items-center gap-2 border-b border-base-content/10 pb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Diagnostic Images
                </h4>
                {imageCards.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {imageCards.map((img) => (
                      <div key={img.key} className="group relative rounded-2xl overflow-hidden border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 bg-base-200">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <img
                          src={img.src}
                          alt={img.title}
                          className="w-full h-56 object-cover bg-black group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                           <div className="text-white font-bold text-sm truncate drop-shadow-md">{img.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-base-200/50 rounded-2xl p-12 text-center border border-base-300 border-dashed">
                    <svg className="w-12 h-12 mx-auto text-base-content/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-base-content/50 font-medium">No diagnostic images generated for this report.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-base-content/50 font-medium pt-8 mt-8 border-t border-base-content/10">
                <p className="font-bold text-base-content/70">DISCLAIMER</p>
                <p className="mt-1">This is an AI-assisted preliminary report generated by RADIOONE-AI.</p>
                <p>Final clinical interpretation and diagnosis must be confirmed by a qualified medical specialist.</p>
              </div>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center text-base-content/40">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="font-bold text-lg">No Report Data Available</span>
              <span className="text-sm">Select an appointment to view its report.</span>
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-base-300/40 backdrop-blur-sm">
        <button onClick={onClose} className="cursor-default">close</button>
      </form>
    </dialog>
  );
}
