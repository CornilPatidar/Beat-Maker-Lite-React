import React, { useState } from 'react';
import { useTheme, themes } from './ThemeContext.jsx';

const ThemeSelector = () => {
  const { currentTheme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentThemeData = themes[currentTheme];

  return (
    <div className="relative">
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${currentThemeData.borderColor} ${currentThemeData.buttonBg} ${currentThemeData.buttonHover} text-white font-medium`}
      >
        <span className="text-lg">{currentThemeData.icon}</span>
        <span className="hidden sm:inline">{currentThemeData.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50">
          <div className={`${currentThemeData.cardBg} ${currentThemeData.borderColor} border rounded-lg overflow-hidden`}>
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => {
                  changeTheme(key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${
                  currentTheme === key 
                    ? `${currentThemeData.buttonBg} text-white` 
                    : `${currentThemeData.textSecondary} hover:${currentThemeData.textPrimary} hover:bg-black/20`
                }`}
              >
                <span className="text-lg">{theme.icon}</span>
                <span className="font-medium">{theme.name}</span>
                {currentTheme === key && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSelector;
