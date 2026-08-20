/* ----------------- Settings Panel (Slide-over Sidebar) ----------------- */

// Inject panel HTML
const settingsPanelHTML = `
  <div id="settings-overlay" class="settings-overlay hidden"></div>
  <div id="settings-panel" class="settings-panel">
    <div class="settings-header">
      <h2 class="settings-title">
        <span class="settings-title-icon"><i data-lucide="settings" class="w-4 h-4"></i></span>
        <span data-i18n="settings.title">${t('settings.title')}</span>
      </h2>
      <button id="closeSettings" class="settings-close-btn" data-i18n="settings.btnClose" title="${t('settings.btnClose')}">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="settings-layout">
      <nav class="settings-nav">
        <button class="settings-tab active" data-tab="general">
          <i data-lucide="settings-2" class="w-4 h-4"></i>
          <span data-i18n="settings.tabGeneral">${t('settings.tabGeneral')}</span>
        </button>
        <button class="settings-tab" data-tab="tools">
          <i data-lucide="paintbrush" class="w-4 h-4"></i>
          <span data-i18n="settings.tabTools">${t('settings.tabTools')}</span>
        </button>
        <button class="settings-tab" data-tab="minimap">
          <i data-lucide="map" class="w-4 h-4"></i>
          <span data-i18n="settings.tabMinimap">${t('settings.tabMinimap')}</span>
        </button>
        <button class="settings-tab" data-tab="shortcuts">
          <i data-lucide="keyboard" class="w-4 h-4"></i>
          <span data-i18n="settings.tabShortcuts">${t('settings.tabShortcuts')}</span>
        </button>
        <button class="settings-tab" data-tab="theme">
          <i data-lucide="palette" class="w-4 h-4"></i>
          <span data-i18n="settings.tabTheme">${t('settings.tabTheme')}</span>
        </button>
      </nav>

      <div class="settings-body">

      <!-- ══════════ TAB: GENERAL ══════════ -->
      <div class="settings-tab-content active" data-tab-content="general">
        <div class="settings-section">
          <h3 class="settings-section-title" data-i18n="settings.sectionWorkspace">${t('settings.sectionWorkspace')}</h3>

          <label class="settings-field">
            <span class="settings-label" data-i18n="settings.labelDefaultView">${t('settings.labelDefaultView')}</span>
            <select id="set-defaultView" class="settings-select">
              <option value="canvas" data-i18n="settings.optionCanvas">${t('settings.optionCanvas')}</option>
              <option value="editor" data-i18n="settings.optionEditor">${t('settings.optionEditor')}</option>
            </select>
          </label>

          <label class="settings-field settings-toggle-field">
            <span class="settings-label" data-i18n="settings.labelGrid">${t('settings.labelGrid')}</span>
            <button id="set-gridVisible" class="settings-toggle" role="switch" aria-checked="true">
              <span class="settings-toggle-thumb"></span>
            </button>
          </label>

          <label class="settings-field settings-toggle-field">
            <span class="settings-label" data-i18n="settings.labelAutoSave">${t('settings.labelAutoSave')}</span>
            <button id="set-autoSave" class="settings-toggle" role="switch" aria-checked="true">
              <span class="settings-toggle-thumb"></span>
            </button>
          </label>

          <label class="settings-field">
            <span class="settings-label" data-i18n="settings.labelLanguage">${t('settings.labelLanguage')}</span>
            <select id="set-language" class="settings-select">
              <option value="en" data-i18n="settings.optionEn">${t('settings.optionEn')}</option>
              <option value="tr" data-i18n="settings.optionTr">${t('settings.optionTr')}</option>
            </select>
          </label>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title" data-i18n="settings.sectionEditor">${t('settings.sectionEditor')}</h3>

          <label class="settings-field">
            <span class="settings-label" data-i18n="settings.labelFontSize">${t('settings.labelFontSize')}</span>
            <select id="set-fontSize" class="settings-select">
              <option value="small" data-i18n="settings.optionSmall">${t('settings.optionSmall')}</option>
              <option value="medium" data-i18n="settings.optionMedium">${t('settings.optionMedium')}</option>
              <option value="large" data-i18n="settings.optionLarge">${t('settings.optionLarge')}</option>
              <option value="xl" data-i18n="settings.optionXl">${t('settings.optionXl')}</option>
            </select>
          </label>

          <label class="settings-field settings-toggle-field">
            <span class="settings-label" data-i18n="settings.labelLineNumbers">${t('settings.labelLineNumbers')}</span>
            <button id="set-showLineNumbers" class="settings-toggle" role="switch" aria-checked="false">
              <span class="settings-toggle-thumb"></span>
            </button>
          </label>

          <label class="settings-field">
            <span class="settings-label" data-i18n="settings.labelTabSize">${t('settings.labelTabSize')}</span>
            <select id="set-tabSize" class="settings-select">
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
          </label>
        </div>

        <div class="settings-section">
          <button id="resetAllSettings" class="settings-danger-btn" data-i18n="settings.btnResetAll">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
            ${t('settings.btnResetAll')}
          </button>
        </div>
      </div>

      <!-- ══════════ TAB: TOOLS & CANVAS ══════════ -->
      <div class="settings-tab-content" data-tab-content="tools">
        <div class="settings-section">
          <h3 class="settings-section-title" data-i18n="settings.sectionBrush">${t('settings.sectionBrush')}</h3>
 
          <label class="settings-field">
            <span class="settings-label"><span data-i18n="settings.labelBrushSize">${t('settings.labelBrushSize')}</span> <span id="brushSizeVal" class="settings-value-badge">3px</span></span>
            <input type="range" id="set-brushSize" class="settings-range" min="1" max="20" value="3" />
          </label>

          <label class="settings-field">
            <span class="settings-label" data-i18n="settings.labelBrushColor">${t('settings.labelBrushColor')}</span>
            <div class="settings-color-row" id="brushColorPresets"></div>
          </label>

          <label class="settings-field">
            <span class="settings-label" data-i18n="settings.labelLineStyle">${t('settings.labelLineStyle')}</span>
            <select id="set-lineStyle" class="settings-select">
              <option value="straight" data-i18n="settings.optionStraight">${t('settings.optionStraight')}</option>
              <option value="curved" data-i18n="settings.optionCurved">${t('settings.optionCurved')}</option>
              <option value="dashed" data-i18n="settings.optionDashed">${t('settings.optionDashed')}</option>
            </select>
          </label>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title" data-i18n="settings.sectionEraser">${t('settings.sectionEraser')}</h3>

          <label class="settings-field">
            <span class="settings-label"><span data-i18n="settings.labelEraserSize">${t('settings.labelEraserSize')}</span> <span id="eraserSizeVal" class="settings-value-badge">10px</span></span>
            <input type="range" id="set-eraserSize" class="settings-range" min="1" max="30" value="10" />
          </label>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title" data-i18n="settings.sectionPresets">${t('settings.sectionPresets')}</h3>
          <div class="settings-color-presets-grid" id="colorPresetsGrid"></div>
          <div class="settings-add-color">
            <input type="color" id="newPresetColor" value="#6366f1" class="settings-color-input" />
            <button id="addPresetColor" class="settings-small-btn" data-i18n="settings.btnAddColor">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> ${t('settings.btnAddColor')}
            </button>
          </div>
        </div>
      </div>

      <!-- ══════════ TAB: MINIMAP ══════════ -->
      <div class="settings-tab-content" data-tab-content="minimap">
        <div class="settings-section">
          <h3 class="settings-section-title" data-i18n="settings.sectionMinimap">${t('settings.sectionMinimap')}</h3>

          <label class="settings-field settings-toggle-field">
            <span class="settings-label" data-i18n="settings.labelMinimapVisible">${t('settings.labelMinimapVisible')}</span>
            <button id="set-minimapVisible" class="settings-toggle" role="switch" aria-checked="true">
              <span class="settings-toggle-thumb"></span>
            </button>
          </label>

          <label class="settings-field">
            <span class="settings-label" data-i18n="settings.labelMinimapSize">${t('settings.labelMinimapSize')}</span>
            <select id="set-minimapSize" class="settings-select">
              <option value="small" data-i18n="settings.optionSmall">${t('settings.optionSmall')}</option>
              <option value="medium" data-i18n="settings.optionMedium">${t('settings.optionMedium')}</option>
              <option value="large" data-i18n="settings.optionLarge">${t('settings.optionLarge')}</option>
            </select>
          </label>

          <label class="settings-field">
            <span class="settings-label"><span data-i18n="settings.labelMinimapOpacity">${t('settings.labelMinimapOpacity')}</span> <span id="minimapOpacityVal" class="settings-value-badge">65%</span></span>
            <input type="range" id="set-minimapOpacity" class="settings-range" min="20" max="100" value="65" />
          </label>
        </div>
      </div>

      <!-- ══════════ TAB: SHORTCUTS ══════════ -->
      <div class="settings-tab-content" data-tab-content="shortcuts">
        <div class="settings-section">
          <div class="settings-shortcuts-header">
            <h3 class="settings-section-title" data-i18n="settings.sectionShortcuts">${t('settings.sectionShortcuts')}</h3>
            <button id="resetShortcutsBtn" class="settings-small-btn" data-i18n="settings.btnReset">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> ${t('settings.btnReset')}
            </button>
          </div>
          <div id="shortcutsList" class="settings-shortcuts-list"></div>
          <p class="settings-hint" data-i18n="settings.hintShortcut">${t('settings.hintShortcut')}</p>
          <div id="shortcut-conflicts" class="settings-conflicts hidden">
            <i data-lucide="alert-triangle" class="w-4 h-4"></i>
            <span id="conflict-message"></span>
          </div>
        </div>
      </div>

      <!-- ══════════ TAB: THEME & APPEARANCE ══════════ -->
      <div class="settings-tab-content" data-tab-content="theme">
        <div class="settings-section">
          <h3 class="settings-section-title" data-i18n="settings.sectionTheme">${t('settings.sectionTheme')}</h3>
          <div class="settings-theme-grid">
            <button class="settings-theme-card" data-theme="light" data-i18n="settings.themeLight" title="${t('settings.themeLight')}">
              <div class="theme-preview theme-preview-light"></div>
              <span data-i18n="settings.themeLight">${t('settings.themeLight')}</span>
            </button>
            <button class="settings-theme-card" data-theme="dark" data-i18n="settings.themeDark" title="${t('settings.themeDark')}">
              <div class="theme-preview theme-preview-dark"></div>
              <span data-i18n="settings.themeDark">${t('settings.themeDark')}</span>
            </button>
            <button class="settings-theme-card" data-theme="black" data-i18n="settings.themeBlack" title="${t('settings.themeBlack')}">
              <div class="theme-preview theme-preview-black"></div>
              <span data-i18n="settings.themeBlack">${t('settings.themeBlack')}</span>
            </button>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title" data-i18n="settings.sectionAccent">${t('settings.sectionAccent')}</h3>
          <div class="settings-color-row" id="accentColorRow">
            <button class="color-dot active" data-accent="#6366f1" style="background:#6366f1"></button>
            <button class="color-dot" data-accent="#2563eb" style="background:#2563eb"></button>
            <button class="color-dot" data-accent="#dc2626" style="background:#dc2626"></button>
            <button class="color-dot" data-accent="#16a34a" style="background:#16a34a"></button>
            <button class="color-dot" data-accent="#d97706" style="background:#d97706"></button>
            <button class="color-dot" data-accent="#7c3aed" style="background:#7c3aed"></button>
            <button class="color-dot" data-accent="#ec4899" style="background:#ec4899"></button>
          </div>
        </div>

        <div class="settings-section">
          <label class="settings-field settings-toggle-field">
            <span class="settings-label" data-i18n="settings.labelCompact">${t('settings.labelCompact')}</span>
            <button id="set-compactMode" class="settings-toggle" role="switch" aria-checked="false">
              <span class="settings-toggle-thumb"></span>
            </button>
          </label>
        </div>
      </div>

      </div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', settingsPanelHTML);

/* ----------------- DOM refs for panel ----------------- */
const settingsOverlay = document.getElementById('settings-overlay');
const settingsPanelEl = document.getElementById('settings-panel');
const closeSettingsBtn = document.getElementById('closeSettings');
const settingsTabs = document.querySelectorAll('.settings-tab');
const settingsTabContents = document.querySelectorAll('.settings-tab-content');

let recordingId = null;

/* ----------------- Tab switching ----------------- */
settingsTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    settingsTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
    settingsTabContents.forEach(c => c.classList.toggle('active', c.dataset.tabContent === target));
  });
});

/* ----------------- Toggle switches ----------------- */
function initToggle(id, key) {
  const el = document.getElementById(id);
  const val = getSetting(key);
  el.setAttribute('aria-checked', String(!!val));
  el.classList.toggle('on', !!val);

  el.addEventListener('click', () => {
    const current = el.getAttribute('aria-checked') === 'true';
    const next = !current;
    el.setAttribute('aria-checked', String(next));
    el.classList.toggle('on', next);
    setSetting(key, next);
    applySettings();
  });
}

initToggle('set-gridVisible', 'gridVisible');
initToggle('set-autoSave', 'autoSave');
initToggle('set-showLineNumbers', 'showLineNumbers');
initToggle('set-compactMode', 'compactMode');

/* ----------------- Select fields ----------------- */
function initSelect(id, key, isNumber) {
  const el = document.getElementById(id);
  el.value = String(getSetting(key));
  el.addEventListener('change', () => {
    const val = isNumber ? Number(el.value) : el.value;
    setSetting(key, val);
    applySettings();
  });
}

initSelect('set-defaultView', 'defaultView');
initSelect('set-fontSize', 'fontSize');
initSelect('set-language', 'language');
document.getElementById('set-language').addEventListener('change', function() {
  setLanguage(this.value);
});
initSelect('set-tabSize', 'tabSize', true);
initSelect('set-lineStyle', 'lineStyle');

/* ----------------- Range sliders ----------------- */
function initRange(id, key, displayId, unit) {
  const el = document.getElementById(id);
  const display = document.getElementById(displayId);
  el.value = getSetting(key);
  display.textContent = getSetting(key) + unit;

  el.addEventListener('input', () => {
    display.textContent = el.value + unit;
  });
  el.addEventListener('change', () => {
    setSetting(key, Number(el.value));
    applySettings();
  });
}

initRange('set-brushSize', 'brushSize', 'brushSizeVal', 'px');
initRange('set-eraserSize', 'eraserSize', 'eraserSizeVal', 'px');

initToggle('set-minimapVisible', 'minimapVisible');
initSelect('set-minimapSize', 'minimapSize');
initRange('set-minimapOpacity', 'minimapOpacity', 'minimapOpacityVal', '%');

/* ----------------- Brush color presets ----------------- */
function renderBrushColorPresets() {
  const container = document.getElementById('brushColorPresets');
  container.innerHTML = '';
  const current = getSetting('brushColor');
  getSetting('colorPresets').forEach(color => {
    const btn = document.createElement('button');
    btn.className = 'color-dot' + (color === current ? ' active' : '');
    btn.style.background = color;
    btn.title = color;
    btn.addEventListener('click', () => {
      setSetting('brushColor', color);
      if (lineColorSelect) lineColorSelect.value = color;
      renderBrushColorPresets();
    });
    container.appendChild(btn);
  });
}
renderBrushColorPresets();

/* ----------------- Top toolbar sync ----------------- */
function syncThemeCards() {
  document.querySelectorAll('.settings-theme-card').forEach(c =>
    c.classList.toggle('active', c.dataset.theme === getSetting('theme')));
}

if (lineColorSelect) {
  lineColorSelect.addEventListener('change', () => {
    setSetting('brushColor', lineColorSelect.value);
    renderBrushColorPresets();
  });
}
if (lineStyleSelect) {
  lineStyleSelect.addEventListener('change', () => {
    setSetting('lineStyle', lineStyleSelect.value);
  });
}

/* ----------------- Color presets grid ----------------- */
function renderColorPresetsGrid() {
  const grid = document.getElementById('colorPresetsGrid');
  grid.innerHTML = '';
  getSetting('colorPresets').forEach((color, idx) => {
    const item = document.createElement('div');
    item.className = 'settings-preset-item';
    item.innerHTML = `
      <div class="settings-preset-swatch" style="background:${color}"></div>
      <span class="settings-preset-label">${color}</span>
      <button class="settings-preset-remove" data-idx="${idx}" title="Kaldır">
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
    `;
    grid.appendChild(item);
  });
  lucide.createIcons();

  grid.querySelectorAll('.settings-preset-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const presets = [...getSetting('colorPresets')];
      presets.splice(Number(btn.dataset.idx), 1);
      setSetting('colorPresets', presets);
      renderColorPresetsGrid();
      renderBrushColorPresets();
    });
  });
}
renderColorPresetsGrid();

document.getElementById('addPresetColor').addEventListener('click', () => {
  const color = document.getElementById('newPresetColor').value;
  const presets = [...getSetting('colorPresets')];
  if (!presets.includes(color)) {
    presets.push(color);
    setSetting('colorPresets', presets);
    renderColorPresetsGrid();
    renderBrushColorPresets();
  }
});

/* ----------------- Theme cards ----------------- */
document.querySelectorAll('.settings-theme-card').forEach(card => {
  const t = card.dataset.theme;
  card.classList.toggle('active', getSetting('theme') === t);
  card.addEventListener('click', () => {
    setSetting('theme', t);
    document.querySelectorAll('.settings-theme-card').forEach(c => c.classList.toggle('active', c.dataset.theme === t));
    applySettings();
  });
});

/* ----------------- Accent color ----------------- */
document.querySelectorAll('#accentColorRow .color-dot').forEach(dot => {
  const c = dot.dataset.accent;
  dot.classList.toggle('active', getSetting('accentColor') === c);
  dot.addEventListener('click', () => {
    setSetting('accentColor', c);
    document.querySelectorAll('#accentColorRow .color-dot').forEach(d => d.classList.toggle('active', d.dataset.accent === c));
    document.documentElement.style.setProperty('--accent-color', c);
  });
});

// Apply saved accent on load
document.documentElement.style.setProperty('--accent-color', getSetting('accentColor'));

/* ----------------- Shortcuts Manager (inside Settings) ----------------- */
const SHORTCUT_I18N_KEYS = {
  newPage: 'shortcuts.descNewPage',
  newTextBlock: 'shortcuts.descNewBlock',
  deleteBlock: 'shortcuts.descDeleteBlock',
  commandPal: 'shortcuts.descCommandPal',
    toggleSide: 'shortcuts.descToggleSide',
    toggleTheme: 'shortcuts.descToggleTheme',
    undo: 'shortcuts.descUndo',
    redo: 'shortcuts.descRedo',
    toggleMinimap: 'shortcuts.descToggleMinimap'
  };

function renderShortcutsList() {
  const list = document.getElementById('shortcutsList');
  list.innerHTML = '';
  const conflicts = detectShortcutConflicts();

  for (const [id, sc] of Object.entries(shortcuts)) {
    const row = document.createElement('div');
    row.className = 'shortcut-row';
    const hasConflict = conflicts.some(c => c.ids.includes(id));

    const badge = document.createElement('span');
    badge.className = 'shortcut-key-badge' + (recordingId === id ? ' recording' : '') + (hasConflict ? ' conflict' : '');
    badge.dataset.shortcutId = id;
    badge.textContent = formatShortcut(sc);
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      startRecording(id);
    });

    row.innerHTML = `<span class="text-sm text-slate-600 dark:text-slate-300">${t(SHORTCUT_I18N_KEYS[id] || sc.desc)}</span>`;
    row.appendChild(badge);
    list.appendChild(row);
  }

  // Show conflict warning
  const conflictEl = document.getElementById('shortcut-conflicts');
  if (conflicts.length > 0) {
    conflictEl.classList.remove('hidden');
    document.getElementById('conflict-message').textContent =
      t('settings.shortcutConflict', conflicts.map(c => c.label).join(', '));
  } else {
    conflictEl.classList.add('hidden');
  }
}

function detectShortcutConflicts() {
  const seen = {};
  const conflicts = [];
  for (const [id, sc] of Object.entries(shortcuts)) {
    const key = formatShortcut(sc);
    if (seen[key]) {
      conflicts.push({ key, ids: [seen[key], id], label: key });
    } else {
      seen[key] = id;
    }
  }
  return conflicts;
}

function startRecording(id) {
  recordingId = id;
  renderShortcutsList();
  const handler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Escape') {
      recordingId = null;
      renderShortcutsList();
      document.removeEventListener('keydown', handler, true);
      return;
    }
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;
    const key = e.key === ' ' ? 'Space' : e.key;
    shortcuts[id] = { key, ctrl: !!e.ctrlKey, shift: !!e.shiftKey, alt: !!e.altKey, desc: shortcuts[id].desc };
    recordingId = null;
    saveShortcuts();
    renderShortcutsList();
    document.removeEventListener('keydown', handler, true);
  };
  document.addEventListener('keydown', handler, true);
}

document.getElementById('resetShortcutsBtn').addEventListener('click', () => {
  resetShortcuts();
  renderShortcutsList();
});

/* ----------------- Reset All Settings ----------------- */
document.getElementById('resetAllSettings').addEventListener('click', () => {
  if (confirm(t('settings.confirmResetAll'))) {
    resetSettings();
    applySettings();
    // Refresh panel UI
    document.querySelectorAll('.settings-theme-card').forEach(c => c.classList.toggle('active', c.dataset.theme === 'light'));
    document.querySelectorAll('#accentColorRow .color-dot').forEach(d => d.classList.toggle('active', d.dataset.accent === '#6366f1'));
    document.getElementById('set-defaultView').value = 'canvas';
    document.getElementById('set-fontSize').value = 'medium';
    document.getElementById('set-tabSize').value = '4';
    document.getElementById('set-lineStyle').value = 'straight';
    document.getElementById('set-brushSize').value = 3;
    document.getElementById('set-eraserSize').value = 10;
    document.getElementById('brushSizeVal').textContent = '3px';
    document.getElementById('eraserSizeVal').textContent = '10px';
    document.getElementById('set-minimapSize').value = 'medium';
    document.getElementById('set-minimapOpacity').value = 65;
    document.getElementById('minimapOpacityVal').textContent = '65%';
    ['set-gridVisible', 'set-autoSave', 'set-showLineNumbers', 'set-compactMode', 'set-minimapVisible'].forEach(id => {
      const el = document.getElementById(id);
      const val = getSetting(id.replace('set-', ''));
      el.setAttribute('aria-checked', String(!!val));
      el.classList.toggle('on', !!val);
    });
    renderColorPresetsGrid();
    renderBrushColorPresets();
    renderShortcutsList();
  }
});

/* ----------------- Open / Close Panel ----------------- */
function showSettingsPanel() {
  renderShortcutsList();
  settingsOverlay.classList.remove('hidden');
  settingsPanelEl.classList.add('open');
  lucide.createIcons();
}

function hideSettingsPanel() {
  recordingId = null;
  settingsPanelEl.classList.remove('open');
  settingsOverlay.classList.add('hidden');
}

closeSettingsBtn.addEventListener('click', hideSettingsPanel);
settingsOverlay.addEventListener('click', hideSettingsPanel);

// Wire up toolbar settings button
document.getElementById('settingsBtn')?.addEventListener('click', showSettingsPanel);

// Re-render shortcuts when language changes
window.addEventListener('doralangchange', () => {
  if (settingsPanelEl.classList.contains('open')) renderShortcutsList();
});

/* ----------------- Legacy: keep shortcuts-panel functions for compat ----------------- */
// init.js references shortcutsPanelEl
const shortcutsPanelEl = settingsPanelEl;
function showShortcutsPanel() { showSettingsPanel(); }

/* ----------------- Window resize ----------------- */
window.addEventListener('resize', () => {
  renderConnections();
  renderStrokes();
  hideContextMenu();
  hideAutocompleteDropdown();
});
