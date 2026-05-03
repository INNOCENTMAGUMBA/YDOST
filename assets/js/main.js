/**
 * YURTDOSTLUK — Main JavaScript Utilities (v1.0)
 * ================================================
 * Purpose: Centralized vanilla JS for navigation, animations, corridor logic, 
 * form validation, component toggles, and toast notifications.
 * Works alongside Tailwind CDN, main.css, and components.css.
 * ================================================
 */
(function() {
  'use strict';

  // ── 1. DOM READY WRAPPER ──────────────────────────
  function init() {
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCorridorLogic();
    initFormValidation();
    initDropdowns();
    initAccordions();
    initModals();
    initToasts();
    initAdminSidebar();
    exposeGlobalFunctions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── 2. MOBILE MENU ────────────────────────────────
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const isHidden = menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', !isHidden);
    });

    // Close menu when clicking internal links
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.add('hidden'));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  }

  // ── 3. SMOOTH SCROLL ──────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.length < 2) return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // ── 4. SCROLL ANIMATIONS (Intersection Observer) ──
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up', 'opacity-100');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-slide-up').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  // ── 5. CORRIDOR LOGIC ─────────────────────────────
  function initCorridorLogic() {
    const fromSelect = document.getElementById('from-country');
    const toSelect = document.getElementById('to-country');
    const statusEl = document.getElementById('status-text');

    if (!fromSelect || !toSelect) return;

    function updateStatus() {
      const from = fromSelect.value;
      const to = toSelect.value;
      if (!from || !to || !statusEl) return;

      const live = ['Uganda', 'Nigeria', 'Kenya'];
      const beta = ['India', 'Pakistan', 'Philippines'];

      if (live.includes(from)) {
        statusEl.textContent = 'LIVE';
        statusEl.className = 'font-semibold text-green-400';
      } else if (beta.includes(from)) {
        statusEl.textContent = 'BETA';
        statusEl.className = 'font-semibold text-amber-400';
      } else {
        statusEl.textContent = 'COMING SOON';
        statusEl.className = 'font-semibold text-slate-300';
      }
    }

    fromSelect.addEventListener('change', updateStatus);
    toSelect.addEventListener('change', updateStatus);
    updateStatus();

    // Global visit function
    window.visitCorridor = function() {
      const from = fromSelect.value;
      const to = toSelect.value;
      if (!from || !to) {
        showToast('Please select both home and host countries.', 'warning');
        return;
      }
      window.location.href = `login.html?register=true&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    };
  }

  // ── 6. FORM VALIDATION ────────────────────────────
  function initFormValidation() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
          e.preventDefault();
          showToast('Please fill in all required fields correctly.', 'error');
          return;
        }

        // Simulate submission
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        if (!btn) return;
        
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Processing...';
        btn.disabled = true;

        setTimeout(() => {
          showToast('Submitted successfully! We will contact you soon.', 'success');
          this.reset();
          btn.innerHTML = originalText;
          btn.disabled = false;
          // TODO: Replace with actual fetch() to your backend API
        }, 1500);
      });

      // Real-time error clearing
      form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => input.classList.remove('form-error'));
        input.addEventListener('blur', () => {
          if (input.required && !input.value.trim()) {
            input.classList.add('form-error');
          }
        });
      });
    });
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
      field.classList.remove('form-error');
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('form-error');
      }
      if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
        valid = false;
        field.classList.add('form-error');
      }
    });
    return valid;
  }

  // ── 7. DROPDOWNS ──────────────────────────────────
  function initDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger, button');
      const menu = dropdown.querySelector('.dropdown-menu');
      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = menu.classList.contains('active');
        closeAllDropdowns();
        if (!isActive) menu.classList.add('active');
      });
    });

    document.addEventListener('click', closeAllDropdowns);
    function closeAllDropdowns() {
      document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active'));
    }
  }

  // ── 8. ACCORDIONS ─────────────────────────────────
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isOpen = item.classList.contains('open');
        
        // Optional: Close others (comment out if you want multiple open)
        document.querySelectorAll('.accordion-item.open').forEach(i => {
          if (i !== item) i.classList.remove('open');
        });

        item.classList.toggle('open', !isOpen);
      });
    });
  }

  // ── 9. MODALS ─────────────────────────────────────
  function initModals() {
    window.openModal = function(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const focusEl = modal.querySelector('input, button, [tabindex="0"]');
      if (focusEl) focusEl.focus();
    };

    window.closeModal = function(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) window.closeModal(overlay.id);
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
          window.closeModal(m.id);
        });
      }
    });
  }

  // ── 10. TOAST NOTIFICATIONS ───────────────────────
  function initToasts() {
    window.showToast = function(message, type = 'info', duration = 4000) {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</div>
        <div class="toast-content">${message}</div>
        <button class="toast-close" aria-label="Close notification">✕</button>
      `;
      document.body.appendChild(toast);
      
      // Trigger animation
      requestAnimationFrame(() => toast.classList.add('visible'));
      
      // Auto remove
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      }, duration);

      // Manual close
      toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      });
    };
  }

  // ── 11. ADMIN SIDEBAR (For Admin Pages) ───────────
  function initAdminSidebar() {
    const toggle = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const main = document.querySelector('.admin-main');
    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      if (window.innerWidth > 1024) {
        main.style.marginLeft = sidebar.classList.contains('collapsed') ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';
      }
    });
  }

  // ── 12. EXPOSE GLOBAL FUNCTIONS ───────────────────
  function exposeGlobalFunctions() {
    // Already attached to window in respective init functions
    // Ready for inline onclick attributes if needed
  }

})();
