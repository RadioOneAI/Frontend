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

    return `
      <html>
        <head>
          <title>RadioOne-AI Report ${safe(report?.id)}</title>
          <style>
            @page { size: A4; margin: 14mm; }
            body { font-family: Arial, sans-serif; color: #111; }
            .wrap { width: 100%; }
            .head { display: flex; gap: 12px; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 12px; }
            .head img { width: 64px; height: 64px; object-fit: contain; }
            .brand { font-weight: 800; font-size: 24px; letter-spacing: .6px; }
            .sub { font-size: 12px; margin-top: 4px; color: #333; }
            .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
            .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 10px; }
            .card { border: 1px solid #222; padding: 10px; border-radius: 6px; break-inside: avoid; }
            .card h4 { margin: 0 0 8px; font-size: 14px; }
            .row { display: grid; grid-template-columns: 40% 60%; border-bottom: 1px solid #ddd; padding: 4px 0; font-size: 12px; }
            .k { font-weight: 700; }
            .imgs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .img-card { border: 1px solid #ccc; padding: 8px; border-radius: 6px; }
            .img-title { font-size: 12px; font-weight: 700; margin-bottom: 6px; }
            .img-card img { width: 100%; height: 190px; object-fit: contain; background: #f7f7f7; }
            .muted { font-size: 12px; color: #666; }
            .foot { margin-top: 14px; border-top: 1px solid #111; padding-top: 8px; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="head">
              <img src="${logo}" alt="RadioOne-AI logo" />
              <div>
                <div class="brand">RadioOne-AI Diagnostics</div>
                <div class="sub">Brain Imaging and AI Assisted Reporting Unit</div>
                <div class="sub">12 Main Street, Colombo | +94 11 000 0000 | reports@radioone.lk</div>
              </div>
            </div>

            <div class="grid2">
              <div class="card">
                <h4>Patient and Request</h4>
                <div class="row"><div class="k">Patient</div><div>${safe(report?.patient?.name)}</div></div>
                <div class="row"><div class="k">Patient ID</div><div>${safe(report?.patient_id)}</div></div>
                <div class="row"><div class="k">Doctor</div><div>${safe(report?.doctor?.name)}</div></div>
                <div class="row"><div class="k">Radiographer</div><div>${safe(report?.radiographer?.name)}</div></div>
                <div class="row"><div class="k">Scan Request</div><div>${safe(report?.scan_req_id || report?.scan_request_id)}</div></div>
              </div>
              <div class="card">
                <h4>Report Meta</h4>
                <div class="row"><div class="k">Report ID</div><div>${safe(report?.id)}</div></div>
                <div class="row"><div class="k">Created</div><div>${safe(fmtDate(report?.created_at))}</div></div>
                <div class="row"><div class="k">Updated</div><div>${safe(fmtDate(report?.updated_at))}</div></div>
                <div class="row"><div class="k">Status</div><div>${safe(report?.status)}</div></div>
                <div class="row"><div class="k">Analysis Time</div><div>${safe(report?.analysis_time_ms)} ms</div></div>
              </div>
            </div>

            <div class="grid3">
              <div class="card">
                <h4>Classification</h4>
                <div class="row"><div class="k">Class</div><div>${safe(classification?.predicted_class)}</div></div>
                <div class="row"><div class="k">Confidence</div><div>${safe(classification?.confidence_pct)}%</div></div>
                <div class="row"><div class="k">Level</div><div>${safe(classification?.confidence_level)}</div></div>
              </div>
              <div class="card">
                <h4>Detection</h4>
                <div class="row"><div class="k">Detections</div><div>${safe(detection?.num_detections ?? summary?.detection?.num_detections)}</div></div>
                <div class="row"><div class="k">RECIST</div><div>${safe(detection?.recist_who?.recist_class ?? summary?.detection?.recist_class)}</div></div>
                <div class="row"><div class="k">Risk</div><div>${safe(detection?.risk_stratification?.risk_level ?? summary?.detection?.risk_level)}</div></div>
              </div>
              <div class="card">
                <h4>Segmentation</h4>
                <div class="row"><div class="k">Area</div><div>${safe(segArea)} cm2</div></div>
                <div class="row"><div class="k">Volume</div><div>${safe(segVolume)} ml</div></div>
                <div class="row"><div class="k">Margin</div><div>${safe(segMargin)}</div></div>
              </div>
            </div>

            <div class="card" style="margin-top:10px;">
              <h4>Report Images</h4>
              <div class="imgs">${imageBlocks}</div>
            </div>

            <div class="foot">
              RADIOONE-AI assisted report. Final clinical interpretation should be confirmed by a qualified specialist.
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
    <dialog id={modalId} className="modal">
      <div className="modal-box w-[96vw] max-w-6xl max-h-[92vh] overflow-y-auto">
        <style>{`
          @media print {
            @page { size: A4; margin: 14mm; }
            body * { visibility: hidden; }
            .report-print, .report-print * { visibility: visible; }
            .report-print { position: absolute; left: 0; top: 0; width: 100%; background: white; color: black; }
            .no-print { display: none !important; }
          }
        `}</style>
        <form method="dialog">
          <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2 no-print ">
            x
          </button>
        </form>

        <div className="no-print flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-2xl">Professional MRI Report</h3>
            <p className="text-sm text-base-content/70">
              Requested ID: <code>{state?.requestedId ?? "-"}</code>
              {" | "}
              Resolved Report ID: <code>{state?.resolvedId ?? "-"}</code>
            </p>
          </div>
          <button className="btn mt-10 btn-primary" type="button" onClick={handleDownloadPdf}>
            Download PDF
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-base-content/60">
            Loading report details...
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : report ? (
          <div className="report-print space-y-5 bg-white text-black p-4 rounded-xl">
            <div className="border-b-2 border-black pb-3">
              <div className="flex items-center gap-3">
                <img src={logo} alt="RadioOne-AI logo" className="w-16 h-16 object-contain" />
                <div>
                  <div className="text-3xl font-black tracking-wide">RADIOONE-AI DIAGNOSTICS</div>
                  <div className="text-sm">
                    Brain Imaging and AI Assisted Reporting Unit
                  </div>
                  <div className="text-sm mt-1">
                    No.55,13 th lane,Isurupura Road,Malabe, Sri Lanka | +94 11 000 0000 | reports@radioone.lk
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card border border-black bg-white">
                <div className="card-body p-4">
                  <h4 className="font-bold">Patient and Request</h4>
                  <InfoRow label="Patient" value={report.patient?.name} />
                  <InfoRow label="Patient ID" value={report.patient_id} />
                  <InfoRow label="Doctor" value={report.doctor?.name} />
                  <InfoRow label="Radiographer" value={report.radiographer?.name} />
                  <InfoRow label="Scan Request" value={report.scan_req_id || report.scan_request_id} />
                  <InfoRow label="Scan Type" value={report.scan_type} />
                  <InfoRow label="Organ" value={report.organ} />
                </div>
              </div>

              <div className="card border border-black bg-white">
                <div className="card-body p-4">
                  <h4 className="font-bold">Report Meta</h4>
                  <InfoRow label="Report ID" value={report.id} />
                  <InfoRow label="Status" value={report.status} />
                  <InfoRow label="Created At" value={fmtDate(report.created_at)} />
                  <InfoRow label="Updated At" value={fmtDate(report.updated_at)} />
                  <InfoRow label="Analysis Time (ms)" value={report.analysis_time_ms} />
                  <InfoRow label="Radiologist Note" value={report.radiologist_text} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card border border-black bg-white">
                <div className="card-body p-4">
                  <h4 className="font-bold">Classification</h4>
                  <InfoRow label="Predicted Class" value={classification.predicted_class} />
                  <InfoRow label="Confidence %" value={classification.confidence_pct} />
                  <InfoRow label="Confidence Level" value={classification.confidence_level} />
                </div>
              </div>

              <div className="card border border-black bg-white">
                <div className="card-body p-4">
                  <h4 className="font-bold">Detection</h4>
                  <InfoRow
                    label="Detections"
                    value={detection.num_detections ?? summary?.detection?.num_detections}
                  />
                  <InfoRow
                    label="RECIST Class"
                    value={detection?.recist_who?.recist_class ?? summary?.detection?.recist_class}
                  />
                  <InfoRow
                    label="Risk Level"
                    value={detection?.risk_stratification?.risk_level ?? summary?.detection?.risk_level}
                  />
                </div>
              </div>

              <div className="card border border-black bg-white">
                <div className="card-body p-4">
                  <h4 className="font-bold">Segmentation</h4>
                  <InfoRow label="Area (cm2)" value={segArea} />
                  <InfoRow label="Volume (ml)" value={segVolume} />
                  <InfoRow
                    label="Margin Type"
                    value={segMargin}
                  />
                  <InfoRow
                    label="Size Class"
                    value={segSizeClass}
                  />
                </div>
              </div>
            </div>

            <div className="card border border-black bg-white">
              <div className="card-body p-4">
                <h4 className="font-bold">Findings Summary</h4>
                <InfoRow
                  label="Tumor Detected"
                  value={summary?.tumor_detected ? "Yes" : "No"}
                />
                <InfoRow
                  label="Hemisphere"
                  value={summary?.detection?.hemisphere}
                />
                <InfoRow
                  label="Lateralization"
                  value={summary?.segmentation?.lateralization}
                />
              </div>
            </div>

            <div className="card border border-black bg-white">
              <div className="card-body p-4">
                <h4 className="font-bold">Report Images</h4>
                {imageCards.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {imageCards.map((img) => (
                      <div key={img.key} className="border border-base-300 rounded-md p-2">
                        <div className="text-xs font-semibold mb-2">{img.title}</div>
                        <img
                          src={img.src}
                          alt={img.title}
                          className="w-full h-44 object-contain bg-base-100"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-base-content/70">
                    No report images available.
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs pt-4 border-t border-black">
              RADIOONE AI assisted report. Final clinical interpretation should be confirmed by a qualified specialist.
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-base-content/60">
            No report details available.
          </div>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
