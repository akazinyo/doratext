    /* ----------------- Marquee (box) selection ----------------- */
    let marqueeState = null;

    function applyBlockSelection() {
      document.querySelectorAll('.note-block').forEach(el => {
        const id = parseInt(el.id.replace('block-', ''), 10);
        el.classList.toggle('selected', selectedBlockIds.has(id));
      });
      document.querySelectorAll('.independent-code-card').forEach(el => {
        const id = parseInt(el.dataset.id, 10);
        el.classList.toggle('selected', selectedCardIds.has(id));
      });
    }

    function clearSelection() {
      selectedBlockIds.clear();
      selectedCardIds.clear();
      applyBlockSelection();
    }

    function onMarqueeMove(e) {
      if (!marqueeState) return;
      const pt = canvasPoint(e);
      const x = Math.min(marqueeState.startPt.x, pt.x);
      const y = Math.min(marqueeState.startPt.y, pt.y);
      marqueeState.rect.style.left = x + 'px';
      marqueeState.rect.style.top = y + 'px';
      marqueeState.rect.style.width = Math.abs(pt.x - marqueeState.startPt.x) + 'px';
      marqueeState.rect.style.height = Math.abs(pt.y - marqueeState.startPt.y) + 'px';
    }

    function onMarqueeEnd(e) {
      if (!marqueeState) return;
      const endPt = canvasPoint(e);
      marqueeState.rect.remove();
      window.removeEventListener('pointermove', onMarqueeMove);
      window.removeEventListener('pointerup', onMarqueeEnd);
      window.removeEventListener('pointercancel', onMarqueeEnd);

      const x = Math.min(marqueeState.startPt.x, endPt.x);
      const y = Math.min(marqueeState.startPt.y, endPt.y);
      const w = Math.abs(endPt.x - marqueeState.startPt.x);
      const h = Math.abs(endPt.y - marqueeState.startPt.y);
      marqueeState = null;

      if (w < 5 && h < 5) { clearSelection(); return; }

      selectedBlockIds.clear();
      selectedCardIds.clear();
      blocks.forEach(b => {
        if (b.x < x + w && b.x + b.width > x && b.y < y + h && b.y + b.height > y) {
          selectedBlockIds.add(b.id);
        }
      });
      independentCodeCards.forEach(c => {
        const cw = c.width || 500, ch = c.height || 200;
        if (c.x < x + cw && c.x + cw > x && c.y < y + ch && c.y + ch > y) {
          selectedCardIds.add(c.id);
        }
      });
      applyBlockSelection();
    }

    /* ----------------- Add (+) dropdown menu ----------------- */
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addMenu.classList.toggle('hidden');
      lucide.createIcons({ parent: addMenu });
    });

    addMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = e.target.closest('[data-action]');
      if (!item) return;
      const action = item.dataset.action;
      addMenu.classList.add('hidden');
      if (action === 'addText') {
        const block = createBlock('text');
        const content = document.querySelector(`#block-${block.id} .block-content`);
        if (content) content.focus();
      } else if (action === 'addImage') {
        imageInput.click();
      } else if (action === 'addFile') {
        fileInput.click();
      } else if (action === 'createCodeCard') {
        const x = -panX / zoom + 80;
        const y = -panY / zoom + 80;
        createIndependentCodeCard(x, y);
      }
    });

    document.addEventListener('click', (e) => {
      if (!addMenuWrap.contains(e.target)) addMenu.classList.add('hidden');
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
        clearSelection();
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
      if (e.target.closest('.independent-code-card')) return;
      if (e.target.closest('svg')) return;
      if (eraserMode) { startEraserDrag(e); return; }
      if (freeDrawMode) { startFreeDraw(e); return; }
      if (drawingMode) return;

      const startPt = canvasPoint(e);
      const rect = document.createElement('div');
      rect.id = 'selection-rect';
      canvasZoom.appendChild(rect);
      marqueeState = { startPt, rect };

      window.addEventListener('pointermove', onMarqueeMove);
      window.addEventListener('pointerup', onMarqueeEnd);
      window.addEventListener('pointercancel', onMarqueeEnd);
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