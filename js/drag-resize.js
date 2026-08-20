    /* ----------------- Dragging ----------------- */
    function startDrag(e, block, el) {
      if (e.button !== 0) return;
      if (e.target.closest('.delete-btn') || e.target.closest('.socket')) return;
      if (e.target.closest('.block-content')) return;

      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');

      const multi = selectedBlockIds.has(block.id) && (selectedBlockIds.size + selectedCardIds.size) > 1;
      if (!multi) {
        selectedBlockIds.clear();
        selectedCardIds.clear();
        selectedBlockIds.add(block.id);
      }
      applyBlockSelection();

      const positions = new Map();
      if (multi) {
        for (const b of blocks) if (selectedBlockIds.has(b.id)) positions.set(b.id, { x: b.x, y: b.y });
        for (const c of independentCodeCards) if (selectedCardIds.has(c.id)) positions.set(c.id, { x: c.x, y: c.y });
      }

      dragState = {
        block, el,
        startX: e.clientX, startY: e.clientY,
        initialLeft: block.x, initialTop: block.y,
        multi, positions
      };

      el.addEventListener('pointermove', onDragMove);
      el.addEventListener('pointerup', onDragEnd);
      el.addEventListener('pointercancel', onDragEnd);
    }

    function onDragMove(e) {
      if (!dragState) return;
      e.preventDefault();
      const dx = (e.clientX - dragState.startX) / zoom;
      const dy = (e.clientY - dragState.startY) / zoom;

      if (dragState.multi) {
        for (const [id, pos] of dragState.positions) {
          const b = blocks.find(x => x.id === id);
          if (b) {
            b.x = pos.x + dx;
            b.y = pos.y + dy;
            const bel = document.getElementById(`block-${b.id}`);
            if (bel) { bel.style.left = b.x + 'px'; bel.style.top = b.y + 'px'; }
          } else {
            const c = independentCodeCards.find(x => x.id === id);
            if (c) {
              c.x = pos.x + dx;
              c.y = pos.y + dy;
              const cel = document.querySelector(`.independent-code-card[data-id="${c.id}"]`);
              if (cel) { cel.style.left = c.x + 'px'; cel.style.top = c.y + 'px'; }
            }
          }
        }
        updateConnectionsRealtime();
        return;
      }

      dragState.block.x = dragState.initialLeft + dx;
      dragState.block.y = dragState.initialTop + dy;
      dragState.el.style.left = `${dragState.block.x}px`;
      dragState.el.style.top = `${dragState.block.y}px`;
      updateConnectionsRealtime();
    }

    function onDragEnd(e) {
      if (!dragState) return;
      const { el } = dragState;
      el.classList.remove('dragging');
      el.releasePointerCapture(e.pointerId);
      el.removeEventListener('pointermove', onDragMove);
      el.removeEventListener('pointerup', onDragEnd);
      el.removeEventListener('pointercancel', onDragEnd);
      dragState = null;
      saveWorkspace();
    }
 
    /* ----------------- Resizing ----------------- */
    function startResize(e, block, el) {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      el.setPointerCapture(e.pointerId);
      el.classList.add('resizing');

      resizeState = {
        block, el,
        startX: e.clientX, startY: e.clientY,
        initialWidth: block.width, initialHeight: block.height
      };

      el.addEventListener('pointermove', onResizeMove);
      el.addEventListener('pointerup', onResizeEnd);
      el.addEventListener('pointercancel', onResizeEnd);
    }

    function onResizeMove(e) {
      if (!resizeState) return;
      e.preventDefault();
      const dx = (e.clientX - resizeState.startX) / zoom;
      const dy = (e.clientY - resizeState.startY) / zoom;

      let newW = Math.max(120, resizeState.initialWidth + dx);
      let newH = Math.max(80, resizeState.initialHeight + dy);

      if (resizeState.block.type === 'image') {
        const ratio = resizeState.initialWidth / resizeState.initialHeight;
        if (Math.abs(dx / resizeState.initialWidth) > Math.abs(dy / resizeState.initialHeight)) {
          newH = newW / ratio;
        } else {
          newW = newH * ratio;
        }
      }

      resizeState.block.width = newW;
      resizeState.block.height = newH;
      resizeState.el.style.width = `${newW}px`;
      resizeState.el.style.height = `${newH}px`;
      updateConnectionsRealtime();
    }

    function onResizeEnd(e) {
      if (!resizeState) return;
      const { el } = resizeState;
      el.classList.remove('resizing');
      el.releasePointerCapture(e.pointerId);
      el.removeEventListener('pointermove', onResizeMove);
      el.removeEventListener('pointerup', onResizeEnd);
      el.removeEventListener('pointercancel', onResizeEnd);
      resizeState = null;
      saveWorkspace();
    }
