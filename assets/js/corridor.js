/**
 * YURTDOSTLUK — Corridor Logic Engine (v1.0)
 * ============================================
 * Purpose: Handles dynamic corridor selection, status validation, 
 * URL synchronization, localStorage persistence, and routing logic.
 * Works alongside main.js, i18n.js, and dashboard.js.
 * ============================================
 */
(function() {
  'use strict';

  // ── 1. CONFIGURATION & STATE ──────────────────────
  const CONFIG = {
    STORAGE_KEY: 'yurtdostluk-corridor',
    LIVE_CORRIDORS: ['Uganda', 'Nigeria', 'Kenya', 'Ghana', 'Morocco'],
    BETA_CORRIDORS: ['India', 'Pakistan', 'Philippines', 'Egypt', 'Ethiopia'],
    DEFAULT_HOST: 'Türkiye',
    API_ENDPOINT: '/api/corridors/status', // Placeholder for future backend sync
    MAX_CACHED_ITEMS: 5
  };

  let state = {
    fromCountry: '',
    toCountry: CONFIG.DEFAULT_HOST,
    status: 'neutral',
    lastUpdated: null
  };

  // DOM Cache
  const DOM = {
    fromSelect: null,
    toSelect: null,
    statusText: null,
    visitBtn: null,
    container: null
  };

  // ── 2. INITIALIZATION ─────────────────────────────
  function init() {
    // Cache selectors
    DOM.fromSelect = document.getElementById('from-country');
    DOM.toSelect = document.getElementById('to-country');
    DOM.statusText = document.getElementById('status-text') || document.querySelector('.corridor-status');
    DOM.visitBtn = document.getElementById('visit-corridor-btn') || document.querySelector('[data-action="visit-corridor"]');
    DOM.container = document.querySelector('.corridor-selector');

    if (!DOM.fromSelect || !DOM.toSelect) return;

    // Load & Sync
    loadFromStorage();
    handleUrlParams();
    syncSelectors();
    updateStatus();
    bindEvents();
    
    console.log('[Corridor] Initialized successfully.');
  }

  // ── 3. EVENT BINDING ──────────────────────────────
  function bindEvents() {
    DOM.fromSelect.addEventListener('change', onSelectionChange);
    DOM.toSelect.addEventListener('change', onSelectionChange);

    if (DOM.visitBtn) {
      DOM.visitBtn.addEventListener('click', handleVisitClick);
    }

    // Listen for custom corridor updates from other modules
    document.addEventListener('yurtdostluk:corridor:update', (e) => {
      if (e.detail.from) DOM.fromSelect.value = e.detail.from;
      if (e.detail.to) DOM.toSelect.value = e.detail.to;
      onSelectionChange();
    });
  }

  function onSelectionChange() {
    state.fromCountry = DOM.fromSelect.value;
    state.toCountry = DOM.toSelect.value;
    state.lastUpdated = new Date().toISOString();

    updateStatus();
    persistToStorage();
    updateUrlParams();
  }

  // ── 4. STATUS LOGIC ───────────────────────────────
  function updateStatus() {
    if (!state.fromCountry || !state.toCountry) {
      setStatusUI('Select countries to begin', 'neutral');
      return;
    }

    let status = 'coming-soon';
    let message = 'Coming Soon';

    if (CONFIG.LIVE_CORRIDORS.includes(state.fromCountry)) {
      status = 'live';
      message = 'LIVE';
    } else if (CONFIG.BETA_CORRIDORS.includes(state.fromCountry)) {
      status = 'beta';
      message = 'BETA';
    }

    state.status = status;
    setStatusUI(message, status);
  }

  function setStatusUI(text, type) {
    if (!DOM.statusText) return;
    DOM.statusText.textContent = text;
    DOM.statusText.className = `corridor-status corridor-status-${type}`;
  }

  // ── 5. PERSISTENCE & URL SYNC ─────────────────────
  function persistToStorage() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[Corridor] localStorage save failed:', e);
    }
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state.fromCountry = parsed.fromCountry || '';
        state.toCountry = parsed.toCountry || CONFIG.DEFAULT_HOST;
        state.status = parsed.status || 'neutral';
      }
    } catch (e) {
      console.warn('[Corridor] localStorage load failed:', e);
    }
  }

  function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const urlFrom = params.get('from');
    const urlTo = params.get('to');

    if (urlFrom) state.fromCountry = decodeURIComponent(urlFrom);
    if (urlTo) state.toCountry = decodeURIComponent(urlTo);
  }

  function updateUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (state.fromCountry) params.set('from', state.fromCountry);
    else params.delete('from');

    if (state.toCountry) params.set('to', state.toCountry);
    else params.delete('to');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  function syncSelectors() {
    if (DOM.fromSelect) DOM.fromSelect.value = state.fromCountry;
    if (DOM.toSelect) DOM.toSelect.value = state.toCountry;
  }

  // ── 6. ROUTING & VALIDATION ───────────────────────
  function handleVisitClick(e) {
    e.preventDefault();
    
    if (!state.fromCountry || !state.toCountry) {
      if (window.showToast) {
        showToast('Please select both home and host countries.', 'warning');
      } else {
        alert('Please select both home and host countries.');
      }
      return;
    }

    // Dispatch custom event for analytics/tracking (future)
    document.dispatchEvent(new CustomEvent('yurtdostluk:corridor:visit', { 
      detail: { from: state.fromCountry, to: state.toCountry } 
    }));

    const redirectUrl = `login.html?register=true&from=${encodeURIComponent(state.fromCountry)}&to=${encodeURIComponent(state.toCountry)}`;
    window.location.href = redirectUrl;
  }

  // ── 7. PUBLIC API ─────────────────────────────────
  window.Corridor = {
    init,
    getState: () => ({ ...state }),
    getConfig: () => ({ ...CONFIG }),
    forceStatus: (status, message) => {
      state.status = status;
      setStatusUI(message || status.toUpperCase(), status);
    },
    getValidCountries: () => [...CONFIG.LIVE_CORRIDORS, ...CONFIG.BETA_CORRIDORS]
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
