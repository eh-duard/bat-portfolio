/**
 * Client-side i18n manager
 * Handles dynamic language switching without page reload
 */

import { translations, defaultLang, type Lang, type TranslationKey } from './translations';

class I18nManager {
  private currentLang: Lang;

  constructor() {
    this.currentLang = this.getStoredLang();
    this.init();
  }

  private getStoredLang(): Lang {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('lang') as Lang;
      if (stored && (stored === 'it' || stored === 'en')) {
        return stored;
      }
    }
    return defaultLang;
  }

  private init() {
    // Apply stored language on load
    this.applyTranslations();
    
    // Listen for language change events
    document.addEventListener('lang-change', ((e: CustomEvent<{ lang: Lang }>) => {
      this.setLang(e.detail.lang);
    }) as EventListener);
  }

  public setLang(lang: Lang) {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    this.applyTranslations();
  }

  public getLang(): Lang {
    return this.currentLang;
  }

  public t(key: TranslationKey): string {
    return translations[this.currentLang][key] || translations[defaultLang][key] || key;
  }

  private applyTranslations() {
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n') as TranslationKey;
      if (key && translations[this.currentLang][key]) {
        el.textContent = translations[this.currentLang][key];
      }
    });

    // Update html lang attribute
    document.documentElement.lang = this.currentLang;
  }
}

// Initialize on DOM ready
let i18nInstance: I18nManager | null = null;

document.addEventListener('DOMContentLoaded', () => {
  i18nInstance = new I18nManager();
});

// Export for use in other scripts
export function getI18n(): I18nManager | null {
  return i18nInstance;
}
