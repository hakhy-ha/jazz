import { useEffect } from 'react';
import { useRouter } from 'next/router';
import api, { clearAuthTokens } from './api';

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jazz_access_token') : null;
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    api.get('/users/me').catch(() => {
      clearAuthTokens();
      router.replace('/auth/login');
    });
  }, [router]);
}
