import React, { useRef, useState, useEffect } from "react";
import TrackRow from "./TrackRow.jsx";
import { COLS, GAP, MIN_STEP, MAX_STEP, LABEL_W, SLIDER_PANEL_W } from "./constants.js";
import { useTheme } from "./ThemeContext.jsx";

export default function SequencerGrid({
  tracks,
  onToggleStep,
  onVolumeChange,
  onPitchChange,
  currentStep = -1,
}) {
  const { currentTheme, themes } = useTheme();
  const currentThemeData = themes[currentTheme];
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
      className={`p-2 sm:p-4 ${currentThemeData.headerBg} rounded-xl border ${currentThemeData.borderColor}`}
      style={{ overflowX: "auto" }}
    >
      {/* Top group markers 1..4 (each spans 4 steps) */}
      <div className="flex items-center mb-1 min-w-max">
        <div style={{ width: LABEL_W }} className="mr-2 sm:mr-4" />
        <div
          className="mr-4 sm:mr-6 shrink-0"
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
          {[1, 2, 3, 4].map((n) => {
            const groupStart = (n - 1) * 4;
            const groupEnd = groupStart + 3;
            const isActive = currentStep >= groupStart && currentStep <= groupEnd;
            
            return (
              <div
                key={n}
                className="text-xs select-none rounded"
                style={{ 
                  width: `calc(var(--step) * 4 + var(--gap) * 3)`,
                  height: "var(--step)",
                  flexShrink: 0,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isActive ? "#1e1e1e" : "transparent",
                  color: isActive ? "#ffffff" : currentThemeData.sliderThumb,
                  transition: "background-color 0.12s, color 0.12s"
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        {/* Right panel headers */}
        <div className="flex gap-4 sm:gap-6" style={{ width: SLIDER_PANEL_W }}>
          <div className="w-20 sm:w-24 text-center text-xs text-white">Volume</div>
          <div className="w-20 sm:w-24 text-center text-xs text-white">Pitch</div>
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
      <div className="flex items-center mt-1 min-w-max">
        <div style={{ width: LABEL_W }} className="mr-2 sm:mr-4" />
        <div
          className="mr-4 sm:mr-6 shrink-0"
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
          {Array.from({ length: COLS }, (_, i) => {
            const isActive = currentStep === i;
            return (
              <div 
                key={i} 
                className="text-xs select-none pt-1 rounded"
                style={{
                  width: "var(--step)",
                  height: "var(--step)",
                  flexShrink: 0,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isActive ? "#1e1e1e" : "transparent",
                  color: isActive ? "#ffffff" : currentThemeData.sliderThumb,
                  transition: "background-color 0.12s, color 0.12s"
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <div style={{ width: SLIDER_PANEL_W }} />
      </div>
    </div>
  );
}
