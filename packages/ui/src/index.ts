import clsx from 'clsx';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function cn(...classes: Array<string | undefined | false | null>): string {
  return clsx(classes);
}

export function PageShell({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('min-h-screen bg-[#1e120f] text-white', className)}>{children}</div>
  );
}

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('rounded-3xl border border-white/10 bg-[#2b1a16]/80 p-4 shadow-lg', className)}>{children}</div>;
}

export function Button({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }>) {
  return (
    <button
      {...props}
      className={cn(
        'rounded-full bg-lime-500 px-5 py-3 font-semibold text-[#1b1a15] transition hover:bg-lime-400',
        className
      )}
    >
      {children}
    </button>
  );
}
