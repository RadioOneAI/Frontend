function InvalidImageModal({ onClose }) {
  return (
    <div className="invalid-modal-overlay" role="dialog" aria-modal="true">
      <div className="invalid-modal">
        <div className="invalid-modal-icon">!</div>
        <h2>Not a brain MRI</h2>
        <p className="invalid-modal-lede">
          Please upload a valid <strong>brain MRI</strong> image to continue.
        </p>
        <button type="button" className="invalid-modal-btn" onClick={onClose} autoFocus>
          Try again
        </button>
      </div>
    </div>
  )
}

export default InvalidImageModal
