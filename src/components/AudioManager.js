// Audio Manager for Beat Maker Lite
// Handles loading and playing drum sounds

class AudioManager {
  constructor() {
    this.sounds = {};
    this.audioContext = null;
    this.masterGain = null;
    this.isInitialized = false;
  }

  // Initialize the audio context (required for Web Audio API)
  async init() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.7; // Master volume
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  // Load a sound file
  async loadSound(name, url) {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds[name] = audioBuffer;
    } catch (error) {
      console.error(`Failed to load sound ${name}:`, error);
    }
  }

  // Play a sound with volume and pitch control
  playSound(name, volume = 1.0, pitch = 1.0) {
    if (!this.isInitialized || !this.sounds[name]) {
      console.warn(`Sound ${name} not loaded`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      const pitchNode = this.audioContext.createGain(); // Simple pitch control

      source.buffer = this.sounds[name];
      source.playbackRate.value = pitch;
      
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      source.start(0);
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
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  // Resume audio context (required after user interaction)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Create and export a singleton instance
const audioManager = new AudioManager();
export default audioManager;
