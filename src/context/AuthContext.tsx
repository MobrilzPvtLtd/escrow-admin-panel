/**
 * AuthContext - Provides global auth state (admin user + session helpers).
 * Components consume this context; they never touch localStorage or the API directly.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AdminUser } from '../types';

// ─── Session Storage Key ───────────────────────────────────────────────────────

const SESSION_KEY = 'escrow_admin_user';
const ACCESS_TOKEN_STORAGE_KEY = 'escrow_admin_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'escrow_admin_refresh_token';

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** The currently authenticated admin, or null if not logged in. */
  admin: AdminUser | null;
  /** Persist admin data after a successful login. */
  saveSession: (admin: AdminUser) => void;
  /** Clear the session and log out the admin. */
  clearSession: () => void;
  /** True when a valid session exists. */
  isAuthenticated: boolean;
}

// ─── Context & Hook ───────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

function loadStoredAdmin(): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(loadStoredAdmin);

  const saveSession = useCallback((adminUser: AdminUser) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
    setAdmin(adminUser);
  }, []);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    setAdmin(null);
  }, []);

  const value: AuthContextValue = {
    admin,
    saveSession,
    clearSession,
    isAuthenticated: admin !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
