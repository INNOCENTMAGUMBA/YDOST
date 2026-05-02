// assets/js/i18n.js - Simple i18n implementation
const translations = {
  en: {
    "nav.platform": "Platform",
    "nav.corridors": "Corridors",
    "nav.about": "About",
    "nav.investors": "For Investors",
    "nav.contact": "Contact",
    "nav.login": "Log In",
    "nav.register": "Get Started",
    "hero.badge": "Now Live: All Foreigners in Türkiye",
    "hero.title1": "The Global Civic Home for",
    "hero.title2": "Foreigners in Türkiye",
    "hero.description": "YurtDostluk is a KYC-verified Super-App that digitizes the entire expat and international student lifecycle — connecting trusted services, academic support, embassy integration, and community in one secure platform.",
    "hero.selectCorridor": "Select Your Home Country",
    "hero.selectCountry": "Select your country...",
    "hero.corridorNote": "All foreigners in Türkiye welcome — students, professionals, medical travelers & more.",
    "hero.ctaPrimary": "Start Your Journey",
    "hero.ctaSecondary": "Explore Platform",
    "trust.kyc": "Zero-Retention KYC",
    "trust.escrow": "Escrow-Protected",
    "trust.embassy": "Embassy Integrated",
    // ... add more translations
  },
  tr: {
    "nav.platform": "Platform",
    "nav.corridors": "Koridorlar",
    "nav.about": "Hakkımızda",
    "nav.investors": "Yatırımcılar",
    "nav.contact": "İletişim",
    "nav.login": "Giriş Yap",
    "nav.register": "Kayıt Ol",
    "hero.badge": "Şimdi Yayında: Türkiye'deki Tüm Yabancılar",
    "hero.title1": "Türkiye'deki Yabancılar İçin",
    "hero.title2": "Küresel Dijital Yuva",
    "hero.description": "YurtDostluk, yabancıların ve uluslararası öğrencilerin tüm yaşam döngüsünü dijitalleştiren, güvenilir hizmetleri, akademik desteği, büyükelçilik entegrasyonunu ve topluluğu tek güvenli platformda birleştiren KYC doğrulamalı bir Süper-Uygulamadır.",
    // ... Turkish translations
  },
  ar: {
    // Arabic translations (RTL support handled via CSS [lang="ar"])
  },
  fr: {
    // French translations
  }
};

// Apply translations to elements with data-i18n attribute
function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang]?.[key]) {
      el.textContent = translations[lang][key];
    }
  });
  
  // Handle RTL for Arabic
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('language-selector');
  if (selector) {
    selector.addEventListener('change', (e) => {
      applyTranslations(e.target.value);
      // Optional: save preference to localStorage
      localStorage.setItem('yurtdostluk_lang', e.target.value);
    });
    
    // Load saved preference or default to 'en'
    const savedLang = localStorage.getItem('yurtdostluk_lang') || 'en';
    selector.value = savedLang;
    applyTranslations(savedLang);
  }
});
