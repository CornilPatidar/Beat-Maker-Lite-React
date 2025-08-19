import React, { useState } from "react";
import Controls from "./components/Controls.jsx";
import SequencerGrid from "./components/SequencerGrid.jsx";
import "./App.css";

// helper to build an empty 16-step row
const emptyRow = () => Array(16).fill(0);

export default function App() {
  const [tracks, setTracks] = useState([
    { id: "kick",  label: "Kick",  steps: emptyRow(), volume: 75, pitch: 50 },
    { id: "snare", label: "Snare", steps: emptyRow(), volume: 75, pitch: 50 },
    { id: "Open hat",   label: "Open hat",   steps: emptyRow(), volume: 75, pitch: 50 },
    { id: "Closed hat",   label: "Closed hat",   steps: emptyRow(), volume: 75, pitch: 50 },
  ]);

  const [isPlaying, setIsPlaying] = useState(false); // UI only for now
  const [bpm, setBpm] = useState(120);
  const [currentStep] = useState(-1); // when you add audio, drive this from the Transport

  const onToggleStep = (rowIndex, stepIndex) => {
    setTracks(prev => {
      const next = prev.map(t => ({ ...t, steps: [...t.steps] }));
      next[rowIndex].steps[stepIndex] = next[rowIndex].steps[stepIndex] ? 0 : 1;
      return next;
    });
  };

  const onVolumeChange = (rowIndex, volume) => {
    setTracks(prev => {
      const next = [...prev];
      next[rowIndex] = { ...next[rowIndex], volume };
      return next;
    });
  };

  const onPitchChange = (rowIndex, pitch) => {
    setTracks(prev => {
      const next = [...prev];
      next[rowIndex] = { ...next[rowIndex], pitch };
      return next;
    });
  };

  const onClear = () => {
    setTracks(prev => prev.map(t => ({ ...t, steps: emptyRow() })));
  };

  const onRandomize = () => {
    setTracks(prev =>
      prev.map(t => ({
        ...t,
        steps: t.steps.map(() => (Math.random() < 0.25 ? 1 : 0)), // ~25% fill
      }))
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Drum Machine (UI Prototype)</h1>

        <Controls
          isPlaying={isPlaying}
          bpm={bpm}
          onTogglePlay={() => setIsPlaying(p => !p)}
          onBpmChange={setBpm}
          onClear={onClear}
          onRandomize={onRandomize}
        />

        <SequencerGrid
          tracks={tracks}
          onToggleStep={onToggleStep}
          onVolumeChange={onVolumeChange}
          onPitchChange={onPitchChange}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}
