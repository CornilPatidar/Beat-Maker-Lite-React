import React, { useState, useRef, useEffect } from "react";
import knobImage from "../assets/knob.png";

function Knob({
  value = 50,
  min = 0,
  max = 100,
  onChange = () => {},
  size = 40,
  label = "Knob",
}) {
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ y: 0, x: 0, value: 0 });
  const rafRef = useRef(0);

  const clamp = (v) => Math.min(max, Math.max(min, v));

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { y: e.clientY, x: e.clientX, value };
    setDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;

    const { y, value: startValue } = startRef.current;
    const dy = y - e.clientY; // move up -> increase
    // Tune this: how many pixels to span the whole range
    const pixelsForFullRange = 150;
    const perPixel = (max - min) / pixelsForFullRange;
    const next = clamp(startValue + dy * perPixel);

    // throttle with rAF to avoid spamming state
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => onChange(Math.round(next)));
  };

  const handlePointerUp = (e) => {
    setDragging(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };

  // (Optional) mouse wheel fine adjust
  const handleWheel = (e) => {
    e.preventDefault();
    const step = Math.max(1, Math.round((max - min) / 100));
    const dir = e.deltaY > 0 ? -1 : 1;
    onChange(clamp(value + dir * step));
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // 270° sweep centered at -135° -> +135°
  const rotation = ((value - min) / (max - min)) * 270 - 135;

  return (
    <div className="flex items-start gap-2 sm:gap-3 select-none">
      <div className="flex flex-col items-center">
        <div
          style={{ width: size, height: size }}
          className="cursor-pointer"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
        >
          <img
            src={knobImage}
            alt={label}
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              transform: `rotate(${rotation}deg)`,
              transition: dragging ? "none" : "transform 80ms ease-out",
              cursor: dragging ? "grabbing" : "grab",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-start">
        <div className="text-xs text-white font-mono">{value}</div>
        <div className="text-xs text-gray-400 mt-1 hidden sm:block">{label}</div>
      </div>
    </div>
  );
}

export default Knob;
