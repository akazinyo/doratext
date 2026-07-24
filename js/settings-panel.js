/* ----------------- Settings Panel (Slide-over Sidebar) ----------------- */

// Inject panel HTML
const settingsPanelHTML = `
  <div id="settings-overlay" class="settings-overlay hidden"></div>
  <div id="settings-panel" class="settings-panel">
    <div class="settings-header">
      <h2 class="settings-title">Ayarlar</h2>
      <button id="closeSettings" class="settings-close-btn" title="Kapat">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="settings-tabs">
      <button class="settings-tab active" data-tab="general">
        <i data-lucide="settings-2" class="w-4 h-4"></i>
        <span>Genel</span>
      </button>
      <button class="settings-tab" data-tab="tools">
        <i data-lucide="paintbrush" class="w-4 h-4"></i>
        <span>Araçlar</span>
      </button>
      <button class="settings-tab" data-tab="shortcuts">
        <i data-lucide="keyboard" class="w-4 h-4"></i>
        <span>Kısayollar</span>
      </button>
      <button class="settings-tab" data-tab="theme">
        <i data-lucide="palette" class="w-4 h-4"></i>
        <span>Tema</span>
      </button>
    </div>

    <div class="settings-body">

      <!-- ══════════ TAB: GENERAL ══════════ -->
      <div class="settings-tab-content active" data-tab-content="general">
        <div class="settings-section">
          <h3 class="settings-section-title">Çalışma Alanı</h3>

          <label class="settings-field">
            <span class="settings-label">Varsayılan Görünüm</span>
            <select id="set-defaultView" class="settings-select">
              <option value="canvas">Tuval</option>
              <option value="editor">Editör</option>
            </select>
          </label>

          <label class="settings-field settings-toggle-field">
            <span class="settings-label">Izgara Göster</span>
            <button id="set-gridVisible" class="settings-toggle" role="switch" aria-checked="true">
              <span class="settings-toggle-thumb"></span>
            </button>
          </label>

          <label class="settings-field settings-toggle-field">
            <span class="settings-label">Otomatik Kaydet</span>
            <button id="set-autoSave" class="settings-toggle" role="switch" aria-checked="true">
              <span class="settings-toggle-thumb"></span>
            </button>
          </label>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title">Editör</h3>

          <label class="settings-field">
            <span class="settings-label">Yazı Boyutu</span>
            <select id="set-fontSize" class="settings-select">
              <option value="small">Küçük</option>
              <option value="medium">Orta</option>
              <option value="large">Büyük</option>
              <option value="xl">Çok Büyük</option>
            </select>
          </label>

          <label class="settings-field settings-toggle-field">
            <span class="settings-label">Satır Numaraları</span>
            <button id="set-showLineNumbers" class="settings-toggle" role="switch" aria-checked="false">
              <span class="settings-toggle-thumb"></span>
            </button>
          </label>

          <label class="settings-field">
            <span class="settings-label">Tab Boyutu</span>
            <select id="set-tabSize" class="settings-select">
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
            </select>
          </label>
        </div>

        <div class="settings-section">
          <button id="resetAllSettings" class="settings-danger-btn">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
            Tüm Ayarları Sıfırla
          </button>
        </div>
      </div>

      <!-- ══════════ TAB: TOOLS & CANVAS ══════════ -->
      <div class="settings-tab-content" data-tab-content="tools">
        <div class="settings-section">
          <h3 class="settings-section-title">Fırça</h3>

          <label class="settings-field">
            <span class="settings-label">Fırça Boyutu <span id="brushSizeVal" class="settings-value-badge">3px</span></span>
            <input type="range" id="set-brushSize" class="settings-range" min="1" max="20" value="3" />
          </label>

          <label class="settings-field">
            <span class="settings-label">Fırça Rengi</span>
            <div class="settings-color-row" id="brushColorPresets"></div>
          </label>

          <label class="settings-field">
            <span class="settings-label">Çizgi Stili</span>
            <select id="set-lineStyle" class="settings-select">
              <option value="straight">Düz</option>
              <option value="curved">Eğri</option>
              <option value="dashed">Kesikli</option>
            </select>
          </label>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title">Silgi</h3>

          <label class="settings-field">
            <span class="settings-label">Silgi Boyutu <span id="eraserSizeVal" class="settings-value-badge">10px</span></span>
            <input type="range" id="set-eraserSize" class="settings-range" min="1" max="30" value="10" />
          </label>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title">Renk Ön Ayarları</h3>
          <div class="settings-color-presets-grid" id="colorPresetsGrid"></div>
          <div class="settings-add-color">
            <input type="color" id="newPresetColor" value="#6366f1" class="settings-color-input" />
            <button id="addPresetColor" class="settings-small-btn">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Ekle
            </button>
          </div>
        </div>
      </div>

      <!-- ══════════ TAB: SHORTCUTS ══════════ -->
      <div class="settings-tab-content" data-tab-content="shortcuts">
        <div class="settings-section">
          <div class="settings-shortcuts-header">
            <h3 class="settings-section-title">Klavye Kısayolları</h3>
            <button id="resetShortcutsBtn" class="settings-small-btn">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Sıfırla
            </button>
          </div>
          <div id="shortcutsList" class="settings-shortcuts-list"></div>
          <p class="settings-hint">Yeniden atamak için kısayol rozetine tıklayın. İptal için Escape.</p>
          <div id="shortcut-conflicts" class="settings-conflicts hidden">
            <i data-lucide="alert-triangle" class="w-4 h-4"></i>
            <span id="conflict-message"></span>
          </div>
        </div>
      </div>

      <!-- ══════════ TAB: THEME & APPEARANCE ══════════ -->
      <div class="settings-tab-content" data-tab-content="theme">
        <div class="settings-section">
          <h3 class="settings-section-title">Tema</h3>
          <div class="settings-theme-grid">
            <button class="settings-theme-card" data-theme="light" title="Açık">
              <div class="theme-preview theme-preview-light"></div>
              <span>Açık</span>
            </button>
            <button class="settings-theme-card" data-theme="dark" title="Koyu">
              <div class="theme-preview theme-preview-dark"></div>
              <span>Koyu</span>
            </button>
            <button class="settings-theme-card" data-theme="black" title="Siyah">
              <div class="theme-preview theme-preview-black"></div>
              <span>Siyah</span>
            </button>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title">Vurgu Rengi</h3>
          <div class="settings-color-row" id="accentColorRow">
            <button class="color-dot active" data-accent="#6366f1" style="background:#6366f1" title="İndigo"></button>
            <button class="color-dot" data-accent="#2563eb" style="background:#2563eb" title="Mavi"></button>
            <button class="color-dot" data-accent="#dc2626" style="background:#dc2626" title="Kırmızı"></button>
            <button class="color-dot" data-accent="#16a34a" style="background:#16a34a" title="Yeşil"></button>
            <button class="color-dot" data-accent="#d97706" style="background:#d97706" title="Turuncu"></button>
            <button class="color-dot" data-accent="#7c3aed" style="background:#7c3aed" title="Mor"></button>
            <button class="color-dot" data-accent="#ec4899" style="background:#ec4899" title="Pembe"></button>
          </div>
        </div>

        <div class="settings-section">
          <label class="settings-field settings-toggle-field">
            <span class="settings-label">Kompakt Mod</span>
            <button id="set-compactMode" class="settings-toggle" role="switch" aria-checked="false">
              <span class="settings-toggle-thumb"></span>
            </button>
          </label>
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
  });
}

initRange('set-brushSize', 'brushSize', 'brushSizeVal', 'px');
initRange('set-eraserSize', 'eraserSize', 'eraserSizeVal', 'px');

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

    row.innerHTML = `<span class="text-sm text-slate-600 dark:text-slate-300">${sc.desc}</span>`;
    row.appendChild(badge);
    list.appendChild(row);
  }

  // Show conflict warning
  const conflictEl = document.getElementById('shortcut-conflicts');
  if (conflicts.length > 0) {
    conflictEl.classList.remove('hidden');
    document.getElementById('conflict-message').textContent =
      conflicts.map(c => c.label).join(', ') + ' arasında çakışma var!';
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
  if (confirm('Tüm ayarları varsayılana sıfırlamak istiyor musunuz?')) {
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
    ['set-gridVisible', 'set-autoSave', 'set-showLineNumbers', 'set-compactMode'].forEach(id => {
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

// Wire up sidebar shortcut button
document.getElementById('shortcutsBtn').addEventListener('click', showSettingsPanel);

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
