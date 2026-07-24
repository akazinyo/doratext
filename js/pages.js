function loadPage(pageId) {
  const state = pagesData.canvasStates[pageId];
  if (state) {
    blocks = Array.isArray(state.blocks) ? state.blocks : [];
    connections = Array.isArray(state.connections) ? state.connections : [];
    freeDrawings = Array.isArray(state.freeDrawings)
      ? state.freeDrawings
      : (Array.isArray(state.strokes) ? state.strokes : []);
    independentCodeCards = Array.isArray(state.independentCodeCards) ? state.independentCodeCards : [];
  } else {
    blocks = [];
    connections = [];
    freeDrawings = [];
    independentCodeCards = [];
  }
  nextId = blocks.reduce((max, b) => Math.max(max, b.id || 0), 0) + 1;
  nextConnId = connections.reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
  nextDrawingId = freeDrawings.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1;
  nextCodeCardId = independentCodeCards.reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;

  document.querySelectorAll('.note-block').forEach(el => el.remove());
  document.querySelectorAll('.independent-code-card').forEach(el => el.remove());
  blocks.forEach(b => renderBlock(b));
  independentCodeCards.forEach(c => renderIndependentCodeCard(c));
  renderConnections();
  renderStrokes();
  updateEmptyState();
  detectHeadersAndCreateSubPages();
  styleHeaderLinks();
}

function generatePageId() {
  return 'page-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

function getSubPages(parentId) {
  return pagesData.pagesList.filter(p => p.parentId === parentId);
}

function deleteSubPagesRecursive(parentId) {
  const children = getSubPages(parentId);
  children.forEach(child => {
    deleteSubPagesRecursive(child.id);
    pagesData.pagesList = pagesData.pagesList.filter(p => p.id !== child.id);
    delete pagesData.canvasStates[child.id];
  });
}

function extractHeadersFromHTML(html) {
  const headers = [];
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      headers.push(trimmed.slice(2).trim());
    }
  }
  return headers;
}

function detectHeadersAndCreateSubPages() {
  if (!currentPageId) return;
  const allHeaders = new Set();
  for (const b of blocks) {
    if (b.type === 'text') {
      const headers = extractHeadersFromHTML(b.content);
      headers.forEach(h => allHeaders.add(h));
    }
  }
  const currentHeaders = [...allHeaders];
  const existingSubPages = getSubPages(currentPageId);

  let changed = false;

  for (const sub of existingSubPages) {
    if (!currentHeaders.includes(sub.title)) {
      deleteSubPagesRecursive(sub.id);
      pagesData.pagesList = pagesData.pagesList.filter(p => p.id !== sub.id);
      delete pagesData.canvasStates[sub.id];
      changed = true;
    }
  }

  for (const header of currentHeaders) {
    if (!existingSubPages.find(p => p.title === header)) {
      const id = generatePageId();
      pagesData.pagesList.push({ id, title: header, parentId: currentPageId });
      pagesData.canvasStates[id] = { blocks: [], connections: [], freeDrawings: [], independentCodeCards: [] };
      changed = true;
    }
  }

  if (changed) {
    renderPageList();
    saveWorkspace();
  }
}

