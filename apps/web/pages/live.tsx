import { useEffect, useRef, useState } from 'react';
import { useRequireAuth } from '../lib/auth';
import { Layout } from '../components/Layout';

export default function LivePage() {
  useRequireAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
      videoRef.current.play().catch(() => {});
    }
  }, [localStream]);

  async function startLive() {
    setStreamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setIsStreaming(true);
      setIsWatching(false);
    } catch (err) {
      console.error('Live stream failed', err);
      setStreamError('Unable to access camera or microphone.');
    }
  }

  function stopLive() {
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    setIsStreaming(false);
  }

  return (
    <Layout>
      <div className="space-y-6 rounded-3xl border border-white/10 bg-surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-lime-400">Live streaming</h1>
            <p className="mt-2 text-sm text-white/70">Start broadcasting or watch a live room with Jazz.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startLive}
              className="rounded-full bg-lime-500 px-5 py-3 text-sm font-semibold text-[#1b1a15] transition hover:bg-lime-400"
            >
              Start live stream
            </button>
            <button
              type="button"
              onClick={() => {
                setIsWatching(true);
                stopLive();
              }}
              className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-[#08211f] transition hover:bg-sky-400"
            >
              Watch live room
            </button>
          </div>
        </div>

        {streamError ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{streamError}</div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-[#150b09] p-6 text-white/80">
            {isStreaming ? (
              <div className="space-y-4">
                <video ref={videoRef} className="w-full rounded-3xl bg-black" muted playsInline />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white/70">You are live now.</span>
                  <button
                    type="button"
                    onClick={stopLive}
                    className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Stop stream
                  </button>
                </div>
              </div>
            ) : isWatching ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-black p-6 text-center text-white/70">
                  <p className="text-lg font-semibold text-white">Watching live room</p>
                  <p className="mt-2 text-sm text-white/70">Live broadcast preview will appear here when a room is available.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-black p-6 text-center text-white/70">
                <p className="text-lg font-semibold text-white">Ready to start streaming</p>
                <p className="mt-2 text-sm text-white/70">Click the button above to request camera and microphone access.</p>
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#120b09] p-6">
            <h2 className="text-xl font-semibold text-white">Live stream tools</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>• Start streaming your camera and microphone locally.</li>
              <li>• Share your live session with friends on Jazz.</li>
              <li>• Use browser media permissions for low-latency capture.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
