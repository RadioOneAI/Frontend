import React from "react";

export default function ConfirmationModal({ id, title, message, onConfirm, confirmText = "Delete", type = "error" }) {
  
  // Define button color based on type
  const btnClass = type === "error" ? "btn-error" : "btn-primary";

  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-error flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {title}
        </h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            {/* If there is a button in form, it will close the modal */}
            <button className="btn btn-ghost">Cancel</button>
            <button 
              className={`btn ${btnClass} ml-2`} 
              onClick={(e) => {
                // Prevent form submission if needed, though 'dialog' handles close
                // e.preventDefault(); 
                onConfirm();
              }}
            >
              {confirmText}
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}