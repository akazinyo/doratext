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
