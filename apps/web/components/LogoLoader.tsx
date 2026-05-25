import Image from 'next/image';
import { useEffect, useState } from 'react';

type LogoLoaderProps = {
  isLoading: boolean;
  message?: string;
};

export default function LogoLoader({ isLoading, message = "Processing..." }: LogoLoaderProps) {
  const [showExtendedMessage, setShowExtendedMessage] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // If it takes more than 5 seconds, it's likely a cold start
      const timeout = setTimeout(() => setShowExtendedMessage(true), 5000);
      return () => clearTimeout(timeout);
    } else {
      setShowExtendedMessage(false);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0a09]/90 backdrop-blur-sm transition-all duration-300">
      <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
        {/* Pulsing ring behind the logo */}
        <div className="absolute inset-0 animate-ping rounded-full bg-lime-500/20"></div>
        {/* Spinning border ring */}
        <div className="absolute inset-[-10px] animate-spin rounded-full border-2 border-lime-500/30 border-t-lime-500"></div>
        
        <div className="relative h-24 w-24 animate-pulse">
          <Image
            src="/logo.png"
            alt="Jazz Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
      
      <p className="animate-pulse text-lg font-semibold text-lime-400">{message}</p>
      
      <div className={`mt-4 max-w-xs text-center text-sm text-white/60 transition-opacity duration-1000 ${showExtendedMessage ? 'opacity-100' : 'opacity-0'}`}>
        <p>Waking up the secure server...</p>
        <p className="mt-1 text-xs">(This can take up to 50 seconds on the first login of the day)</p>
      </div>
    </div>
  );
}
