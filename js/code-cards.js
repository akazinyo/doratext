    /* ---------- Independent Code Card (Canvas-Level) ---------- */
    function createIndependentCodeCard(x, y) {
      const card = {
        id: nextCodeCardId++,
        x: x - canvas.getBoundingClientRect().left + canvas.scrollLeft,
        y: y - canvas.getBoundingClientRect().top + canvas.scrollTop,
        width: 500, height: null,
        language: 'javascript', code: ''
      };
      independentCodeCards.push(card);
      renderIndependentCodeCard(card);
      saveWorkspace();
      updateEmptyState();
      return card;
    }

    function renderIndependentCodeCard(card) {
      document.querySelector(`.independent-code-card[data-id="${card.id}"]`)?.remove();
      const el = document.createElement('div');
      el.className = 'independent-code-card';
      el.dataset.id = card.id;
      el.style.left = card.x + 'px';
      el.style.top = card.y + 'px';
      el.style.width = card.width + 'px';
      el.style.minHeight = '200px';

      el.innerHTML = `
        <div class="code-card-header flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 cursor-move">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-500">CODE</span>
            <select class="code-lang-select bg-transparent outline-none cursor-pointer text-slate-300 border-none font-medium">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
              <option value="plaintext">Plain Text</option>
            </select>
          </div>
          <div class="flex items-center gap-3">
            <button class="code-copy-btn hover:text-white transition-colors text-slate-400">Kopyala</button>
            <button class="code-delete-btn hover:text-red-400 text-slate-500 font-bold">✕</button>
          </div>
        </div>
        <div class="relative w-full h-full min-h-[150px]">
          <pre class="pointer-events-none m-0 p-4 overflow-auto bg-transparent text-slate-100 whitespace-pre break-all"><code class="code-display block language-javascript outline-none"></code></pre>
          <textarea class="code-textarea absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white font-mono text-sm leading-relaxed outline-none resize-none overflow-hidden whitespace-pre break-all border-none" spellcheck="false" placeholder="// Kodunuzu buraya yazın veya yapıştırın..."></textarea>
        </div>`;

      canvas.appendChild(el);

      const select = el.querySelector('.code-lang-select');
      const textarea = el.querySelector('.code-textarea');
      const codeDisplay = el.querySelector('.code-display');

      select.value = card.language;
      textarea.value = card.code;
      syncIndependentCodeDisplay(textarea, codeDisplay, card.language);

      textarea.addEventListener('input', () => {
        card.code = textarea.value;
        syncIndependentCodeDisplay(textarea, codeDisplay, select.value);
        saveWorkspace();
      });

      textarea.addEventListener('paste', () => {
        requestAnimationFrame(() => {
          card.code = textarea.value;
          syncIndependentCodeDisplay(textarea, codeDisplay, select.value);
          saveWorkspace();
        });
      });

      textarea.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        card.code = textarea.value;
        syncIndependentCodeDisplay(textarea, codeDisplay, select.value);
        saveWorkspace();
      });

      select.addEventListener('change', () => {
        card.language = select.value;
        syncIndependentCodeDisplay(textarea, codeDisplay, select.value);
        saveWorkspace();
      });

      el.querySelector('.code-copy-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(textarea.value).then(() => {
          const btn = e.currentTarget;
          const original = btn.innerHTML;
          btn.classList.add('copied');
          btn.innerHTML = 'Kopyalandı!';
          setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = original; }, 1500);
        }).catch(err => console.error('Failed to copy code', err));
      });

      el.querySelector('.code-delete-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteIndependentCodeCard(card.id);
      });

      initCodeCardDrag(el, card);
    }

    function deleteIndependentCodeCard(id) {
      const idx = independentCodeCards.findIndex(c => c.id === id);
      if (idx === -1) return;
      independentCodeCards.splice(idx, 1);
      document.querySelector(`.independent-code-card[data-id="${id}"]`)?.remove();
      saveWorkspace();
      updateEmptyState();
    }

    function syncIndependentCodeDisplay(textarea, codeDisplay, language) {
      if (!codeDisplay) return;
      codeDisplay.className = `code-display block language-${language} outline-none`;
      if (window.Prism && language !== 'plaintext') {
        codeDisplay.textContent = textarea.value;
        Prism.highlightElement(codeDisplay);
      } else {
        codeDisplay.innerHTML = textarea.value
          .replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
      }
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }

    function initCodeCardDrag(el, card) {
      const header = el.querySelector('.code-card-header');
      let dragStateLocal = null;

      header.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.code-lang-select') || e.target.closest('.code-copy-btn') || e.target.closest('.code-delete-btn')) return;
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        el.classList.add('dragging');
        dragStateLocal = {
          startX: e.clientX, startY: e.clientY,
          initialLeft: card.x, initialTop: card.y
        };
      });

      el.addEventListener('pointermove', (e) => {
        if (!dragStateLocal) return;
        e.preventDefault();
        const dx = e.clientX - dragStateLocal.startX;
        const dy = e.clientY - dragStateLocal.startY;
        card.x = Math.max(0, dragStateLocal.initialLeft + dx);
        card.y = Math.max(0, dragStateLocal.initialTop + dy);
        el.style.left = card.x + 'px';
        el.style.top = card.y + 'px';
      });

      el.addEventListener('pointerup', (e) => {
        if (!dragStateLocal) return;
        el.classList.remove('dragging');
        el.releasePointerCapture(e.pointerId);
        dragStateLocal = null;
        saveWorkspace();
      });

      el.addEventListener('pointercancel', () => {
        if (!dragStateLocal) return;
        el.classList.remove('dragging');
        dragStateLocal = null;
      });
    }

    function updateEmptyState() {
      const hasContent = blocks.length || connections.length || freeDrawings.length || independentCodeCards.length;
      emptyState.style.display = hasContent ? 'none' : 'flex';
    }
