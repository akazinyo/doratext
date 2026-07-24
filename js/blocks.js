/* ----------------- Block factory ----------------- */
function createBlock(type, content = '', x = null, y = null, width = null, height = null) {
  const scrollLeft = canvas.scrollLeft;
  const scrollTop = canvas.scrollTop;
  const defaults = { text: { w: 320, h: 180 }, image: { w: 300, h: 200 } };

  const block = {
    id: nextId++, type, content,
    x: x ?? scrollLeft + 40 + (blocks.length % 5) * 20,
    y: y ?? scrollTop + 40 + (blocks.length % 5) * 20,
    width: width ?? defaults[type].w,
    height: height ?? defaults[type].h,
    bgColor: 'white',
    fontSize: window._defaultFontSize || 'medium'
  };

  blocks.push(block);
  renderBlock(block);
  saveWorkspace();
  updateEmptyState();
  return block;
}

function getBlockBgClass(color) {
  const map = {
    white: 'bg-white dark:bg-slate-800',
    slate: 'bg-slate-100 dark:bg-slate-700',
    blue: 'bg-blue-100 dark:bg-blue-900/40',
    red: 'bg-red-100 dark:bg-red-900/40',
    green: 'bg-green-100 dark:bg-green-900/40',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/40'
  };
  return map[color] || map.white;
}

function getBlockFontSize(size) {
  const map = { small: '12px', medium: '14px', large: '16px', xl: '18px' };
  return map[size] || map.medium;
}

function createTodoItem(checked = false, text = '') {
  const item = document.createElement('div');
  item.className = 'todo-item flex items-center gap-2 my-1';
  item.contentEditable = 'false';

  const checkbox = document.createElement('span');
  checkbox.className = 'todo-checkbox cursor-pointer flex items-center justify-center w-5 h-5 rounded-full border border-slate-400 dark:border-slate-500 transition-all duration-200';
  checkbox.contentEditable = 'false';
  checkbox.dataset.checked = checked ? 'true' : 'false';
  if (checked) {
    checkbox.classList.remove('border-slate-400', 'dark:border-slate-500');
    checkbox.classList.add('bg-emerald-500', 'border-emerald-500');
    checkbox.innerHTML = '<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
  }

  const textSpan = document.createElement('span');
  textSpan.className = 'todo-text outline-none flex-1' + (checked ? ' line-through text-slate-400 dark:text-slate-500' : '');
  textSpan.contentEditable = 'true';
  textSpan.textContent = text;

  item.appendChild(checkbox);
  item.appendChild(textSpan);
  return item;
}

function normalizeTodoItems(content) {
  content.querySelectorAll('.todo-item').forEach(item => {
    const cb = item.querySelector('.todo-checkbox');
    const text = item.querySelector('.todo-text');
    if (!cb || !text) return;
    const checked = cb.dataset.checked === 'true';
    if (checked) {
      cb.className = 'todo-checkbox cursor-pointer flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 border border-emerald-500 transition-all duration-200';
      cb.innerHTML = '<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
      text.classList.add('line-through', 'text-slate-400', 'dark:text-slate-500');
    } else {
      cb.className = 'todo-checkbox cursor-pointer flex items-center justify-center w-5 h-5 rounded-full border border-slate-400 dark:border-slate-500 transition-all duration-200';
      cb.innerHTML = '';
      text.classList.remove('line-through', 'text-slate-400', 'dark:text-slate-500');
    }
  });
}

