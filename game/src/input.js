const held = new Set();
export function createInput(canvas) {
  const mouse = { x: 0, y: 0, width: 1280, height: 800, down: false, clicked: false };
  const justPressed = new Set();
  window.addEventListener('keydown', e => { if (!held.has(e.code)) justPressed.add(e.code); held.add(e.code); if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault(); });
  window.addEventListener('keyup', e => { held.delete(e.code); justPressed.delete(e.code); });
  window.addEventListener('blur', () => { held.clear(); justPressed.clear(); });
  canvas.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX-r.left; mouse.y=e.clientY-r.top; mouse.width=r.width; mouse.height=r.height; });
  canvas.addEventListener('pointerdown', e => { mouse.down=true; mouse.clicked=true; canvas.setPointerCapture?.(e.pointerId); });
  window.addEventListener('pointerup', () => { mouse.down=false; });
  return { held, mouse, pressed(code) { return held.has(code); }, justPressed(code) { const v=justPressed.has(code); justPressed.delete(code); return v; }, takeClick() { const v=mouse.clicked; mouse.clicked=false; return v; } };
}
