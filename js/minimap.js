/* ----------------- Minimap ----------------- */
const minimap = document.getElementById('minimap');
const minimapCanvas = document.getElementById('minimap-canvas');
const minimapViewport = document.getElementById('minimap-viewport');
const ctx = minimapCanvas.getContext('2d');
let MM_W = 180, MM_H = 120;
let mmScale = 1, mmOffsetX = 0, mmOffsetY = 0;

function getMmSize() {
  const s = getSetting('minimapSize') || 'medium';
  if (s === 'small') { MM_W = 120; MM_H = 80; }
  else if (s === 'large') { MM_W = 250; MM_H = 170; }
  else { MM_W = 180; MM_H = 120; }
}

function resizeMinimapCanvas() {
  const dpr = window.devicePixelRatio || 1;
  minimapCanvas.width = MM_W * dpr;
  minimapCanvas.height = MM_H * dpr;
  ctx.scale(dpr, dpr);
}

function applyMinimapSettings() {
  getMmSize();
  resizeMinimapCanvas();
  minimap.classList.toggle('hidden', !getSetting('minimapVisible'));
  renderMinimap();
}

function toggleMinimap() {
  const cur = getSetting('minimapVisible');
  setSetting('minimapVisible', !cur);
  applyMinimapSettings();
}

function renderMinimap() {
  minimap.style.opacity = (getSetting('minimapOpacity') ?? 65) / 100;
  const items = [];

  blocks.forEach(b => {
    items.push({ x: b.x, y: b.y, w: b.width, h: b.height, type: 'block', color: b.bgColor || 'white' });
  });

  independentCodeCards.forEach(c => {
    items.push({ x: c.x, y: c.y, w: c.width || 400, h: c.height || 200, type: 'block', color: 'code' });
  });

  freeDrawings.forEach(s => {
    if (s.points.length < 2) return;
    items.push({ type: 'drawing', points: s.points });
  });

  connections.forEach(c => {
    items.push({ type: 'connection', fromId: c.fromId, toId: c.toId });
  });

  if (items.length === 0) { ctx.clearRect(0, 0, MM_W, MM_H); return; }

  function blockPos(id) { const b = blocks.find(x => x.id === id); return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; }
  function updateBounds(x, y) { if (x < minX) minX = x; if (y < minY) minY = y; if (x > maxX) maxX = x; if (y > maxY) maxY = y; }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  items.forEach(item => {
    if (item.type === 'drawing') {
      item.points.forEach(p => { updateBounds(p.x, p.y); });
    } else if (item.type === 'connection') {
      const from = blockPos(item.fromId), to = blockPos(item.toId);
      if (from) updateBounds(from.x, from.y); if (to) updateBounds(to.x, to.y);
    } else {
      updateBounds(item.x, item.y); updateBounds(item.x + item.w, item.y + item.h);
    }
  });

  const pad = 20;
  minX -= pad; minY -= pad; maxX += pad; maxY += pad;
  const contentW = maxX - minX, contentH = maxY - minY;
  if (!isFinite(contentW) || contentW <= 0 || contentH <= 0) { ctx.clearRect(0, 0, MM_W, MM_H); return; }
  const scale = Math.min(MM_W / contentW, MM_H / contentH, 1);
  const offX = (MM_W - contentW * scale) / 2 - minX * scale;
  const offY = (MM_H - contentH * scale) / 2 - minY * scale;
  mmScale = scale; mmOffsetX = offX; mmOffsetY = offY;

  ctx.clearRect(0, 0, MM_W, MM_H);
  ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
  ctx.fillRect(0, 0, MM_W, MM_H);

  // Connections first (behind blocks)
  items.forEach(item => {
    if (item.type !== 'connection') return;
    const from = blockPos(item.fromId), to = blockPos(item.toId);
    if (!from || !to) return;
    ctx.beginPath();
    ctx.moveTo(from.x * scale + offX, from.y * scale + offY);
    ctx.lineTo(to.x * scale + offX, to.y * scale + offY);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  });

  items.forEach(item => {
    if (item.type === 'drawing') {
      ctx.beginPath();
      const p0 = item.points[0];
      ctx.moveTo(p0.x * scale + offX, p0.y * scale + offY);
      for (let i = 1; i < item.points.length; i++) {
        ctx.lineTo(item.points[i].x * scale + offX, item.points[i].y * scale + offY);
      }
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      const x = item.x * scale + offX;
      const y = item.y * scale + offY;
      const w = Math.max(2, item.w * scale);
      const h = Math.max(2, item.h * scale);
      const mmColorMap = { white: 'rgba(255,255,255,0.5)', slate: 'rgba(148,163,184,0.5)', blue: 'rgba(96,165,250,0.5)', red: 'rgba(248,113,113,0.5)', green: 'rgba(74,222,128,0.5)', yellow: 'rgba(250,204,21,0.5)' };
      ctx.fillStyle = item.color === 'code' ? '#6366f1' : mmColorMap[item.color] || 'rgba(255,255,255,0.3)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, w, h);
    }
  });

  // Viewport
  updateMinimapViewport();
}

