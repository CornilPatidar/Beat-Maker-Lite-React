import React, { useState, useRef, useEffect } from "react";
import toneAudioManager from "./ToneAudioManager.js";
import { useTheme } from "./ThemeContext.jsx";

/**
 * Controls Component - The transport/control panel for the drum machine
 * 
 * This component renders the main control buttons and settings:
 * - Play/Stop button
 * - BPM (tempo) spin buttons
 * - Kit and Demos selection
 * - Clear and Randomize buttons
 */
function Controls({
  isPlaying,        // Boolean: whether the sequencer is currently playing
  bpm,              // Number: current beats per minute (tempo)
  onTogglePlay,     // Function: called when play/stop button is clicked
  onBpmChange,      // Function: called when BPM is changed
  onClear,          // Function: called when clear button is clicked
  onRandomize,      // Function: called when randomize button is clicked
  selectedKit,      // String: currently selected kit
  selectedDemo,     // String: currently selected demo
  onKitChange,      // Function: called when kit selection changes
  onDemoChange,     // Function: called when demo selection changes
  kitOptions,       // Array: available kit options
  demoOptions,      // Array: available demo options
}) {
  const { currentTheme, themes } = useTheme();
  const currentThemeData = themes[currentTheme];

  const handleBpmIncrement = () => {
    if (bpm < 240) {
      onBpmChange(bpm + 1);
    }
  };

  const handleBpmDecrement = () => {
    if (bpm > 40) {
      onBpmChange(bpm - 1);
    }
  };

  const [inputValue, setInputValue] = useState(bpm.toString());
  const inputRef = useRef(null);

  // Update input value when bpm prop changes (from external sources like buttons)
  useEffect(() => {
    setInputValue(bpm.toString());
  }, [bpm]);

  const handleBpmInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleBpmInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (!isNaN(numValue) && numValue >= 40 && numValue <= 240) {
      onBpmChange(numValue);
    } else {
      // Reset to current bpm if invalid
      setInputValue(bpm.toString());
    }
  };

  const handleBpmInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const handleTogglePlay = () => {
    // Initialize Tone.js on first play (required by browsers)
    toneAudioManager.init();
    onTogglePlay();
  };

  return (
    // Main container: responsive layout with dark styling
    <div className={`flex flex-col sm:flex-row items-center gap-3 p-3 sm:p-4 ${currentThemeData.headerBg} rounded-xl border ${currentThemeData.borderColor} mb-6`}>
      {/* Top row for mobile: Play button and BPM */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Play/Stop Button - Changes text based on current state */}
        <button
          onClick={handleTogglePlay}
          className={`px-4 py-2 rounded-md ${currentThemeData.buttonBg} ${currentThemeData.buttonHover} text-white font-semibold transition-colors flex-1 sm:flex-none`}
        >
          {/* Conditional text: Show "Stop" when playing, "Play" when stopped */}
          {isPlaying ? "Stop" : "Play"}
        </button>

        {/* BPM Control Section - Tempo adjustment with spin buttons */}
        <div className="flex items-center gap-2">
          {/* Label for the BPM control */}
          <span className="text-xs sm:text-sm text-white hidden sm:inline">Tempo</span>
          
          {/* Spin button container */}
          <div className={`flex items-center border ${currentThemeData.borderColor} rounded-md bg-neutral-700`}>
            {/* Decrement button */}
            <button
              onClick={handleBpmDecrement}
              disabled={bpm <= 40}
              className="px-2 py-1 text-white hover:text-white hover:bg-neutral-600 disabled:text-gray-500 disabled:hover:bg-neutral-700 transition-colors"
              title="Decrease tempo"
            >
              ▼
            </button>
            
            {/* BPM input field */}
            <input
              ref={inputRef}
              type="number"
              min={40}
              max={240}
              value={inputValue}
              onChange={handleBpmInputChange}
              onBlur={handleBpmInputBlur}
              onKeyDown={handleBpmInputKeyDown}
              className="w-12 sm:w-16 px-2 py-1 text-center text-white bg-transparent border-none outline-none text-sm"
              title="Tempo (40-240 BPM)"
            />
            
            {/* Increment button */}
            <button
              onClick={handleBpmIncrement}
              disabled={bpm >= 240}
              className="px-2 py-1 text-white hover:text-white hover:bg-neutral-600 disabled:text-gray-500 disabled:hover:bg-neutral-700 transition-colors"
              title="Increase tempo"
            >
              ▲
            </button>
          </div>
          
          {/* BPM label */}
          <span className="text-xs sm:text-sm text-white">BPM</span>
        </div>
      </div>

      {/* Second row for mobile: Kit and Demos */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Kit Selection */}
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <span className="text-xs sm:text-sm text-white">Kit</span>
          <select
            value={selectedKit}
            onChange={(e) => onKitChange(e.target.value)}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-white bg-neutral-700 border border-neutral-600 rounded-md outline-none focus:border-cyan-400 flex-1 sm:flex-none"
          >
            {kitOptions.map((option) => (
              <option 
                key={option} 
                value={option} 
                disabled={option === "Coming Soon"}
                className={`bg-neutral-700 ${option === "Coming Soon" ? "text-gray-500" : "text-gray-300"}`}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Demos Selection */}
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <span className="text-xs sm:text-sm text-white">Demos</span>
          <select
            value={selectedDemo}
            onChange={(e) => onDemoChange(e.target.value)}
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-white bg-neutral-700 border border-neutral-600 rounded-md outline-none focus:border-cyan-400 flex-1 sm:flex-none"
          >
            {demoOptions.map((option) => (
              <option key={option} value={option} className="bg-neutral-700 text-gray-300">
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Third row for mobile: Volume and Action buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Master Volume Control */}
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <span className="text-xs sm:text-sm text-white hidden sm:inline">Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="70"
            onChange={(e) => toneAudioManager.setMasterVolume(e.target.value / 100)}
            className="w-full sm:w-20"
            title="Master Volume"
          />
        </div>

        {/* Clear Button - Removes all drum hits from all tracks */}
        <button
          onClick={onClear}
          className="px-2 sm:px-3 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 transition-colors text-xs sm:text-sm"
        >
          Clear
        </button>
        
        {/* Randomize Button - Adds random drum hits to create patterns */}
        <button
          onClick={onRandomize}
          className="px-2 sm:px-3 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 transition-colors text-xs sm:text-sm"
        >
          Randomize
        </button>
      </div>
    </div>
  );
}

export default Controls;