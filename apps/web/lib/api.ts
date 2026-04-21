import axios from 'axios';

const envApiBaseURL = process.env.NEXT_PUBLIC_API_URL?.trim();
const browserLocalhost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
const defaultBaseURL = browserLocalhost ? window.location.origin : '';
const apiBaseURL = envApiBaseURL || defaultBaseURL;

if (typeof window !== 'undefined' && !apiBaseURL) {
  console.error(
    'NEXT_PUBLIC_API_URL is not set. The Jazz frontend cannot reach the backend from a deployed site unless NEXT_PUBLIC_API_URL is configured.'
  );
}

const api = axios.create({
  baseURL: apiBaseURL || undefined,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jazz_access_token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function setAuthTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('jazz_access_token', accessToken);
  localStorage.setItem('jazz_refresh_token', refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem('jazz_access_token');
  localStorage.removeItem('jazz_refresh_token');
}

export default api;
