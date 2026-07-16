import { apps, appById, type AppDef } from '../data/apps';
import {
  langStore, setLang, pinsStore, togglePin, wallStore, setWall,
} from '../stores/os';

type Layout = 'desktop' | 'tablet' | 'phone';

let zCounter = 20;
const running = new Set<string>();

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const win = (id: string) => $(`#win-${id}`) as HTMLElement | null;

function layout(): Layout {
  const w = window.innerWidth;
  if (w <= 640) return 'phone';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

/* ---------------- etichette / lingua ---------------- */
function refreshLabels() {
  const lang = langStore.get();
  $$('[data-app-label]').forEach((el) => {
    const app = appById(el.dataset.appLabel!);
    if (app) el.textContent = app.label[lang];
  });
  $$('[data-set-lang]').forEach((el) => el.classList.toggle('on', (el as HTMLElement).dataset.setLang === lang));
}

/* ---------------- focus / z-order ---------------- */
function focus(id: string) {
  const el = win(id);
  if (!el) return;
  el.style.zIndex = String(++zCounter);
  $$('.win').forEach((w) => w.classList.toggle('is-active', w === el));
  syncDock();
}

/* ---------------- posizionamento ---------------- */
function area() { return $('#desktop-area')!.getBoundingClientRect(); }

function place(el: HTMLElement, app: AppDef) {
  const lay = layout();
  el.classList.remove('win--sheet', 'win--max');
  if (lay === 'phone') {
    el.classList.add('win--sheet');
    el.style.cssText = el.style.cssText.replace(/(left|top|width|height):[^;]+;?/g, '');
    return;
  }
  const a = area();
  let { w, h } = app.size;
  w = Math.min(w, a.width - 32);
  h = Math.min(h, a.height - 32);
  let x: number, y: number;
  if (lay === 'tablet') {
    const i = apps.findIndex((p) => p.id === app.id);
    x = (a.width - w) / 2 + (i % 3) * 16 - 16;
    y = (a.height - h) / 2 + (i % 3) * 14 - 20;
  } else {
    x = app.spawn.x; y = app.spawn.y;
  }
  x = Math.max(8, Math.min(x, a.width - w - 12));
  y = Math.max(8, Math.min(y, a.height - h - 12));
  el.style.width = `${w}px`; el.style.height = `${h}px`;
  el.style.left = `${x}px`; el.style.top = `${y}px`;
}

/* ---------------- open / close / min / max ---------------- */
function open(id: string) {
  const el = win(id); const app = appById(id);
  if (!el || !app) return;
  const first = el.hidden;
  el.hidden = false; el.setAttribute('aria-hidden', 'false'); el.classList.remove('is-min');
  if (first || !el.style.left) place(el, app);
  running.add(id);
  requestAnimationFrame(() => el.classList.add('is-open'));
  focus(id);
  closeStartMenu();
  if (layout() === 'phone') document.body.classList.add('has-sheet');
}
function close(id: string) {
  const el = win(id); if (!el) return;
  el.classList.remove('is-open', 'is-active'); running.delete(id);
  const done = () => { el.hidden = true; el.setAttribute('aria-hidden', 'true'); };
  setTimeout(done, 300);
  if (![...running].some((r) => win(r)?.classList.contains('win--sheet'))) document.body.classList.remove('has-sheet');
  syncDock();
}
function minimize(id: string) {
  const el = win(id); if (!el) return;
  el.classList.add('is-min'); el.classList.remove('is-active');
  setTimeout(() => { if (el.classList.contains('is-min')) el.hidden = true; }, 260);
  if (layout() === 'phone') document.body.classList.remove('has-sheet');
  syncDock();
}
function toggleMax(id: string) {
  const el = win(id); if (!el || layout() === 'phone') return;
  el.classList.toggle('win--max'); focus(id);
}
function fromDock(id: string) {
  const el = win(id); if (!el) return;
  if (running.has(id) && !el.hidden && !el.classList.contains('is-min')) {
    if (el.classList.contains('is-active')) minimize(id); else focus(id);
  } else open(id);
}

/* ---------------- dock ---------------- */
function syncDock() {
  const pins = pinsStore.get();
  $$('[data-dock-li]').forEach((li) => {
    const id = li.dataset.dockLi!;
    li.classList.toggle('is-pinned', pins.includes(id));
    li.classList.toggle('running', running.has(id));
  });
  $$('[data-dock-item]').forEach((el) => {
    const id = el.dataset.dockItem!; const w = win(id);
    el.classList.toggle('running', running.has(id));
    el.classList.toggle('active', !!w && w.classList.contains('is-active') && !w.hidden);
  });
}

/* ---------------- drag ---------------- */
function initDrag(el: HTMLElement) {
  const bar = $('[data-drag]', el); if (!bar) return;
  bar.addEventListener('pointerdown', (e) => {
    const pe = e as PointerEvent;
    if ((pe.target as HTMLElement).closest('[data-action]')) return;
    if (layout() === 'phone' || el.classList.contains('win--max')) return;
    const a = area(); const rect = el.getBoundingClientRect();
    const offX = pe.clientX - rect.left, offY = pe.clientY - rect.top;
    focus(el.id.replace('win-', ''));
    bar.setPointerCapture(pe.pointerId); el.classList.add('is-dragging');
    const move = (ev: PointerEvent) => {
      let x = ev.clientX - a.left - offX, y = ev.clientY - a.top - offY;
      x = Math.max(2, Math.min(x, a.width - rect.width - 2));
      y = Math.max(2, Math.min(y, a.height - rect.height - 2));
      el.style.left = `${x}px`; el.style.top = `${y}px`;
    };
    const up = (ev: PointerEvent) => {
      bar.releasePointerCapture(ev.pointerId); el.classList.remove('is-dragging');
      bar.removeEventListener('pointermove', move as EventListener);
      bar.removeEventListener('pointerup', up as EventListener);
    };
    bar.addEventListener('pointermove', move as EventListener);
    bar.addEventListener('pointerup', up as EventListener);
  });
}

/* ---------------- start menu ---------------- */
function openStartMenu() {
  const sm = $('#startmenu'); if (!sm) return;
  sm.hidden = false; requestAnimationFrame(() => sm.classList.add('is-open'));
  ($('#sm-search') as HTMLInputElement | null)?.focus();
}
function closeStartMenu() {
  const sm = $('#startmenu'); if (!sm || sm.hidden) return;
  sm.classList.remove('is-open'); setTimeout(() => (sm.hidden = true), 240);
}
function toggleStartMenu() {
  const sm = $('#startmenu'); if (!sm) return;
  sm.hidden || !sm.classList.contains('is-open') ? openStartMenu() : closeStartMenu();
}

/* ---------------- menu contestuale ---------------- */
function showMenu(x: number, y: number, items: { label: string; onClick: () => void; danger?: boolean }[]) {
  hideMenu();
  const menu = document.createElement('div');
  menu.className = 'ctxmenu'; menu.id = 'ctxmenu';
  items.forEach((it) => {
    const b = document.createElement('button');
    b.className = 'ctxmenu__item' + (it.danger ? ' is-danger' : '');
    b.textContent = it.label;
    b.onclick = () => { hideMenu(); it.onClick(); };
    menu.appendChild(b);
  });
  document.body.appendChild(menu);
  const mw = menu.offsetWidth, mh = menu.offsetHeight;
  menu.style.left = Math.min(x, window.innerWidth - mw - 8) + 'px';
  menu.style.top = Math.min(y, window.innerHeight - mh - 8) + 'px';
  requestAnimationFrame(() => menu.classList.add('is-open'));
}
function hideMenu() { $('#ctxmenu')?.remove(); }

/* ---------------- bind ---------------- */
function bind() {
  $$('.win').forEach((el) => {
    initDrag(el);
    el.addEventListener('pointerdown', () => focus(el.id.replace('win-', '')), true);
    $$('[data-action]', el).forEach((btn) => btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.id.replace('win-', ''); const act = (btn as HTMLElement).dataset.action;
      if (act === 'close') close(id); else if (act === 'min') minimize(id); else if (act === 'max') toggleMax(id);
    }));
  });

  // launch (dock, start menu, desktop icons, terminal)
  $$('[data-launch]').forEach((el) => {
    const id = (el as HTMLElement).dataset.launch!;
    el.addEventListener('click', () => open(id));
  });
  $$('[data-dock-item]').forEach((el) => {
    const id = (el as HTMLElement).dataset.dockItem;
    if (!id) return;
    el.addEventListener('click', () => fromDock(id));
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const pinned = pinsStore.get().includes(id);
      showMenu((e as MouseEvent).clientX, (e as MouseEvent).clientY, [
        { label: running.has(id) ? 'Porta in primo piano' : 'Apri', onClick: () => open(id) },
        { label: pinned ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti', onClick: () => togglePin(id) },
      ]);
    });
  });

  // desktop icons: doppio click desktop / tap altrove
  $$('[data-desktop-icon]').forEach((el) => {
    const id = (el as HTMLElement).dataset.desktopIcon!;
    el.addEventListener('dblclick', () => open(id));
    el.addEventListener('click', () => { if (layout() !== 'desktop') open(id); });
  });

  // start menu
  $$('[data-toggle-startmenu]').forEach((el) => el.addEventListener('click', (e) => { e.stopPropagation(); toggleStartMenu(); }));
  $$('[data-close-startmenu]').forEach((el) => el.addEventListener('click', () => closeStartMenu()));

  // lingua
  $$('[data-set-lang]').forEach((el) => el.addEventListener('click', () => setLang((el as HTMLElement).dataset.setLang as any)));

  // menu contestuale desktop
  $('#desktop-area')?.addEventListener('contextmenu', (e) => {
    const me = e as MouseEvent;
    if (!(me.target as HTMLElement).closest('.win')) {
      e.preventDefault();
      showMenu(me.clientX, me.clientY, [
        { label: 'Apri Terminale', onClick: () => open('terminal') },
        { label: 'Nuova nota', onClick: () => open('notes') },
        { label: 'Cambia sfondo', onClick: () => setWall((wallStore.get() + 1) % 4) },
        { label: 'Tutte le app', onClick: () => openStartMenu() },
      ]);
    }
  });
  document.addEventListener('pointerdown', (e) => { if (!(e.target as HTMLElement).closest('#ctxmenu')) hideMenu(); });
  window.addEventListener('blur', hideMenu);

  // tastiera
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideMenu();
      const sm = $('#startmenu');
      if (sm && !sm.hidden) { closeStartMenu(); return; }
      const active = $$('.win').find((w) => w.classList.contains('is-active') && !w.hidden);
      if (active) close(active.id.replace('win-', ''));
    }
  });
}

