# 🎵 Beat Maker Lite

A modern, web-based drum machine built with React that brings the power of professional beat-making to your browser. Create, experiment, and produce beats with an intuitive 16-step sequencer and multiple themes.

**🌐 Live Demo:** [https://beat-maker-lite.vercel.app/](https://beat-maker-lite.vercel.app/)

![Beat Maker Lite](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎛️ Core Functionality
- **16-Step Sequencer**: Classic drum machine workflow with visual step programming
- **5 Drum Tracks**: Kick, Snare, Open Hat, Closed Hat, and Cowbell
- **Real-time Playback**: Instant audio feedback with Web Audio API
- **Tempo Control**: Adjustable BPM from 40-240 with precise control
- **Volume & Pitch Control**: Individual track mixing and sound shaping

### 🎵 Demo Patterns
- **8 Professional Patterns**: Hip-Hop, Groove, EDM, Boom-Bap, Afrobeat, West Coast Bounce, Lo-Fi Chill
- **One-Click Loading**: Instant pattern loading with optimized BPM settings
- **Randomize Function**: AI-powered professional drum patterns with intelligent variation

### 🎯 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional UI**: Clean, modern interface with smooth animations
- **Accessibility**: Keyboard navigation and screen reader support
- **Cross-Browser**: Compatible with all modern browsers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/Beat-Maker-Lite-React.git

# Navigate to project directory
cd Beat-Maker-Lite-React

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## 🏗️ Architecture

Built with **React 18**, **Vite**, **Tailwind CSS**, and **Web Audio API**. Features a modular component architecture with centralized state management using React Context for themes and audio processing.

## 🛠️ Technical Challenges

### 1. **Audio Synchronization**
**Challenge**: Ensuring precise timing across all audio tracks while maintaining low latency.
**Solution**: Implemented a centralized timing system using `setInterval` with BPM-based calculations and Web Audio API for sample-accurate playback.

### 2. **Cross-Browser Audio Compatibility**
**Challenge**: Different browsers handle Web Audio API initialization and autoplay policies differently.
**Solution**: Created an AudioManager class with proper context resumption and fallback handling for various browser implementations.

### 3. **Dynamic Theme System**
**Challenge**: Implementing a comprehensive theme system that affects all UI elements including sliders and interactive components.
**Solution**: Developed a hybrid approach using CSS-in-JS for dynamic elements and CSS custom properties for static styling, with a custom hook for real-time slider updates.

### 4. **Responsive Grid Layout**
**Challenge**: Creating a responsive sequencer grid that maintains proper proportions across different screen sizes.
**Solution**: Implemented a flexible grid system using CSS Grid and Flexbox with dynamic sizing calculations based on container width.

### 5. **Performance Optimization**
**Challenge**: Maintaining smooth animations and real-time audio processing without performance degradation.
**Solution**: Used React.memo for component optimization, implemented efficient state management, and optimized audio buffer handling.

## 🎵 Future Enhancements

### **Tone.js Integration** (Coming Soon)
The project is planned for a major upgrade to [Tone.js](https://tonejs.github.io/), a powerful Web Audio framework that will enable:

- **Advanced Synthesis**: Built-in synthesizers and effects
- **Better Timing**: More precise audio scheduling and synchronization
- **Effects Processing**: Reverb, delay, compression, and more
- **MIDI Support**: External controller integration
- **Advanced Patterns**: More sophisticated pattern generation algorithms
- **Real-time Effects**: Dynamic audio processing and manipulation

### **Additional Features Planned**
- **More Drum Kits**: Additional sample packs and sound libraries
- **Pattern Export**: Save and share custom patterns
- **Advanced Sequencing**: 32-step and 64-step sequencer modes

## 👨‍💻 Author

**Cornil Patidar**
- Live Demo: [https://beat-maker-lite.vercel.app/](https://beat-maker-lite.vercel.app/)

---

**🎵 Made with ❤️ for the music production community**
