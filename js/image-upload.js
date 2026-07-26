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

    addImageBtn.addEventListener('click', () => imageInput.click());

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
