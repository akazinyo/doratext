function renderPageList() {
  pageList.innerHTML = '';
  function renderPage(page, depth) {
    const item = document.createElement('div');
    item.className = `page-item ${page.id === currentPageId ? 'active' : ''}`;
    item.dataset.pageId = page.id;

    const isChild = depth > 0;
    if (isChild) {
      item.classList.add('tree-child');
      item.style.setProperty('--trunk-x', ((depth - 1) * 20 + 8) + 'px');
      item.style.setProperty('--indent', (depth * 20) + 'px');
    }
    item.style.paddingLeft = isChild ? 'var(--indent)' : '0px';

    item.innerHTML = `
      <i data-lucide="file-text" class="w-4 h-4 flex-shrink-0 ${isChild ? 'tree-child-icon' : ''}"></i>
      <span class="page-title" contenteditable="false">${escapeHtml(page.title || t('page.untitled'))}</span>
      <div class="page-actions">
        <button class="page-action-btn rename-page-btn text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400" title="${t('page.rename')}">
          <i data-lucide="pencil" class="w-3 h-3"></i>
        </button>
        <button class="page-action-btn delete-page-btn text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400" title="${t('page.delete')}">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </div>
    `;

    const titleSpan = item.querySelector('.page-title');

    item.addEventListener('click', (e) => {
      if (e.target.closest('.page-actions') || titleSpan.isContentEditable) return;
      switchPage(page.id);
    });

    item.querySelector('.rename-page-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      titleSpan.contentEditable = 'true';
      titleSpan.focus();
      const range = document.createRange();
      range.selectNodeContents(titleSpan);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    });

    titleSpan.addEventListener('blur', () => {
      renamePage(page.id, titleSpan.textContent);
      titleSpan.contentEditable = 'false';
    });

    titleSpan.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        titleSpan.blur();
      }
    });

    item.querySelector('.delete-page-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deletePage(page.id);
    });

    pageList.appendChild(item);

    const children = pagesData.pagesList.filter(p => p.parentId === page.id);
    children.forEach(child => renderPage(child, depth + 1));
  }
  const topLevel = pagesData.pagesList.filter(p => !p.parentId);
  topLevel.forEach(page => renderPage(page, 0));
  lucide.createIcons({ parent: pageList });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
