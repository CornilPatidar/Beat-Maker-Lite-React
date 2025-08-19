import { useEffect } from 'react';
import { useTheme } from './ThemeContext.jsx';

export const useSliderTheme = () => {
  const { currentTheme, themes } = useTheme();
  const theme = themes[currentTheme];

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'slider-theme-style';
    
    const css = `
      input[type="range"] {
        background: ${theme.sliderTrack} !important;
      }
      
      input[type="range"]::-webkit-slider-thumb {
        background: ${theme.sliderThumb} !important;
        border: 2px solid ${theme.sliderThumbBorder} !important;
      }
      
      input[type="range"]::-moz-range-thumb {
        background: ${theme.sliderThumb} !important;
        border: 2px solid ${theme.sliderThumbBorder} !important;
      }
      
      input[type="range"]::-moz-range-track {
        background: ${theme.sliderTrack} !important;
      }
      
      input[type="range"]:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 3px ${theme.sliderThumb}40 !important;
      }
      
      input[type="range"]:focus::-moz-range-thumb {
        box-shadow: 0 0 0 3px ${theme.sliderThumb}40 !important;
      }
    `;
    
    style.textContent = css;
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById('slider-theme-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [currentTheme, theme]);
};