function updateMinimapViewport() {
  const rect = canvas.getBoundingClientRect();
  const vx = (-panX / zoom) * mmScale + mmOffsetX;
  const vy = (-panY / zoom) * mmScale + mmOffsetY;
  const vw = (rect.width / zoom) * mmScale;
  const vh = (rect.height / zoom) * mmScale;
  minimapViewport.style.left = vx + 'px';
  minimapViewport.style.top = vy + 'px';
  minimapViewport.style.width = vw + 'px';
  minimapViewport.style.height = vh + 'px';
}

// Click to pan
minimap.addEventListener('click', (e) => {
  const mmRect = minimap.getBoundingClientRect();
  const mx = e.clientX - mmRect.left;
  const my = e.clientY - mmRect.top;
  const wx = (mx - mmOffsetX) / mmScale;
  const wy = (my - mmOffsetY) / mmScale;
  const rect = canvas.getBoundingClientRect();
  panX = -wx * zoom + rect.width / 2;
  panY = -wy * zoom + rect.height / 2;
  updateCanvasTransform();
  savePan();
  renderMinimap();
});

// Drag to pan
let mmDragging = false;
minimap.addEventListener('mousedown', (e) => { mmDragging = true; });
document.addEventListener('mousemove', (e) => {
  if (!mmDragging) return;
  if (!minimap.contains(e.target)) { mmDragging = false; return; }
  const mmRect = minimap.getBoundingClientRect();
  const mx = e.clientX - mmRect.left;
  const my = e.clientY - mmRect.top;
  const wx = (mx - mmOffsetX) / mmScale;
  const wy = (my - mmOffsetY) / mmScale;
  const rect = canvas.getBoundingClientRect();
  panX = -wx * zoom + rect.width / 2;
  panY = -wy * zoom + rect.height / 2;
  updateCanvasTransform();
  savePan();
  renderMinimap();
});
document.addEventListener('mouseup', () => { mmDragging = false; });

applyMinimapSettings();

// Re-render whenever saveWorkspace is called (catches all content changes)
const origSaveWorkspace = saveWorkspace;
saveWorkspace = function() { origSaveWorkspace(); renderMinimap(); };

// Watch for bare DOM changes
const mmObserver = new MutationObserver(() => renderMinimap());
mmObserver.observe(canvasZoom, { childList: true, subtree: true });

// Re-render on pan/zoom
window.addEventListener('doralangchange', renderMinimap);

// Continuous update during pointer interaction
let mmRunning = false;
function mmStart() { if (mmRunning) return; mmRunning = true; mmLoop(); }
function mmStop() { mmRunning = false; }
function mmLoop() { if (!mmRunning) return; renderMinimap(); requestAnimationFrame(mmLoop); }
document.addEventListener('pointerdown', mmStart);
document.addEventListener('pointerup', mmStop);
