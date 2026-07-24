    /* ----------------- Interactive Todo Checkboxes (Event Delegation) ----------------- */
    function getBlockFromContent(content) {
      return blocks.find(b => `block-${b.id}` === content.parentElement.id);
    }

    canvas.addEventListener('click', (e) => {
      const linkTag = e.target.closest('.project-link-tag');
      if (linkTag) {
        e.preventDefault();
        e.stopPropagation();
        const targetPageId = linkTag.dataset.targetPageId;
        if (targetPageId && targetPageId !== currentPageId) {
          switchPage(targetPageId);
        }
        return;
      }

      const urlLink = e.target.closest('.url-link');
      if (urlLink) {
        e.stopPropagation();
        window.open(urlLink.href, '_blank', 'noopener,noreferrer');
        return;
      }

      const badge = e.target.closest('.header-badge');
      if (badge) {
        const match = badge.textContent.match(/^# (.+)/);
        if (match) {
          const pageTitle = match[1].trim();
          const subPage = pagesData.pagesList.find(p => p.parentId === currentPageId && p.title === pageTitle);
          if (subPage && subPage.id !== currentPageId) {
            e.preventDefault();
            e.stopPropagation();
            switchPage(subPage.id);
            return;
          }
        }
      }

      const addColBtn = e.target.closest('.table-add-col');
      if (addColBtn) {
        e.preventDefault();
        e.stopPropagation();
        const container = addColBtn.closest('.table-container');
        const table = container?.querySelector('table');
        const content = container?.closest('.block-content');
        const block = content ? getBlockFromContent(content) : null;
        if (table) {
          addTableColumn(table);
          lucide.createIcons({ parent: container });
          if (block) {
            block.content = content.innerHTML;
            saveWorkspace();
          }
        }
        return;
      }

      const addRowBtn = e.target.closest('.table-add-row');
      if (addRowBtn) {
        e.preventDefault();
        e.stopPropagation();
        const container = addRowBtn.closest('.table-container');
        const table = container?.querySelector('table');
        const content = container?.closest('.block-content');
        const block = content ? getBlockFromContent(content) : null;
        if (table) {
          addTableRow(table);
          if (block) {
            block.content = content.innerHTML;
            saveWorkspace();
          }
        }
        return;
      }

      const checkbox = e.target.closest('.todo-checkbox');
      if (!checkbox) return;
      e.preventDefault();
      e.stopPropagation();

      const item = checkbox.closest('.todo-item');
      const text = item.querySelector('.todo-text');
      if (!item || !text) return;

      const isChecked = checkbox.dataset.checked === 'true';
      if (!isChecked) {
        checkbox.dataset.checked = 'true';
        checkbox.className = 'todo-checkbox cursor-pointer flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 border border-emerald-500 transition-all duration-200';
        checkbox.innerHTML = '<svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
        text.classList.add('line-through', 'text-slate-400', 'dark:text-slate-500');
      } else {
        checkbox.dataset.checked = 'false';
        checkbox.className = 'todo-checkbox cursor-pointer flex items-center justify-center w-5 h-5 rounded-full border border-slate-400 dark:border-slate-500 transition-all duration-200';
        checkbox.innerHTML = '';
        text.classList.remove('line-through', 'text-slate-400', 'dark:text-slate-500');
      }

      const content = item.closest('.block-content');
      const block = content ? getBlockFromContent(content) : null;
      if (block) {
        block.content = content.innerHTML;
        saveWorkspace();
      }
    });

    canvas.addEventListener('keydown', (e) => {
      if (!e.target.classList.contains('todo-text') || e.key !== 'Enter') return;
      e.preventDefault();

      const currentText = e.target;
      const currentItem = currentText.closest('.todo-item');
      const content = currentItem.closest('.block-content');
      const block = content ? getBlockFromContent(content) : null;
      const text = currentText.textContent.trim();

      if (text === '') {
        const p = document.createElement('div');
        p.className = 'outline-none my-1';
        p.contentEditable = 'true';
        p.innerHTML = '<br>';
        currentItem.replaceWith(p);
        p.focus();
        const range = document.createRange();
        range.setStart(p, 0);
        range.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        const newTodo = createTodoItem(false, '');
        currentItem.after(newTodo);
        const newText = newTodo.querySelector('.todo-text');
        if (newText) {
          newText.focus();
          const range = document.createRange();
          range.setStart(newText, 0);
          range.collapse(true);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

      if (block) {
        block.content = content.innerHTML;
        saveWorkspace();
      }
    });
