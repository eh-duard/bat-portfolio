// Registro delle app dell'OS. Tema unico.
// Le app "di profilo" (progetti, esperienze, skill...) verranno generate in
// seguito dal profilo LinkedIn. Per ora: terminale, gioco, note, impostazioni.
// icon = nome Iconify (set lucide), risolto self-hosted al build da astro-icon.

export type Lang = 'it' | 'en';

export interface AppDef {
  id: string;
  label: Record<Lang, string>;
  icon: string;
  color: string;
  size: { w: number; h: number };
  spawn: { x: number; y: number };
  pinned: boolean;
  desktop?: boolean;
}

export const apps: AppDef[] = [
  {
    id: 'terminal',
    label: { it: 'Terminale', en: 'Terminal' },
    icon: 'lucide:square-terminal', color: '#f2703a',
    size: { w: 640, h: 420 }, spawn: { x: 150, y: 80 }, pinned: true,
  },
  {
    id: 'game',
    label: { it: 'Bat-Signal', en: 'Bat-Signal' },
    icon: 'lucide:gamepad-2', color: '#ec5f8a',
    size: { w: 600, h: 460 }, spawn: { x: 260, y: 100 }, pinned: true, desktop: true,
  },
  {
    id: 'notes',
    label: { it: 'Note', en: 'Notes' },
    icon: 'lucide:notebook-pen', color: '#e8b04b',
    size: { w: 560, h: 440 }, spawn: { x: 300, y: 140 }, pinned: true,
  },
  {
    id: 'info',
    label: { it: 'Info', en: 'About' },
    icon: 'lucide:badge-info', color: '#58b6e6',
    size: { w: 600, h: 500 }, spawn: { x: 240, y: 110 }, pinned: true, desktop: true,
  },
  {
    id: 'settings',
    label: { it: 'Impostazioni', en: 'Settings' },
    icon: 'lucide:settings', color: '#8a94a6',
    size: { w: 540, h: 460 }, spawn: { x: 220, y: 120 }, pinned: true,
  },
];

export const OS_NAME = 'BAT-DESK';
export const OS_HOST = 'batdesk';

export function appById(id: string): AppDef | undefined {
  return apps.find((a) => a.id === id);
}
