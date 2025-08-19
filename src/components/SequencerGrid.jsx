import React, { useRef, useState, useEffect } from "react";
import TrackRow from "./TrackRow.jsx";
import { COLS, GAP, MIN_STEP, MAX_STEP, LABEL_W, SLIDER_PANEL_W } from "./constants.js";

export default function SequencerGrid({
  tracks,
  onToggleStep,
  onVolumeChange,
  onPitchChange,
  currentStep = -1,
}) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [stepPx, setStepPx] = useState(MAX_STEP);

  // Track container width for responsive sizing
  useEffect(() => {
    if (!containerRef.current) return;

    const ro = new ResizeObserver(() => {
      const width = containerRef.current.clientWidth;
      setContainerWidth(width);

      // Calculate step size for header/footer markers
      const availableForGrid = width - LABEL_W - SLIDER_PANEL_W - 48;
      const step = (availableForGrid - GAP * (COLS - 1)) / COLS;
      const clamped = Math.max(MIN_STEP, Math.min(MAX_STEP, Math.floor(step)));
      setStepPx(clamped);
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // CSS variables for header/footer markers
  const gridVars = {
    "--step": `${stepPx}px`,
    "--gap": `${GAP}px`,
    "--gridw": `calc(var(--step) * ${COLS} + var(--gap) * ${COLS - 1})`,
  };

  return (
    <div
      ref={containerRef}
      className="p-4 bg-neutral-900 rounded-xl border border-neutral-800"
      style={{ overflowX: "hidden" }}
    >
      {/* Top group markers 1..4 (each spans 4 steps) */}
      <div className="flex items-center mb-1">
        <div style={{ width: LABEL_W }} className="mr-4" />
        <div
          className="mr-6 shrink-0"
          style={{
            ...gridVars,
            width: "var(--gridw)",
            display: "flex",
            gap: "var(--gap)",
            textAlign: "center",
            // Ensure grid stability - no centering that could cause shifts
            flexWrap: "nowrap",
          }}
        >
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="text-xs text-teal-400 select-none"
              style={{ 
                width: `calc(var(--step) * 4 + var(--gap) * 3)`,
                flexShrink: 0,
                textAlign: "center"
              }}
            >
              {n}
            </div>
          ))}
        </div>
        {/* Right panel headers */}
        <div className="flex gap-6" style={{ width: SLIDER_PANEL_W }}>
          <div className="w-24 text-center text-xs text-gray-400">Volume</div>
          <div className="w-24 text-center text-xs text-gray-400">Pitch</div>
        </div>
      </div>

      {/* Rows */}
      {tracks.map((t, i) => (
        <TrackRow
          key={t.id}
          label={t.label}
          rowIndex={i}
          steps={t.steps}
          volume={t.volume}
          pitch={t.pitch}
          currentStep={currentStep}
          onToggleStep={onToggleStep}
          onVolumeChange={onVolumeChange}
          onPitchChange={onPitchChange}
          containerWidth={containerWidth}
        />
      ))}

      {/* Bottom 1..16 markers */}
      <div className="flex items-center mt-1">
        <div style={{ width: LABEL_W }} className="mr-4" />
        <div
          className="mr-6 shrink-0"
          style={{
            ...gridVars,
            width: "var(--gridw)",
            display: "flex",
            gap: "var(--gap)",
            textAlign: "center",
            // Ensure grid stability - no centering that could cause shifts
            flexWrap: "nowrap",
          }}
        >
          {Array.from({ length: COLS }, (_, i) => (
            <div 
              key={i} 
              className="text-xs text-teal-400 select-none pt-1"
              style={{
                width: "var(--step)",
                flexShrink: 0,
                textAlign: "center"
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div style={{ width: SLIDER_PANEL_W }} />
      </div>
    </div>
  );
}
