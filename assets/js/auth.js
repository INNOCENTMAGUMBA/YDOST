/**
 * YURTDOSTLUK — Authentication Engine (v1.0)
 * ============================================
 * Purpose: Manages user sessions, role-based access control (RBAC),
 * and KYC verification gates. Simulates the logic from your React 
 * App Router/ProtectedRoute components.
 * ============================================
 */
(function() {
  'use strict';

  // ── 1. CONFIGURATION ──────────────────────────────
  const CONFIG = {
    STORAGE_KEY: 'yurtdostluk_user',
    LOGIN_URL: 'login.html',
    DASHBOARD_URL: 'admin/super-admin.html',
    ONBOARDING_URL: 'onboarding.html', // Placeholder for future
    ROLES: {
      MEMBER: 'member',
      MODERATOR: 'moderator',
      UNIVERSITY_ADMIN: 'university_admin',
      EMBASSY_ADMIN: 'embassy_admin',
      SUPER_ADMIN: 'super_admin'
    }
  };

  // ── 2. STATE ──────────────────────────────────────
  let currentUser = null;
  let isLoading = true;

  // ── 3. CORE FUNCTIONS ─────────────────────────────

  /**
   * Initialize Auth: Check localStorage for existing session.
   */
  function init() {
    try {
      const storedUser = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error('[Auth] Failed to load user session:', e);
      logout();
    } finally {
      isLoading = false;
      document.dispatchEvent(new Event('yurtdostluk:auth:ready'));
    }
  }

  /**
   * Simulate Login: Saves user data to localStorage.
   * @param {string} role - User role (member, admin, etc.)
   * @param {boolean} isVerified - KYC status
   * @param {object} metadata - Extra user info (name, email, etc.)
   */
  function login(role, isVerified = false, metadata = {}) {
    const user = {
      id: 'usr_' + Date.now(),
      role: role || CONFIG.ROLES.MEMBER,
      isVerified: isVerified,
      name: metadata.name || 'New User',
      email: metadata.email || '',
      loginTime: new Date().toISOString()
    };

    currentUser = user;
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user));
    
    console.log(`[Auth] User logged in as ${role} (Verified: ${isVerified})`);
    return user;
  }

  /**
   * Logout: Clears session and redirects.
   */
  function logout() {
    currentUser = null;
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    console.log('[Auth] User logged out.');
    
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = CONFIG.LOGIN_URL;
    }
  }

  /**
   * Check Authentication: Returns true if user is logged in.
   */
  function isAuthenticated() {
    return !!currentUser;
  }

  /**
   * Check Role: Returns true if user has the specific role.
   * Super Admin has access to everything.
   */
  function hasRole(requiredRole) {
    if (!currentUser) return false;
    if (currentUser.role === CONFIG.ROLES.SUPER_ADMIN) return true;
    return currentUser.role === requiredRole;
  }

  /**
   * Protected Route Logic (Vanilla version of React <ProtectedRoute>):
   * - Requires login
   * - Optionally requires KYC verification
   */
  function requireAuth(options = {}) {
    const { requireVerified = false, redirectUrl = CONFIG.LOGIN_URL } = options;

    if (isLoading) return; // Wait for init

    // 1. Check if logged in
    if (!isAuthenticated()) {
      console.warn('[Auth] Access denied: Not authenticated.');
      window.location.href = `${redirectUrl}?next=${encodeURIComponent(window.location.pathname)}`;
      return false;
    }

    // 2. Check KYC verification
    if (requireVerified && !currentUser.isVerified) {
      console.warn('[Auth] Access denied: Verification required.');
      alert('Verification Required: You must complete KYC onboarding to view this page.');
      // Redirect to onboarding (simulated)
      window.location.href = CONFIG.ONBOARDING_URL || '#onboarding';
      return false;
    }

    return true; // Access granted
  }

  /**
   * Admin Route Logic (Vanilla version of React <AdminRoute>):
   * - Requires login
   * - Requires specific role
   */
  function requireRole(requiredRole) {
    if (isLoading) return;

    if (!requireAuth()) return false; // First check if logged in

    if (!hasRole(requiredRole)) {
      console.warn(`[Auth] Access denied: Insufficient permissions for role '${requiredRole}'.`);
      // Show "Unauthorized" UI or redirect
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#f8fafc;font-family:sans-serif;text-align:center;padding:2rem;">
          <h1 style="color:#e2445c;font-size:3rem;font-weight:800;margin-bottom:1rem;">403</h1>
          <h2 style="color:#323338;font-size:1.5rem;margin-bottom:0.5rem;">Unauthorized Area</h2>
          <p style="color:#676879;margin-bottom:2rem;">You do not have clearance for this dashboard.</p>
          <a href="index.html" style="background:#0284c7;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Return Home</a>
        </div>
      `;
      return false;
    }

    return true; // Access granted
  }

  /**
   * Get User: Returns the current user object.
   */
  function getUser() {
    return currentUser;
  }

  // ── 4. UI UPDATES (Optional) ──────────────────────
  // Automatically updates UI elements like "Log In" vs "Profile"
  function updateAuthUI() {
    const loginBtns = document.querySelectorAll('[data-auth-action="login"]');
    const logoutBtns = document.querySelectorAll('[data-auth-action="logout"]');
    const userNames = document.querySelectorAll('[data-user-name]');

    if (isAuthenticated()) {
      loginBtns.forEach(el => el.style.display = 'none');
      logoutBtns.forEach(el => el.style.display = '');
      userNames.forEach(el => el.textContent = currentUser.name);
    } else {
      loginBtns.forEach(el => el.style.display = '');
      logoutBtns.forEach(el => el.style.display = 'none');
    }
  }

  // ── 5. PUBLIC API ─────────────────────────────────
  window.Auth = {
    init,
    login,
    logout,
    isAuthenticated,
    hasRole,
    requireAuth,
    requireRole,
    getUser,
    updateAuthUI,
    CONFIG
  };

  // Auto-init
  init();

  // Update UI on load
  document.addEventListener('DOMContentLoaded', updateAuthUI);

})();
