// Tone.js Audio Manager for Beat Maker Lite
// Enhanced audio system with Tone.js for better timing and effects

import * as Tone from "tone";

class ToneAudioManager {
  constructor() {
    this.players = {};
    this.isInitialized = false;
    this.masterVolume = new Tone.Volume(-10).toDestination();
    this.reverb = new Tone.Reverb(1.5).connect(this.masterVolume);
    this.distortion = new Tone.Distortion(0.3).connect(this.masterVolume);
    this.delay = new Tone.FeedbackDelay("8n", 0.5).connect(this.masterVolume);
    
    // Effects routing
    this.effectsChain = {
      reverb: false,
      distortion: false,
      delay: false
    };
    
    // Transport settings
    this.transport = Tone.getTransport();
    this.transport.bpm.value = 120;
    
    // Sequencer state
    this.sequencer = null;
    this.isPlaying = false;
  }

  // Initialize Tone.js (required for user interaction)
  async init() {
    if (this.isInitialized) return;

    try {
      await Tone.start();
      console.log("Tone.js initialized successfully");
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Tone.js:', error);
    }
  }

  // Load a sound file using Tone.Player (better for drum sounds)
  async loadSound(name, url) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      // Create a player for each drum sound
      this.players[name] = new Tone.Player({
        url: url,
        loop: false,
        autostart: false
      }).connect(this.masterVolume);
      
      // Wait for the sample to load
      await Tone.loaded();
      console.log(`Loaded sound: ${name}`);
    } catch (error) {
      console.error(`Failed to load sound ${name}:`, error);
    }
  }

  // Play a sound with volume and pitch control
  playSound(name, volume = 1.0, pitch = 1.0) {
    if (!this.isInitialized || !this.players[name]) {
      console.warn(`Sound ${name} not loaded`);
      return;
    }

    try {
      const player = this.players[name];
      
      // Set volume and pitch
      player.volume.value = Tone.gainToDb(volume);
      player.playbackRate = pitch;
      
      // Start the sound
      player.start();
    } catch (error) {
      console.error(`Failed to play sound ${name}:`, error);
    }
  }

  // Load all sounds for a kit
  async loadKit(kitName) {
    const kitSounds = {
      'kick': new URL(`../assets/sounds/${kitName}/kick.wav`, import.meta.url).href,
      'snare': new URL(`../assets/sounds/${kitName}/snare.wav`, import.meta.url).href,
      'open-hat': new URL(`../assets/sounds/${kitName}/openhat.wav`, import.meta.url).href,
      'closed-hat': new URL(`../assets/sounds/${kitName}/closedhat.wav`, import.meta.url).href,
      'cowbell': new URL(`../assets/sounds/${kitName}/cowbell.wav`, import.meta.url).href,
    };

    const loadPromises = Object.entries(kitSounds).map(([name, url]) => 
      this.loadSound(name, url)
    );

    await Promise.all(loadPromises);
  }

  // Set master volume
  setMasterVolume(volume) {
    this.masterVolume.volume.value = Tone.gainToDb(volume);
  }

  // Set BPM
  setBPM(bpm) {
    this.transport.bpm.value = bpm;
  }

  // Start the sequencer
  startSequencer(tracks, onStepChange) {
    if (this.sequencer) {
      this.sequencer.dispose();
    }

    this.sequencer = new Tone.Sequence((time, step) => {
      // Play sounds for active steps
      tracks.forEach((track) => {
        if (track.steps[step]) {
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
          
          if (this.players[soundName]) {
            const player = this.players[soundName];
            player.volume.value = Tone.gainToDb(volume);
            player.playbackRate = pitch;
            player.start(time);
          }
        }
      });
      
      // Call the step change callback
      if (onStepChange) {
        onStepChange(step);
      }
    }, Array.from({ length: 16 }, (_, i) => i), "16n");

    this.sequencer.start(0);
    this.transport.start();
    this.isPlaying = true;
  }

  // Stop the sequencer
  stopSequencer() {
    if (this.sequencer) {
      this.sequencer.stop();
      this.sequencer.dispose();
      this.sequencer = null;
    }
    this.transport.stop();
    this.transport.position = 0;
    this.isPlaying = false;
  }

  // Toggle effects
  toggleEffect(effectName, enabled) {
    if (this.effectsChain.hasOwnProperty(effectName)) {
      this.effectsChain[effectName] = enabled;
      
      // Reconnect players based on effects
      Object.values(this.players).forEach(player => {
        player.disconnect();
        
        if (enabled) {
          switch (effectName) {
            case 'reverb':
              player.connect(this.reverb);
              break;
            case 'distortion':
              player.connect(this.distortion);
              break;
            case 'delay':
              player.connect(this.delay);
              break;
          }
        } else {
          player.connect(this.masterVolume);
        }
      });
    }
  }

  // Set effect parameters
  setEffectParameter(effectName, parameter, value) {
    switch (effectName) {
      case 'reverb':
        if (parameter === 'decay') {
          this.reverb.decay = value;
        }
        break;
      case 'distortion':
        if (parameter === 'distortion') {
          this.distortion.distortion = value;
        }
        break;
      case 'delay':
        if (parameter === 'delayTime') {
          this.delay.delayTime = value;
        } else if (parameter === 'feedback') {
          this.delay.feedback.value = value;
        }
        break;
    }
  }

  // Get current transport position
  getCurrentStep() {
    const position = this.transport.position;
    const step = Math.floor(Tone.Time(position).toTicks() / Tone.Time("16n").toTicks()) % 16;
    return step;
  }

  // Clean up resources
  dispose() {
    if (this.sequencer) {
      this.sequencer.dispose();
    }
    Object.values(this.players).forEach(player => player.dispose());
    this.masterVolume.dispose();
    this.reverb.dispose();
    this.distortion.dispose();
    this.delay.dispose();
  }
}

// Create and export a singleton instance
const toneAudioManager = new ToneAudioManager();
export default toneAudioManager;
