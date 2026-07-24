    /* ----------------- Text formatting ----------------- */
    function handleTextKeydown(e, content, block) {
      if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        const key = e.key.toLowerCase();
        if (['b','i','u'].includes(key)) {
          e.preventDefault();
          document.execCommand(key === 'b' ? 'bold' : key === 'i' ? 'italic' : 'underline');
          block.content = content.innerHTML;
          saveWorkspace();
          return;
        }
      }

      if (e.key === 'Enter') {
        const selection = window.getSelection();
        const node = selection.anchorNode;
        if (!node) return;

        const line = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        // Let the delegated canvas listener handle Enter inside todo items
        if (line.closest('.todo-item')) return;

        const lineText = (line.textContent || '').replace(/\u200B/g, '');

        const bulletMatch = lineText.match(/^(\s*)([-*])\s(.*)$/);
        const numberMatch = lineText.match(/^(\s*)(\d+)\.\s(.*)$/);

        if (bulletMatch && selection.anchorOffset === lineText.length) {
          e.preventDefault();
          const [, indent, marker, text] = bulletMatch;
          if (text.trim() === '') {
            line.textContent = '';
            insertNewLine(content);
          } else {
            const newLine = document.createElement('div');
            newLine.textContent = `${indent}${marker} `;
            insertNodeAfterLine(line, newLine);
          }
          block.content = content.innerHTML;
          saveWorkspace();
          return;
        }

        if (numberMatch && selection.anchorOffset === lineText.length) {
          e.preventDefault();
          const [, indent, num, text] = numberMatch;
          if (text.trim() === '') {
            line.textContent = '';
            insertNewLine(content);
          } else {
            const newLine = document.createElement('div');
            newLine.textContent = `${indent}${parseInt(num, 10) + 1}. `;
            insertNodeAfterLine(line, newLine);
          }
          block.content = content.innerHTML;
          saveWorkspace();
          return;
        }
      }
    }

    function insertNodeAfterLine(line, newLine) {
      const range = document.createRange();
      range.setStartAfter(line);
      range.collapse(true);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      range.insertNode(newLine);
      range.setStart(newLine.firstChild, newLine.textContent.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    function insertNewLine(content) {
      const sel = window.getSelection();
      const range = sel.getRangeAt(0);
      const br = document.createElement('br');
      range.deleteContents();
      range.insertNode(br);
      range.setStartAfter(br);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    /* ----------------- Auto bullet detection ----------------- */
    canvas.addEventListener('input', (e) => {
      const content = e.target.closest('.block-content');
      if (!content) return;

      const block = blocks.find(b => `block-${b.id}` === content.parentElement.id);
      if (!block) return;

      const selection = window.getSelection();
      const node = selection.anchorNode;
      if (node && node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const line = node.parentElement;
        if (!line.closest('.todo-item, .table-container')) {
          if (/^[-*] $/.test(text)) {
            e.preventDefault();
            const newLine = document.createElement('div');
            const bullet = document.createElement('span');
            bullet.textContent = '• ';
            bullet.style.fontWeight = 'bold';
            newLine.appendChild(bullet);
            const space = document.createTextNode('\u00A0');
            newLine.appendChild(space);
            line.replaceWith(newLine);

            const range = document.createRange();
            range.setStart(space, 1);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            block.content = content.innerHTML;
            saveWorkspace();
            return;
          }

          if (/^\d+\. $/.test(text)) {
            const num = text.match(/^\d+/)[0];
            const newLine = document.createElement('div');
            newLine.textContent = `${num}. \u00A0`;
            line.replaceWith(newLine);

            const range = document.createRange();
            range.setStart(newLine.firstChild, newLine.textContent.length);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            block.content = content.innerHTML;
            saveWorkspace();
            return;
          }

          if (/^- \[([ xX]?)\] $/.test(text)) {
            const checked = /[xX]/.test(text);
            const newItem = createTodoItem(checked, '');
            line.replaceWith(newItem);

            const textSpan = newItem.querySelector('.todo-text');
            const range = document.createRange();
            range.setStart(textSpan, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            block.content = content.innerHTML;
            saveWorkspace();
            return;
          }
        }
      }

      styleHeaderLinks();
      block.content = content.innerHTML;
      saveWorkspace();
      detectHeadersAndCreateSubPages();
    });

    canvas.addEventListener('keyup', (e) => {
      const content = e.target.closest('.block-content');
      if (!content) return;
      const block = blocks.find(b => `block-${b.id}` === content.parentElement.id);
      if (!block) return;

      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const range = sel.getRangeAt(0);

      const { query, startNode, startOffset } = detectAtQuery(range, content);
      if (query !== null) {
        showAutocompleteDropdown(content, block, query, startNode, startOffset);
      } else {
        hideAutocompleteDropdown();
        parseProjectLinks(content, block);
      }
      styleHeaderLinks();
    });

    canvas.addEventListener('keydown', (e) => {
      if (!autocompleteState) return;
      if (!['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key)) return;

      e.preventDefault();
      if (e.key === 'ArrowDown') {
        autocompleteState.activeIndex = Math.min(autocompleteState.activeIndex + 1, Math.max(autocompleteState.items.length - 1, 0));
        renderAutocompleteDropdown();
      } else if (e.key === 'ArrowUp') {
        autocompleteState.activeIndex = Math.max(autocompleteState.activeIndex - 1, 0);
        renderAutocompleteDropdown();
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        selectAutocompleteItem(autocompleteState.activeIndex);
      } else if (e.key === 'Escape') {
        hideAutocompleteDropdown();
      }
    });

    autocompleteDropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.autocomplete-item');
      if (!item) return;
      if (item.dataset.action === 'create-new') {
        selectAutocompleteItem(0);
      } else {
        selectAutocompleteItem(parseInt(item.dataset.index, 10));
      }
    });

    /* ----------------- Smart Paste: URLs → Hyperlinks ----------------- */
    canvas.addEventListener('paste', (e) => {
      const content = e.target.closest('.block-content');
      if (!content) return;
      const block = blocks.find(b => `block-${b.id}` === content.parentElement.id);
      if (!block) return;

      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text');
      const trimmed = text.trim();
      const urlRegex = /^(https?:\/\/[^\s]+)$/i;

      if (urlRegex.test(trimmed)) {
        const safeUrl = escapeHtml(trimmed);
        const linkHTML = `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="url-link text-sky-500 hover:text-sky-400 dark:text-sky-400 dark:hover:text-sky-300 underline underline-offset-4 transition-colors" contenteditable="false">${safeUrl}</a>&nbsp;`;
        document.execCommand('insertHTML', false, linkHTML);
      } else {
        document.execCommand('insertText', false, text);
      }

      block.content = content.innerHTML;
      saveWorkspace();
    });

    /* ----------------- Code Block: overlay events ----------------- */
    canvas.addEventListener('input', (e) => {
      const textarea = e.target.closest('.code-textarea');
      if (!textarea) return;
      const wrapper = textarea.closest('.code-block-wrapper');
      const select = wrapper?.querySelector('.code-lang-select');
      const codeDisplay = wrapper?.querySelector('.code-display');
      if (select && codeDisplay) {
        syncCodeDisplay(textarea, codeDisplay, select.value);
      }
      syncCodeBlockState(textarea);
    });

    canvas.addEventListener('paste', (e) => {
      const textarea = e.target.closest('.code-textarea');
      if (!textarea) return;
      // Standard textarea paste is handled natively; sync after paste
      requestAnimationFrame(() => {
        const wrapper = textarea.closest('.code-block-wrapper');
        const select = wrapper?.querySelector('.code-lang-select');
        const codeDisplay = wrapper?.querySelector('.code-display');
        if (select && codeDisplay) {
          syncCodeDisplay(textarea, codeDisplay, select.value);
        }
        syncCodeBlockState(textarea);
      });
    });

    canvas.addEventListener('keydown', (e) => {
      const textarea = e.target.closest('.code-textarea');
      if (!textarea || e.key !== 'Tab') return;
      if (textarea.closest('.independent-code-card')) return;
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      textarea.value = value.substring(0, start) + '  ' + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      syncCodeBlockState(textarea);
    });

    canvas.addEventListener('change', (e) => {
      const select = e.target.closest('.code-lang-select');
      if (!select) return;
      const wrapper = select.closest('.code-block-wrapper');
      const textarea = wrapper?.querySelector('.code-textarea');
      const content = wrapper?.closest('.block-content');
      const block = content ? getBlockFromContent(content) : null;
      if (textarea) {
        textarea.dataset.language = select.value;
        updateCodeBlockDisplay(textarea);
      }
      if (block) {
        block.content = content.innerHTML;
        saveWorkspace();
      }
    });

    canvas.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.code-copy-btn');
      if (!copyBtn) return;
      e.preventDefault();
      e.stopPropagation();

      const wrapper = copyBtn.closest('.code-block-wrapper');
      const textarea = wrapper?.querySelector('.code-textarea');
      if (!textarea) return;

      navigator.clipboard.writeText(textarea.value).then(() => {
        const original = copyBtn.innerHTML;
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<span>Kopyalandı!</span>';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = original;
        }, 1500);
      }).catch(err => {
        console.error('Failed to copy code', err);
      });
    });
