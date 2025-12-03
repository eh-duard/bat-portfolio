export const languages = {
  it: 'Italiano',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'it';

export const translations = {
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'Chi Sono',
    'nav.skills': 'Competenze',
    'nav.projects': 'Progetti',
    'nav.contact': 'Contatti',
    
    // Intro
    'intro.search': 'Cercami',
    'intro.found': 'Mi hai trovato!',
    'intro.hint': 'Trascina il dito per cercare',
    
    // Audio Gate
    'audio.title': 'Esperienza audio immersiva',
    'audio.enable': 'Attiva Audio',
    'audio.skip': 'Continua senza',
    
    // Hero Section
    'hero.greeting': 'Ciao, sono',
    'hero.name': 'Eduard',
    'hero.role': 'Fullstack Developer',
    'hero.description': 'Creo esperienze digitali immersive con passione per il codice pulito e il design elegante.',
    'hero.cta': 'Scopri i miei progetti',
    
    // About Section
    'about.title': 'Chi Sono',
    'about.subtitle': 'La mia storia',
    'about.p1': 'Sviluppatore fullstack con una passione per creare esperienze web uniche e memorabili.',
    'about.p2': 'Mi piace affrontare sfide complesse e trasformarle in soluzioni eleganti.',
    
    // Skills Section
    'skills.title': 'Competenze',
    'skills.subtitle': 'Il mio arsenale',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend',
    'skills.tools': 'Strumenti',
    
    // Projects Section
    'projects.title': 'Progetti',
    'projects.subtitle': 'Le mie opere',
    'projects.viewCode': 'Codice',
    'projects.viewDemo': 'Demo',
    
    // Contact Section
    'contact.title': 'Contatti',
    'contact.subtitle': 'Parliamo',
    'contact.email': 'Scrivimi',
    'contact.message': 'Hai un progetto in mente? Contattami!',
    
    // Footer
    'footer.rights': 'Tutti i diritti riservati',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    
    // Intro
    'intro.search': 'Find me',
    'intro.found': 'You found me!',
    'intro.hint': 'Drag your finger to search',
    
    // Audio Gate
    'audio.title': 'Immersive audio experience',
    'audio.enable': 'Enable Audio',
    'audio.skip': 'Continue without',
    
    // Hero Section
    'hero.greeting': 'Hi, I\'m',
    'hero.name': 'Eduard',
    'hero.role': 'Fullstack Developer',
    'hero.description': 'I create immersive digital experiences with passion for clean code and elegant design.',
    'hero.cta': 'Discover my projects',
    
    // About Section
    'about.title': 'About Me',
    'about.subtitle': 'My story',
    'about.p1': 'Fullstack developer with a passion for creating unique and memorable web experiences.',
    'about.p2': 'I enjoy tackling complex challenges and transforming them into elegant solutions.',
    
    // Skills Section
    'skills.title': 'Skills',
    'skills.subtitle': 'My arsenal',
    'skills.frontend': 'Frontend',
    'skills.backend': 'Backend',
    'skills.tools': 'Tools',
    
    // Projects Section
    'projects.title': 'Projects',
    'projects.subtitle': 'My work',
    'projects.viewCode': 'Code',
    'projects.viewDemo': 'Demo',
    
    // Contact Section
    'contact.title': 'Contact',
    'contact.subtitle': 'Let\'s talk',
    'contact.email': 'Email me',
    'contact.message': 'Have a project in mind? Get in touch!',
    
    // Footer
    'footer.rights': 'All rights reserved',
  },
} as const;

export type TranslationKey = keyof typeof translations.it;

/**
 * Get translation for a key in the specified language
 */
export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key] || translations[defaultLang][key] || key;
}

/**
 * Get the current language from localStorage or default
 */
export function getLang(): Lang {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('lang') as Lang;
    if (stored && stored in languages) {
      return stored;
    }
  }
  return defaultLang;
}

/**
 * Set the current language in localStorage
 */
export function setLang(lang: Lang): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('lang', lang);
  }
}
