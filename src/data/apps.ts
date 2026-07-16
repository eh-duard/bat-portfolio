// Registro delle "app" dell'OS. Ogni sezione del portfolio e' un'app/finestra.
// I nomi cambiano con la modalita' (dev / batman) e con la lingua (it / en).

export type Lang = 'it' | 'en';
export type Mode = 'dev' | 'batman';

export interface AppDef {
  id: string;
  icon: string; // chiave in icons.ts
  /** nome mostrato: [modalita'][lingua] */
  label: Record<Mode, Record<Lang, string>>;
  /** larghezza x altezza iniziale della finestra su desktop (px) */
  size: { w: number; h: number };
  /** posizione iniziale a cascata su desktop (px dal top-left dell'area) */
  spawn: { x: number; y: number };
  /** true = fa parte dei preferiti nel dock/home telefono */
  dock: boolean;
}

export const apps: AppDef[] = [
  {
    id: 'bio',
    icon: 'id',
    label: {
      dev: { it: 'Profilo', en: 'Profile' },
      batman: { it: 'Dossier', en: 'Dossier' },
    },
    size: { w: 560, h: 440 },
    spawn: { x: 120, y: 90 },
    dock: true,
  },
  {
    id: 'experience',
    icon: 'briefcase',
    label: {
      dev: { it: 'Esperienze', en: 'Experience' },
      batman: { it: 'Casi Risolti', en: 'Solved Cases' },
    },
    size: { w: 600, h: 480 },
    spawn: { x: 200, y: 130 },
    dock: true,
  },
  {
    id: 'projects',
    icon: 'grid',
    label: {
      dev: { it: 'Progetti', en: 'Projects' },
      batman: { it: 'Archivio', en: 'Archive' },
    },
    size: { w: 680, h: 500 },
    spawn: { x: 280, y: 100 },
    dock: true,
  },
  {
    id: 'skills',
    icon: 'chip',
    label: {
      dev: { it: 'Competenze', en: 'Skills' },
      batman: { it: 'Arsenale', en: 'Arsenal' },
    },
    size: { w: 600, h: 460 },
    spawn: { x: 160, y: 170 },
    dock: true,
  },
  {
    id: 'contact',
    icon: 'signal',
    label: {
      dev: { it: 'Contatti', en: 'Contact' },
      batman: { it: 'Bat-Segnale', en: 'Bat-Signal' },
    },
    size: { w: 520, h: 420 },
    spawn: { x: 340, y: 150 },
    dock: true,
  },
];

export const osName: Record<Mode, string> = {
  dev: 'DEV//OS',
  batman: 'GOTHAM//OS',
};

export function appLabel(app: AppDef, mode: Mode, lang: Lang): string {
  return app.label[mode][lang];
}
