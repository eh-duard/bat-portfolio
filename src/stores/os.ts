import { atom } from 'nanostores';
import { apps } from '../data/apps';

export type Lang = 'it' | 'en';

const LS_LANG = 'nox-lang';
const LS_PINS = 'nox-pins';
const LS_WALL = 'nox-wall';

function readLang(): Lang {
  if (typeof localStorage === 'undefined') return 'it';
  return localStorage.getItem(LS_LANG) === 'en' ? 'en' : 'it';
}

export const langStore = atom<Lang>(readLang());

export function setLang(lang: Lang) {
  langStore.set(lang);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem(LS_LANG, lang); } catch {}
  }
}
export function toggleLang() {
  setLang(langStore.get() === 'it' ? 'en' : 'it');
}

/* ---- Pin del dock (persistente) ---- */
function readPins(): string[] {
  if (typeof localStorage === 'undefined') return apps.filter((a) => a.pinned).map((a) => a.id);
  try {
    const raw = localStorage.getItem(LS_PINS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return apps.filter((a) => a.pinned).map((a) => a.id);
}

export const pinsStore = atom<string[]>(readPins());

export function setPins(ids: string[]) {
  pinsStore.set(ids);
  try { localStorage.setItem(LS_PINS, JSON.stringify(ids)); } catch {}
}
export function togglePin(id: string) {
  const cur = pinsStore.get();
  setPins(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
}

/* ---- Wallpaper scelto (persistente) ---- */
export const wallStore = atom<number>(
  typeof localStorage !== 'undefined' ? Number(localStorage.getItem(LS_WALL) ?? 0) : 0
);
export function setWall(i: number) {
  wallStore.set(i);
  try { localStorage.setItem(LS_WALL, String(i)); } catch {}
}
