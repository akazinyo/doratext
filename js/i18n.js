/* ----------------- Internationalization (i18n) ----------------- */

const LANGUAGES = {
  en: {
    // App
    'app.title': 'DoraNote — Notes',
    'app.name': 'DoraNote',

    // Toolbar
    'toolbar.text': 'Text',
    'toolbar.image': 'Image',
    'toolbar.draw': 'Draw',
    'toolbar.pencil': 'Pencil',
    'toolbar.eraser': 'Eraser',
    'toolbar.clear': 'Clear',
    'toolbar.colorBlack': 'Black',
    'toolbar.colorBlue': 'Blue',
    'toolbar.colorRed': 'Red',
    'toolbar.colorGreen': 'Green',
    'toolbar.styleStraight': 'Straight',
    'toolbar.styleCurved': 'Curved',
    'toolbar.styleDashed': 'Dashed',
    'toolbar.tooltipDraw': 'Toggle connection drawing mode',
    'toolbar.tooltipPencil': 'Toggle freehand drawing mode',
    'toolbar.tooltipEraser': 'Toggle eraser mode',
    'toolbar.tooltipTheme': 'Toggle theme',
    'toolbar.settings': 'Settings',

    // Sidebar
    'sidebar.newPage': 'New Page',
    'sidebar.tooltipShortcuts': 'Shortcuts',
    'sidebar.tooltipCollapse': 'Toggle sidebar',

    // Empty state
    'canvas.emptyTitle': 'Your canvas is empty',
    'canvas.emptyHint': 'Add text blocks, drop images, or double-click anywhere to start.',

    // Context menu
    'ctx.addText': 'Add Text Block',
    'ctx.addImage': 'Add Image Block',
    'ctx.addFile': 'Add File',
    'ctx.codeCard': 'Create Code Block',
    'ctx.clear': 'Clear Workspace',
    'ctx.bulletList': 'Bulleted List',
    'ctx.numberedList': 'Numbered List',
    'ctx.todo': 'Todo Checkbox',
    'ctx.table': 'Insert Table',
    'ctx.bold': 'Bold',
    'ctx.italic': 'Italic',
    'ctx.underline': 'Underline',
    'ctx.linkProject': 'Link to Project...',
    'ctx.codeBlock': 'Insert Code Block',
    'ctx.deleteBlock': 'Delete Block',
    'ctx.colorWhite': 'White',
    'ctx.colorSlate': 'Slate',
    'ctx.colorBlue': 'Blue',
    'ctx.colorRed': 'Red',
    'ctx.colorGreen': 'Green',
    'ctx.colorYellow': 'Yellow',
    'ctx.sectionList': 'List Format',
    'ctx.sectionStyle': 'Style',
    'ctx.sectionFont': 'Font Size',
    'ctx.sectionColor': 'Card Color',

    // Settings
    'settings.title': 'Settings',
    'settings.tabGeneral': 'General',
    'settings.tabTools': 'Tools',
    'settings.tabMinimap': 'Minimap',
    'settings.tabShortcuts': 'Shortcuts',
    'settings.tabTheme': 'Theme',
    'settings.sectionWorkspace': 'Workspace',
    'settings.sectionEditor': 'Editor',
    'settings.sectionBrush': 'Brush',
    'settings.sectionEraser': 'Eraser',
    'settings.sectionPresets': 'Color Presets',
    'settings.sectionMinimap': 'Minimap',
    'settings.sectionShortcuts': 'Keyboard Shortcuts',
    'settings.sectionTheme': 'Theme',
    'settings.sectionAccent': 'Accent Color',
    'settings.labelDefaultView': 'Default View',
    'settings.labelGrid': 'Show Grid',
    'settings.labelAutoSave': 'Auto Save',
    'settings.labelFontSize': 'Font Size',
    'settings.labelLineNumbers': 'Line Numbers',
    'settings.labelTabSize': 'Tab Size',
    'settings.labelBrushSize': 'Brush Size',
    'settings.labelBrushColor': 'Brush Color',
    'settings.labelLineStyle': 'Line Style',
    'settings.labelEraserSize': 'Eraser Size',
    'settings.labelMinimapVisible': 'Show Minimap',
    'settings.labelMinimapSize': 'Minimap Size',
    'settings.labelMinimapOpacity': 'Opacity',
    'settings.labelCompact': 'Compact Mode',
    'settings.labelLanguage': 'Language',
    'settings.optionCanvas': 'Canvas',
    'settings.optionEditor': 'Editor',
    'settings.optionSmall': 'Small',
    'settings.optionMedium': 'Medium',
    'settings.optionLarge': 'Large',
    'settings.optionXl': 'Extra Large',
    'settings.optionStraight': 'Straight',
    'settings.optionCurved': 'Curved',
    'settings.optionDashed': 'Dashed',
    'settings.optionEn': 'English',
    'settings.optionTr': 'Turkish',
    'settings.themeLight': 'Light',
    'settings.themeDark': 'Dark',
    'settings.themeBlack': 'Black',
    'settings.hintShortcut': 'Click a shortcut badge to rebind. Press Escape to cancel.',
    'settings.btnReset': 'Reset',
    'settings.btnClose': 'Close',
    'settings.btnResetAll': 'Reset All Settings',
    'settings.btnAddColor': 'Add',
    'settings.confirmResetAll': 'Reset all settings to defaults?',
    'settings.shortcutConflict': 'Conflict between {0}!',

    // Pages
    'page.deleteConfirm': 'Delete page "{0}"? This cannot be undone.',
    'page.keepOne': 'You must keep at least one page.',
    'page.rename': 'Rename',
    'page.delete': 'Delete',
    'page.untitled': 'Untitled',
    'page.defaultTitle': 'Main Notes',
    'page.promptName': 'Enter page name:',
    'page.promptNew': 'New Page',

    // Blocks
    'block.deleteLast': 'Delete the last block?',
    'block.addColumn': 'Add column',
    'block.addRow': 'Add row',
    'block.dropImage': 'Dropped image',
    'block.placeholderCode': '// Paste or type your code here...',
    'block.copy': 'Copy',
    'block.copied': 'Copied!',
    'block.plainText': 'Plain Text',
    'block.colLabel': 'Column',
    'block.dataCell': 'Data',

    // Files
    'file.untitled': 'File',
    'file.binary': 'Binary file',
    'file.readError': 'Could not read the file.',

    // Canvas
    'canvas.clearConfirm': 'Clear the current page? This cannot be undone.',

    // Autocomplete
    'autocomplete.create': 'Create new page',

    // Shortcuts
    'shortcuts.descNewPage': 'New Page',
    'shortcuts.descNewBlock': 'New Text Block',
    'shortcuts.descDeleteBlock': 'Delete Selected Block',
    'shortcuts.descCommandPal': 'Command Palette',
    'shortcuts.descToggleSide': 'Toggle Sidebar',
    'shortcuts.descToggleTheme': 'Toggle Theme',
    'shortcuts.descUndo': 'Undo',
    'shortcuts.descRedo': 'Redo',
    'shortcuts.descToggleMinimap': 'Toggle Minimap',

    // Confirmations
    'confirm.linkPage': 'Link to page:',
    'alert.pageNotFound': 'No page named "{0}" found.',
  },

  tr: {
    'app.title': 'DoraNote — Not Defteri',
    'app.name': 'DoraNote',

    'toolbar.text': 'Metin',
    'toolbar.image': 'Resim',
    'toolbar.draw': 'Bağla',
    'toolbar.pencil': 'Kalem',
    'toolbar.eraser': 'Silgi',
    'toolbar.clear': 'Temizle',
    'toolbar.colorBlack': 'Siyah',
    'toolbar.colorBlue': 'Mavi',
    'toolbar.colorRed': 'Kırmızı',
    'toolbar.colorGreen': 'Yeşil',
    'toolbar.styleStraight': 'Düz',
    'toolbar.styleCurved': 'Eğri',
    'toolbar.styleDashed': 'Kesikli',
    'toolbar.tooltipDraw': 'Bağlantı çizim modunu aç/kapat',
    'toolbar.tooltipPencil': 'Serbest çizim modunu aç/kapat',
    'toolbar.tooltipEraser': 'Silgi modunu aç/kapat',
    'toolbar.tooltipTheme': 'Temayı değiştir',
    'toolbar.settings': 'Ayarlar',

    'sidebar.newPage': 'Yeni Sayfa',
    'sidebar.tooltipShortcuts': 'Kısayollar',
    'sidebar.tooltipCollapse': 'Kenar çubuğunu aç/kapat',

    'canvas.emptyTitle': 'Tuvaliniz boş',
    'canvas.emptyHint': 'Metin bloğu ekleyin, resim bırakın veya başlamak için çift tıklayın.',

    'ctx.addText': 'Metin Bloğu Ekle',
    'ctx.addImage': 'Resim Bloğu Ekle',
    'ctx.addFile': 'Dosya Ekle',
    'ctx.codeCard': 'Kod Bloğu Oluştur',
    'ctx.clear': 'Çalışma Alanını Temizle',
    'ctx.bulletList': 'Madde İşaretli Liste',
    'ctx.numberedList': 'Numaralı Liste',
    'ctx.todo': 'Yapılacak Kutusu',
    'ctx.table': 'Tablo Ekle',
    'ctx.bold': 'Kalın',
    'ctx.italic': 'İtalik',
    'ctx.underline': 'Altı Çizili',
    'ctx.linkProject': 'Projeye Bağla...',
    'ctx.codeBlock': 'Kod Bloğu Ekle',
    'ctx.deleteBlock': 'Bloğu Sil',
    'ctx.colorWhite': 'Beyaz',
    'ctx.colorSlate': 'Gri',
    'ctx.colorBlue': 'Mavi',
    'ctx.colorRed': 'Kırmızı',
    'ctx.colorGreen': 'Yeşil',
    'ctx.colorYellow': 'Sarı',
    'ctx.sectionList': 'Liste Biçimi',
    'ctx.sectionStyle': 'Stil',
    'ctx.sectionFont': 'Yazı Boyutu',
    'ctx.sectionColor': 'Kart Rengi',

    'settings.title': 'Ayarlar',
    'settings.tabGeneral': 'Genel',
    'settings.tabTools': 'Araçlar',
    'settings.tabMinimap': 'Mini Harita',
    'settings.tabShortcuts': 'Kısayollar',
    'settings.tabTheme': 'Tema',
    'settings.sectionWorkspace': 'Çalışma Alanı',
    'settings.sectionEditor': 'Editör',
    'settings.sectionBrush': 'Fırça',
    'settings.sectionEraser': 'Silgi',
    'settings.sectionPresets': 'Renk Ön Ayarları',
    'settings.sectionMinimap': 'Mini Harita',
    'settings.sectionShortcuts': 'Klavye Kısayolları',
    'settings.sectionTheme': 'Tema',
    'settings.sectionAccent': 'Vurgu Rengi',
    'settings.labelDefaultView': 'Varsayılan Görünüm',
    'settings.labelGrid': 'Izgara Göster',
    'settings.labelAutoSave': 'Otomatik Kaydet',
    'settings.labelFontSize': 'Yazı Boyutu',
    'settings.labelLineNumbers': 'Satır Numaraları',
    'settings.labelTabSize': 'Tab Boyutu',
    'settings.labelBrushSize': 'Fırça Boyutu',
    'settings.labelBrushColor': 'Fırça Rengi',
    'settings.labelLineStyle': 'Çizgi Stili',
    'settings.labelEraserSize': 'Silgi Boyutu',
    'settings.labelMinimapVisible': 'Mini Haritayı Göster',
    'settings.labelMinimapSize': 'Mini Harita Boyutu',
    'settings.labelMinimapOpacity': 'Opaklık',
    'settings.labelCompact': 'Kompakt Mod',
    'settings.labelLanguage': 'Dil',
    'settings.optionCanvas': 'Tuval',
    'settings.optionEditor': 'Editör',
    'settings.optionSmall': 'Küçük',
    'settings.optionMedium': 'Orta',
    'settings.optionLarge': 'Büyük',
    'settings.optionXl': 'Çok Büyük',
    'settings.optionStraight': 'Düz',
    'settings.optionCurved': 'Eğri',
    'settings.optionDashed': 'Kesikli',
    'settings.optionEn': 'İngilizce',
    'settings.optionTr': 'Türkçe',
    'settings.themeLight': 'Açık',
    'settings.themeDark': 'Koyu',
    'settings.themeBlack': 'Siyah',
    'settings.hintShortcut': 'Yeniden atamak için kısayol rozetine tıklayın. İptal için Escape.',
    'settings.btnReset': 'Sıfırla',
    'settings.btnClose': 'Kapat',
    'settings.btnResetAll': 'Tüm Ayarları Sıfırla',
    'settings.btnAddColor': 'Ekle',
    'settings.confirmResetAll': 'Tüm ayarları varsayılana sıfırlamak istiyor musunuz?',
    'settings.shortcutConflict': '{0} arasında çakışma var!',

    'page.deleteConfirm': '"{0}" sayfasını silmek istiyor musunuz? Bu işlem geri alınamaz.',
    'page.keepOne': 'En az bir sayfa bulundurmalısınız.',
    'page.rename': 'Yeniden Adlandır',
    'page.delete': 'Sil',
    'page.untitled': 'İsimsiz',
    'page.defaultTitle': 'Ana Notlar',
    'page.promptName': 'Sayfa adı girin:',
    'page.promptNew': 'Yeni Sayfa',

    'block.deleteLast': 'Son bloğu silmek istiyor musunuz?',
    'block.addColumn': 'Sütun ekle',
    'block.addRow': 'Satır ekle',
    'block.dropImage': 'Bırakılan resim',
    'block.placeholderCode': '// Kodunuzu buraya yazın veya yapıştırın...',
    'block.copy': 'Kopyala',
    'block.copied': 'Kopyalandı!',
    'block.plainText': 'Düz Metin',
    'block.colLabel': 'Başlık',
    'block.dataCell': 'Veri',

    // Files
    'file.untitled': 'Dosya',
    'file.binary': 'İkili dosya',
    'file.readError': 'Dosya okunamadı.',

    'canvas.clearConfirm': 'Mevcut sayfayı temizlemek istiyor musunuz? Bu işlem geri alınamaz.',

    'autocomplete.create': 'Yeni sayfa oluştur',

    'shortcuts.descNewPage': 'Yeni Sayfa',
    'shortcuts.descNewBlock': 'Yeni Metin Bloğu',
    'shortcuts.descDeleteBlock': 'Seçili Bloğu Sil',
    'shortcuts.descCommandPal': 'Komut Paleti',
    'shortcuts.descToggleSide': 'Kenar Çubuğunu Aç/Kapat',
    'shortcuts.descToggleTheme': 'Temayı Değiştir',
    'shortcuts.descUndo': 'Geri Al',
    'shortcuts.descRedo': 'İleri Al',
    'shortcuts.descToggleMinimap': 'Mini Haritayı Aç/Kapat',

    'confirm.linkPage': 'Bağlanacak sayfa:',
    'alert.pageNotFound': '"{0}" adında bir sayfa bulunamadı.',
  }
};

