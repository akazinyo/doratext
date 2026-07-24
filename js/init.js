    /* ----------------- Global Keydown Handler ----------------- */
    document.addEventListener('keydown', (e) => {
      if (shortcutsPanelEl.classList.contains('open')) return;
      if (e.target.closest('.block-content[contenteditable], input, textarea, select')) return;

      for (const [id, sc] of Object.entries(shortcuts)) {
        if (shortcutMatches(e, sc)) {
          e.preventDefault();
          switch (id) {
            case 'newPage':
              const title = prompt('Sayfa adı girin:', 'Yeni Sayfa');
              if (title && title.trim()) createPage(title.trim());
              break;
            case 'newTextBlock':
              const block = createBlock('text');
              const content = document.querySelector(`#block-${block.id} .block-content`);
              if (content) content.focus();
              break;
            case 'deleteBlock':
              if (blocks.length > 0) {
                const last = blocks[blocks.length - 1];
                if (confirm('Son bloğu silmek istiyor musunuz?')) deleteBlock(last.id);
              }
              break;
            case 'toggleSide':
              toggleSidebar.click();
              break;
            case 'toggleTheme':
              themeToggle.click();
              break;
            case 'commandPal':
              showShortcutsPanel();
              break;
            case 'undo':
              undo();
              break;
            case 'redo':
              redo();
              break;
          }
          return;
        }
      }
    });

    /* ----------------- Init ----------------- */
    loadWorkspace();
    lucide.createIcons();
