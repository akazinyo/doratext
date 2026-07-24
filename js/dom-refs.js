    /* ----------------- DOM refs ----------------- */
    const canvas = document.getElementById('canvas');
    const svg = document.getElementById('connection-svg');
    const drawingSvg = document.getElementById('drawing-svg');
    const emptyState = document.getElementById('emptyState');
    const addTextBtn = document.getElementById('addTextBtn');
    const addImageBtn = document.getElementById('addImageBtn');
    const clearBtn = document.getElementById('clearBtn');
    const themeToggle = document.getElementById('themeToggle');
    const drawLineBtn = document.getElementById('drawLineBtn');
    const freeDrawBtn = document.getElementById('freeDrawBtn');
    const eraserBtn = document.getElementById('eraserBtn');
    const lineColorSelect = document.getElementById('lineColor');
    const lineStyleSelect = document.getElementById('lineStyle');
    const imageInput = document.getElementById('imageInput');
    const contextMenu = document.getElementById('context-menu');
    const ctxGlobal = document.getElementById('ctxGlobal');
    const ctxBlock = document.getElementById('ctxBlock');
    const autocompleteDropdown = document.getElementById('autocomplete-dropdown');
    const autocompleteList = document.getElementById('autocomplete-list');
    const sidebar = document.getElementById('sidebar');
    const pageList = document.getElementById('pageList');
    const newPageBtn = document.getElementById('newPageBtn');
    const toggleSidebar = document.getElementById('toggleSidebar');

    /* ----------------- Theme ----------------- */
    const THEMES = ['light', 'dark', 'black'];

    function applyTheme() {
      document.documentElement.classList.remove('dark', 'theme-black');
      if (theme === 'dark' || theme === 'black') {
        document.documentElement.classList.add('dark');
      }
      if (theme === 'black') {
        document.documentElement.classList.add('theme-black');
      }
      localStorage.setItem('doranote_theme', theme);
      const icons = themeToggle.querySelectorAll('[data-lucide]');
      icons.forEach(i => i.classList.add('hidden'));
      if (theme === 'light') themeToggle.querySelector('[data-lucide="sun"]')?.classList.remove('hidden');
      else if (theme === 'dark') themeToggle.querySelector('[data-lucide="moon"]')?.classList.remove('hidden');
      else themeToggle.querySelector('[data-lucide="monitor"]')?.classList.remove('hidden');
    }

    themeToggle.addEventListener('click', () => {
      const idx = THEMES.indexOf(theme);
      theme = THEMES[(idx + 1) % THEMES.length];
      applyTheme();
      renderConnections();
      renderStrokes();
      lucide.createIcons();
    });

    applyTheme();
