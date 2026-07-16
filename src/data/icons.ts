// Icone line-art originali (nessun logo/marchio di terzi). viewBox 0 0 24 24.
// Uso: <span set:html={icon('grid')} /> oppure direttamente nella markup dell'OS.
// currentColor eredita dal contesto, cosi' cambia con la palette dev/batman.

const P = 'stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"';

export const icons: Record<string, string> = {
  // Profilo / dossier: tessera identificativa
  id: `<svg viewBox="0 0 24 24" ${P}><rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="8.5" cy="11" r="2.3"/><path d="M5 16.2c.6-1.6 2-2.2 3.5-2.2s2.9.6 3.5 2.2"/><path d="M14.5 9.5h4M14.5 12.5h4M14.5 15.5h2.5"/></svg>`,

  // Esperienze: valigetta con cerniera
  briefcase: `<svg viewBox="0 0 24 24" ${P}><rect x="3" y="7.5" width="18" height="12" rx="1.5"/><path d="M8.5 7.5V6a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 6v1.5"/><path d="M3 12.5h18"/><path d="M11 12.5v1.5h2v-1.5"/></svg>`,

  // Progetti / archivio: griglia di finestre
  grid: `<svg viewBox="0 0 24 24" ${P}><rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/></svg>`,

  // Skill / arsenale: microchip
  chip: `<svg viewBox="0 0 24 24" ${P}><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/></svg>`,

  // Contatti / segnale: onde di trasmissione
  signal: `<svg viewBox="0 0 24 24" ${P}><circle cx="12" cy="17" r="1.6"/><path d="M8.5 13.5a5 5 0 0 1 7 0"/><path d="M6 11a8.5 8.5 0 0 1 12 0"/><path d="M3.5 8.5a12 12 0 0 1 17 0"/></svg>`,

  // Sistema / menu batman: silhouette pipistrello stilizzata (originale, non il logo DC)
  bat: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M2 9c1.6.3 2.7 1 3.4 2.2.1-1.4.5-2.3 1.2-2.9-.2 1 .1 2 .9 2.8.7-1.5 1.8-2.4 3.3-2.6-.6.7-.9 1.4-.8 2.2.6-.7 1.2-1 1.9-1 .7 0 1.3.3 1.9 1 .1-.8-.2-1.5-.8-2.2 1.5.2 2.6 1.1 3.3 2.6.8-.8 1.1-1.8.9-2.8.7.6 1.1 1.5 1.2 2.9C18.3 10 19.4 9.3 21 9c-.9 1.3-1.3 2.6-1.2 4-1.9-.5-3.4-.2-4.6.9-.9.9-1.9 1.4-3.2 1.4s-2.3-.5-3.2-1.4c-1.2-1.1-2.7-1.4-4.6-.9.1-1.4-.3-2.7-1.2-4Z"/></svg>`,

  // Codice / menu dev: parentesi angolari
  code: `<svg viewBox="0 0 24 24" ${P}><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg>`,

  // Lingua: globo
  globe: `<svg viewBox="0 0 24 24" ${P}><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5Z"/></svg>`,

  // Email
  mail: `<svg viewBox="0 0 24 24" ${P}><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>`,

  // GitHub-like (gatto/ottocat generico -> uso un ramo generico "repo")
  branch: `<svg viewBox="0 0 24 24" ${P}><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 8v8M18 10c0 3-2 4-5 4.5-1.8.3-3 .8-3 1.5"/></svg>`,

  // LinkedIn-like (generico "network")
  network: `<svg viewBox="0 0 24 24" ${P}><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M8 10.5V16M8 8v.01M12 16v-3a1.8 1.8 0 0 1 3.5 0v3M12 16v-5.5"/></svg>`,
};

export function icon(key: string): string {
  return icons[key] ?? '';
}