let currentLang = 'en';

function getLanguage() {
  return currentLang;
}

function setLanguage(lang) {
  if (LANGUAGES[lang]) {
    currentLang = lang;
    setSetting('language', lang);
    applyTranslation();
    window.dispatchEvent(new CustomEvent('doralangchange'));
  }
}

function t(key, ...args) {
  const lang = LANGUAGES[currentLang] || LANGUAGES.en;
  let text = lang[key] || LANGUAGES.en[key] || key;
  if (args.length > 0) {
    args.forEach((arg, i) => { text = text.replace(`{${i}}`, arg).replace('{val}', arg); });
  }
  return text;
}

function translateElement(el) {
  const key = el.getAttribute('data-i18n');
  if (!key) return;
  let text = t(key);
  if (el.hasAttribute('placeholder')) { el.setAttribute('placeholder', text); return; }
  if (el.hasAttribute('title')) { el.setAttribute('title', text); return; }
  if (el.hasAttribute('aria-label')) { el.setAttribute('aria-label', text); return; }
  if (el.tagName === 'OPTION') { el.textContent = text; return; }
  // For elements with child text nodes only
  const child = el.firstChild;
  if (child && child.nodeType === 3) { child.textContent = text; return; }
  if (!el.querySelector('*')) { el.textContent = text; }
}

function applyTranslation() {
  document.querySelectorAll('[data-i18n]').forEach(translateElement);
  document.title = t('app.title');
}

// Initialize language from settings
currentLang = getSetting('language') || 'en';
if (!LANGUAGES[currentLang]) currentLang = 'en';
