// Registro delle app dell'OS. Nessuna modalita' doppia: tema unico.
// icon = nome Iconify (set lucide/logos), risolto self-hosted al build da astro-icon.

export type Lang = 'it' | 'en';

export interface AppDef {
  id: string;
  label: Record<Lang, string>;
  icon: string;
  color: string; // tinta della tile (icona in stile app da distro)
  size: { w: number; h: number };
  spawn: { x: number; y: number };
  pinned: boolean;   // presente nel dock di default
  desktop?: boolean; // icona anche sul desktop
}

export const apps: AppDef[] = [
  {
    id: 'terminal',
    label: { it: 'Terminale', en: 'Terminal' },
    icon: 'lucide:square-terminal', color: '#f2703a',
    size: { w: 640, h: 420 }, spawn: { x: 150, y: 80 }, pinned: true, desktop: false,
  },
  {
    id: 'projects',
    label: { it: 'Progetti', en: 'Projects' },
    icon: 'lucide:folder-git-2', color: '#5b8def',
    size: { w: 720, h: 500 }, spawn: { x: 250, y: 110 }, pinned: true, desktop: true,
  },
  {
    id: 'about',
    label: { it: 'Profilo', en: 'About' },
    icon: 'lucide:user-round', color: '#46c6b0',
    size: { w: 600, h: 460 }, spawn: { x: 200, y: 100 }, pinned: true,
  },
  {
    id: 'skills',
    label: { it: 'Stack', en: 'Stack' },
    icon: 'lucide:cpu', color: '#52c07a',
    size: { w: 620, h: 470 }, spawn: { x: 220, y: 130 }, pinned: true,
  },
  {
    id: 'experience',
    label: { it: 'Esperienze', en: 'Experience' },
    icon: 'lucide:briefcase-business', color: '#8b7cf0',
    size: { w: 620, h: 480 }, spawn: { x: 180, y: 90 }, pinned: false,
  },
  {
    id: 'notes',
    label: { it: 'Note', en: 'Notes' },
    icon: 'lucide:notebook-pen', color: '#e8b04b',
    size: { w: 560, h: 440 }, spawn: { x: 300, y: 140 }, pinned: true,
  },
  {
    id: 'game',
    label: { it: 'Bat-Signal', en: 'Bat-Signal' },
    icon: 'lucide:gamepad-2', color: '#ec5f8a',
    size: { w: 600, h: 460 }, spawn: { x: 260, y: 90 }, pinned: true,
  },
  {
    id: 'contact',
    label: { it: 'Contatti', en: 'Contact' },
    icon: 'lucide:send', color: '#e5674f',
    size: { w: 520, h: 430 }, spawn: { x: 320, y: 150 }, pinned: false,
  },
  {
    id: 'settings',
    label: { it: 'Impostazioni', en: 'Settings' },
    icon: 'lucide:settings', color: '#8a94a6',
    size: { w: 520, h: 420 }, spawn: { x: 280, y: 120 }, pinned: false,
  },
];

export const OS_NAME = 'NOX//OS';

export function appById(id: string): AppDef | undefined {
  return apps.find((a) => a.id === id);
}
