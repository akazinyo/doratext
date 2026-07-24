    /* ----------------- Dragging ----------------- */
    function startDrag(e, block, el) {
      if (e.button !== 0) return;
      if (e.target.closest('.delete-btn') || e.target.closest('.socket')) return;
      if (e.target.closest('.block-content')) return;

      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');

      dragState = {
        block, el,
        startX: e.clientX, startY: e.clientY,
        initialLeft: block.x, initialTop: block.y
      };

      el.addEventListener('pointermove', onDragMove);
      el.addEventListener('pointerup', onDragEnd);
      el.addEventListener('pointercancel', onDragEnd);
    }

    function onDragMove(e) {
      if (!dragState) return;
      e.preventDefault();
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      dragState.block.x = Math.max(0, dragState.initialLeft + dx);
      dragState.block.y = Math.max(0, dragState.initialTop + dy);
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
      const dx = e.clientX - resizeState.startX;
      const dy = e.clientY - resizeState.startY;

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