/* ---------------- wallpaper ---------------- */
function applyWall() { document.getElementById('desktop')?.setAttribute('data-wall', String(wallStore.get())); }

/* ---------------- clock ---------------- */
function clock() {
  const c = $('#os-clock'), d = $('#os-date'); if (!c) return;
  const tick = () => {
    const loc = langStore.get() === 'it' ? 'it-IT' : 'en-GB';
    c.textContent = new Date().toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
    if (d) d.textContent = new Date().toLocaleDateString(loc, { weekday: 'short', day: '2-digit', month: 'short' });
  };
  tick(); setInterval(tick, 15000);
}

/* ---------------- boot ---------------- */
function boot() {
  const el = $('#boot'); if (!el) return;
  if (sessionStorage.getItem('nox-booted')) { el.remove(); return; }
  const done = () => { el.classList.add('done'); sessionStorage.setItem('nox-booted', '1'); setTimeout(() => el.remove(), 650); };
  el.addEventListener('click', done);
  document.addEventListener('keydown', done, { once: true });
  setTimeout(done, 2400);
}

/* ---------------- init ---------------- */
function init() {
  document.documentElement.setAttribute('lang', langStore.get());
  bind(); refreshLabels(); syncDock(); applyWall(); clock(); boot();

  langStore.subscribe(() => { refreshLabels(); });
  pinsStore.subscribe(() => syncDock());
  wallStore.subscribe(() => applyWall());

  let last = layout();
  window.addEventListener('resize', () => {
    const now = layout(); if (now === last) return; last = now;
    running.forEach((id) => { const el = win(id), app = appById(id); if (el && app && !el.hidden) place(el, app); });
    document.body.classList.toggle('has-sheet', now === 'phone' && running.size > 0);
  });

  (window as any).batOS = { open, close, minimize, apps };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