/* ----------------- Table Tool ----------------- */
function createTable(rows = 3, cols = 3) {
  const container = document.createElement('div');
  container.className = 'table-container my-3';
  container.contentEditable = 'false';

  const scrollWrapper = document.createElement('div');
  scrollWrapper.className = 'overflow-x-auto';

  const table = document.createElement('table');
  table.className = 'w-full border-collapse border border-slate-300 dark:border-slate-700 text-sm';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.className = 'bg-slate-100 dark:bg-slate-800';
  for (let c = 0; c < cols; c++) {
    const th = document.createElement('th');
    th.className = 'border border-slate-300 dark:border-slate-700 p-2 outline-none';
    th.contentEditable = 'true';
    th.textContent = `Başlık ${c + 1}`;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (let r = 0; r < rows - 1; r++) {
    const tr = document.createElement('tr');
    for (let c = 0; c < cols; c++) {
      const td = document.createElement('td');
      td.className = 'border border-slate-300 dark:border-slate-700 p-2 outline-none';
      td.contentEditable = 'true';
      td.textContent = 'Veri';
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  const addColBtn = document.createElement('div');
  addColBtn.className = 'table-add-col';
  addColBtn.innerHTML = '<i data-lucide="plus" class="w-3 h-3"></i>';
  addColBtn.title = 'Sütun ekle';
  addColBtn.contentEditable = 'false';

  const addRowBtn = document.createElement('div');
  addRowBtn.className = 'table-add-row';
  addRowBtn.innerHTML = '<i data-lucide="plus" class="w-3 h-3"></i>';
  addRowBtn.title = 'Satır ekle';
  addRowBtn.contentEditable = 'false';

  scrollWrapper.appendChild(table);
  container.appendChild(scrollWrapper);
  container.appendChild(addColBtn);
  container.appendChild(addRowBtn);

  return container;
}

function insertTableAtCursor(content, block) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0).cloneRange();
  const table = createTable(3, 3);

  // Ensure insertion point is inside the content editor
  if (!content.contains(range.commonAncestorContainer)) {
    content.appendChild(table);
  } else {
    range.deleteContents();
    range.insertNode(table);
  }

  const space = document.createTextNode('\u00A0');
  table.after(space);

  const newRange = document.createRange();
  const firstCell = table.querySelector('th, td');
  if (firstCell) {
    firstCell.focus();
    newRange.setStart(firstCell.firstChild || firstCell, 0);
    newRange.setEnd(firstCell.firstChild || firstCell, 0);
  } else {
    newRange.setStartAfter(space);
    newRange.collapse(true);
  }
  selection.removeAllRanges();
  selection.addRange(newRange);

  lucide.createIcons({ parent: table });
  block.content = content.innerHTML;
  saveWorkspace();
}

function addTableColumn(table) {
  const theadRow = table.querySelector('thead tr');
  const tbodyRows = table.querySelectorAll('tbody tr');
  if (!theadRow) return;

  const colCount = theadRow.children.length;
  const newTh = document.createElement('th');
  newTh.className = 'border border-slate-300 dark:border-slate-700 p-2 outline-none';
  newTh.contentEditable = 'true';
  newTh.textContent = `Başlık ${colCount + 1}`;
  theadRow.appendChild(newTh);

  tbodyRows.forEach(tr => {
    const newTd = document.createElement('td');
    newTd.className = 'border border-slate-300 dark:border-slate-700 p-2 outline-none';
    newTd.contentEditable = 'true';
    newTd.textContent = 'Veri';
    tr.appendChild(newTd);
  });
}

function addTableRow(table) {
  const tbody = table.querySelector('tbody');
  const theadRow = table.querySelector('thead tr');
  if (!tbody || !theadRow) return;

  const colCount = theadRow.children.length;
  const tr = document.createElement('tr');
  for (let c = 0; c < colCount; c++) {
    const td = document.createElement('td');
    td.className = 'border border-slate-300 dark:border-slate-700 p-2 outline-none';
    td.contentEditable = 'true';
    td.textContent = 'Veri';
    tr.appendChild(td);
  }
  tbody.appendChild(tr);
}

/* ----------------- Code Block Tool (Overlay Method) ----------------- */
const CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'java', label: 'Java' },
  { value: 'plaintext', label: 'Düz Metin' }
];

function getPrismLanguageClass(language) {
  const map = {
    javascript: 'language-javascript',
    python: 'language-python',
    c: 'language-c',
    cpp: 'language-cpp',
    csharp: 'language-csharp',
    java: 'language-java',
    html: 'language-markup',
    css: 'language-css',
    plaintext: 'language-plaintext'
  };
  return map[language] || 'language-plaintext';
}

