import React from 'react';
import { useTheme, themes } from './ThemeContext.jsx';

const ThemeSelector = () => {
  const { currentTheme, changeTheme } = useTheme();
  const currentThemeData = themes[currentTheme];

  // Get all theme keys in order
  const themeKeys = Object.keys(themes);
  
  // Find current theme index and get next theme
  const currentIndex = themeKeys.indexOf(currentTheme);
  const nextTheme = themeKeys[(currentIndex + 1) % themeKeys.length];

  const handleThemeClick = () => {
    changeTheme(nextTheme);
  };

  return (
    <button
      onClick={handleThemeClick}
      className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg border transition-all duration-200 ${currentThemeData.borderColor} ${currentThemeData.buttonBg} ${currentThemeData.buttonHover} text-white shadow-lg hover:scale-105`}
      title={`${currentThemeData.name} - Click for ${themes[nextTheme].name}`}
    >
      <span className="text-base sm:text-lg">{currentThemeData.icon}</span>
    </button>
  );
};

export default ThemeSelector;
