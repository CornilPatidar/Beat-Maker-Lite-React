import React, { useState, useEffect, useRef } from "react";
import Controls from "./components/Controls.jsx";
import SequencerGrid from "./components/SequencerGrid.jsx";
import audioManager from "./components/AudioManager.js";
import "./App.css";

// helper to build an empty 16-step row
const emptyRow = () => Array(16).fill(0);

export default function App() {
  const [tracks, setTracks] = useState([
    { id: "kick",  label: "Kick",  steps: emptyRow(), volume: 75, pitch: 50 },
    { id: "snare", label: "Snare", steps: emptyRow(), volume: 75, pitch: 50 },
    { id: "openhat",   label: "Open hat",   steps: emptyRow(), volume: 75, pitch: 50 },
    { id: "closedhat",   label: "Closed hat",   steps: emptyRow(), volume: 75, pitch: 50 },
    { id: "cowbell",   label: "Cowbell",   steps: emptyRow(), volume: 75, pitch: 50 },
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(-1);
  const intervalRef = useRef(null);
  const bpmRef = useRef(bpm);
  
  // Kit and Demos state
  const [selectedKit, setSelectedKit] = useState("kit1");
  const [selectedDemo, setSelectedDemo] = useState("No Demo");

  // Kit options
  const kitOptions = ["kit1", "kit2", "kit3", "kit4"];
  
  // Demo options
  const demoOptions = ["No Demo", "Demo 1", "Demo 2", "Demo 3", "Demo 4", "Demo 5"];

  // Initialize audio manager
  useEffect(() => {
    audioManager.init();
  }, []);

  // Load kit sounds when kit changes
  useEffect(() => {
    audioManager.loadKit(selectedKit);
  }, [selectedKit]);

  // Update BPM ref when BPM changes
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  // Sequencer logic with audio playback
  useEffect(() => {
    if (isPlaying) {
      const stepInterval = (60 / bpmRef.current) * 1000 / 4; // 16th note timing
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          const currentStep = next >= 16 ? 0 : next;
          
          // Play sounds for active steps
          tracks.forEach((track, trackIndex) => {
            if (track.steps[currentStep]) {
              // Map track IDs to sound names
              let soundName;
              switch (track.id) {
                case 'kick':
                  soundName = 'kick';
                  break;
                case 'snare':
                  soundName = 'snare';
                  break;
                case 'openhat':
                  soundName = 'open-hat';
                  break;
                case 'closedhat':
                  soundName = 'closed-hat';
                  break;
                case 'cowbell':
                  soundName = 'cowbell';
                  break;
                default:
                  soundName = track.id.toLowerCase().replace(' ', '-');
              }
              const volume = track.volume / 100;
              const pitch = 0.5 + (track.pitch / 100) * 1.5; // Pitch range: 0.5 to 2.0
              audioManager.playSound(soundName, volume, pitch);
            }
          });
          
          return currentStep;
        });
      }, stepInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentStep(-1);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, tracks]); // Add tracks to dependencies

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
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #0a0a0a 100%)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}
    >
      {/* Main Card Container */}
      <div className="w-full max-w-6xl bg-neutral-900/95 backdrop-blur-sm rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-800/90 border-b border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-cyan-400">Beat Maker Lite</h1>
              <span className="text-sm text-gray-400">Online Drum Machine</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">by React Developer</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Controls
            isPlaying={isPlaying}
            bpm={bpm}
            onTogglePlay={() => setIsPlaying(p => !p)}
            onBpmChange={setBpm}
            onClear={onClear}
            onRandomize={onRandomize}
            selectedKit={selectedKit}
            selectedDemo={selectedDemo}
            onKitChange={setSelectedKit}
            onDemoChange={setSelectedDemo}
            kitOptions={kitOptions}
            demoOptions={demoOptions}
          />

          <SequencerGrid
            tracks={tracks}
            onToggleStep={onToggleStep}
            onVolumeChange={onVolumeChange}
            onPitchChange={onPitchChange}
            currentStep={currentStep}
          />
        </div>

        {/* Footer */}
        <div className="bg-neutral-800/90 border-t border-neutral-700 p-4">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <span>© 2025 Beat Maker Lite</span>
            <span>•</span>
            <span>React Drum Machine</span>
            <span>•</span>
            <span>Made with ❤️</span>
          </div>
        </div>
      </div>
    </div>
  );
}
