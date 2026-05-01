import React from 'react';
import ZoomableImage from './ZoomableImage';
import { renderMarkdown } from './markdown';

function renderDataGroup(title, obj) {
  if (!obj || typeof obj !== 'object') return null;
  const entries = Object.entries(obj).filter(
    ([k, v]) => typeof v !== 'object' || v === null
  );
  if (entries.length === 0) return null;

  return (
    <div className="card bg-base-100/40 backdrop-blur-md border border-white/5 shadow-xl transition-all duration-300 hover:shadow-primary/10 hover:border-primary/20">
      <div className="card-body p-5">
        <h4 className="text-lg font-bold text-primary mb-3 border-b border-white/10 pb-2">{title}</h4>
        <div className="flex flex-col gap-2">
          {entries.map(([k, v]) => (
            <div className="flex justify-between items-start gap-4 text-sm group" key={k}>
              <span className="text-base-content/60 capitalize group-hover:text-base-content/80 transition-colors">
                {k.replace(/_/g, ' ')}
              </span>
              <span className="font-medium text-right text-base-content/90">
                {v === null || v === undefined ? 'N/A' : typeof v === 'number' ? Number(v.toFixed(4)) : String(v)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetectionReport({ data, originalImage }) {
  if (!data) return (
    <div className="alert alert-info shadow-lg backdrop-blur-md bg-info/10 border border-info/20 text-info-content rounded-2xl">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>No detection data available.</span>
    </div>
  );

  const allImages = data._images || {};
  const hiddenKeys = ['clinical_report', 'comparison', 'json_report', 'multi_detection_overlay'];
  const images = Object.fromEntries(
    Object.entries(allImages).filter(([key]) => !hiddenKeys.includes(key))
  );
  const sections = [
    ['RECIST / WHO', data.recist_who],
    ['Volumetrics', data.volumetrics],
    ['Hemispheric Symmetry', data.hemispheric_symmetry],
    ['ROI Radiomics', data.roi_radiomics],
    ['Perilesional Profile', data.perilesional_profile],
    ['Enhancement Grading', data.enhancement_grading],
    ['Detection Reliability', data.detection_reliability],
    ['Risk Stratification', data.risk_stratification],
    ['Detection', data.detection],
  ];

  const vlm = data.vlm_report;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
        </div>
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Detection Analysis
        </h3>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {originalImage && (
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-base-300/30 backdrop-blur-sm shadow-xl group">
            <div className="bg-base-200/50 p-3 border-b border-white/5 text-sm font-semibold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>Original MRI
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
        {Object.entries(images).map(([key, b64]) => (
          <div key={key} className="rounded-2xl overflow-hidden border border-white/10 bg-base-300/30 backdrop-blur-sm shadow-xl group">
            <div className="bg-base-200/50 p-3 border-b border-white/5 text-sm font-semibold capitalize flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>{key.replace(/_/g, ' ')}
            </div>
            <div className="p-2 relative">
              <ZoomableImage
                src={`data:image/png;base64,${b64}`}
                label={key.replace(/_/g, ' ')}
                className="rounded-xl w-full object-cover shadow-inner hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Data Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(([title, obj]) =>
          obj ? renderDataGroup(title, obj) : null
        )}
      </div>

      {/* VLM Report — OpenAI diagnosis grounded in the detection findings */}
      {vlm && (
        <section className="mt-10 pt-8 border-t border-white/10">
          <div className="card bg-gradient-to-br from-base-300/80 to-base-200/80 backdrop-blur-xl border border-primary/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="card-body p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold">VLM Report</h4>
                </div>

                {vlm.status === 'success' && (
                  <span className="badge badge-success badge-outline gap-2 px-4 py-3 bg-success/10 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    Generated by OpenAI VLM
                  </span>
                )}
                {vlm.status === 'error' && (
                  <span className="badge badge-error badge-outline gap-2 px-4 py-3 bg-error/10 backdrop-blur-md">
                    VLM error
                  </span>
                )}
                {vlm.status === 'empty' && (
                  <span className="badge badge-warning badge-outline gap-2 px-4 py-3 bg-warning/10 backdrop-blur-md">
                    Empty response
                  </span>
                )}
              </div>

              <div className="text-base-content/90 prose-headings:text-base-content prose-strong:text-primary prose-a:text-secondary">
                {vlm.body ? renderMarkdown(vlm.body) : <p className="italic opacity-50">No VLM content available.</p>}
              </div>


            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default DetectionReport;
