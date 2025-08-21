// Layout constants for the sequencer grid
export const COLS = 16;
export const GAP = 4;           // px between squares (reduced for mobile)
export const MIN_STEP = 18;     // min square size (reduced for mobile)
export const MAX_STEP = 25;     // max square size
export const LABEL_W = 70;      // px (left labels) (reduced for mobile)
export const SLIDER_PANEL_W = 180; // px (right sliders area + labels) (reduced for mobile)

// Color constants for the sequencer
export const COLORS = {
  inactiveA: "#F8FAFC", // almost white
  inactiveB: "#8f8d8d", // light gray
  border:    "#4B5563", // slate border so squares are crisp
  active:    "#06B6D4", // cyan
  playhead:  "#FFFFFF", // thin white halo
  hover:     "#EEF2F7"
};
