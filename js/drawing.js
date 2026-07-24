    /* ----------------- Freehand drawing ----------------- */
    function setFreeDrawMode(active) {
      freeDrawMode = active;
      if (active) {
        setDrawingMode(false);
        drawingSvg.classList.add('drawing');
        canvas.classList.add('free-drawing');
        freeDrawBtn.classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-100', 'dark:bg-indigo-900/40');
      } else {
        drawingSvg.classList.remove('drawing');
        canvas.classList.remove('free-drawing');
        freeDrawBtn.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-100', 'dark:bg-indigo-900/40');
        if (freeDrawState) endFreeDraw();
      }
    }

    freeDrawBtn.addEventListener('click', () => {
      setFreeDrawMode(!freeDrawMode);
    });

    /* ----------------- Eraser mode (Drag-based) ----------------- */
    let eraserMode = false;
    let eraserDragState = null;

    function setEraserMode(active) {
      eraserMode = active;
      if (active) {
        setFreeDrawMode(false);
        setDrawingMode(false);
        canvas.classList.add('eraser-mode');
        eraserBtn.classList.add('ring-2', 'ring-red-500', 'bg-red-100', 'dark:bg-red-900/40');
      } else {
        canvas.classList.remove('eraser-mode');
        eraserBtn.classList.remove('ring-2', 'ring-red-500', 'bg-red-100', 'dark:bg-red-900/40');
      }
    }

    eraserBtn.addEventListener('click', () => {
      setEraserMode(!eraserMode);
    });

    function startEraserDrag(e) {
      if (!eraserMode) return;
      if (e.button !== 0) return;
      eraserDragState = { erasedIds: new Set() };
      eraseAtPoint(e);
    }

    function moveEraserDrag(e) {
      if (!eraserDragState) return;
      eraseAtPoint(e);
    }

    function endEraserDrag() {
      if (!eraserDragState) return;
      if (eraserDragState.erasedIds.size > 0) {
        saveWorkspace();
        updateEmptyState();
      }
      eraserDragState = null;
    }

    function eraseAtPoint(e) {
      const rect = canvas.getBoundingClientRect();
      const pt = {
        x: e.clientX - rect.left + canvas.scrollLeft,
        y: e.clientY - rect.top + canvas.scrollTop
      };
      const radius = getSetting('eraserSize');
      let changed = false;

      for (let i = freeDrawings.length - 1; i >= 0; i--) {
        const s = freeDrawings[i];
        if (eraserDragState.erasedIds.has(s.id)) continue;
        for (const p of s.points) {
          const dx = p.x - pt.x;
          const dy = p.y - pt.y;
          if (dx * dx + dy * dy <= radius * radius) {
            eraserDragState.erasedIds.add(s.id);
            freeDrawings.splice(i, 1);
            document.getElementById(`stroke-${s.id}`)?.remove();
            changed = true;
            break;
          }
        }
      }
      if (changed) renderStrokes();
    }

    function cancelEraserDrag() {
      eraserDragState = null;
    }



    function getCanvasPoint(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left + canvas.scrollLeft,
        y: e.clientY - rect.top + canvas.scrollTop
      };
    }

    function startFreeDraw(e) {
      if (!freeDrawMode) return;
      if (e.button !== 0) return;
      if (e.target.closest('.note-block') || e.target.closest('.socket')) return;
      e.preventDefault();

      const pt = getCanvasPoint(e);
      const stroke = {
        id: nextDrawingId++,
        color: getSetting('brushColor'),
        width: getSetting('brushSize') || 3,
        points: [pt]
      };
      freeDrawings.push(stroke);
      freeDrawState = { stroke, currentPath: null };

      renderStroke(stroke);
      freeDrawState.currentPath = document.getElementById(`stroke-${stroke.id}`);
    }

    function updateFreeDraw(e) {
      if (!freeDrawState) return;
      e.preventDefault();
      const pt = getCanvasPoint(e);
      freeDrawState.stroke.points.push(pt);
      updateStrokePath(freeDrawState.stroke, freeDrawState.currentPath);
    }

    function endFreeDraw() {
      if (!freeDrawState) return;
      freeDrawState = null;
      saveWorkspace();
    }

    function pointsToPath(points) {
      if (!points.length) return '';
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i].x} ${points[i].y}`;
      }
      return d;
    }

    function renderStroke(stroke) {
      const existing = document.getElementById(`stroke-${stroke.id}`);
      if (existing) existing.remove();

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.id = `stroke-${stroke.id}`;
      g.classList.add('stroke-group');
      g.dataset.strokeId = stroke.id;

      const color = getThemeColor(stroke.color);
      const d = pointsToPath(stroke.points);

      const hit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hit.setAttribute('d', d);
      hit.setAttribute('class', 'free-stroke-hit');
      hit.setAttribute('stroke-width', (stroke.width + 12));

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'free-stroke');
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', stroke.width);

      g.appendChild(hit);
      g.appendChild(path);
      drawingSvg.appendChild(g);

      g.addEventListener('dblclick', () => deleteStroke(stroke.id));
    }

    function updateStrokePath(stroke, el) {
      if (!el) el = document.getElementById(`stroke-${stroke.id}`);
      if (!el) return;
      const d = pointsToPath(stroke.points);
      const paths = el.querySelectorAll('path');
      paths.forEach(p => p.setAttribute('d', d));
    }

    function renderStrokes() {
      drawingSvg.querySelectorAll('.stroke-group').forEach(el => el.remove());
      freeDrawings.forEach(s => renderStroke(s));
    }

    function deleteStroke(id) {
      freeDrawings = freeDrawings.filter(s => s.id !== id);
      document.getElementById(`stroke-${id}`)?.remove();
      saveWorkspace();
      updateEmptyState();
    }
