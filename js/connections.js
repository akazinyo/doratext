    /* ----------------- Geometry helpers ----------------- */
    function getSocketPoint(blockId, side) {
      const block = blocks.find(b => b.id === blockId);
      if (!block) return null;
      const x = block.x + block.width / 2;
      const y = block.y + block.height / 2;
      switch (side) {
        case 'top': return { x, y: block.y };
        case 'right': return { x: block.x + block.width, y };
        case 'bottom': return { x, y: block.y + block.height };
        case 'left': return { x: block.x, y };
        default: return { x, y };
      }
    }

    function getSocketNormal(side) {
      switch (side) {
        case 'top': return { x: 0, y: -1 };
        case 'right': return { x: 1, y: 0 };
        case 'bottom': return { x: 0, y: 1 };
        case 'left': return { x: -1, y: 0 };
      }
    }

    /* ----------------- Connections ----------------- */
    function createConnection(fromId, fromSide, toId, toSide) {
      if (fromId === toId) return;
      const exists = connections.find(c =>
        c.fromId === fromId && c.fromSide === fromSide && c.toId === toId && c.toSide === toSide
      );
      if (exists) return;

      const conn = {
        id: nextConnId++,
        fromId, fromSide, toId, toSide,
        color: getSetting('brushColor'),
        style: lineStyleSelect.value
      };
      connections.push(conn);
      renderConnections();
      saveWorkspace();
    }

    function removeConnectionsForBlock(blockId) {
      connections = connections.filter(c => c.fromId !== blockId && c.toId !== blockId);
      renderConnections();
    }

    function deleteConnection(id) {
      connections = connections.filter(c => c.id !== id);
      renderConnections();
      saveWorkspace();
      updateEmptyState();
    }

    function getThemeColor(hex) {
      if (hex === '#334155') return document.documentElement.classList.contains('dark') ? '#94a3b8' : '#334155';
      return hex;
    }

    function renderConnections() {
      // Remove old paths (keep defs)
      const oldPaths = svg.querySelectorAll('.connection-group, .preview-line');
      oldPaths.forEach(p => p.remove());

      connections.forEach(conn => {
        const start = getSocketPoint(conn.fromId, conn.fromSide);
        const end = getSocketPoint(conn.toId, conn.toSide);
        if (!start || !end) return;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('connection-group');
        g.dataset.connId = conn.id;

        const color = getThemeColor(conn.color);
        const dash = conn.style === 'dashed' ? '7,5' : 'none';
        const d = buildPath(start, end, conn.fromSide, conn.toSide, conn.style);

        const hit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hit.setAttribute('d', d);
        hit.setAttribute('class', 'connection-hit');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', 'connection-path');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-dasharray', dash);
        path.setAttribute('marker-end', 'url(#arrowhead)');

        // Update arrowhead fill color dynamically
        const markerPolygon = document.getElementById('arrowhead')?.querySelector('polygon');
        if (markerPolygon) markerPolygon.setAttribute('fill', color);

        g.appendChild(hit);
        g.appendChild(path);
        svg.appendChild(g);

        g.addEventListener('dblclick', () => deleteConnection(conn.id));
      });
    }

    function buildPath(start, end, fromSide, toSide, style) {
      if (style === 'straight' || style === 'dashed') {
        return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      }
      // Curved bezier
      const n1 = getSocketNormal(fromSide);
      const n2 = getSocketNormal(toSide);
      const dist = Math.hypot(end.x - start.x, end.y - start.y);
      const cpDist = Math.max(40, dist * 0.45);
      const cp1 = { x: start.x + n1.x * cpDist, y: start.y + n1.y * cpDist };
      const cp2 = { x: end.x + n2.x * cpDist, y: end.y + n2.y * cpDist };
      return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
    }

    function updateConnectionsRealtime() {
      renderConnections();
    }

    /* ----------------- Drawing connections ----------------- */
    function startDrawConnection(e, block, side, socket) {
      if (freeDrawMode) return;
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      const startPt = getSocketPoint(block.id, side);
      drawState = {
        fromId: block.id,
        fromSide: side,
        startX: startPt.x,
        startY: startPt.y,
        preview: document.createElementNS('http://www.w3.org/2000/svg', 'path')
      };

      drawState.preview.setAttribute('class', 'preview-line');
      drawState.preview.setAttribute('stroke', getSetting('brushColor'));
      drawState.preview.setAttribute('stroke-dasharray', '5,5');
      svg.appendChild(drawState.preview);

      socket.classList.add('active');
      setDrawingMode(true);

      window.addEventListener('pointermove', onDrawMove);
      window.addEventListener('pointerup', onDrawEnd);
    }

    function onDrawMove(e) {
      if (!drawState) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left + canvas.scrollLeft;
      const y = e.clientY - rect.top + canvas.scrollTop;
      const d = buildPath(
        { x: drawState.startX, y: drawState.startY },
        { x, y },
        drawState.fromSide,
        'left',
        'curved'
      );
      drawState.preview.setAttribute('d', d);
    }

    function onDrawEnd(e) {
      if (!drawState) return;

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const socket = target?.closest('.socket');

      if (socket) {
        const toId = parseInt(socket.dataset.blockId, 10);
        const toSide = socket.dataset.side;
        createConnection(drawState.fromId, drawState.fromSide, toId, toSide);
      }

      drawState.preview.remove();
      document.querySelectorAll('.socket.active').forEach(s => s.classList.remove('active'));
      drawState = null;
      setDrawingMode(false);

      window.removeEventListener('pointermove', onDrawMove);
      window.removeEventListener('pointerup', onDrawEnd);
    }

    function setDrawingMode(active) {
      drawingMode = active;
      if (active) {
        setFreeDrawMode(false);
        svg.classList.add('drawing');
        canvas.classList.add('drawing');
        drawLineBtn.classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-100', 'dark:bg-indigo-900/40');
      } else {
        svg.classList.remove('drawing');
        canvas.classList.remove('drawing');
        drawLineBtn.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-100', 'dark:bg-indigo-900/40');
      }
    }

    drawLineBtn.addEventListener('click', () => {
      setDrawingMode(!drawingMode);
    });
