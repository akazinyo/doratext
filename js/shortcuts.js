    /* ----------------- Customizable Shortcuts ----------------- */
    const SHORTCUTS_KEY = 'doranote_shortcuts';
    const DEFAULT_SHORTCUTS = {
      newPage:      { key: 'n', ctrl: true,  shift: false, alt: true,  desc: 'Yeni Sayfa' },
      newTextBlock: { key: 't', ctrl: true,  shift: false, alt: true,  desc: 'Yeni Metin Bloğu' },
      deleteBlock:  { key: 'k', ctrl: true,  shift: false, alt: true,  desc: 'Seçili Bloğu Sil' },
      commandPal:   { key: '/', ctrl: false, shift: false, alt: true,  desc: 'Komut Paleti' },
      toggleSide:   { key: 'b', ctrl: true,  shift: false, alt: false, desc: 'Kenar Çubuğunu Aç/Kapat' },
      toggleTheme:  { key: 'd', ctrl: true,  shift: false, alt: false, desc: 'Temayı Değiştir' },
      undo:         { key: 'z', ctrl: true,  shift: false, alt: false, desc: 'Geri Al' },
      redo:         { key: 'z', ctrl: true,  shift: true,  alt: false, desc: 'İleri Al' },
    };
    let shortcuts = {};

    function loadShortcuts() {
      const raw = localStorage.getItem(SHORTCUTS_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          shortcuts = JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
          for (const k of Object.keys(parsed)) {
            if (shortcuts[k]) shortcuts[k] = parsed[k];
          }
          return;
        } catch {}
      }
      shortcuts = JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
    }
    function saveShortcuts() { localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(shortcuts)); }
    function resetShortcuts() { shortcuts = JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS)); saveShortcuts(); }

    function shortcutMatches(e, sc) {
      if ((e.key || '').toLowerCase() !== sc.key.toLowerCase()) return false;
      if (!!e.ctrlKey !== !!sc.ctrl) return false;
      if (!!e.shiftKey !== !!sc.shift) return false;
      if (!!e.altKey !== !!sc.alt) return false;
      return true;
    }

    function formatShortcut(sc) {
      const parts = [];
      if (sc.ctrl) parts.push('Ctrl');
      if (sc.alt) parts.push('Alt');
      if (sc.shift) parts.push('Shift');
      parts.push(sc.key.toUpperCase());
      return parts.join('+');
    }

    loadShortcuts();
