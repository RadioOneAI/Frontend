import { useEffect, useRef, useState } from "react";

function InlineImageModal({ src, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") {
        setScale((s) => Math.min(s + 0.25, 5));
      }
      if (e.key === "-") {
        setScale((s) => Math.max(s - 0.25, 0.5));
      }
      if (e.key === "0") {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((s) => {
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      return Math.min(Math.max(s + delta, 0.5), 5);
    });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: posStart.current.x + (e.clientX - dragStart.current.x),
      y: posStart.current.y + (e.clientY - dragStart.current.y),
    });
  };

  const handleMouseUp = () => setDragging(false);

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-[92vw] max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-base-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3">
          <span className="text-sm font-semibold">{alt || "Image Viewer"}</span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
            >
              −
            </button>

            <span className="min-w-[56px] text-center text-sm font-medium">
              {Math.round(scale * 100)}%
            </span>

            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => setScale((s) => Math.min(s + 0.25, 5))}
            >
              +
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={resetView}
            >
              Reset
            </button>

            <button
              type="button"
              className="btn btn-sm btn-error"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <div
          className="flex flex-1 items-center justify-center overflow-hidden bg-black"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: dragging ? "grabbing" : "grab" }}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="max-h-[90%] max-w-[90%] select-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: dragging ? "none" : "transform 0.1s ease",
            }}
          />
        </div>

        <div className="border-t border-base-300 bg-base-100 px-4 py-2 text-center text-xs text-base-content/70">
          Scroll to zoom · Drag to pan · Press 0 to reset · Esc to close
        </div>
      </div>
    </div>
  );
}

function ZoomableImage({ src, alt, label }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="group relative cursor-pointer overflow-hidden rounded-xl bg-white"
        onClick={() => setOpen(true)}
      >
        <span className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Click to zoom
        </span>

        <img
          src={src}
          alt={alt || label}
          className="w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />

        {label && (
          <div className="border-t border-base-300 bg-base-100 px-4 py-3 text-center text-sm font-medium text-base-content/70">
            {label}
          </div>
        )}
      </div>

      {open && (
        <InlineImageModal
          src={src}
          alt={label || alt}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default ZoomableImage;