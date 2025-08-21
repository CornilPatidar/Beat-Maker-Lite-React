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
    
    // Store current tracks for real-time updates
    this.currentTracks = null;
    this.onStepChangeCallback = null;
    
    // Pre-load players for instant playback
    this.preloadedPlayers = {};
    
    // Visual delay tracking
    this.visualDelay = 0.1; // 0.5 second visual delay
    this.actualStep = -1;
    this.visualStep = -1;
    this.visualUpdateInterval = null;
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
      
      // Create multiple preloaded players for instant playback
      this.preloadedPlayers[name] = [];
      for (let i = 0; i < 4; i++) { // Create 4 preloaded players per sound
        const player = new Tone.Player({
          url: url,
          loop: false,
          autostart: false
        }).connect(this.masterVolume);
        this.preloadedPlayers[name].push(player);
      }
      
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
    
    // Restart visual updates with new BPM if currently playing
    if (this.isPlaying && this.visualUpdateInterval) {
      this.stopVisualUpdates();
      this.startVisualUpdates();
    }
  }

    // Start the sequencer
  startSequencer(tracks, onStepChange) {
     
    if (this.sequencer) {
      this.sequencer.dispose();
    }

    // Store tracks and callback for real-time updates
    this.currentTracks = tracks;
    this.onStepChangeCallback = onStepChange;

    // Optimize transport for low latency
    this.transport.lookAhead = 0.01; // Reduce look-ahead time
    this.transport.swing = 0; // Disable swing for precise timing

    // Reset visual delay tracking
    this.actualStep = -1;
    this.visualStep = -1;
    
    // Clear any existing visual update interval
    if (this.visualUpdateInterval) {
      clearInterval(this.visualUpdateInterval);
    }

    this.sequencer = new Tone.Sequence((time, step) => {
      // Update actual step immediately (for audio timing)
      this.actualStep = step;
      
      // Play sounds for active steps using current tracks
      if (this.currentTracks) {
        this.currentTracks.forEach((track) => {
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
            
            // Use preloaded players for instant playback
            if (this.preloadedPlayers[soundName] && this.preloadedPlayers[soundName].length > 0) {
              // Get the next available preloaded player
              const player = this.preloadedPlayers[soundName].shift();
              
              // Set volume and pitch
              player.volume.value = Tone.gainToDb(volume);
              player.playbackRate = pitch;
              
              // Start immediately without scheduling
              player.start();
              
              // Re-add the player to the end of the queue for reuse
              this.preloadedPlayers[soundName].push(player);
              
              // console.log(`Playing ${soundName} at step ${step}`);
            } else if (this.players[soundName]) {
              // Fallback to regular player if preloaded players aren't available
              const player = this.players[soundName];
              player.volume.value = Tone.gainToDb(volume);
              player.playbackRate = pitch;
              player.start(time);
              // console.log(`Playing ${soundName} at step ${step} (fallback)`);
            } else {
              console.warn(`Player not found for sound: ${soundName}`);
            }
          }
        });
      }
    }, Array.from({ length: 16 }, (_, i) => i), "16n");

    this.sequencer.start(0);
    this.transport.start();
    this.isPlaying = true;
    
    // Start visual update interval with 0.5 second delay
    this.startVisualUpdates();
  }

  // Start visual updates with 0.5 second delay
  startVisualUpdates() {
    // Calculate step duration based on current BPM
    const stepDuration = (60 / this.transport.bpm.value) / 4; // 16th note duration
    const visualDelaySteps = Math.ceil(this.visualDelay / stepDuration);
    
    this.visualUpdateInterval = setInterval(() => {
      if (this.isPlaying && this.actualStep >= 0) {
        // Calculate the visual step with delay
        const delayedStep = (this.actualStep - visualDelaySteps + 16) % 16;
        this.visualStep = delayedStep;
        
        // Call the step change callback with the delayed visual step
        if (this.onStepChangeCallback) {
          this.onStepChangeCallback(this.visualStep);
        }
      }
    }, stepDuration * 1000); // Convert to milliseconds
  }

  // Stop visual updates
  stopVisualUpdates() {
    if (this.visualUpdateInterval) {
      clearInterval(this.visualUpdateInterval);
      this.visualUpdateInterval = null;
    }
  }

  // Update tracks in real-time without restarting sequencer
  updateTracks(tracks) {
    this.currentTracks = tracks;
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
    
    // Stop visual updates
    this.stopVisualUpdates();
    
    // Reset visual step
    this.visualStep = -1;
    this.actualStep = -1;
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

  // Get current visual step (with delay)
  getVisualStep() {
    return this.visualStep;
  }

  // Get actual step (without delay)
  getActualStep() {
    return this.actualStep;
  }

  // Clean up resources
  dispose() {
    if (this.sequencer) {
      this.sequencer.dispose();
    }
    Object.values(this.players).forEach(player => player.dispose());
    
    // Clean up preloaded players
    Object.values(this.preloadedPlayers).forEach(playerArray => {
      playerArray.forEach(player => player.dispose());
    });
    
    // Clean up visual update interval
    this.stopVisualUpdates();
    
    this.masterVolume.dispose();
    this.reverb.dispose();
    this.distortion.dispose();
    this.delay.dispose();
  }
}

// Create and export a singleton instance
const toneAudioManager = new ToneAudioManager();
export default toneAudioManager;
