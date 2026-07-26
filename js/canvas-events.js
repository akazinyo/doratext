    /* ----------------- Add text ----------------- */
    addTextBtn.addEventListener('click', () => {
      const block = createBlock('text');
      const content = document.querySelector(`#block-${block.id} .block-content`);
      if (content) content.focus();
    });

    /* ----------------- Page management ----------------- */
    newPageBtn.addEventListener('click', () => {
      const title = prompt(t('page.promptName'), t('page.promptNew'));
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
      if (confirm(t('canvas.clearConfirm'))) {
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
      if (e.button === 1) return;
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

    /* ----------------- Canvas Pan (middle mouse) & Zoom (Ctrl+scroll) ----------------- */
    const canvasZoom = document.getElementById('canvas-zoom');
    let isPanning = false;
    let panStartX, panStartY, panPanX, panPanY;

    canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 1) return;
      e.preventDefault();
      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      panPanX = panX;
      panPanY = panY;
      canvas.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isPanning) return;
      panX = panPanX + (e.clientX - panStartX);
      panY = panPanY + (e.clientY - panStartY);
      updateCanvasTransform();
      savePan();
    });

    document.addEventListener('mouseup', () => {
      if (!isPanning) return;
      isPanning = false;
      canvas.style.cursor = '';
    });

    canvas.addEventListener('wheel', (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const prev = zoom;
      zoom = Math.max(0.1, Math.min(10, zoom + delta));
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      panX = mx - (mx - panX) * (zoom / prev);
      panY = my - (my - panY) * (zoom / prev);
      updateCanvasTransform();
      savePan();
    }, { passive: false });

    function updateCanvasTransform() {
      canvasZoom.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    }

    // Center initial view
    updateCanvasTransform();