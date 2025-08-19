import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  default: {
    name: "Default",
    icon: "🎛️",
    background: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #0a0a0a 100%)",
    cardBg: "bg-neutral-900/95",
    borderColor: "border-neutral-700",
    headerBg: "bg-neutral-800/90",
    textPrimary: "text-cyan-400",
    textSecondary: "text-gray-400",
    buttonBg: "bg-cyan-600",
    buttonHover: "hover:bg-cyan-700",
    sliderTrack: "#374151",
    sliderThumb: "#06b6d4",
    sliderThumbBorder: "#0891b2",
    titleFont: "Audiowide", // Logo font - keep as is
    titleGradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
    titleGlow: "rgba(6, 182, 212, 0.5)"
  },
  underground: {
    name: "Underground",
    icon: "🏚️",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)",
    cardBg: "bg-black/95",
    borderColor: "border-gray-800",
    headerBg: "bg-gray-900/90",
    textPrimary: "text-green-400",
    textSecondary: "text-gray-300",
    buttonBg: "bg-green-600",
    buttonHover: "hover:bg-green-700",
    sliderTrack: "#2a2a2a",
    sliderThumb: "#00ff41",
    sliderThumbBorder: "#00cc33",
    titleFont: "Audiowide", // Logo font - keep as is
    titleGradient: "linear-gradient(135deg, #00ff41 0%, #00cc33 50%, #009900 100%)",
    titleGlow: "rgba(0, 255, 65, 0.6)"
  },
  forest: {
    name: "Forest",
    icon: "🌲",
    background: "linear-gradient(135deg, #1a3a1a 0%, #2d4a2d 50%, #3a5a3a 100%)",
    cardBg: "bg-green-900/95",
    borderColor: "border-green-700",
    headerBg: "bg-green-800/90",
    textPrimary: "text-green-300",
    textSecondary: "text-green-200",
    buttonBg: "bg-green-600",
    buttonHover: "hover:bg-green-700",
    sliderTrack: "#2d4a2d",
    sliderThumb: "#8bc34a",
    sliderThumbBorder: "#689f38",
    titleFont: "Audiowide", // Logo font - keep as is
    titleGradient: "linear-gradient(135deg, #8bc34a 0%, #689f38 50%, #4caf50 100%)",
    titleGlow: "rgba(139, 195, 74, 0.5)"
  },
  ocean: {
    name: "Ocean",
    icon: "🌊",
    background: "linear-gradient(135deg, #0a1a2a 0%, #1a3a4a 50%, #2a5a6a 100%)",
    cardBg: "bg-blue-900/95",
    borderColor: "border-blue-700",
    headerBg: "bg-blue-800/90",
    textPrimary: "text-cyan-300",
    textSecondary: "text-blue-200",
    buttonBg: "bg-cyan-500",
    buttonHover: "hover:bg-cyan-600",
    sliderTrack: "#1a3a4a",
    sliderThumb: "#00bcd4",
    sliderThumbBorder: "#0097a7",
    titleFont: "Audiowide", // Logo font - keep as is
    titleGradient: "linear-gradient(135deg, #00bcd4 0%, #0097a7 50%, #006064 100%)",
    titleGlow: "rgba(0, 188, 212, 0.6)"
  },
  rnb: {
    name: "R&B",
    icon: "🎶",
    background: "linear-gradient(135deg, #1a0a2a 0%, #2a1a3a 50%, #3a2a4a 100%)",
    cardBg: "bg-purple-900/95",
    borderColor: "border-purple-700",
    headerBg: "bg-purple-800/90",
    textPrimary: "text-yellow-300",
    textSecondary: "text-purple-200",
    buttonBg: "bg-yellow-600",
    buttonHover: "hover:bg-yellow-700",
    sliderTrack: "#2a1a3a",
    sliderThumb: "#ffd700",
    sliderThumbBorder: "#ffb300",
    titleFont: "Audiowide", // Logo font - keep as is
    titleGradient: "linear-gradient(135deg, #ffd700 0%, #ffb300 50%, #ff8f00 100%)",
    titleGlow: "rgba(255, 215, 0, 0.6)"
  },
  rock: {
    name: "Rock",
    icon: "🎸",
    background: "linear-gradient(135deg, #2a0a0a 0%, #3a1a1a 50%, #4a2a2a 100%)",
    cardBg: "bg-red-900/95",
    borderColor: "border-red-700",
    headerBg: "bg-red-800/90",
    textPrimary: "text-red-400",
    textSecondary: "text-red-200",
    buttonBg: "bg-red-600",
    buttonHover: "hover:bg-red-700",
    sliderTrack: "#3a1a1a",
    sliderThumb: "#ff4444",
    sliderThumbBorder: "#cc3333",
    titleFont: "Audiowide", // Logo font - keep as is
    titleGradient: "linear-gradient(135deg, #ff4444 0%, #cc3333 50%, #aa2222 100%)",
    titleGlow: "rgba(255, 68, 68, 0.6)"
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('beatMakerTheme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('beatMakerTheme', themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
