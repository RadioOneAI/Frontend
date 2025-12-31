import React from "react";
// 1. Import the specific tumor image
import tumorImage from "../../assets/images/meningioma-segmentation.png";
// 2. Import the clear image
import noTumorImage from "../../assets/images/clean-mri.png";

export default function DoctorReportModal({ patient, onClose }) {
  if (!patient) return null;

  // --- MOCK DATABASE ---
  const reports = {
    "P001": { // Kamal Gunawardena (The Tumor Case)
      tumorType: "Meningioma",
      location: "Right Frontal Lobe",
      size: "3.2cm x 2.8cm",
      confidence: "98.5%",
      suggestions: [
        "Refer to Neurosurgery for potential resection assessment.",
        "Schedule follow-up MRI in 3 months to monitor growth rate.",
        "Monitor for seizure activity or cognitive changes."
      ],
      clinicalNote: "Well-defined extra-axial mass with homogeneous enhancement. Significant mass effect noted on the adjacent frontal lobe.",
      imageUrl: tumorImage, 
      hasTumor: true
    },
    "P002": { // Nimali Perera (The Healthy Case)
      tumorType: "None Detected",
      location: "N/A",
      size: "N/A",
      confidence: "99.1%",
      suggestions: ["No further radiological action required at this time."],
      clinicalNote: "Brain parenchyma appears normal. No evidence of mass effect, midline shift, or intracranial hemorrhage. Ventricles are within normal limits.",
      imageUrl: noTumorImage, // <--- Updated to use the clear image
      hasTumor: false
    }
  };

  // Default fallback if patient ID not found
  const aiReport = reports[patient.id] || {
    tumorType: "Processing...",
    location: "Pending",
    size: "--",
    confidence: "--",
    suggestions: [],
    clinicalNote: "Data not yet available.",
    imageUrl: "https://via.placeholder.com/400x400?text=Scan+Pending",
    hasTumor: false
  };

  return (
    <dialog id="doctor_report_modal" className="modal modal-open">
      {/* INCREASED WIDTH HERE: max-w-7xl */}
      <div className="modal-box w-11/12 max-w-7xl p-0 overflow-hidden bg-base-100">
        
        {/* Header */}
        <div className="p-4 bg-base-200 border-b border-base-300 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl">AI Diagnostic Report</h3>
            <p className="text-xs text-base-content/60">Patient: {patient.name} | ID: {patient.id}</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        {/* INCREASED HEIGHT HERE: h-[85vh] */}
        <div className="flex flex-col lg:flex-row h-[85vh]">
          
          {/* LEFT: MRI Visual */}
          <div className="lg:w-3/5 bg-black flex items-center justify-center p-4 relative group">
             <img 
                src={aiReport.imageUrl} 
                alt="MRI Scan" 
                className="max-h-full object-contain" 
             />
             
             {/* Confidence Badge */}
             <div className="absolute bottom-4 left-4">
                <div className={`badge ${aiReport.hasTumor ? 'badge-warning' : 'badge-success'} gap-2 p-3 font-mono shadow-lg`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  AI Confidence: {aiReport.confidence}
                </div>
             </div>
          </div>

          {/* RIGHT: Clinical Data & Action */}
          <div className="lg:w-2/5 p-6 flex flex-col bg-base-100 overflow-y-auto">
             
             <div className="text-sm font-bold uppercase text-primary mb-2">AI Findings (Doctor View)</div>
             
             {/* Key Metrics */}
             <div className="stats stats-vertical shadow border border-base-200 w-full mb-4">
               <div className="stat p-3">
                 <div className="stat-title text-xs">Pathology Detected</div>
                 <div className={`stat-value text-lg ${aiReport.hasTumor ? 'text-error' : 'text-success'}`}>
                    {aiReport.tumorType}
                 </div>
                 <div className="stat-desc">{aiReport.location}</div>
               </div>
               
               {/* Only show Size if tumor exists */}
               {aiReport.hasTumor && (
                 <div className="stat p-3 bg-base-200/30">
                   <div className="stat-title text-xs font-bold text-base-content">Estimated Size</div>
                   <div className="stat-value text-2xl text-primary">{aiReport.size}</div>
                   <div className="stat-desc">Axial Plane Dimensions</div>
                 </div>
               )}
             </div>

             {/* Clinical Note */}
             <div className={`alert ${aiReport.hasTumor ? 'alert-warning bg-warning/10' : 'alert-success bg-success/10'} text-sm mb-4 rounded-lg border-0`}>
               <div className="w-full">
                 <span className="font-bold block mb-1 text-base-content opacity-70 uppercase text-xs">Radiological Impression:</span>
                 <p className="text-base-content font-medium leading-relaxed">
                   {aiReport.clinicalNote}
                 </p>
               </div>
             </div>

             {/* AI Suggestions Section */}
             {aiReport.suggestions && aiReport.suggestions.length > 0 && (
               <div className="mb-6">
                 <h4 className="text-xs font-bold uppercase text-base-content/50 mb-2">AI Clinical Suggestions</h4>
                 <ul className="menu bg-base-200 rounded-box p-2 text-sm">
                   {aiReport.suggestions.map((suggestion, index) => (
                     <li key={index} className="disabled">
                       <a className="text-base-content cursor-text flex items-start gap-2 py-2">
                         <span className="text-primary mt-1">•</span>
                         {suggestion}
                       </a>
                     </li>
                   ))}
                 </ul>
               </div>
             )}

             {/* Doctor Action Area */}
             <div className="mt-auto form-control">
               <label className="label">
                 <span className="label-text font-bold">Doctor's Final Assessment</span>
               </label>
               <textarea className="textarea textarea-bordered h-24 text-sm" placeholder="Add clinical notes for the patient report..."></textarea>
               
               <div className="flex flex-col gap-2 mt-4">
                 <button className="btn btn-primary w-full" onClick={onClose}>
                    Approve & Send to Patient
                 </button>
                 {aiReport.hasTumor && (
                    <button className="btn btn-outline btn-warning w-full">
                        Request Radiologist Re-eval
                    </button>
                 )}
               </div>
             </div>

          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}