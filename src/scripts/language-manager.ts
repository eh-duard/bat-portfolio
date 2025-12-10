import { ui, defaultLang } from '../i18n/ui';

// Simple text replacement based on data-i18n attribute
export function updateTranslations(lang: 'en' | 'it') {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (!key) return;

        // Type safety workaround for dynamic key access
        const translations = ui[lang] as Record<string, string>;
        const text = translations[key];

        if (text) {
            // Use innerHTML to support <br/> tags in translations
            element.innerHTML = text;
        }
    });

    // Also update placeholders if needed
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (!key) return;
        const translations = ui[lang] as Record<string, string>;
        const text = translations[key];
        if (text) {
            element.setAttribute('placeholder', text);
        }
    });
}

// Listen for custom event from LanguageToggle
if (typeof window !== 'undefined') {
    window.addEventListener('lang-change', ((e: CustomEvent) => {
        const newLang = e.detail;
        updateTranslations(newLang);
    }) as EventListener);

    // Initial update on load
    document.addEventListener('DOMContentLoaded', () => {
        const savedLang = localStorage.getItem('lang') || defaultLang;
        updateTranslations(savedLang as 'en' | 'it');
    });

    // Re-run on Astro page transitions
    document.addEventListener('astro:page-load', () => {
        const savedLang = localStorage.getItem('lang') || defaultLang;
        updateTranslations(savedLang as 'en' | 'it');
    });
}
