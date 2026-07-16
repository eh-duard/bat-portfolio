import { atom } from 'nanostores';

export type Mode = 'dev' | 'batman';
export type Lang = 'it' | 'en';

const LS_MODE = 'batos-mode';
const LS_LANG = 'batos-lang';

function read<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  if (typeof localStorage === 'undefined') return fallback;
  const v = localStorage.getItem(key) as T | null;
  return v && allowed.includes(v) ? v : fallback;
}

export const modeStore = atom<Mode>(read(LS_MODE, 'batman', ['dev', 'batman']));
export const langStore = atom<Lang>(read(LS_LANG, 'it', ['it', 'en']));

export function setMode(mode: Mode) {
  modeStore.set(mode);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-mode', mode);
    try { localStorage.setItem(LS_MODE, mode); } catch {}
  }
}

export function toggleMode() {
  setMode(modeStore.get() === 'batman' ? 'dev' : 'batman');
}

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