function createCodeBlock(language = 'javascript', code = '') {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-block-wrapper my-4 w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-950 select-none relative';
  wrapper.contentEditable = 'false';

  const header = document.createElement('div');
  header.className = 'code-block-header flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 z-10 relative';

  const leftGroup = document.createElement('div');
  leftGroup.className = 'flex items-center gap-2';

  const select = document.createElement('select');
  select.className = 'code-lang-select bg-transparent outline-none cursor-pointer text-slate-300 border-none font-medium';
  CODE_LANGUAGES.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.value;
    option.textContent = lang.label;
    if (lang.value === language) option.selected = true;
    select.appendChild(option);
  });

  const copyBtn = document.createElement('button');
  copyBtn.className = 'code-copy-btn flex items-center gap-1 hover:text-white transition-colors';
  copyBtn.type = 'button';
  copyBtn.innerHTML = '<span>Kopyala</span>';

  leftGroup.appendChild(select);
  header.appendChild(leftGroup);
  header.appendChild(copyBtn);

  const editorBox = document.createElement('div');
  editorBox.className = 'relative w-full font-mono text-sm leading-relaxed';

  const pre = document.createElement('pre');
  pre.className = 'pointer-events-none m-0 p-0 overflow-auto bg-transparent text-slate-100 whitespace-pre-wrap break-all';

  const codeDisplay = document.createElement('code');
  codeDisplay.className = `code-display block ${getPrismLanguageClass(language)} outline-none`;
  codeDisplay.textContent = code;

  pre.appendChild(codeDisplay);

  const textarea = document.createElement('textarea');
  textarea.className = 'code-textarea absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white font-mono text-sm leading-relaxed outline-none resize-none overflow-hidden whitespace-pre-wrap break-all border-none';
  textarea.spellcheck = false;
  textarea.placeholder = '// Kodunuzu buraya yazın veya yapıştırın...';
  textarea.value = code;
  textarea.dataset.language = language;

  editorBox.appendChild(pre);
  editorBox.appendChild(textarea);
  wrapper.appendChild(header);
  wrapper.appendChild(editorBox);

  return wrapper;
}

function autoResizeCodeBlock(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function updateCodeBlockDisplay(textarea) {
  const wrapper = textarea.closest('.code-block-wrapper');
  const codeDisplay = wrapper?.querySelector('.code-display');
  if (!codeDisplay) return;

  const language = textarea.dataset.language || 'plaintext';
  codeDisplay.className = `code-display block ${getPrismLanguageClass(language)} outline-none`;
  codeDisplay.textContent = textarea.value;

  if (window.Prism && language !== 'plaintext') {
    Prism.highlightElement(codeDisplay);
  }

  autoResizeCodeBlock(textarea);
}

function syncCodeDisplay(textarea, codeDisplay, language) {
  if (!codeDisplay) return;
  codeDisplay.className = `code-display block ${getPrismLanguageClass(language)} outline-none`;

  if (window.Prism && language !== 'plaintext') {
    codeDisplay.textContent = textarea.value;
    Prism.highlightElement(codeDisplay);
  } else {
    // Safe plain text fallback: Escape HTML tags so they display visually without breaking layout
    let escapedCode = textarea.value
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">");
    codeDisplay.innerHTML = escapedCode;
  }
  autoResizeCodeBlock(textarea);
}

function syncCodeBlockState(textarea) {
  updateCodeBlockDisplay(textarea);
  const wrapper = textarea.closest('.code-block-wrapper');
  const content = wrapper?.closest('.block-content');
  const block = content ? getBlockFromContent(content) : null;
  if (block) {
    block.content = content.innerHTML;
    saveWorkspace();
  }
}

