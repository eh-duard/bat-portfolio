import { apps, appLabel, osName, type AppDef } from '../data/apps';
import { modeStore, langStore, setMode, setLang, toggleMode, toggleLang } from '../stores/os';

type Layout = 'desktop' | 'tablet' | 'phone';

const appMap = new Map<string, AppDef>(apps.map((a) => [a.id, a]));
let zCounter = 20;
const running = new Set<string>();

function layout(): Layout {
  const w = window.innerWidth;
  if (w <= 640) return 'phone';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const win = (id: string) => $(`#win-${id}`) as HTMLElement | null;

/* ---------------------------------------------------------------- *
 *  Etichette dinamiche (nome app, titolo OS) su cambio mode/lang
 * ---------------------------------------------------------------- */
function refreshLabels() {
  const mode = modeStore.get();
  const lang = langStore.get();
  $$('[data-app-label]').forEach((el) => {
    const app = appMap.get(el.dataset.appLabel!);
    if (app) el.textContent = appLabel(app, mode, lang);
  });
  $$('[data-os-name]').forEach((el) => (el.textContent = osName[mode]));
}

/* ---------------------------------------------------------------- *
 *  Focus / z-order
 * ---------------------------------------------------------------- */
function focus(id: string) {
  const el = win(id);
  if (!el) return;
  el.style.zIndex = String(++zCounter);
  $$('.win').forEach((w) => w.classList.toggle('is-active', w === el));
  syncDock();
}

/* ---------------------------------------------------------------- *
 *  Posizionamento iniziale
 * ---------------------------------------------------------------- */
function place(el: HTMLElement, app: AppDef) {
  const lay = layout();
  el.classList.remove('win--sheet', 'win--max');
  if (lay === 'phone') {
    el.classList.add('win--sheet');
    el.style.left = el.style.top = el.style.width = el.style.height = '';
    return;
  }
  const area = $('#desktop-area')!.getBoundingClientRect();
  let { w, h } = app.size;
  w = Math.min(w, area.width - 40);
  h = Math.min(h, area.height - 40);
  let x: number, y: number;
  if (lay === 'tablet') {
    // centrato con leggero scostamento a cascata
    const i = apps.findIndex((a) => a.id === app.id);
    x = Math.max(16, (area.width - w) / 2 + i * 12 - 24);
    y = Math.max(16, (area.height - h) / 2 + i * 10 - 30);
  } else {
    x = app.spawn.x;
    y = app.spawn.y;
  }
  x = Math.min(x, area.width - w - 16);
  y = Math.min(y, area.height - h - 16);
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  el.style.left = `${Math.max(8, x)}px`;
  el.style.top = `${Math.max(8, y)}px`;
}

/* ---------------------------------------------------------------- *
 *  Open / close / minimize / maximize
 * ---------------------------------------------------------------- */
function open(id: string) {
  const el = win(id);
  const app = appMap.get(id);
  if (!el || !app) return;
  const firstOpen = el.hidden;
  el.hidden = false;
  el.setAttribute('aria-hidden', 'false');
  el.classList.remove('is-min');
  if (firstOpen || !el.style.left) place(el, app);
  running.add(id);
  requestAnimationFrame(() => el.classList.add('is-open'));
  focus(id);
  if (layout() === 'phone') document.body.classList.add('has-sheet');
}

function close(id: string) {
  const el = win(id);
  if (!el) return;
  el.classList.remove('is-open', 'is-active');
  running.delete(id);
  const done = () => {
    el.hidden = true;
    el.setAttribute('aria-hidden', 'true');
    el.removeEventListener('transitionend', done);
  };
  el.addEventListener('transitionend', done);
  setTimeout(done, 320); // fallback
  if (![...running].some((r) => win(r)?.classList.contains('win--sheet')))
    document.body.classList.remove('has-sheet');
  syncDock();
}

function minimize(id: string) {
  const el = win(id);
  if (!el) return;
  el.classList.add('is-min');
  el.classList.remove('is-active');
  setTimeout(() => { if (el.classList.contains('is-min')) el.hidden = true; }, 260);
  if (layout() === 'phone') document.body.classList.remove('has-sheet');
  syncDock();
}

function toggleMax(id: string) {
  const el = win(id);
  if (!el || layout() === 'phone') return;
  el.classList.toggle('win--max');
  focus(id);
}

function toggleFromDock(id: string) {
  const el = win(id);
  if (!el) return;
  if (running.has(id) && !el.hidden && !el.classList.contains('is-min')) {
    if (el.classList.contains('is-active')) minimize(id);
    else focus(id);
  } else open(id);
}

/* ---------------------------------------------------------------- *
 *  Dock: indicatori "running"
 * ---------------------------------------------------------------- */
function syncDock() {
  $$('[data-dock-item]').forEach((el) => {
    const id = el.dataset.dockItem!;
    const w = win(id);
    el.classList.toggle('running', running.has(id));
    el.classList.toggle('active', !!w && w.classList.contains('is-active') && !w.hidden);
  });
}

/* ---------------------------------------------------------------- *
 *  Drag delle finestre
 * ---------------------------------------------------------------- */
function initDrag(el: HTMLElement) {
  const bar = $('[data-drag]', el);
  if (!bar) return;
  bar.addEventListener('pointerdown', (e) => {
    const pe = e as PointerEvent;
    if ((pe.target as HTMLElement).closest('[data-action]')) return;
    if (layout() === 'phone' || el.classList.contains('win--max')) return;
    const area = $('#desktop-area')!.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const offX = pe.clientX - rect.left;
    const offY = pe.clientY - rect.top;
    focus(el.id.replace('win-', ''));
    bar.setPointerCapture(pe.pointerId);
    el.classList.add('is-dragging');

    const move = (ev: PointerEvent) => {
      let x = ev.clientX - area.left - offX;
      let y = ev.clientY - area.top - offY;
      x = Math.max(4, Math.min(x, area.width - rect.width - 4));
      y = Math.max(4, Math.min(y, area.height - rect.height - 4));
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };
    const up = (ev: PointerEvent) => {
      bar.releasePointerCapture(ev.pointerId);
      el.classList.remove('is-dragging');
      bar.removeEventListener('pointermove', move as EventListener);
      bar.removeEventListener('pointerup', up as EventListener);
    };
    bar.addEventListener('pointermove', move as EventListener);
    bar.addEventListener('pointerup', up as EventListener);
  });
}

/* ---------------------------------------------------------------- *
 *  Bind UI
 * ---------------------------------------------------------------- */
function bind() {
  // finestre
  $$('.win').forEach((el) => {
    initDrag(el);
    el.addEventListener('pointerdown', () => focus(el.id.replace('win-', '')), true);
    $$('[data-action]', el).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.id.replace('win-', '');
        const act = (btn as HTMLElement).dataset.action;
        if (act === 'close') close(id);
        else if (act === 'min') minimize(id);
        else if (act === 'max') toggleMax(id);
      });
    });
  });

  // icone desktop: singolo click seleziona, doppio apre (desktop); tap apre (touch)
  $$('[data-launch]').forEach((el) => {
    const id = (el as HTMLElement).dataset.launch!;
    el.addEventListener('dblclick', () => open(id));
    el.addEventListener('click', () => {
      if (layout() === 'desktop') {
        $$('[data-launch]').forEach((o) => o.classList.toggle('selected', o === el));
      } else open(id);
    });
    el.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') open(id);
    });
  });

  // dock
  $$('[data-dock-item]').forEach((el) => {
    el.addEventListener('click', () => toggleFromDock((el as HTMLElement).dataset.dockItem!));
  });

  // toggle mode / lang
  $$('[data-set-mode]').forEach((el) =>
    el.addEventListener('click', () => setMode((el as HTMLElement).dataset.setMode as any)));
  $$('[data-toggle-mode]').forEach((el) => el.addEventListener('click', () => toggleMode()));
  $$('[data-set-lang]').forEach((el) =>
    el.addEventListener('click', () => setLang((el as HTMLElement).dataset.setLang as any)));
  $$('[data-toggle-lang]').forEach((el) => el.addEventListener('click', () => toggleLang()));

  // deseleziona icone cliccando sul vuoto
  $('#desktop-area')?.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).id === 'desktop-area')
      $$('[data-launch]').forEach((o) => o.classList.remove('selected'));
  });

  // ESC chiude la finestra attiva
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const active = $$('.win').find((w) => w.classList.contains('is-active') && !w.hidden);
    if (active) close(active.id.replace('win-', ''));
  });
}

