import React, { useState } from "react";
import { useTheme } from "./ThemeContext.jsx";

function EffectsPanel({ audioManager }) {
  const { currentTheme, themes } = useTheme();
  const currentThemeData = themes[currentTheme];
  
  const [effects, setEffects] = useState({
    reverb: { enabled: false, decay: 1.5 },
    distortion: { enabled: false, distortion: 0.3 },
    delay: { enabled: false, delayTime: 0.5, feedback: 0.5 }
  });

  const handleEffectToggle = (effectName) => {
    const newEffects = { ...effects };
    newEffects[effectName].enabled = !newEffects[effectName].enabled;
    setEffects(newEffects);
    
    if (audioManager && audioManager.toggleEffect) {
      audioManager.toggleEffect(effectName, newEffects[effectName].enabled);
    }
  };

  const handleParameterChange = (effectName, parameter, value) => {
    const newEffects = { ...effects };
    newEffects[effectName][parameter] = value;
    setEffects(newEffects);
    
    if (audioManager && audioManager.setEffectParameter) {
      audioManager.setEffectParameter(effectName, parameter, value);
    }
  };

  return (
    <div
      className={`w-full min-w-0 max-w-full box-border 
                  p-4 rounded-lg border 
                  ${currentThemeData.bgSecondary} ${currentThemeData.border}`}
    >
      <h3 className={`text-lg font-semibold mb-4 ${currentThemeData.textPrimary}`}>
        Effects
      </h3>
      
      <div className="space-y-4">
        {/* Reverb */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium ${currentThemeData.textSecondary}`}>
              Reverb
            </label>
            <input
              type="checkbox"
              checked={effects.reverb.enabled}
              onChange={() => handleEffectToggle('reverb')}
              className="w-4 h-4"
            />
          </div>
          {effects.reverb.enabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${currentThemeData.textSecondary}`}>Decay</span>
                <span className={`text-xs ${currentThemeData.textSecondary}`}>
                  {effects.reverb.decay.toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={effects.reverb.decay}
                onChange={(e) => handleParameterChange('reverb', 'decay', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Distortion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium ${currentThemeData.textSecondary}`}>
              Distortion
            </label>
            <input
              type="checkbox"
              checked={effects.distortion.enabled}
              onChange={() => handleEffectToggle('distortion')}
              className="w-4 h-4"
            />
          </div>
          {effects.distortion.enabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${currentThemeData.textSecondary}`}>Amount</span>
                <span className={`text-xs ${currentThemeData.textSecondary}`}>
                  {effects.distortion.distortion.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={effects.distortion.distortion}
                onChange={(e) => handleParameterChange('distortion', 'distortion', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Delay */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium ${currentThemeData.textSecondary}`}>
              Delay
            </label>
            <input
              type="checkbox"
              checked={effects.delay.enabled}
              onChange={() => handleEffectToggle('delay')}
              className="w-4 h-4"
            />
          </div>
          {effects.delay.enabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${currentThemeData.textSecondary}`}>Time</span>
                <span className={`text-xs ${currentThemeData.textSecondary}`}>
                  {effects.delay.delayTime.toFixed(2)}s
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={effects.delay.delayTime}
                onChange={(e) => handleParameterChange('delay', 'delayTime', parseFloat(e.target.value))}
                className="w-full"
              />
              
              <div className="flex items-center justify-between">
                <span className={`text-xs ${currentThemeData.textSecondary}`}>Feedback</span>
                <span className={`text-xs ${currentThemeData.textSecondary}`}>
                  {effects.delay.feedback.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.01"
                value={effects.delay.feedback}
                onChange={(e) => handleParameterChange('delay', 'feedback', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EffectsPanel;
