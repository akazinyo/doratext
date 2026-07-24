    /* ----------------- Window resize ----------------- */
    window.addEventListener('resize', () => {
      renderConnections();
      renderStrokes();
      hideContextMenu();
      hideAutocompleteDropdown();
    });

    /* ----------------- Shortcuts Panel ----------------- */
    const shortcutsPanelHTML = `
      <div id="shortcutsPanel-overlay" class="hidden"></div>
      <div id="shortcutsPanel" class="hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-200">Klavye Kısayolları</h3>
          <div class="flex gap-2">
            <button id="resetShortcutsBtn" class="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">Sıfırla</button>
            <button id="closeShortcutsPanel" class="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">Kapat</button>
          </div>
        </div>
        <div id="shortcutsList" class="space-y-1"></div>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-3">Click a shortcut badge to rebind. Press Escape to cancel.</p>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', shortcutsPanelHTML);

    const shortcutsOverlay = document.getElementById('shortcutsPanel-overlay');
    const shortcutsPanelEl = document.getElementById('shortcutsPanel');
    const shortcutsList = document.getElementById('shortcutsList');
    const closeShortcutsPanel = document.getElementById('closeShortcutsPanel');
    const resetShortcutsBtn = document.getElementById('resetShortcutsBtn');
    const shortcutsBtn = document.getElementById('shortcutsBtn');

    let recordingId = null;

    function renderShortcutsPanel() {
      shortcutsList.innerHTML = '';
      for (const [id, sc] of Object.entries(shortcuts)) {
        const row = document.createElement('div');
        row.className = 'shortcut-row';
        const badge = document.createElement('span');
        badge.className = 'shortcut-key-badge';
        badge.dataset.shortcutId = id;
        badge.textContent = formatShortcut(sc);
        if (recordingId === id) badge.classList.add('recording');
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          startRecording(id);
        });
        row.innerHTML = `<span class="text-sm text-slate-600 dark:text-slate-300">${sc.desc}</span>`;
        row.appendChild(badge);
        shortcutsList.appendChild(row);
      }
    }

    function startRecording(id) {
      recordingId = id;
      renderShortcutsPanel();
      const handler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'Escape') { recordingId = null; renderShortcutsPanel(); document.removeEventListener('keydown', handler, true); return; }
        if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;
        const key = e.key === ' ' ? 'Space' : e.key;
        shortcuts[id] = { key, ctrl: !!e.ctrlKey, shift: !!e.shiftKey, alt: !!e.altKey, desc: shortcuts[id].desc };
        recordingId = null;
        saveShortcuts();
        renderShortcutsPanel();
        document.removeEventListener('keydown', handler, true);
      };
      document.addEventListener('keydown', handler, true);
    }

    function showShortcutsPanel() {
      renderShortcutsPanel();
      shortcutsOverlay.classList.remove('hidden');
      shortcutsPanelEl.classList.remove('hidden');
    }

    function hideShortcutsPanel() {
      recordingId = null;
      shortcutsOverlay.classList.add('hidden');
      shortcutsPanelEl.classList.add('hidden');
    }

    shortcutsBtn.addEventListener('click', showShortcutsPanel);
    closeShortcutsPanel.addEventListener('click', hideShortcutsPanel);
    shortcutsOverlay.addEventListener('click', hideShortcutsPanel);
    resetShortcutsBtn.addEventListener('click', () => { resetShortcuts(); renderShortcutsPanel(); });
