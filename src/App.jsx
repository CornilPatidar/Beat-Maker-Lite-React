import React, { useState, useEffect, useRef } from "react";
import Controls from "./components/Controls.jsx";
import SequencerGrid from "./components/SequencerGrid.jsx";
import audioManager from "./components/AudioManager.js";
import ThemeSelector from "./components/ThemeSelector.jsx";
import { useTheme } from "./components/ThemeContext.jsx";
import { useSliderTheme } from "./components/useSliderTheme.js";
import "./App.css";

// helper to build an empty 16-step row
const emptyRow = () => Array(16).fill(0);

export default function App() {
  const { currentTheme, themes } = useTheme();
  const currentThemeData = themes[currentTheme];
  useSliderTheme(); // Apply dynamic slider styling
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
  const demoOptions = ["No Demo", "Hip-Hop", "Groove", "EDM", "Boom-Bap", "Afrobeat", "West Coast Bounce", "Lo-Fi Chill"];

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

  // Professional drum patterns for randomization
  const professionalPatterns = [
    // Hip-Hop Patterns
    {
      name: "Classic Hip-Hop",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], volume: 75, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 70, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    {
      name: "Trap Style",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], volume: 80, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 65, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    // EDM Patterns
    {
      name: "Four on the Floor",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], volume: 80, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], volume: 70, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 65, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    {
      name: "Progressive House",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 70, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 60, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    // Funk Patterns
    {
      name: "Funky Groove",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 70, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0], volume: 80, pitch: 50 },
      ]
    },
    {
      name: "James Brown Style",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 65, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    // Latin Patterns
    {
      name: "Salsa Groove",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 70, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0], volume: 80, pitch: 50 },
      ]
    },
    {
      name: "Bossa Nova",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], volume: 70, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 70, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 65, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    // Rock Patterns
    {
      name: "Rock Beat",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], volume: 80, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 70, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    {
      name: "Punk Rock",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], volume: 85, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 80, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 75, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    // Jazz Patterns
    {
      name: "Jazz Ride",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], volume: 70, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 70, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 65, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    // Reggae Patterns
    {
      name: "Reggae One Drop",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 70, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    // Breakbeat Patterns
    {
      name: "Breakbeat",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 70, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    // Minimal Patterns
    {
      name: "Minimal Techno",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0], volume: 70, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 65, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    },
    // Complex Patterns
    {
      name: "Complex Groove",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 70, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0], volume: 80, pitch: 50 },
      ]
    },
    // Experimental Patterns
    {
      name: "Polyrhythm",
      tracks: [
        { id: "kick", label: "Kick", steps: [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1], volume: 75, pitch: 50 },
        { id: "snare", label: "Snare", steps: [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0], volume: 75, pitch: 50 },
        { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
        { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 70, pitch: 50 },
        { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
      ]
    }
  ];

  const onRandomize = () => {
    // Select a random professional pattern
    const randomPattern = professionalPatterns[Math.floor(Math.random() * professionalPatterns.length)];
    
    // Apply the pattern with some randomization for variety
    setTracks(prev => prev.map((track, index) => {
      const patternTrack = randomPattern.tracks[index];
      if (!patternTrack) return track;
      
      // Add some randomization to the pattern (10% chance to flip each step)
      const randomizedSteps = patternTrack.steps.map(step => 
        Math.random() < 0.1 ? (step === 1 ? 0 : 1) : step
      );
      
      return {
        ...track,
        steps: randomizedSteps,
        volume: patternTrack.volume + (Math.random() * 10 - 5), // ±5 volume variation
        pitch: patternTrack.pitch + (Math.random() * 10 - 5)    // ±5 pitch variation
      };
    }));
  };

  // Demo patterns
  const loadDemo = (demoName) => {
    switch (demoName) {
      case "Hip-Hop":
        // Hip-Hop pattern
        // Kick: steps 1, 7, 11 (indices 0, 6, 10)
        // Snare: steps 5, 13 (indices 4, 12)
        // Hi-Hats: every step with variation
        setTracks([
          { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], volume: 75, pitch: 50 },
          { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
          { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
          { id: "closedhat", label: "Closed hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 70, pitch: 50 },
          { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
        ]);
        break;
      case "Groove":
        // Groove pattern
        // Kick: steps 1, 9 (indices 0, 8)
        // Snare: steps 5, 13 (indices 4, 12)
        // Cowbell: steps 1, 4, 7, 11, 15 (indices 0, 3, 6, 10, 14)
        // Closed Hat: steps 3, 6, 10, 14 (indices 2, 5, 9, 13)
        setTracks([
          { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
          { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
          { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 60, pitch: 50 },
          { id: "closedhat", label: "Closed hat", steps: [0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0], volume: 70, pitch: 50 },
          { id: "cowbell", label: "Cowbell", steps: [1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0], volume: 75, pitch: 50 },
        ]);
        break;
      case "EDM":
        // EDM pattern
        // Kick: steps 1, 5, 9, 13 (indices 0, 4, 8, 12)
        // Snare/Clap: steps 5, 13 (indices 4, 12)
        // Open Hat: steps 3, 7, 11, 15 (indices 2, 6, 10, 14)
        // Closed Hat: every offbeat (2, 4, 6, 8, 10, 12, 14, 16) (indices 1, 3, 5, 7, 9, 11, 13, 15)
        setTracks([
          { id: "kick", label: "Kick", steps: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], volume: 80, pitch: 50 },
          { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
          { id: "openhat", label: "Open hat", steps: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], volume: 70, pitch: 50 },
          { id: "closedhat", label: "Closed hat", steps: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], volume: 65, pitch: 50 },
          { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
        ]);
        break;
      case "Boom-Bap":
        // Boom-Bap pattern
        // Kick: steps 1, 7, 11 (indices 0, 6, 10)
        // Snare: steps 5, 13 (indices 4, 12)
        // Open Hat: step 12 (index 11)
        // Closed Hat: steps 2,3,4,5,6,7,8,10,12,13,16 (indices 1,2,3,4,5,6,7,9,11,12,15)
        setTracks([
          { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0], volume: 75, pitch: 50 },
          { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
          { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0], volume: 70, pitch: 50 },
          { id: "closedhat", label: "Closed hat", steps: [0,1,1,1,1,1,1,1,0,1,0,1,1,0,0,1], volume: 65, pitch: 50 },
          { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
        ]);
        break;
      case "Afrobeat":
        // Afrobeat pattern
        // Kick: steps 1, 4, 7, 11, 14 (indices 0, 3, 6, 10, 13)
        // Snare: steps 5, 13 (indices 4, 12)
        // Closed Hat: steps 2, 6, 10, 12, 16 (indices 1, 5, 9, 11, 15)
        // Open Hat: steps 8, 15 (indices 7, 14)
        // Cowbell: steps 1, 5, 11 (indices 0, 4, 10)
        setTracks([
          { id: "kick", label: "Kick", steps: [1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0], volume: 75, pitch: 50 },
          { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
          { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0], volume: 70, pitch: 50 },
          { id: "closedhat", label: "Closed hat", steps: [0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,1], volume: 65, pitch: 50 },
          { id: "cowbell", label: "Cowbell", steps: [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0], volume: 80, pitch: 50 },
        ]);
        break;
      case "West Coast Bounce":
        // West Coast Bounce pattern
        // Tempo: 120 BPM
        // Kick: steps 1, 8, 11, 15 (indices 0, 7, 10, 14)
        // Snare: steps 5, 13 (indices 4, 12)
        // Closed Hat: steps 3, 7, 11, 15 (indices 2, 6, 10, 14)
        // Open Hat: steps 4, 12 (indices 3, 11)
        setBpm(120); // Set tempo to 120 BPM
        setTracks([
          { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0], volume: 75, pitch: 50 },
          { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 75, pitch: 50 },
          { id: "openhat", label: "Open hat", steps: [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0], volume: 70, pitch: 50 },
          { id: "closedhat", label: "Closed hat", steps: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0], volume: 65, pitch: 50 },
          { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
        ]);
        break;
      case "Lo-Fi Chill":
        // Lo-Fi Chill pattern
        // Tempo: 75 BPM
        // Kick: steps 1, 11 (indices 0, 10)
        // Snare: steps 5, 13 (indices 4, 12)
        // Closed Hat: steps 2, 6, 10, 14 (indices 1, 5, 9, 13)
        // Open Hat: step 12 (index 11)
        setBpm(75); // Set tempo to 75 BPM
        setTracks([
          { id: "kick", label: "Kick", steps: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0], volume: 70, pitch: 50 },
          { id: "snare", label: "Snare", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], volume: 65, pitch: 50 },
          { id: "openhat", label: "Open hat", steps: [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0], volume: 60, pitch: 50 },
          { id: "closedhat", label: "Closed hat", steps: [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0], volume: 55, pitch: 50 },
          { id: "cowbell", label: "Cowbell", steps: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], volume: 75, pitch: 50 },
        ]);
        break;
      default:
        // Clear pattern
        setTracks(prev => prev.map(t => ({ ...t, steps: emptyRow() })));
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        background: currentThemeData.background,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}
    >
      {/* Main Card Container */}
      <div className={`w-full max-w-6xl ${currentThemeData.cardBg} backdrop-blur-sm rounded-2xl border ${currentThemeData.borderColor} shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className={`${currentThemeData.headerBg} border-b ${currentThemeData.borderColor} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <h1 className={`text-4xl beat-maker-title flex-shrink-0`} data-theme={currentTheme}>Beat Maker Lite</h1>
              <span className={`text-sm ${currentThemeData.textSecondary} flex-shrink-0`}>Online Drum Machine</span>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <ThemeSelector />
              <div className={`text-sm ${currentThemeData.textSecondary} hidden sm:block`}>by Cornil Patidar</div>
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
            onDemoChange={(demo) => {
              setSelectedDemo(demo);
              loadDemo(demo);
            }}
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
        <div className={`${currentThemeData.headerBg} border-t ${currentThemeData.borderColor} p-4`}>
          <div className={`flex items-center justify-center gap-6 text-sm ${currentThemeData.textSecondary}`}>
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
