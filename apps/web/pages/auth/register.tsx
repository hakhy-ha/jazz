import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import api, { setAuthTokens } from '../../lib/api';
import { firebaseRegister } from '../../lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email || !password || !name) {
      setError('Please enter your name, email, and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Register with Firebase first
      const firebaseUser = await firebaseRegister(email, password);

      // Then register with API, including Firebase UID
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
        phone,
        firebaseUid: firebaseUser.user.uid
      });

      if (!response.data.accessToken || !response.data.refreshToken) {
        throw new Error('Invalid response from server: missing tokens.');
      }

      setAuthTokens(response.data.accessToken, response.data.refreshToken);
      await router.push('/feed');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 text-white">
      <h1 className="mb-6 text-4xl font-semibold text-lime-400">Create your Jazz account</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-surface p-6 shadow-xl">
        <label className="block space-y-2 text-sm">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1a0f0d] p-3 text-white outline-none"
            type="text"
            required
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1a0f0d] p-3 text-white outline-none"
            type="email"
            required
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1a0f0d] p-3 text-white outline-none"
            type="password"
            required
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1a0f0d] p-3 text-white outline-none"
            type="tel"
          />
        </label>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-lime-500 px-5 py-3 font-semibold text-[#1b1a15] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <div className="mt-6 text-sm text-white/70">
        Already have an account? <Link href="/auth/login" className="text-lime-300">Sign in</Link>
      </div>
    </div>
  );
}
