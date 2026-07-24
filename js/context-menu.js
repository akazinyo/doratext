    /* ----------------- Double-click to add text ----------------- */
    canvas.addEventListener('dblclick', (e) => {
      if (freeDrawMode) return;
      if (e.target !== canvas && !e.target.closest('#emptyState')) return;
      const x = e.clientX - canvas.getBoundingClientRect().left + canvas.scrollLeft;
      const y = e.clientY - canvas.getBoundingClientRect().top + canvas.scrollTop;
      const block = createBlock('text', '', x, y);
      const content = document.querySelector(`#block-${block.id} .block-content`);
      if (content) content.focus();
    });

    /* ----------------- Context Menu ----------------- */
    function showContextMenu(x, y, target) {
      contextTarget = target ? { ...target, x, y } : { x, y };
      const isBlock = target && target.block;
      const isContent = target && target.content;

      const sel = window.getSelection();
      savedSelectionRange = (sel && sel.rangeCount > 0 && !sel.isCollapsed) ? sel.getRangeAt(0).cloneRange() : null;

      ctxGlobal.classList.toggle('hidden', isBlock);
      ctxBlock.classList.toggle('hidden', !isBlock);

      contextMenu.classList.remove('hidden');
      requestAnimationFrame(() => {
        const rect = contextMenu.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        let left = x;
        let top = y;
        if (left + rect.width > winW) left = winW - rect.width - 8;
        if (top + rect.height > winH) top = winH - rect.height - 8;
        if (left < 8) left = 8;
        if (top < 8) top = 8;
        contextMenu.style.left = `${left}px`;
        contextMenu.style.top = `${top}px`;
        contextMenu.classList.add('open');

        // Highlight current block options
        contextMenu.querySelectorAll('.color-dot.active, .font-size-btn.active').forEach(el => el.classList.remove('active'));
        if (contextTarget?.block) {
          const colorBtn = contextMenu.querySelector(`[data-action="color${capitalize(contextTarget.block.bgColor)}"]`);
          const sizeBtn = contextMenu.querySelector(`[data-action="font${capitalize(contextTarget.block.fontSize)}"]`);
          if (colorBtn) colorBtn.classList.add('active');
          if (sizeBtn) sizeBtn.classList.add('active');
        }

        lucide.createIcons({ parent: contextMenu });
      });
    }

    function capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function hideContextMenu() {
      contextMenu.classList.remove('open');
      setTimeout(() => {
        if (!contextMenu.classList.contains('open')) {
          contextMenu.classList.add('hidden');
          contextTarget = null;
        }
      }, 120);
    }

    function prefixCurrentLine(content, prefix) {
      const selection = window.getSelection();
      const node = selection.anchorNode;
      if (!node) return;
      const line = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
      const text = line.textContent || '';
      const range = document.createRange();
      range.selectNodeContents(line);
      range.deleteContents();
      line.textContent = prefix;
      range.setStart(line.firstChild, prefix.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      content.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function applyFormat(command) {
      if (!contextTarget || !contextTarget.content) return;
      document.execCommand(command);
      contextTarget.block.content = contextTarget.content.innerHTML;
      saveWorkspace();
    }

    function setBlockColor(colorName) {
      if (!contextTarget || !contextTarget.block) return;
      contextTarget.block.bgColor = colorName;
      const el = document.getElementById(`block-${contextTarget.block.id}`);
      if (el) {
        const allBgClasses = [
          'bg-white', 'dark:bg-slate-800',
          'bg-slate-100', 'dark:bg-slate-700',
          'bg-blue-100', 'dark:bg-blue-900/40',
          'bg-red-100', 'dark:bg-red-900/40',
          'bg-green-100', 'dark:bg-green-900/40',
          'bg-yellow-100', 'dark:bg-yellow-900/40'
        ];
        allBgClasses.forEach(c => el.classList.remove(...c.split(' ')));
        getBlockBgClass(colorName).split(' ').forEach(c => el.classList.add(c));
      }
      saveWorkspace();
    }

    function setBlockFontSize(sizeName) {
      if (!contextTarget || !contextTarget.block) return;
      contextTarget.block.fontSize = sizeName;
      const content = document.querySelector(`#block-${contextTarget.block.id} .block-content`);
      if (content) content.style.fontSize = getBlockFontSize(sizeName);
      saveWorkspace();
    }

    document.addEventListener('contextmenu', (e) => {
      // Allow native context menu inside code/inspect contexts only with Shift key
      if (e.shiftKey) return;
      if (e.target.closest('#context-menu')) return;
      e.preventDefault();

      const blockEl = e.target.closest('.note-block');
      const contentEl = e.target.closest('.block-content');

      if (blockEl) {
        const blockId = parseInt(blockEl.id.replace('block-', ''), 10);
        const block = blocks.find(b => b.id === blockId);
        if (block) {
          showContextMenu(e.clientX, e.clientY, { block, content: contentEl });
          return;
        }
      }

      showContextMenu(e.clientX, e.clientY, null);
    });

    contextMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      handleContextAction(action, btn);
      hideContextMenu();
    });

    function handleContextAction(action, btn) {
      switch (action) {
        case 'addText': {
          const rect = canvas.getBoundingClientRect();
          const bx = (contextTarget?.x || rect.left + 40) - rect.left + canvas.scrollLeft;
          const by = (contextTarget?.y || rect.top + 40) - rect.top + canvas.scrollTop;
          const block = createBlock('text', '', bx, by);
          const content = document.querySelector(`#block-${block.id} .block-content`);
          if (content) content.focus();
          break;
        }
        case 'addImage': {
          const rect = canvas.getBoundingClientRect();
          pendingImageDrop = {
            x: (contextTarget?.x || rect.left + 40) - rect.left + canvas.scrollLeft,
            y: (contextTarget?.y || rect.top + 40) - rect.top + canvas.scrollTop
          };
          imageInput.click();
          break;
        }
        case 'clear':
          clearBtn.click();
          break;
        case 'createCodeCard': {
          const cx = contextTarget?.x || (canvas.getBoundingClientRect().left + 40 + canvas.scrollLeft);
          const cy = contextTarget?.y || (canvas.getBoundingClientRect().top + 40 + canvas.scrollTop);
          createIndependentCodeCard(cx, cy);
          break;
        }
        case 'bullet':
          if (contextTarget?.content) prefixCurrentLine(contextTarget.content, '• ');
          break;
        case 'numbered':
          if (contextTarget?.content) prefixCurrentLine(contextTarget.content, '1. ');
          break;
        case 'checkbox': {
          if (!contextTarget?.content || !contextTarget?.block) return;
          const selection = window.getSelection();
          const node = selection.anchorNode;
          let ref = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
          // Find the top-level child of the content editor
          while (ref && ref.parentElement !== contextTarget.content) {
            ref = ref.parentElement;
          }
          const newTodo = createTodoItem(false, '');
          if (ref && ref !== contextTarget.content) {
            ref.after(newTodo);
          } else {
            contextTarget.content.appendChild(newTodo);
          }
          const textSpan = newTodo.querySelector('.todo-text');
          if (textSpan) {
            textSpan.focus();
            const range = document.createRange();
            range.setStart(textSpan, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          contextTarget.block.content = contextTarget.content.innerHTML;
          saveWorkspace();
          break;
        }
        case 'table': {
          if (!contextTarget?.content || !contextTarget?.block) return;
          insertTableAtCursor(contextTarget.content, contextTarget.block);
          break;
        }
        case 'bold':
          applyFormat('bold');
          break;
        case 'italic':
          applyFormat('italic');
          break;
        case 'underline':
          applyFormat('underline');
          break;
        case 'linkProject': {
          if (!contextTarget?.content || !contextTarget?.block) return;
          const selectedText = savedSelectionRange ? savedSelectionRange.toString().trim() : '';
          const defaultTitle = selectedText || contextTarget.block.content?.replace(/<[^>]*>/g, '').slice(0, 30) || '';
          const pageTitle = prompt('Bağlanacak sayfa:', defaultTitle);
          if (!pageTitle) return;
          const page = findPageByTitle(pageTitle);
          if (!page) {
            alert(`"${pageTitle}" adında bir sayfa bulunamadı.`);
            return;
          }
          const displayText = selectedText || pageTitle;
          if (savedSelectionRange) {
            savedSelectionRange.deleteContents();
            const badge = createProjectLink(page.id, page.title, displayText);
            savedSelectionRange.insertNode(badge);
            const space = document.createTextNode('\u00A0');
            badge.after(space);
          } else {
            const badge = createProjectLink(page.id, page.title, displayText);
            const space = document.createTextNode('\u00A0');
            contextTarget.content.appendChild(badge);
            contextTarget.content.appendChild(space);
          }
          lucide.createIcons({ parent: contextTarget.content });
          contextTarget.block.content = contextTarget.content.innerHTML;
          saveWorkspace();
          break;
        }
        case 'codeBlock': {
          if (!contextTarget?.content || !contextTarget?.block) return;
          insertCodeBlockAtCursor(contextTarget.content, contextTarget.block, 'javascript');
          break;
        }
        case 'fontSmall':
          setBlockFontSize('small');
          break;
        case 'fontMedium':
          setBlockFontSize('medium');
          break;
        case 'fontLarge':
          setBlockFontSize('large');
          break;
        case 'fontXl':
          setBlockFontSize('xl');
          break;
        case 'colorWhite':
        case 'colorSlate':
        case 'colorBlue':
        case 'colorRed':
        case 'colorGreen':
        case 'colorYellow':
          setBlockColor(action.replace('color', '').toLowerCase());
          break;
        case 'deleteBlock':
          if (contextTarget?.block) deleteBlock(contextTarget.block.id);
          break;
      }
    }

    document.addEventListener('click', (e) => {
      if (!contextMenu.contains(e.target)) hideContextMenu();
      if (!autocompleteDropdown.contains(e.target) && !e.target.closest('.block-content')) {
        hideAutocompleteDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideContextMenu();
        hideAutocompleteDropdown();
      }
    });
