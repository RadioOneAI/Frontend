import React from "react";
// Reusing the same images for consistency
import tumorImage from "../../assets/images/meningioma-segmentation.png";
import cleanImage from "../../assets/images/clean-mri.png";

export default function PatientReportModal({ reportId, onClose }) {
  if (!reportId) return null;

  // --- MOCK LOGIC: AI Translation for Patients ---
  const isTumorCase = reportId === "REQ-8821";

  const patientReport = isTumorCase ? {
    title: "Meningioma Detected",
    summary: "Our AI analysis has detected a specific growth in the brain known as a Meningioma.",
    explanation: "This is often a benign (non-cancerous) condition that grows slowly. The symptoms you may be feeling, such as headaches or dizziness, are likely caused by this growth pressing on nearby areas.",
    reassurance: "This condition is generally treatable. Many patients recover fully with appropriate care.",
    nextStep: "Please schedule an appointment with Dr. Sarah Jenkins immediately to discuss treatment options.",
    imageUrl: tumorImage,
    status: "Attention Needed",
    color: "warning"
  } : {
    title: "Normal Scan Result",
    summary: "Good news! The AI analysis did not detect any abnormalities in your scan.",
    explanation: "Your brain structure appears healthy and normal. There are no signs of tumors, bleeding, or other concerning issues.",
    reassurance: "You can have peace of mind knowing your scan is clear.",
    nextStep: "Maintain your regular check-up schedule. No immediate action is required.",
    imageUrl: cleanImage,
    status: "Normal",
    color: "success"
  };

  return (
    <dialog id="patient_report_modal" className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl bg-base-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-2xl">Scan Result Explanation</h3>
            <span className={`badge badge-${patientReport.color} mt-1`}>{patientReport.status}</span>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        {/* Visual */}
        <div className="w-full h-64 bg-black rounded-xl overflow-hidden flex justify-center items-center mb-6 relative">
          <img src={patientReport.imageUrl} alt="Scan Result" className="h-full object-contain" />
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            AI Generated Preview
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          
          <div className="p-4 bg-base-200 rounded-lg">
            <h4 className="font-bold text-lg mb-2">What does this mean?</h4>
            <p className="text-base-content/80 text-sm leading-relaxed">
              {patientReport.summary} {patientReport.explanation}
            </p>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex gap-4 items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <h4 className="font-bold text-primary">Good to know</h4>
              <p className="text-sm text-base-content/70">{patientReport.reassurance}</p>
            </div>
          </div>

          <div className="divider">Next Steps</div>

          <div className="flex flex-col gap-3">
             <div className="alert">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               <span>{patientReport.nextStep}</span>
             </div>
             
             {isTumorCase && (
               <button className="btn btn-primary w-full">
                 Book Appointment with Dr. Jenkins
               </button>
             )}
          </div>

        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}