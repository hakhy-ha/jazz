import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { firebaseSendPasswordReset } from '../../lib/firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await firebaseSendPasswordReset(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError('Failed to send password reset email. Please check your email address.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 text-white">
      <h1 className="mb-6 text-4xl font-semibold text-lime-400">Reset your password</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-surface p-6 shadow-xl">
        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1a0f0d] p-3 text-white outline-none"
            type="email"
            required
            placeholder="Enter your email address"
          />
        </label>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        {message ? <p className="text-sm text-green-400">{message}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-lime-500 px-5 py-3 font-semibold text-[#1b1a15] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Reset Email'}
        </button>
      </form>
      <div className="mt-6 text-sm text-white/70">
        Remember your password? <Link href="/auth/login" className="text-lime-300">Sign in</Link>
      </div>
    </div>
  );
}