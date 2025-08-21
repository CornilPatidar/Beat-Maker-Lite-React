import React, { useEffect, useState } from "react";
import { COLS, GAP, MIN_STEP, MAX_STEP, LABEL_W, SLIDER_PANEL_W, COLORS } from "./constants.js";
import { useTheme } from "./ThemeContext.jsx";
import Knob from "./Knob.jsx";

/**
 * Row uses CSS vars from parent:
 * --step  : square size
 * --gap   : gap size
 * --gridw : computed grid width
 */
function TrackRow({
  label,
  rowIndex,
  steps,
  volume,
  pitch,
  currentStep = -1,
  onToggleStep,
  onVolumeChange,
  onPitchChange,
  containerWidth,
}) {
  const { currentTheme, themes } = useTheme();
  const currentThemeData = themes[currentTheme];
  const [stepPx, setStepPx] = useState(MAX_STEP);

  // Compute square size so the 16 columns + gaps fit without scrolling
  useEffect(() => {
    if (!containerWidth) return;

    // space left for the grid after label + sliders + margins
    const availableForGrid = containerWidth - LABEL_W - SLIDER_PANEL_W - 48; // ~margins/gaps
    const step = (availableForGrid - GAP * (COLS - 1)) / COLS;

    const clamped = Math.max(MIN_STEP, Math.min(MAX_STEP, Math.floor(step)));
    // Ensure we always use the same step size to prevent layout shifts
    setStepPx(clamped);
  }, [containerWidth]);

  // CSS variables for this row
  const gridVars = {
    "--step": `${stepPx}px`,
    "--gap": `${GAP}px`,
    "--gridw": `calc(var(--step) * ${COLS} + var(--gap) * ${COLS - 1})`,
  };

  return (
    <div className="flex items-center mb-2 min-w-max">
      {/* Left label */}
      <div
        className="text-right text-xs sm:text-sm font-medium text-white mr-2 sm:mr-4"
        style={{ width: LABEL_W }}
      >
        {label}
      </div>

      {/* 16-step grid */}
      <div
        className="mr-4 sm:mr-6 shrink-0"
        style={{
          ...gridVars,
          width: "var(--gridw)",
          display: "flex",
          gap: "var(--gap)",
          // Ensure grid stability - no centering that could cause shifts
          flexWrap: "nowrap",
          // Force stable positioning
          position: "relative",
        }}
      >
        {steps.map((active, stepIndex) => {
        const isPlayhead = currentStep === stepIndex;
        const beatGroup = Math.floor(stepIndex / 4);
        const isGroupB = beatGroup % 2 === 1;

        // Use theme colors for tiles
        const bg = active ? currentThemeData.sliderThumb : (isGroupB ? "#8f8d8d" : "#F8FAFC");
        const borderColor = currentThemeData.sliderThumbBorder;
        const playheadColor = currentThemeData.sliderThumb;

        const style = {
            width: "var(--step)",
            height: "var(--step)",   // true square
            borderRadius: 4,         // small, not pill
            border: `1px solid ${borderColor}`,
            backgroundColor: bg,
            transition: "background .12s, outline .12s",
            cursor: "pointer",
            // Ensure consistent box model to prevent layout shifts
            boxSizing: "border-box",
            // Use outline instead of box-shadow to prevent layout shifts
            outline: isPlayhead ? `2px solid ${playheadColor}` : "none",
            outlineOffset: "-2px",
            // Prevent any layout shifts
            margin: 0,
            padding: 0,
            display: "block",
            flexShrink: 0,
            // keep it flat; no heavy shadows
        };

        return (
            <button
            key={`${rowIndex}-${stepIndex}`}
            onClick={() => onToggleStep(rowIndex, stepIndex)}
            style={style}
            onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "#EEF2F7";
            }}
            onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = bg;
            }}
            type="button"
            />
        );
        })}

      </div>

      {/* Knobs panel */}
      <div className="flex gap-4 sm:gap-8 items-center" style={{ width: SLIDER_PANEL_W }}>
        <Knob
          value={volume}
          onChange={(value) => onVolumeChange(rowIndex, value)}
          label="Volume"
          size={32}
        />
        <Knob
          value={pitch}
          onChange={(value) => onPitchChange(rowIndex, value)}
          label="Pitch"
          size={32}
        />
      </div>
    </div>
  );
}

export default TrackRow;
