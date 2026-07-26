    /* ----------------- State ----------------- */
    const STORAGE_KEY = 'doranote_pages_v1';
    const LEGACY_STORAGE_KEY = 'doranote_workspace_v2';

    let pagesData = {
      activePageId: 'default',
      pagesList: [{ id: 'default', title: 'Ana Notlar', parentId: null }],
      canvasStates: {
        default: { blocks: [], connections: [], freeDrawings: [], independentCodeCards: [] }
      }
    };
    let currentPageId = 'default';

    let blocks = [];
    let connections = [];
    let freeDrawings = [];
    let independentCodeCards = [];
    let nextId = 1;
    let nextConnId = 1;
    let nextDrawingId = 1;
    let nextCodeCardId = 1;
    let dragState = null;
    let resizeState = null;
    let drawState = null;
    let drawingMode = false;
    let freeDrawMode = false;
    let freeDrawState = null;
    let contextTarget = null;
    let savedSelectionRange = null;
    let autocompleteState = null;
    let pendingImageDrop = null;
    let sidebarCollapsed = false;
    let theme = localStorage.getItem('doranote_theme') || 'light';

    /* ----------------- Undo / Redo ----------------- */
    const MAX_UNDO = 30;
    let undoStack = [];
    let redoStack = [];
    let undoCooldown = false;

    function snapshotState() {
      return {
        pagesList: JSON.parse(JSON.stringify(pagesData.pagesList)),
        canvasStates: JSON.parse(JSON.stringify(pagesData.canvasStates)),
        activePageId: pagesData.activePageId
      };
    }

    function pushUndoState() {
      undoStack.push(snapshotState());
      if (undoStack.length > MAX_UNDO) undoStack.shift();
      redoStack = [];
    }

    function undo() {
      if (undoStack.length === 0) return;
      redoStack.push(snapshotState());
      const prev = undoStack.pop();
      pagesData = prev;
      currentPageId = prev.activePageId;
      loadPage(currentPageId);
      pagesData.canvasStates[currentPageId] = getCurrentPageState();
      pagesData.activePageId = currentPageId;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pagesData));
      renderPageList();
      styleHeaderLinks();
    }

    function redo() {
      if (redoStack.length === 0) return;
      undoStack.push(snapshotState());
      const next = redoStack.pop();
      pagesData = next;
      currentPageId = next.activePageId;
      loadPage(currentPageId);
      pagesData.canvasStates[currentPageId] = getCurrentPageState();
      pagesData.activePageId = currentPageId;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pagesData));
      renderPageList();
      styleHeaderLinks();
    }

    /* ----------------- Canvas pan / zoom ----------------- */
    const PAN_KEY = 'doranote_pan';
    let panX = 0, panY = 0, zoom = 1;

    function loadPan() {
      try {
        const saved = JSON.parse(localStorage.getItem(PAN_KEY));
        if (saved) { panX = saved.x || 0; panY = saved.y || 0; zoom = saved.z || 1; }
      } catch {}
    }

    function savePan() {
      localStorage.setItem(PAN_KEY, JSON.stringify({ x: panX, y: panY, z: zoom }));
    }

    function canvasPoint(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - panX) / zoom,
        y: (e.clientY - rect.top - panY) / zoom
      };
    }

    loadPan();
