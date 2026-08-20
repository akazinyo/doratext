    /* ----------------- Image upload ----------------- */
    function processImageFile(file, x, y) {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const maxW = 500;
          const ratio = img.width / img.height;
          const w = Math.min(maxW, img.width);
          const h = w / ratio;
          createBlock('image', ev.target.result, x, y, w, h);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }

    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const x = pendingImageDrop ? pendingImageDrop.x : (-panX / zoom) + 40;
      const y = pendingImageDrop ? pendingImageDrop.y : (-panY / zoom) + 40;
      processImageFile(file, x, y);
      pendingImageDrop = null;
      imageInput.value = '';
    });

    /* ----------------- Canvas drag & drop ----------------- */
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      canvas.classList.add('drag-over');
    });

    canvas.addEventListener('dragleave', (e) => {
      if (e.target === canvas) canvas.classList.remove('drag-over');
    });

    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      canvas.classList.remove('drag-over');

      const pt = canvasPoint(e);
      const x = pt.x, y = pt.y;

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(f => /image\/(png|jpeg|jpg|gif)/i.test(f.type));

      imageFiles.forEach((file, i) => {
        processImageFile(file, x + i * 30, y + i * 30);
      });
    });

    /* ----------------- Any-file upload ----------------- */
    const TEXT_EXTENSIONS = ['txt','md','json','xml','html','htm','css','js','mjs','jsx','ts','py','c','h','cpp','cc','cs','java','sql','sh','yml','yaml','ini','svg','log'];

    function getFileLanguage(fileName) {
      const ext = (fileName || '').split('.').pop().toLowerCase();
      const map = {
        js: 'javascript', mjs: 'javascript', jsx: 'javascript', ts: 'javascript',
        py: 'python', html: 'html', htm: 'html', css: 'css', scss: 'css',
        c: 'c', h: 'c', cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp',
        cs: 'csharp', java: 'java'
      };
      return map[ext] || 'plaintext';
    }

    function formatFileSize(bytes) {
      if (!bytes && bytes !== 0) return '';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function isTextLikeFile(file) {
      const ext = (file.name || '').split('.').pop().toLowerCase();
      if (file.size > 2 * 1024 * 1024) return false;
      if (file.type && file.type.startsWith('text/')) return true;
      return TEXT_EXTENSIONS.includes(ext);
    }

    function processFile(file) {
      const meta = { fileName: file.name, fileSize: file.size, fileType: file.type || '' };
      const lang = getFileLanguage(file.name);
      if (isTextLikeFile(file)) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const block = createBlock('file', ev.target.result, null, null, 380, 120);
          Object.assign(block, meta, { fileLang: lang });
          renderBlock(block);
          saveWorkspace();
          if (typeof openFileViewer === 'function') openFileViewer(block);
        };
        reader.onerror = () => alert(t('file.readError'));
        reader.readAsText(file);
      } else {
        const block = createBlock('file', '', null, null, 320, 110);
        Object.assign(block, meta, { fileLang: null, binary: true });
        renderBlock(block);
        saveWorkspace();
      }
    }

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      processFile(file);
      fileInput.value = '';
    });
