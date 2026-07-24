    /* ----------------- Add text ----------------- */
    addTextBtn.addEventListener('click', () => {
      const block = createBlock('text');
      const content = document.querySelector(`#block-${block.id} .block-content`);
      if (content) content.focus();
    });

    /* ----------------- Page management ----------------- */
    newPageBtn.addEventListener('click', () => {
      const title = prompt('Sayfa adı girin:', 'Yeni Sayfa');
      if (title !== null && title.trim() !== '') {
        createPage(title.trim());
      }
    });

    toggleSidebar.addEventListener('click', () => {
      sidebarCollapsed = !sidebarCollapsed;
      sidebar.classList.toggle('collapsed', sidebarCollapsed);
      sidebar.querySelector('.sidebar-icon-open').classList.toggle('hidden', sidebarCollapsed);
      sidebar.querySelector('.sidebar-icon-closed').classList.toggle('hidden', !sidebarCollapsed);
    });

    /* ----------------- Clear canvas ----------------- */
    clearBtn.addEventListener('click', () => {
      if (!blocks.length && !connections.length && !freeDrawings.length && !independentCodeCards.length) return;
      if (confirm('Mevcut sayfayı temizlemek istiyor musunuz? Bu işlem geri alınamaz.')) {
        blocks = [];
        connections = [];
        freeDrawings = [];
        independentCodeCards = [];
        document.querySelectorAll('.note-block').forEach(el => el.remove());
        document.querySelectorAll('.independent-code-card').forEach(el => el.remove());
        renderConnections();
        renderStrokes();
        nextId = 1;
        nextConnId = 1;
        nextDrawingId = 1;
        nextCodeCardId = 1;
        saveWorkspace();
        updateEmptyState();
      }
    });

    /* ----------------- Canvas free drawing & eraser events ----------------- */
    canvas.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.note-block')) return;
      if (eraserMode) { startEraserDrag(e); return; }
      startFreeDraw(e);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (eraserMode) { moveEraserDrag(e); return; }
      updateFreeDraw(e);
    });
    canvas.addEventListener('pointerup', () => {
      if (eraserMode) { endEraserDrag(); return; }
      endFreeDraw();
    });
    canvas.addEventListener('pointercancel', () => {
      if (eraserMode) { cancelEraserDrag(); return; }
      endFreeDraw();
    });
    canvas.addEventListener('pointerleave', () => {
      if (eraserMode) { cancelEraserDrag(); return; }
      endFreeDraw();
    });
