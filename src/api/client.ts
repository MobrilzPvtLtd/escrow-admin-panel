/**
 * API Client - Base HTTP client for all API requests.
 * Centralizes the base URL, headers, and error handling.
 */

export const API_BASE_URL = "https://escrow-website-backend.onrender.com/api";

const ACCESS_TOKEN_STORAGE_KEY = 'escrow_admin_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'escrow_admin_refresh_token';

export interface ApiError {
  message: string;
  status?: number;
}

function normalizeToken(token: string | null): string | null {
  if (!token) return null;
  return token.startsWith('Bearer ') ? token.slice(7) : token;
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

function clearStoredAuthTokens(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

async function refreshAuthToken(): Promise<boolean> {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  if (!refreshToken) {
    clearStoredAuthTokens();
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearStoredAuthTokens();
      return false;
    }

    storeAuthTokens(response.headers);
    return true;
  } catch {
    clearStoredAuthTokens();
    return false;
  }
}

/**
 * A generic fetch wrapper that handles JSON parsing and error formatting.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const headers = new Headers(defaultHeaders);
  if (options.headers) {
    new Headers(options.headers).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const accessToken = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  let response = await fetch(url, config);

  if (response.status === 401 && endpoint !== '/admin/refresh-token') {
    const refreshed = await refreshAuthToken();
    if (refreshed) {
      const retryHeaders = new Headers(config.headers);
      const nextAccessToken = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
      if (nextAccessToken) {
        retryHeaders.set('Authorization', `Bearer ${nextAccessToken}`);
      }
      response = await fetch(url, {
        ...config,
        headers: retryHeaders,
      });
    }
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw { message: 'Failed to parse server response', status: response.status } as ApiError;
  }

  if (!response.ok) {
    const errorData = data as { message?: string };
    throw {
      message: errorData?.message ?? 'An unexpected error occurred.',
      status: response.status,
    } as ApiError;
  }

  return data as T;
}
