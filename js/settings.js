/* ----------------- Settings State & Persistence ----------------- */

const SETTINGS_KEY = 'doranote_settings';

const DEFAULT_SETTINGS = {
  // General
  autoSave: true,
  defaultView: 'canvas',       // 'canvas' | 'editor'
  gridVisible: true,

  // Tools & Canvas
  brushSize: 3,                // 1–20 px
  brushColor: '#334155',
  lineStyle: 'straight',       // 'straight' | 'curved' | 'dashed'
  eraserSize: 10,              // 1–30 px
  colorPresets: ['#334155', '#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed'],

  // Editor
  fontSize: 'medium',          // 'small' | 'medium' | 'large' | 'xl'
  showLineNumbers: false,
  tabSize: 4,

  // Theme & Appearance
  theme: 'light',              // 'light' | 'dark' | 'black'
  accentColor: '#6366f1',
  compactMode: false,
};

let settings = {};

function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      settings = { ...DEFAULT_SETTINGS, ...parsed };
      return;
    } catch {}
  }
  settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getSetting(key) {
  return settings[key] ?? DEFAULT_SETTINGS[key];
}

function setSetting(key, value) {
  settings[key] = value;
  saveSettings();
}

function resetSettings() {
  settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  saveSettings();
}

// Apply settings to the running app
function applySettings() {
  // Theme
  theme = getSetting('theme');
  applyTheme();

  // Brush / drawing defaults
  if (lineColorSelect) lineColorSelect.value = getSetting('brushColor');
  if (lineStyleSelect) lineStyleSelect.value = getSetting('lineStyle');

  // Grid visibility
  canvas.style.setProperty('--grid-size', getSetting('gridVisible') ? '24px' : '0px');
  canvas.style.backgroundImage = getSetting('gridVisible')
    ? ''
    : 'none';

  // Default font size for new blocks
  const fontSizeMap = { small: 'small', medium: 'medium', large: 'large', xl: 'xl' };
  window._defaultFontSize = fontSizeMap[getSetting('fontSize')] || 'medium';

  // Compact mode
  document.documentElement.classList.toggle('compact-mode', getSetting('compactMode'));
}

loadSettings();
