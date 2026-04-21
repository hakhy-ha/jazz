import Link from 'next/link';
import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#180d0b]/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/feed" className="text-xl font-semibold text-lime-400">
            Jazz
          </Link>
          <nav className="hidden gap-4 md:flex">
            <Link href="/feed" className="hover:text-lime-300">
              Feed
            </Link>
            <Link href="/chat" className="hover:text-lime-300">
              Chat
            </Link>
            <Link href="/live" className="hover:text-lime-300">
              Live
            </Link>
            <Link href="/notifications" className="hover:text-lime-300">
              Notifications
            </Link>
            <Link href="/profile" className="hover:text-lime-300">
              Profile
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#150b09]/95 p-3 text-sm text-white/70 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/feed" className="text-lime-300">
            Feed
          </Link>
          <Link href="/chat" className="text-lime-300">
            Chat
          </Link>
          <Link href="/live" className="text-lime-300">
            Live
          </Link>
          <Link href="/notifications" className="text-lime-300">
            Notifications
          </Link>
          <Link href="/profile" className="text-lime-300">
            Me
          </Link>
        </div>
      </footer>
    </div>
  );
}
