import { useState, useEffect, useRef } from 'react'

function ImageModal({ src, alt, onClose }) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(s + 0.25, 5))
      if (e.key === '-') setScale((s) => Math.max(s - 0.25, 0.5))
      if (e.key === '0') { setScale(1); setPosition({ x: 0, y: 0 }) }
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleWheel = (e) => {
    e.preventDefault()
    setScale((s) => {
      const delta = e.deltaY > 0 ? -0.15 : 0.15
      return Math.min(Math.max(s + delta, 0.5), 5)
    })
  }

  const handleMouseDown = (e) => {
    if (e.button !== 0) return
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { ...position }
  }

  const handleMouseMove = (e) => {
    if (!dragging) return
    setPosition({
      x: posStart.current.x + (e.clientX - dragStart.current.x),
      y: posStart.current.y + (e.clientY - dragStart.current.y),
    })
  }

  const handleMouseUp = () => setDragging(false)

  const resetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleImageClick = () => {
    setScale((prev) => {
      const next = prev > 1 ? 1 : 2
      if (next === 1) setPosition({ x: 0, y: 0 })
      return next
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="modal-topbar">
          <span className="modal-title">{alt || 'Image Viewer'}</span>
          <div className="modal-controls">
            <button className="modal-ctrl-btn" onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))} title="Zoom Out">−</button>
            <span className="modal-zoom-label">{Math.round(scale * 100)}%</span>
            <button className="modal-ctrl-btn" onClick={() => setScale((s) => Math.min(s + 0.25, 5))} title="Zoom In">+</button>
            <button className="modal-ctrl-btn" onClick={resetView} title="Reset View">⟲</button>
            <button className="modal-close-btn" onClick={onClose} title="Close (Esc)">✕</button>
          </div>
        </div>

        {/* Image area */}
        <div
          className="modal-image-area"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        >
          <img
            src={src}
            alt={alt}
            className="modal-image"
            draggable={false}
            onClick={handleImageClick}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: scale > 1 ? 'zoom-out' : 'zoom-in',
            }}
          />
        </div>

        {/* Bottom hint */}
        <div className="modal-hint">
          Scroll to zoom &middot; Drag to pan &middot; Press <kbd>0</kbd> to reset &middot; <kbd>Esc</kbd> to close
        </div>
      </div>
    </div>
  )
}

export default ImageModal