function styleHeaderLinks() {
  const sel = window.getSelection();
  let savedOffset = -1;
  let savedEl = null;
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      savedEl = range.startContainer.parentElement;
      if (savedEl) {
        const full = savedEl.textContent;
        let pos = 0;
        const walk = document.createTreeWalker(savedEl.parentElement, NodeFilter.SHOW_TEXT, null, false);
        let n;
        while ((n = walk.nextNode())) {
          if (n === range.startContainer) { pos += range.startOffset; break; }
          pos += n.textContent.length;
        }
        savedOffset = pos;
      }
    }
  }

  document.querySelectorAll('.block-content').forEach(content => {
    for (const child of content.children) {
      if (child.tagName !== 'DIV' && child.tagName !== 'P') continue;
      const text = child.textContent.trim();
      const isHeader = !!text.match(/^# .+/);
      const existing = child.querySelector('.header-badge');
      if (isHeader && !existing) {
        const match = child.textContent.match(/^(# .+?)(\s*)$/);
        if (match) {
          child.innerHTML = '';
          const span = document.createElement('span');
          span.className = 'header-badge';
          span.textContent = match[1];
          child.appendChild(span);
          if (match[2]) child.appendChild(document.createTextNode(match[2]));
        }
      } else if (!isHeader && existing) {
        const restored = existing.textContent + (child.lastChild?.textContent || '');
        child.textContent = restored;
      }
    }
  });

  if (savedOffset >= 0 && savedEl) {
    const parent = savedEl.parentElement;
    if (parent) {
      const walk = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT, null, false);
      let pos = 0;
      let targetNode = null;
      let targetOffset = 0;
      let n;
      while ((n = walk.nextNode())) {
        if (pos + n.textContent.length >= savedOffset) {
          targetNode = n;
          targetOffset = savedOffset - pos;
          break;
        }
        pos += n.textContent.length;
      }
      if (targetNode) {
        const range = document.createRange();
        range.setStart(targetNode, Math.min(targetOffset, targetNode.textContent.length));
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
}

function createPage(title) {
  const id = generatePageId();
  pagesData.pagesList.push({ id, title, parentId: null });
  pagesData.canvasStates[id] = { blocks: [], connections: [], freeDrawings: [] };
  switchPage(id);
  renderPageList();
  saveWorkspace();
}

function switchPage(pageId) {
  if (pageId === currentPageId) return;
  saveWorkspace();
  currentPageId = pageId;
  pagesData.activePageId = pageId;
  loadPage(pageId);
  renderPageList();
}

function deletePage(pageId) {
  if (pagesData.pagesList.length <= 1) {
    alert('En az bir sayfa bulundurmalısınız.');
    return;
  }
  const page = pagesData.pagesList.find(p => p.id === pageId);
  if (!confirm(`"${page?.title || 'İsimsiz'}" sayfasını silmek istiyor musunuz? Bu işlem geri alınamaz.`)) return;

  deleteSubPagesRecursive(pageId);
  pagesData.pagesList = pagesData.pagesList.filter(p => p.id !== pageId);
  delete pagesData.canvasStates[pageId];

  if (currentPageId === pageId) {
    currentPageId = pagesData.pagesList[0].id;
    pagesData.activePageId = currentPageId;
    loadPage(currentPageId);
  }
  renderPageList();
  saveWorkspace();
}

function renamePage(pageId, newTitle) {
  const page = pagesData.pagesList.find(p => p.id === pageId);
  if (!page) return;
  const trimmed = (newTitle || '').trim();
  if (trimmed) {
    page.title = trimmed;
    renderPageList();
    saveWorkspace();
  }
}

/* ----------------- Project / Page Linking ----------------- */
function findPageByTitle(title) {
  const normalized = (title || '').trim().toLowerCase();
  return pagesData.pagesList.find(p => (p.title || '').trim().toLowerCase() === normalized);
}

function createProjectLink(pageId, pageTitle, displayText) {
  const badge = document.createElement('span');
  badge.className = 'project-link-tag';
  badge.contentEditable = 'false';
  badge.dataset.targetPageId = pageId;
  badge.dataset.targetPageTitle = pageTitle;
  badge.title = `Open page: ${pageTitle}`;
  badge.innerHTML = `<i data-lucide="link" class="w-3 h-3"></i>${escapeHtml(displayText || pageTitle)}`;
  return badge;
}

function parseProjectLinks(content, block) {
  if (content.dataset.parsing === 'true') return;
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    // Skip text nodes that are inside a project link badge or todo text
    if (node.parentElement?.closest('.project-link-tag, .todo-text')) continue;
    textNodes.push(node);
  }

  let replaced = false;
  for (const textNode of textNodes) {
    const text = textNode.textContent;
    let match;
    const bracketRegex = /\[\[([^\]]+)\]\]/g;

    // Convert [[Page Name]] syntax automatically
    bracketRegex.lastIndex = 0;
    while ((match = bracketRegex.exec(text)) !== null) {
      const raw = match[0];
      const title = match[1];
      const page = findPageByTitle(title);
      if (page) {
        replaceTextWithProjectLink(textNode, match.index, raw.length, page, raw);
        replaced = true;
        break;
      }
    }
    if (replaced) break;
  }

  if (replaced) {
    lucide.createIcons({ parent: content });
    block.content = content.innerHTML;
    saveWorkspace();
  }
}

function replaceTextWithProjectLink(textNode, start, length, page, displayText) {
  const range = document.createRange();
  range.setStart(textNode, start);
  range.setEnd(textNode, start + length);
  range.deleteContents();
  const badge = createProjectLink(page.id, page.title, displayText);
  range.insertNode(badge);
  const space = document.createTextNode('\u00A0');
  badge.after(space);
  const sel = window.getSelection();
  const newRange = document.createRange();
  newRange.setStartAfter(space);
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange);
}

function createPageSilent(title) {
  const id = generatePageId();
  const page = { id, title, parentId: null };
  pagesData.pagesList.push(page);
  pagesData.canvasStates[id] = { blocks: [], connections: [], freeDrawings: [] };
  renderPageList();
  saveWorkspace();
  return page;
}
