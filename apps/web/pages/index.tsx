import { useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jazz_access_token') : null;
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    api.get('/users/me')
      .then(() => router.replace('/feed'))
      .catch(() => router.replace('/auth/login'));
  }, [router]);

  return <div className="min-h-screen bg-background px-4 py-24 text-center text-white">Redirecting to your dashboard...</div>;
}
