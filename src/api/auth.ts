/**
 * Auth API - All authentication-related API calls.
 * Keeps auth logic isolated and easy to maintain.
 */

import { API_BASE_URL } from './client';
import type { AdminUser } from '../types';

const ACCESS_TOKEN_STORAGE_KEY = 'escrow_admin_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'escrow_admin_refresh_token';

// ─── Request / Response Types ─────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  admin: AdminUser;
}

function normalizeToken(token: string | null): string | null {
  if (!token) return null;
  return token.startsWith('Bearer ') ? token.slice(7) : token;
}

function clearStoredAuthTokens(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

function storeAuthTokens(headers: Headers): void {
  const authHeader = headers.get('authorization') ?? headers.get('Authorization');
  const refreshTokenHeader = headers.get('refreshtoken') ?? headers.get('refreshToken');

  const accessToken = normalizeToken(authHeader);
  const refreshToken = normalizeToken(refreshTokenHeader);

  if (accessToken) {
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  } else {
    sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  } else {
    sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}

export async function logoutAdmin(): Promise<void> {
  const accessToken = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  try {
    const response = await fetch(`${API_BASE_URL}/admin/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw { message: 'Failed to parse server response', status: response.status };
    }

    if (!response.ok) {
      const errorData = data as { message?: string };
      throw {
        message: errorData?.message ?? 'Logout failed.',
        status: response.status,
      };
    }
  } finally {
    clearStoredAuthTokens();
  }
}

// ─── Auth API Functions ────────────────────────────────────────────────────────

/**
 * Authenticates an admin user with email and password.
 * POST /api/admin/login
 */
export async function loginAdmin(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw { message: 'Failed to parse server response', status: response.status };
  }

  if (!response.ok) {
    const errorData = data as { message?: string };
    throw {
      message: errorData?.message ?? 'An unexpected error occurred.',
      status: response.status,
    };
  }

  storeAuthTokens(response.headers);

  return data as LoginResponse;
}
