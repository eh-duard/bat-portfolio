import { atom } from 'nanostores';

export type GameState = {
  isPlaying: boolean;
  isFound: boolean;
  isRevealed: boolean;
};

export type ViewMode = 'dev' | 'batman';

// State del minigioco
export const gameStore = atom<GameState>({
  isPlaying: true, // Il gioco inizia subito
  isFound: false,  // Logo non ancora trovato
  isRevealed: false // Portfolio non ancora rivelato
});

// State della modalità di visualizzazione (inizia come 'batman' per coerenza col gioco, ma l'utente switcherà)
export const modeStore = atom<ViewMode>('batman');

export const setFound = () => {
  gameStore.set({ ...gameStore.get(), isFound: true });
};

export const revealPortfolio = () => {
  gameStore.set({ ...gameStore.get(), isRevealed: true, isPlaying: false });
};

export const setMode = (mode: ViewMode) => {
  modeStore.set(mode);
  // Aggiorna l'attributo data-mode sul body per lo styling globale
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-mode', mode);
  }
};

// Inizializzazione client-side
if (typeof document !== 'undefined') {
  // Sync iniziale
  const currentMode = modeStore.get();
  document.documentElement.setAttribute('data-mode', currentMode);
}
