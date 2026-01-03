import React, { useEffect, useState } from "react";

export default function DateTimeDisplay({ compact = false }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`text-right ${compact ? "text-sm" : "text-base"}`}>
      <div className="font-mono font-semibold text-base-content">
        {now.toLocaleTimeString()}
      </div>
      <div className="text-base-content/60">
        {now.toLocaleDateString(undefined, {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
