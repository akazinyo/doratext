/* ----------------- Persistence ----------------- */
function getCurrentPageState() {
  return {
    blocks: blocks.map(b => ({
      id: b.id, type: b.type, content: b.content,
      x: b.x, y: b.y, width: b.width, height: b.height,
      bgColor: b.bgColor, fontSize: b.fontSize
    })),
    connections: connections.map(c => ({
      id: c.id,
      fromId: c.fromId, fromSide: c.fromSide,
      toId: c.toId, toSide: c.toSide,
      color: c.color, style: c.style
    })),
    freeDrawings: freeDrawings,
    independentCodeCards: independentCodeCards.map(c => ({
      id: c.id, x: c.x, y: c.y,
      width: c.width, height: c.height,
      language: c.language, code: c.code
    }))
  };
}

function saveWorkspace() {
  if (!undoCooldown) {
    undoCooldown = true;
    setTimeout(() => { undoCooldown = false; }, 1500);
    pushUndoState();
  }
  pagesData.canvasStates[currentPageId] = getCurrentPageState();
  pagesData.activePageId = currentPageId;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pagesData));
}

function loadWorkspace() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // Try to migrate from legacy single-page storage
    migrateLegacyData();
    return;
  }
  try {
    const data = JSON.parse(raw);
    pagesData = {
      activePageId: data.activePageId || 'default',
      pagesList: Array.isArray(data.pagesList) ? data.pagesList.map(p => ({ ...p, parentId: p.parentId ?? null })) : [{ id: 'default', title: 'Ana Notlar', parentId: null }],
      canvasStates: data.canvasStates || { default: { blocks: [], connections: [], freeDrawings: [], independentCodeCards: [] } }
    };
    currentPageId = pagesData.activePageId;
    if (!pagesData.pagesList.find(p => p.id === currentPageId)) {
      currentPageId = pagesData.pagesList[0]?.id || 'default';
      pagesData.activePageId = currentPageId;
    }
    loadPage(currentPageId);
    renderPageList();
  } catch (e) {
    console.error('Failed to load workspace', e);
    migrateLegacyData();
  }
}

function migrateLegacyData() {
  const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!legacyRaw) {
    loadPage('default');
    renderPageList();
    return;
  }
  try {
    const data = JSON.parse(legacyRaw);
    const legacyBlocks = Array.isArray(data.blocks) ? data.blocks : [];
    const legacyConnections = Array.isArray(data.connections) ? data.connections : [];
    const legacyDrawings = Array.isArray(data.freeDrawings)
      ? data.freeDrawings
      : (Array.isArray(data.strokes) ? data.strokes : []);
    pagesData = {
      activePageId: 'default',
  pagesList: [{ id: 'default', title: 'Ana Notlar', parentId: null }],
      canvasStates: {
        default: {
          blocks: legacyBlocks,
          connections: legacyConnections,
          freeDrawings: legacyDrawings,
          independentCodeCards: []
        }
      }
    };
    currentPageId = 'default';
    loadPage('default');
    renderPageList();
    saveWorkspace();
  } catch (e) {
    console.error('Failed to migrate legacy data', e);
    loadPage('default');
    renderPageList();
  }
}
