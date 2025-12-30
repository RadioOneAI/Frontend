import React from "react";

export default function DoctorReportModal({ patient, onClose }) {
  if (!patient) return null;

  // Mocking the AI Output specific to the Doctor
  const aiReport = {
    tumorType: "Meningioma",
    location: "Left Frontal Lobe",
    size: "2.4cm x 1.8cm",
    urgency: "Moderate",
    confidence: "94%",
    clinicalNote: "Mass exerts mild mass effect on adjacent parenchyma. No midline shift observed.",
    imageUrl: "https://img.daisyui.com/images/stock/photo-1551963831-b3b1ca40c98e.webp" 
  };

  return (
    <dialog id="doctor_report_modal" className="modal modal-open">
      <div className="modal-box w-11/12 max-w-4xl p-0 overflow-hidden bg-base-100">
        
        {/* Header */}
        <div className="p-6 bg-base-200 border-b border-base-300 flex justify-between items-start">
          <div>
            <h3 className="font-bold text-2xl">Diagnostic Report</h3>
            <p className="text-base-content/60 text-sm mt-1">Patient: <span className="font-semibold text-base-content">{patient.name}</span> | ID: {patient.id}</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        <div className="flex flex-col lg:flex-row h-[70vh]">
          
          {/* LEFT: AI Visual Output (The marked scan) */}
          <div className="lg:w-1/2 bg-black flex items-center justify-center p-4 relative">
             <img src={aiReport.imageUrl} alt="MRI Scan" className="max-h-full max-w-full rounded-lg border border-gray-700" />
             {/* Simulated AI Marking overlay */}
             <div className="absolute top-4 left-4 badge badge-warning gap-2">
               AI Detection: {aiReport.tumorType}
             </div>
          </div>

          {/* RIGHT: Doctor's Technical Data */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
             
             {/* AI Summary Card */}
             <div className="card bg-primary/10 border border-primary/20 mb-6">
               <div className="card-body p-4">
                 <h4 className="text-sm font-bold uppercase text-primary tracking-wide mb-2">AI Analysis Findings</h4>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block opacity-60 text-xs">Pathology Detected</span>
                      <span className="font-bold text-lg">{aiReport.tumorType}</span>
                    </div>
                    <div>
                      <span className="block opacity-60 text-xs">Dimensions</span>
                      <span className="font-bold text-lg">{aiReport.size}</span>
                    </div>
                    <div>
                      <span className="block opacity-60 text-xs">Location</span>
                      <span className="font-medium">{aiReport.location}</span>
                    </div>
                    <div>
                      <span className="block opacity-60 text-xs">Model Confidence</span>
                      <span className="font-medium">{aiReport.confidence}</span>
                    </div>
                 </div>
                 <div className="mt-3 p-3 bg-base-100 rounded-lg text-sm">
                   <span className="font-bold">Clinical Note:</span> {aiReport.clinicalNote}
                 </div>
               </div>
             </div>

             {/* Prescription / Next Steps (Simulating Doctor Action) */}
             <div className="form-control">
               <label className="label">
                 <span className="label-text font-bold">Doctor's Remarks & Next Steps</span>
               </label>
               <textarea className="textarea textarea-bordered h-32" placeholder="Enter notes for patient discussion or further referrals..."></textarea>
             </div>

             <div className="mt-6 flex justify-end gap-2">
               <button className="btn btn-ghost" onClick={onClose}>Close</button>
               <button className="btn btn-primary" onClick={onClose}>Finalize & Notify Patient</button>
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