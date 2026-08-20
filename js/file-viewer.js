/* ----------------- File Viewer (In-App) ----------------- */
let fileViewerBlock = null;

const fileViewerHTML = `
  <div id="fileViewer-overlay" class="file-viewer-overlay hidden"></div>
  <div id="fileViewer" class="file-viewer hidden">
    <div class="file-viewer-header">
      <div class="flex items-center gap-2 min-w-0">
        <i data-lucide="file-text" class="w-4 h-4 flex-shrink-0 text-indigo-400"></i>
        <span id="fileViewer-title" class="truncate font-semibold text-slate-200"></span>
        <span id="fileViewer-lang" class="file-viewer-lang-badge"></span>
      </div>
      <div class="flex items-center gap-2">
        <button id="fileViewer-copy" class="file-viewer-btn">${t('block.copy')}</button>
        <button id="fileViewer-close" class="file-viewer-btn file-viewer-close" title="${t('settings.btnClose')}">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
    <div class="file-viewer-body">
      <pre class="file-viewer-pre"><code id="fileViewer-code" class="code-display block language-plaintext"></code></pre>
      <textarea id="fileViewer-textarea" class="file-viewer-textarea" wrap="off" spellcheck="false" placeholder="// ..."></textarea>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', fileViewerHTML);

const fileViewerOverlay = document.getElementById('fileViewer-overlay');
const fileViewerEl = document.getElementById('fileViewer');
const fileViewerBody = document.querySelector('.file-viewer-body');
const fileViewerTitle = document.getElementById('fileViewer-title');
const fileViewerLang = document.getElementById('fileViewer-lang');
const fileViewerCode = document.getElementById('fileViewer-code');
const fileViewerTextarea = document.getElementById('fileViewer-textarea');
const fileViewerCopy = document.getElementById('fileViewer-copy');
const fileViewerClose = document.getElementById('fileViewer-close');

function syncFileViewerCode() {
  const lang = fileViewerTextarea.dataset.lang || 'plaintext';
  fileViewerCode.className = `code-display block language-${lang}`;
  fileViewerCode.textContent = fileViewerTextarea.value;
  if (window.Prism && lang !== 'plaintext') {
    Prism.highlightElement(fileViewerCode);
  }
}

function syncFileViewerScroll() {
  const pre = fileViewerCode.closest('pre');
  pre.scrollTop = fileViewerTextarea.scrollTop;
  pre.scrollLeft = fileViewerTextarea.scrollLeft;
}

function openFileViewer(block) {
  fileViewerBlock = block;
  fileViewerTitle.textContent = block.fileName || t('file.untitled');
  const lang = block.fileLang || 'plaintext';
  fileViewerLang.textContent = lang === 'plaintext' ? '' : lang;
  fileViewerLang.classList.toggle('hidden', lang === 'plaintext');
  fileViewerTextarea.dataset.lang = lang;
  fileViewerTextarea.value = block.content || '';
  syncFileViewerCode();
  fileViewerBody.scrollTop = 0;
  fileViewerBody.scrollLeft = 0;
  const pre = fileViewerCode.closest('pre');
  pre.scrollTop = 0;
  pre.scrollLeft = 0;
  fileViewerOverlay.classList.remove('hidden');
  fileViewerEl.classList.remove('hidden');
  requestAnimationFrame(() => fileViewerEl.classList.add('open'));
  lucide.createIcons();
  fileViewerTextarea.focus();
}

function closeFileViewer(save = true) {
  if (!fileViewerEl.classList.contains('open')) return;
  if (save && fileViewerBlock) {
    const block = blocks.find(b => b.id === fileViewerBlock.id);
    if (block) {
      block.content = fileViewerTextarea.value;
      saveWorkspace();
    }
  }
  fileViewerEl.classList.remove('open');
  setTimeout(() => fileViewerEl.classList.add('hidden'), 200);
  fileViewerOverlay.classList.add('hidden');
  fileViewerBlock = null;
}

fileViewerClose.addEventListener('click', () => closeFileViewer(true));
fileViewerOverlay.addEventListener('click', () => closeFileViewer(true));

fileViewerCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(fileViewerTextarea.value).then(() => {
    const original = fileViewerCopy.innerHTML;
    fileViewerCopy.innerHTML = t('block.copied');
    setTimeout(() => { fileViewerCopy.innerHTML = original; }, 1500);
  }).catch(err => console.error('Failed to copy file content', err));
});

fileViewerTextarea.addEventListener('input', syncFileViewerCode);

fileViewerTextarea.addEventListener('scroll', syncFileViewerScroll);

fileViewerTextarea.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    closeFileViewer(true);
    return;
  }
  if (e.key === 'Tab') {
    e.preventDefault();
    const s = fileViewerTextarea.selectionStart;
    const end = fileViewerTextarea.selectionEnd;
    fileViewerTextarea.value = fileViewerTextarea.value.substring(0, s) + '  ' + fileViewerTextarea.value.substring(end);
    fileViewerTextarea.selectionStart = fileViewerTextarea.selectionEnd = s + 2;
    syncFileViewerCode();
  }
});