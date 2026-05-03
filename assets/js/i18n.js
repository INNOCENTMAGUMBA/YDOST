/**
 * YURTDOSTLUK — Internationalization (i18n) Engine (v1.0)
 * =======================================================
 * Purpose: Manages translations and language switching for the public site.
 * Supports EN (English), TR (Turkish), FR (French), AR (Arabic).
 * 
 * USAGE:
 * 1. Add data-i18n="key_name" to any HTML element you want to translate.
 * 2. Add the key and translations to the 'translations' object below.
 * =======================================================
 */

const I18n = (function() {
  
  // ── 1. CONFIGURATION & STATE ──────────────────────
  let currentLang = 'en';
  const supportedLanguages = ['en', 'tr', 'fr', 'ar'];
  const rtlLanguages = ['ar'];

  // ── 2. TRANSLATION DICTIONARY ─────────────────────
  // Add new keys here as you add more text to the site.
  const translations = {
    en: {
      // Navigation
      "nav.home": "Home",
      "nav.platform": "Platform",
      "nav.corridors": "Corridors",
      "nav.about": "About",
      "nav.contact": "Contact",
      "nav.investors": "Investors",
      "nav.login": "Log In",
      "nav.get_started": "Get Started",
      
      // Hero Section
      "hero.badge": "Now Live: Country A → Türkiye Corridor",
      "hero.title_part_1": "The Global Civic Home for",
      "hero.title_part_2": "Diaspora Communities",
      "hero.description": "YurtDostluk is a KYC-verified Super-App that digitizes the entire expat and international student lifecycle — connecting trusted services, academic support, embassy integration, and cross-border commerce in one secure platform.",
      "hero.corridor_label": "Select Your Corridor",
      "hero.from_placeholder": "From Country",
      "hero.to_placeholder": "To Country",
      "hero.cta_primary": "Start Your Journey",
      "hero.cta_secondary": "Watch Demo",
      
      // Footer
      "footer.platform_title": "Platform",
      "footer.company_title": "Company",
      "footer.features": "Features",
      "footer.how_it_works": "How It Works",
      "footer.portals": "Portals",
      "footer.security": "Security",
      "footer.api_docs": "API Docs",
      "footer.about": "About",
      "footer.for_investors": "For Investors",
      "footer.careers": "Careers",
      "footer.press": "Press",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
      "footer.cookie": "Cookie Policy",
      "footer.rights": "© 2026 Innocent Magumba & The TeeParkots Tech. All rights reserved.",

      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.language": "Language"
    },
    tr: {
      "nav.home": "Ana Sayfa",
      "nav.platform": "Platform",
      "nav.corridors": "Koridorlar",
      "nav.about": "Hakkımızda",
      "nav.contact": "İletişim",
      "nav.investors": "Yatırımcılar",
      "nav.login": "Giriş Yap",
      "nav.get_started": "Kayıt Ol",
      
      "hero.badge": "Şimdi Canlı: Ülke A → Türkiye Koridoru",
      "hero.title_part_1": "Diaspora Toplulukları İçin",
      "hero.title_part_2": "Küresel Sivil Ev",
      "hero.description": "YurtDostluk, gurbetçi ve uluslararası öğrenci yaşam döngüsünü dijitalleştiren KYC doğrulamalı bir Süper Uygulamadır. Güvenilir hizmetleri, akademik desteği, büyükelçilik entegrasyonunu ve sınır ötesi ticareti tek güvenli platformda birleştirir.",
      "hero.corridor_label": "Koridorunuzu Seçin",
      "hero.from_placeholder": "Menşei Ülke",
      "hero.to_placeholder": "Hedef Ülke",
      "hero.cta_primary": "Yolculuğunuza Başlayın",
      "hero.cta_secondary": "Demo İzle",

      "footer.platform_title": "Platform",
      "footer.company_title": "Şirket",
      "footer.features": "Özellikler",
      "footer.how_it_works": "Nasıl Çalışır",
      "footer.portals": "Portallar",
      "footer.security": "Güvenlik",
      "footer.api_docs": "API Belgeleri",
      "footer.about": "Hakkımızda",
      "footer.for_investors": "Yatırımcılar",
      "footer.careers": "Kariyer",
      "footer.press": "Basın",
      "footer.privacy": "Gizlilik Politikası",
      "footer.terms": "Kullanım Şartları",
      "footer.cookie": "Çerez Politikası",
      "footer.rights": "© 2026 Innocent Magumba & The TeeParkots Tech. Tüm hakları saklıdır.",
      
      "common.language": "Dil"
    },
    fr: {
      "nav.home": "Accueil",
      "nav.platform": "Plateforme",
      "nav.corridors": "Corridors",
      "nav.about": "À Propos",
      "nav.contact": "Contact",
      "nav.investors": "Investisseurs",
      "nav.login": "Connexion",
      "nav.get_started": "Commencer",
      
      "hero.badge": "Maintenant en direct : Corridor Pays A → Turquie",
      "hero.title_part_1": "La Maison Civique Mondiale pour les",
      "hero.title_part_2": "Communautés Diasporiques",
      "hero.description": "YurtDostluk est une Super-Application vérifiée KYC qui numérise tout le cycle de vie des expatriés et des étudiants internationaux...",
      "hero.corridor_label": "Sélectionnez votre corridor",
      "hero.from_placeholder": "Pays d'origine",
      "hero.to_placeholder": "Pays de destination",
      "hero.cta_primary": "Commencez votre voyage",
      "hero.cta_secondary": "Voir la démo",

      "footer.platform_title": "Plateforme",
      "footer.company_title": "Entreprise",
      "footer.features": "Fonctionnalités",
      "footer.how_it_works": "Comment ça marche",
      "footer.portals": "Portails",
      "footer.security": "Sécurité",
      "footer.api_docs": "Docs API",
      "footer.about": "À Propos",
      "footer.for_investors": "Pour les Investisseurs",
      "footer.careers": "Carrières",
      "footer.press": "Presse",
      "footer.privacy": "Politique de Confidentialité",
      "footer.terms": "Conditions d'Utilisation",
      "footer.cookie": "Politique de Cookies",
      "footer.rights": "© 2026 Innocent Magumba & The TeeParkots Tech. Tous droits réservés.",
      
      "common.language": "Langue"
    },
    ar: {
      "nav.home": "الرئيسية",
      "nav.platform": "المنصة",
      "nav.corridors": "الممرات",
      "nav.about": "من نحن",
      "nav.contact": "اتصل بنا",
      "nav.investors": "المستثمرون",
      "nav.login": "تسجيل الدخول",
      "nav.get_started": "ابدأ الآن",
      
      "hero.badge": "يعمل الآن: الممر من بلد أ ← إلى تركيا",
      "hero.title_part_1": "البيت المدني العالمي",
      "hero.title_part_2": "لمجتمعات المغتربين",
      "hero.description": "يُردوستلوك هو تطبيق خارق تم التحقق منه عبر KYC يقوم برقمنة دورة حياة المغتربين والطلاب الدوليين بالكامل...",
      "hero.corridor_label": "اختر ممرّك",
      "hero.from_placeholder": "من بلد",
      "hero.to_placeholder": "إلى بلد",
      "hero.cta_primary": "ابدأ رحلتك",
      "hero.cta_secondary": "شاهد العرض",

      "footer.platform_title": "المنصة",
      "footer.company_title": "الشركة",
      "footer.features": "الميزات",
      "footer.how_it_works": "كيف يعمل",
      "footer.portals": "البوابات",
      "footer.security": "الأمان",
      "footer.api_docs": "مستندات API",
      "footer.about": "من نحن",
      "footer.for_investors": "للمستثمرين",
      "footer.careers": "الوظائف",
      "footer.press": "الصحافة",
      "footer.privacy": "سياسة الخصوصية",
      "footer.terms": "شروط الخدمة",
      "footer.cookie": "سياسة ملفات تعريف الارتباط",
      "footer.rights": "© 2026 Innocent Magumba & The TeeParkots Tech. جميع الحقوق محفوظة.",
      
      "common.language": "اللغة"
    }
  };

  // ── 3. CORE FUNCTIONS ─────────────────────────────
  
  /**
   * Translates all elements on the page matching data-i18n attributes.
   */
  function applyTranslations() {
    const dictionary = translations[currentLang];
    if (!dictionary) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      // Support nested keys if needed, currently supports direct keys
      if (dictionary[key]) {
        el.textContent = dictionary[key];
      }
    });

    // Handle placeholders for inputs
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dictionary[key]) {
        el.placeholder = dictionary[key];
      }
    });
  }

  /**
   * Sets the current language and updates the DOM.
   * @param {string} lang - Language code (en, tr, fr, ar)
   */
  function setLanguage(lang) {
    if (!translations[lang]) return;
    
    currentLang = lang;
    
    // Update HTML lang and dir attributes
    document.documentElement.lang = lang;
    if (rtlLanguages.includes(lang)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    // Update all translations
    applyTranslations();

    // Update language selector UI if present
    const selectors = document.querySelectorAll('.language-selector');
    selectors.forEach(sel => {
      sel.value = lang;
    });

    // Save preference to localStorage
    localStorage.setItem('yurtdostluk-lang', lang);
  }

  /**
   * Initializes the i18n system.
   */
  function init() {
    // 1. Check for saved language preference or browser language
    const savedLang = localStorage.getItem('yurtdostluk-lang');
    const browserLang = navigator.language.slice(0, 2);
    
    let initialLang = 'en';
    if (savedLang && supportedLanguages.includes(savedLang)) {
      initialLang = savedLang;
    } else if (supportedLanguages.includes(browserLang)) {
      initialLang = browserLang;
    }

    // 2. Apply language
    setLanguage(initialLang);

    // 3. Attach listeners to language selectors
    document.querySelectorAll('.language-selector').forEach(select => {
      select.value = initialLang;
      select.addEventListener('change', (e) => {
        setLanguage(e.target.value);
      });
    });
  }

  // ── 4. PUBLIC API ─────────────────────────────────
  return {
    init: init,
    setLanguage: setLanguage,
    getCurrentLang: () => currentLang
  };

})();

// Run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', I18n.init);
} else {
  I18n.init();
}
