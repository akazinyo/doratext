/* ----------------- @-Mention Autocomplete ----------------- */
function detectAtQuery(range, content) {
  const node = range.startContainer;
  const offset = range.startOffset;

  if (node.nodeType !== Node.TEXT_NODE) return { query: null };
  if (!content.contains(node)) return { query: null };

  const text = node.textContent;
  const beforeCursor = text.slice(0, offset);

  const lastAt = beforeCursor.lastIndexOf('@');
  if (lastAt === -1) return { query: null };

  const queryPart = beforeCursor.slice(lastAt + 1);
  if (/\s/.test(queryPart)) return { query: null };

  const beforeAt = beforeCursor.slice(0, lastAt);
  if (beforeAt.length > 0 && !/\s$/.test(beforeAt)) return { query: null };

  return {
    query: queryPart,
    startNode: node,
    startOffset: lastAt
  };
}

function filterPagesByQuery(query) {
  const q = query.toLowerCase();
  return pagesData.pagesList.filter(p => (p.title || '').toLowerCase().includes(q));
}

function showAutocompleteDropdown(content, block, query, startNode, startOffset) {
  const items = filterPagesByQuery(query);
  autocompleteState = {
    content,
    block,
    query,
    startNode,
    startOffset,
    items,
    activeIndex: 0
  };
  renderAutocompleteDropdown();
  positionAutocompleteDropdown();
}

function hideAutocompleteDropdown() {
  autocompleteState = null;
  autocompleteDropdown.classList.add('hidden');
}

function renderAutocompleteDropdown() {
  if (!autocompleteState) {
    hideAutocompleteDropdown();
    return;
  }

  const { items, query, activeIndex } = autocompleteState;

  if (items.length === 0) {
    autocompleteList.innerHTML = `
      <div class="autocomplete-item autocomplete-create-new active" data-action="create-new">
        <i data-lucide="plus-circle" class="w-4 h-4"></i>
        <span class="text-sm">Yeni Proje Oluştur: '${escapeHtml(query)}'</span>
      </div>
    `;
  } else {
    autocompleteList.innerHTML = items.map((page, index) => `
      <div class="autocomplete-item ${index === activeIndex ? 'active' : ''}" data-index="${index}" data-page-id="${page.id}">
        <i data-lucide="file-text" class="w-4 h-4"></i>
        <span class="text-sm">${escapeHtml(page.title || 'İsimsiz')}</span>
      </div>
    `).join('');
  }

  autocompleteDropdown.classList.remove('hidden');
  lucide.createIcons({ parent: autocompleteDropdown });
}

function positionAutocompleteDropdown() {
  if (!autocompleteState) return;
  const { startNode, startOffset, query } = autocompleteState;

  const range = document.createRange();
  range.setStart(startNode, startOffset + 1 + query.length);
  range.setEnd(startNode, startOffset + 1 + query.length);

  const rect = range.getBoundingClientRect();
  const dropdownRect = autocompleteDropdown.getBoundingClientRect();

  let left = rect.left;
  let top = rect.bottom + 4;

  if (left + dropdownRect.width > window.innerWidth) {
    left = window.innerWidth - dropdownRect.width - 8;
  }
  if (top + dropdownRect.height > window.innerHeight) {
    top = rect.top - dropdownRect.height - 4;
  }
  if (left < 8) left = 8;
  if (top < 8) top = 8;

  autocompleteDropdown.style.left = `${left}px`;
  autocompleteDropdown.style.top = `${top}px`;
}

function selectAutocompleteItem(index) {
  if (!autocompleteState) return;
  const { content, block, query, startNode, startOffset, items } = autocompleteState;

  let page;
  if (items.length === 0) {
    const title = query.trim();
    if (!title) return;
    page = createPageSilent(title);
  } else {
    page = items[index];
  }
  if (!page) return;

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(startNode, startOffset + 1 + query.length);
  range.deleteContents();

  const badge = createProjectLink(page.id, page.title, `@${page.title}`);
  range.insertNode(badge);
  const space = document.createTextNode('\u00A0');
  badge.after(space);

  const sel = window.getSelection();
  const newRange = document.createRange();
  newRange.setStartAfter(space);
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange);

  lucide.createIcons({ parent: content });
  block.content = content.innerHTML;
  saveWorkspace();
  hideAutocompleteDropdown();
}
