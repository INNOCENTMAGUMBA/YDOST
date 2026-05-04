/**
 * YURTDOSTLUK — Dashboard JavaScript Engine (v1.0)
 * ==================================================
 * Purpose: Handles all admin & user portal dashboard interactions.
 * Features: Sidebar navigation, data tables, SVG charts, 
 *           tab switching, CSV export, real-time simulation.
 * Works alongside main.js, i18n.js, and admin.css.
 * ==================================================
 */
(function() {
  'use strict';

  // ── 1. STATE & CONFIG ─────────────────────────────
  const state = {
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    activeTab: 'overview',
    tables: {},
    charts: {}
  };

  const config = {
    sidebarBreakpoint: 1024,
    rowsPerPage: 10,
    chartColors: ['#0284c7', '#14b8a6', '#f59e0b', '#e2445c', '#a25ddc', '#64748b'],
    refreshInterval: 5000 // ms for simulated real-time updates
  };

  // ── 2. INITIALIZATION ─────────────────────────────
  function init() {
    if (!document.querySelector('.admin-body')) return;
    
    initSidebar();
    initTopbar();
    initTabs();
    initTables();
    initCharts();
    initExportButtons();
    startRealtimeSimulation();
    
    console.log('[Dashboard] Initialized successfully.');
  }

  // ── 3. SIDEBAR NAVIGATION ─────────────────────────
  function initSidebar() {
    const toggle = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const main = document.querySelector('.admin-main');
    const mobileClose = document.getElementById('admin-sidebar-close');
    const overlay = document.getElementById('admin-sidebar-overlay');
    const navItems = document.querySelectorAll('.admin-nav-item');

    if (!sidebar) return;

    // Desktop collapse/expand
    if (toggle) {
      toggle.addEventListener('click', () => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
        if (window.innerWidth > config.sidebarBreakpoint) {
          main.style.marginLeft = state.sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';
        }
      });
    }

    // Mobile drawer
    function openMobileSidebar() {
      state.mobileSidebarOpen = true;
      sidebar.classList.add('mobile-open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileSidebar() {
      state.mobileSidebarOpen = false;
      sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Expose to global for topbar hamburger button
    window.toggleMobileSidebar = state.mobileSidebarOpen ? closeMobileSidebar : openMobileSidebar;

    if (mobileClose) mobileClose.addEventListener('click', closeMobileSidebar);
    if (overlay) overlay.addEventListener('click', closeMobileSidebar);

    // Active state management
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        closeMobileSidebar();
      });
    });

    // Responsive handler
    window.addEventListener('resize', () => {
      if (window.innerWidth <= config.sidebarBreakpoint) {
        main.style.marginLeft = '0';
        if (!state.mobileSidebarOpen) sidebar.classList.remove('mobile-open');
      } else {
        main.style.marginLeft = state.sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';
        sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ── 4. TOPBAR & SEARCH ────────────────────────────
  function initTopbar() {
    const searchInput = document.querySelector('.admin-search input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      // Filter table rows if on a table view
      document.querySelectorAll('.admin-table tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
      });
      // Filter dashboard cards
      document.querySelectorAll('.admin-card, .admin-board-row').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? '' : 'none';
      });
    });

    // Sync with i18n if language changes
    if (window.I18n) {
      const originalSetLang = window.I18n.setLanguage;
      window.I18n.setLanguage = function(lang) {
        originalSetLang.call(window.I18n, lang);
        // Update placeholder
        const pl = document.documentElement.lang === 'ar' ? 'بحث...' : 
                   document.documentElement.lang === 'tr' ? 'Ara...' : 
                   document.documentElement.lang === 'fr' ? 'Rechercher...' : 'Search...';
        if (searchInput) searchInput.placeholder = pl;
      };
    }
  }

  // ── 5. TAB SWITCHING ──────────────────────────────
  function initTabs() {
    const tabButtons = document.querySelectorAll('[data-tab]');
    const tabPanels = document.querySelectorAll('[data-tab-panel]');

    if (!tabButtons.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        
        // Update buttons
        tabButtons.forEach(b => {
          b.classList.toggle('active', b.dataset.tab === target);
          b.setAttribute('aria-selected', b.dataset.tab === target);
        });

        // Update panels
        tabPanels.forEach(p => {
          p.classList.toggle('hidden', p.dataset.tabPanel !== target);
        });

        state.activeTab = target;
        window.location.hash = target;
      });
    });

    // Restore tab from URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetBtn = document.querySelector(`[data-tab="${hash}"]`);
      if (targetBtn) targetBtn.click();
    }
  }

  // ── 6. DATA TABLES (Sort, Filter, Paginate) ──────
  function initTables() {
    document.querySelectorAll('.admin-table[data-sortable]').forEach(table => {
      const id = table.id || `table-${Date.now()}`;
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const headers = table.querySelectorAll('th[data-sort]');
      
      state.tables[id] = { rows, currentSort: null, page: 1 };

      // Sorting
      headers.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
          const colIndex = Array.from(header.parentNode.children).indexOf(header);
          const dir = state.tables[id].currentSort === `${colIndex}-asc` ? 'desc' : 'asc';
          state.tables[id].currentSort = `${colIndex}-${dir}`;

          rows.sort((a, b) => {
            const aText = a.children[colIndex]?.textContent.trim() || '';
            const bText = b.children[colIndex]?.textContent.trim() || '';
            const aNum = parseFloat(aText.replace(/[^\d.-]/g, ''));
            const bNum = parseFloat(bText.replace(/[^\d.-]/g, ''));

            if (!isNaN(aNum) && !isNaN(bNum)) return dir === 'asc' ? aNum - bNum : bNum - aNum;
            return dir === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
          });

          tbody.innerHTML = '';
          rows.forEach(r => tbody.appendChild(r));
          renderPagination(id);
        });
      });

      // Initial render
      renderPagination(id);
    });
  }

  function renderPagination(tableId) {
    const { rows, page } = state.tables[tableId];
    const totalPages = Math.ceil(rows.length / config.rowsPerPage);
    const start = (page - 1) * config.rowsPerPage;
    const end = start + config.rowsPerPage;

    rows.forEach((row, i) => {
      row.style.display = (i >= start && i < end) ? '' : 'none';
    });

    // Update pagination UI if exists
    const container = document.querySelector(`[data-pagination-for="${tableId}"]`);
    if (container) {
      container.innerHTML = `
        <button class="pagination-btn" ${page === 1 ? 'disabled' : ''} onclick="window.Dashboard.prevPage('${tableId}')">‹</button>
        <span class="text-sm text-slate-500">Page ${page} of ${totalPages}</span>
        <button class="pagination-btn" ${page === totalPages ? 'disabled' : ''} onclick="window.Dashboard.nextPage('${tableId}')">›</button>
      `;
    }
  }

  // ── 7. CHARTS (Lightweight SVG Renderer) ──────────
  function initCharts() {
    document.querySelectorAll('[data-chart]').forEach(el => {
      const type = el.dataset.chart;
      const data = JSON.parse(el.dataset.chartData || '[]');
      const labels = JSON.parse(el.dataset.chartLabels || '[]');
      
      if (type === 'bar') renderBarChart(el, data, labels);
      else if (type === 'line') renderLineChart(el, data, labels);
      else if (type === 'doughnut') renderDoughnutChart(el, data, labels);
    });
  }

  function renderBarChart(container, data, labels) {
    const max = Math.max(...data, 1);
    const height = 200;
    const barWidth = Math.max(20, (container.clientWidth - 40) / data.length - 10);
    
    let svg = `<svg viewBox="0 0 ${container.clientWidth} ${height + 30}" class="w-full h-full">`;
    data.forEach((val, i) => {
      const barHeight = (val / max) * height;
      const x = i * (barWidth + 10) + 20;
      const y = height - barHeight;
      const color = config.chartColors[i % config.chartColors.length];
      
      svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="4" class="transition-all hover:opacity-80" />`;
      svg += `<text x="${x + barWidth/2}" y="${height + 20}" text-anchor="middle" font-size="10" fill="#676879">${labels[i] || ''}</text>`;
      svg += `<text x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" font-size="11" font-weight="600" fill="#323338">${val}</text>`;
    });
    svg += `</svg>`;
    container.innerHTML = svg;
  }

  function renderLineChart(container, data, labels) {
    const max = Math.max(...data, 1);
    const height = 200;
    const width = container.clientWidth;
    const stepX = (width - 40) / (data.length - 1);
    
    let points = data.map((val, i) => `${20 + i * stepX},${height - (val / max) * height}`).join(' ');
    let svg = `<svg viewBox="0 0 ${width} ${height + 30}" class="w-full h-full">`;
    svg += `<polyline points="${points}" fill="none" stroke="${config.chartColors[0]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`;
    svg += `<circle cx="${points.split(' ')[0].split(',')[0]}" cy="${points.split(' ')[0].split(',')[1]}" r="5" fill="${config.chartColors[0]}" />`;
    svg += `</svg>`;
    container.innerHTML = svg;
  }

  function renderDoughnutChart(container, data, labels) {
    const total = data.reduce((a, b) => a + b, 0);
    let svg = `<svg viewBox="0 0 200 200" class="w-48 h-48 mx-auto">`;
    let cumulative = 0;
    
    data.forEach((val, i) => {
      const startAngle = (cumulative / total) * 2 * Math.PI;
      cumulative += val;
      const endAngle = (cumulative / total) * 2 * Math.PI;
      const largeArc = val / total > 0.5 ? 1 : 0;
      
      const x1 = 100 + 80 * Math.cos(startAngle);
      const y1 = 100 + 80 * Math.sin(startAngle);
      const x2 = 100 + 80 * Math.cos(endAngle);
      const y2 = 100 + 80 * Math.sin(endAngle);
      
      svg += `<path d="M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${config.chartColors[i % config.chartColors.length]}" stroke="#fff" stroke-width="2" />`;
    });
    
    svg += `<circle cx="100" cy="100" r="50" fill="#fff" />`;
    svg += `<text x="100" y="105" text-anchor="middle" font-size="18" font-weight="700" fill="#323338">${total}</text>`;
    svg += `</svg>`;
    container.innerHTML = svg;
  }

  // ── 8. EXPORT FUNCTIONALITY ───────────────────────
  function initExportButtons() {
    document.querySelectorAll('[data-export]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tableId = btn.dataset.export;
        const table = document.getElementById(tableId);
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        let csv = [];
        
        // Headers
        const headers = Array.from(table.querySelectorAll('th')).map(th => `"${th.textContent.trim()}"`);
        csv.push(headers.join(','));
        
        // Data
        rows.forEach(row => {
          const cells = Array.from(row.querySelectorAll('td')).map(td => `"${td.textContent.trim().replace(/"/g, '""')}"`);
          csv.push(cells.join(','));
        });

        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tableId}_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  }

  // ── 9. REAL-TIME SIMULATION (Demo Only) ───────────
  function startRealtimeSimulation() {
    setInterval(() => {
      document.querySelectorAll('[data-live-value]').forEach(el => {
        const base = parseFloat(el.dataset.base || '0');
        const variance = (Math.random() - 0.5) * base * 0.02;
        const newVal = Math.max(0, Math.round(base + variance));
        el.textContent = el.dataset.prefix || '' + newVal + (el.dataset.suffix || '');
        el.dataset.base = newVal;
        
        // Flash effect
        el.classList.add('text-accent-teal');
        setTimeout(() => el.classList.remove('text-accent-teal'), 500);
      });
    }, config.refreshInterval);
  }

  // ── 10. PUBLIC API ────────────────────────────────
  window.Dashboard = {
    init,
    prevPage: (id) => { if (state.tables[id] && state.tables[id].page > 1) { state.tables[id].page--; renderPagination(id); } },
    nextPage: (id) => { if (state.tables[id] && state.tables[id].page < Math.ceil(state.tables[id].rows.length / config.rowsPerPage)) { state.tables[id].page++; renderPagination(id); } },
    toggleMobileSidebar: window.toggleMobileSidebar || function() {}
  };

  // Auto-init if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
