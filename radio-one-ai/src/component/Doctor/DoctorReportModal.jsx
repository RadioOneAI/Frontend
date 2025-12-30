import React from "react";
// 1. Import the specific tumor image
import tumorImage from "../../assets/images/meningioma-segmentation.png";

export default function DoctorReportModal({ patient, onClose }) {
  if (!patient) return null;

  const aiReport = {
    tumorType: "Meningioma",
    location: "Right Frontal Lobe", // Updated to match the visual location roughly
    size: "3.2cm x 2.8cm",
    confidence: "98.5%", // Increased confidence for segmented image
    clinicalNote: "Well-defined extra-axial mass with homogeneous enhancement. Significant mass effect noted on the adjacent frontal lobe.",
    imageUrl: tumorImage // 2. Use the imported image here
  };

  return (
    <dialog id="doctor_report_modal" className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl p-0 overflow-hidden bg-base-100">
        
        {/* Header */}
        <div className="p-4 bg-base-200 border-b border-base-300 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl">AI Diagnostic Report</h3>
            <p className="text-xs text-base-content/60">Patient: {patient.name} | ID: {patient.id}</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        <div className="flex flex-col lg:flex-row h-[75vh]">
          
          {/* LEFT: MRI Visual with AI Marks */}
          <div className="lg:w-3/5 bg-black flex items-center justify-center p-4 relative group">
             {/* Display the uploaded segmentation image */}
             <img 
                src={aiReport.imageUrl} 
                alt="MRI Scan with AI Segmentation" 
                className="max-h-full object-contain" 
             />
             
             {/* NOTE: I removed the CSS 'absolute border' bounding box 
                because your image already has the purple AI segmentation mask.
             */}
             
             <div className="absolute bottom-4 left-4">
                <div className="badge badge-warning gap-2 p-3 font-mono shadow-lg">
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
                 <div className="stat-title text-xs">Pathology</div>
                 <div className="stat-value text-lg text-error">{aiReport.tumorType}</div>
                 <div className="stat-desc">{aiReport.location}</div>
               </div>
               <div className="stat p-3">
                 <div className="stat-title text-xs">Dimensions</div>
                 <div className="stat-value text-lg">{aiReport.size}</div>
                 <div className="stat-desc">Axial Plane</div>
               </div>
             </div>

             {/* Clinical Note from AI */}
             <div className="alert alert-soft bg-base-200 text-sm mb-6 rounded-lg">
               <div>
                 <span className="font-bold block mb-1">Radiological Impression:</span>
                 {aiReport.clinicalNote}
               </div>
             </div>

             {/* Doctor Action Area */}
             <div className="mt-auto form-control">
               <label className="label">
                 <span className="label-text font-bold">Doctor's Final Assessment</span>
               </label>
               <textarea className="textarea textarea-bordered h-32 text-sm" placeholder="Add clinical notes for the patient report..."></textarea>
               
               <div className="flex flex-col gap-2 mt-4">
                 <button className="btn btn-primary w-full" onClick={onClose}>
                    Approve & Send to Patient
                 </button>
                 <button className="btn btn-outline btn-warning w-full">
                    Request Radiologist Re-eval
                 </button>
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