function insertCodeBlockAtCursor(content, block, language = 'javascript') {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0).cloneRange();
  const codeBlock = createCodeBlock(language);

  if (!content.contains(range.commonAncestorContainer)) {
    content.appendChild(codeBlock);
  } else {
    range.deleteContents();
    range.insertNode(codeBlock);
  }

  const space = document.createTextNode('\u00A0');
  codeBlock.after(space);

  const textarea = codeBlock.querySelector('.code-textarea');
  if (textarea) {
    textarea.focus();
    updateCodeBlockDisplay(textarea);
  }

  block.content = content.innerHTML;
  saveWorkspace();
}

/* ----------------- Block rendering ----------------- */
function renderBlock(block) {
  const existing = document.getElementById(`block-${block.id}`);
  if (existing) existing.remove();

  const bgClass = getBlockBgClass(block.bgColor);
  const el = document.createElement('div');
  el.id = `block-${block.id}`;
  el.className = `note-block group flex flex-col rounded-xl border shadow-sm ${bgClass} ${
    block.type === 'text'
      ? 'border-slate-200 dark:border-slate-700'
      : 'border-slate-200 dark:border-slate-700 overflow-hidden'
  }`;
  el.style.left = `${block.x}px`;
  el.style.top = `${block.y}px`;
  el.style.width = `${block.width}px`;
  el.style.height = `${block.height}px`;

  // Header / drag handle
  const header = document.createElement('div');
  header.className = 'drag-handle flex items-center justify-between px-2.5 py-1.5 rounded-t-xl bg-slate-100/60 dark:bg-slate-700/40 select-none';
  header.innerHTML = `
    <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
      <i data-lucide="grip-vertical" class="w-4 h-4"></i>
      <span class="text-xs font-semibold uppercase tracking-wider">${block.type}</span>
    </div>
    <button class="delete-btn p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition" aria-label="Delete block">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;
  el.appendChild(header);

  // Content
  if (block.type === 'text') {
    const fontSizePx = getBlockFontSize(block.fontSize);
    const content = document.createElement('div');
    content.className = 'block-content flex-1 px-4 py-3 leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap overflow-auto';
    content.style.fontSize = fontSizePx;
    content.contentEditable = true;
    content.innerHTML = block.content || '<div><br></div>';
    normalizeTodoItems(content);
    content.querySelectorAll('.code-textarea').forEach(updateCodeBlockDisplay);
    content.addEventListener('input', () => { block.content = content.innerHTML; saveWorkspace(); });
    content.addEventListener('keydown', (e) => handleTextKeydown(e, content, block));
    content.addEventListener('focus', () => { el.style.zIndex = 50; });
    content.addEventListener('blur', () => { el.style.zIndex = ''; });
    el.appendChild(content);
  } else {
    const content = document.createElement('div');
    content.className = 'image-block flex-1 relative overflow-hidden';
    const img = document.createElement('img');
    img.src = block.content;
    img.alt = 'Bırakılan resim';
    img.draggable = false;
    content.appendChild(img);
    el.appendChild(content);
  }

  // Resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle text-slate-500 dark:text-slate-400';
  el.appendChild(resizeHandle);

  // Sockets
  const sides = ['top', 'right', 'bottom', 'left'];
  sides.forEach(side => {
    const socket = document.createElement('div');
    socket.className = `socket socket-${side}`;
    socket.dataset.side = side;
    socket.dataset.blockId = block.id;
    socket.addEventListener('pointerdown', (e) => startDrawConnection(e, block, side, socket));
    el.appendChild(socket);
  });

  // Delete handler
  header.querySelector('.delete-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    deleteBlock(block.id);
  });

  // Drag start
  header.addEventListener('pointerdown', (e) => startDrag(e, block, el));

  // Resize start
  resizeHandle.addEventListener('pointerdown', (e) => startResize(e, block, el));

  canvas.appendChild(el);
  lucide.createIcons({ parent: el });
}

function deleteBlock(id) {
  const idx = blocks.findIndex(b => b.id === id);
  if (idx === -1) return;
  blocks.splice(idx, 1);
  document.getElementById(`block-${id}`)?.remove();
  removeConnectionsForBlock(id);
  saveWorkspace();
  updateEmptyState();
}