/* ---------------------------------------------------------------- *
 *  Stato attivo dei toggle nella UI
 * ---------------------------------------------------------------- */
function reflectToggles() {
  const mode = modeStore.get();
  const lang = langStore.get();
  $$('[data-set-mode]').forEach((el) =>
    el.classList.toggle('on', (el as HTMLElement).dataset.setMode === mode));
  $$('[data-set-lang]').forEach((el) =>
    el.classList.toggle('on', (el as HTMLElement).dataset.setLang === lang));
}

/* ---------------------------------------------------------------- *
 *  Clock
 * ---------------------------------------------------------------- */
function clock() {
  const el = $('#os-clock');
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString(
      langStore.get() === 'it' ? 'it-IT' : 'en-GB',
      { hour: '2-digit', minute: '2-digit' }
    );
  };
  tick();
  setInterval(tick, 15000);
}

/* ---------------------------------------------------------------- *
 *  Boot sequence (una volta per sessione)
 * ---------------------------------------------------------------- */
function boot() {
  const el = $('#boot');
  if (!el) return;
  if (sessionStorage.getItem('batos-booted')) { el.remove(); return; }
  const dismiss = () => {
    el.classList.add('done');
    sessionStorage.setItem('batos-booted', '1');
    setTimeout(() => el.remove(), 700);
  };
  el.addEventListener('click', dismiss);
  document.addEventListener('keydown', dismiss, { once: true });
  setTimeout(dismiss, 2600);
}

/* ---------------------------------------------------------------- *
 *  Init
 * ---------------------------------------------------------------- */
function init() {
  document.documentElement.setAttribute('data-mode', modeStore.get());
  document.documentElement.setAttribute('lang', langStore.get());
  bind();
  refreshLabels();
  reflectToggles();
  clock();
  boot();

  modeStore.subscribe(() => { refreshLabels(); reflectToggles(); });
  langStore.subscribe(() => { refreshLabels(); reflectToggles(); });

  // riposiziona le finestre aperte al cambio di layout
  let last = layout();
  window.addEventListener('resize', () => {
    const now = layout();
    if (now === last) return;
    last = now;
    running.forEach((id) => {
      const el = win(id);
      const app = appMap.get(id);
      if (el && app && !el.hidden) place(el, app);
    });
    document.body.classList.toggle('has-sheet', now === 'phone' && running.size > 0);
  });

  // API di debug
  (window as any).batOS = { open, close, minimize, apps };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
