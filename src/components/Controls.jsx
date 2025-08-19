import React from "react";

/**
 * Controls Component - The transport/control panel for the drum machine
 * 
 * This component renders the main control buttons and settings:
 * - Play/Stop button
 * - BPM (tempo) slider
 * - Clear and Randomize buttons
 */
function Controls({
  isPlaying,        // Boolean: whether the sequencer is currently playing
  bpm,              // Number: current beats per minute (tempo)
  onTogglePlay,     // Function: called when play/stop button is clicked
  onBpmChange,      // Function: called when BPM slider is moved
  onClear,          // Function: called when clear button is clicked
  onRandomize,      // Function: called when randomize button is clicked
}) {
  return (
    // Main container: horizontal layout with dark styling
    <div className="flex items-center gap-3 p-4 bg-neutral-900 rounded-xl border border-neutral-800 mb-4">
      {/* Play/Stop Button - Changes text based on current state */}
      <button
        onClick={onTogglePlay}
        className="px-4 py-2 rounded-md bg-cyan-500 text-black font-semibold"
      >
        {/* Conditional text: Show "Stop" when playing, "Play" when stopped */}
        {isPlaying ? "Stop" : "Play"}
      </button>

      {/* BPM Control Section - Tempo adjustment */}
      <div className="flex items-center gap-2">
        {/* Label for the BPM control */}
        <span className="text-sm text-gray-300">BPM</span>
        
        {/* Range slider: 60-180 BPM (typical music tempo range) */}
        <input
          type="range"
          min={60}            // Minimum tempo (slow)
          max={180}           // Maximum tempo (fast)
          value={bpm}         // Current BPM value
          onChange={(e) => onBpmChange(Number(e.target.value))} // Convert string to number
        />
        
        {/* Display current BPM value */}
        <span className="w-10 text-sm text-gray-300 text-right">{bpm}</span>
      </div>

      {/* Clear Button - Removes all drum hits from all tracks */}
      <button
        onClick={onClear}
        className="px-3 py-2 rounded-md bg-neutral-800 text-black border border-neutral-700"
      >
        Clear
      </button>
      
      {/* Randomize Button - Adds random drum hits to create patterns */}
      <button
        onClick={onRandomize}
        className="px-3 py-2 rounded-md bg-neutral-800 text-black border border-neutral-700"
      >
        Randomize
      </button>
    </div>
  );
}

export default Controls;