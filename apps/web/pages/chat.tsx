import { useEffect, useState } from 'react';
import api from '../lib/api';
import { uploadFile } from '../lib/firebase';
import { useRequireAuth } from '../lib/auth';
import { Layout } from '../components/Layout';

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  mediaUrl?: string;
  type: string;
  status: string;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  nickname?: string;
  avatarUrl?: string;
};

type Friend = {
  id: string;
  user: User;
};

export default function ChatPage() {
  useRequireAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [peerId, setPeerId] = useState('');
  const [peerUser, setPeerUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    if (peerId) {
      api.get(`/messages/${peerId}`).then((res) => setMessages(res.data)).catch(() => {});
      // Find peer user info
      const friend = friends.find(f => f.user.id === peerId);
      if (friend) {
        setPeerUser(friend.user);
      } else {
        // If not a friend, try to get user info
        api.get(`/users/${peerId}`).then((res) => setPeerUser(res.data)).catch(() => setPeerUser(null));
      }
    } else {
      setPeerUser(null);
    }
  }, [peerId, friends]);

  async function loadFriends() {
    try {
      const res = await api.get('/friends/list');
      setFriends(res.data);
    } catch (err) {
      console.error('Error loading friends:', err);
    }
  }

  async function searchUsers(query: string) {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => searchUsers(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  async function sendTextMessage() {
    if (!peerId || !content.trim()) return;
    setIsSending(true);
    setError(null);

    try {
      const response = await api.post('/messages', { receiverId: peerId, type: 'TEXT', content });
      setMessages((prev) => [...prev, response.data]);
      setContent('');
    } catch (err) {
      console.error('Send text failed', err);
      setError('Unable to send text message.');
    } finally {
      setIsSending(false);
    }
  }

  async function sendMediaMessage(file: File, typeHint: 'IMAGE' | 'VIDEO' | 'VOICE' | 'FILE') {
    if (!peerId) return;
    setIsSending(true);
    setError(null);

    try {
      const mediaUrl = await uploadFile(file, typeHint === 'VOICE' ? 'audio-notes' : 'chat-media');
      const response = await api.post('/messages', {
        receiverId: peerId,
        type: typeHint,
        mediaUrl,
        content: file.name
      });
      setMessages((prev) => [...prev, response.data]);
      setMediaFile(null);
      setAudioFile(null);
    } catch (err) {
      console.error('Send media failed', err);
      setError('Unable to send media message.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-surface p-6">
          <h2 className="font-semibold text-lime-400">Friends</h2>
          <div className="mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-2xl border border-white/10 bg-[#1b1210] p-3 text-white outline-none mb-4"
            />
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(searchQuery ? searchResults : friends).map((item) => {
                const user = searchQuery ? item : item.user;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setPeerId(user.id)}
                    className={`block w-full rounded-2xl border border-white/10 p-3 text-left hover:bg-white/5 ${
                      peerId === user.id ? 'bg-lime-500/20 border-lime-400' : 'bg-[#1b1210]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.nickname || user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-white truncate">
                          {user.nickname || user.name}
                        </div>
                        {user.nickname && (
                          <div className="text-sm text-white/60 truncate">{user.name}</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
        <section className="rounded-3xl border border-white/10 bg-surface p-6">
          {peerUser ? (
            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
              <div className="h-12 w-12 rounded-full bg-white/10 overflow-hidden">
                {peerUser.avatarUrl ? (
                  <img
                    src={peerUser.avatarUrl}
                    alt={peerUser.nickname || peerUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-lime-400">
                  {peerUser.nickname || peerUser.name}
                </h2>
                {peerUser.nickname && (
                  <p className="text-sm text-white/60">{peerUser.name}</p>
                )}
              </div>
            </div>
          ) : (
            <h2 className="text-xl font-semibold text-lime-400 pb-4 border-b border-white/10 mb-4">Chat</h2>
          )}
          <div className="mt-4 h-[60vh] space-y-3 overflow-y-auto rounded-3xl border border-white/10 bg-[#170d0b] p-4">
            {messages.length === 0 ? (
              <p className="text-sm text-white/60">
                {peerId ? 'No messages yet. Start the conversation!' : 'Select a friend to start chatting.'}
              </p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="rounded-2xl border border-white/10 bg-[#23150f] p-3">
                  {message.type === 'IMAGE' && message.mediaUrl ? (
                    <img src={message.mediaUrl} alt={message.content || 'Image message'} className="max-h-72 w-full rounded-2xl object-cover" />
                  ) : message.type === 'VIDEO' && message.mediaUrl ? (
                    <video controls src={message.mediaUrl} className="max-h-72 w-full rounded-2xl" />
                  ) : message.type === 'VOICE' && message.mediaUrl ? (
                    <audio controls src={message.mediaUrl} className="w-full" />
                  ) : (
                    <p className="text-sm text-white/90">{message.content}</p>
                  )}
                  <div className="mt-2 flex items-center justify-between text-xs text-white/50">
                    <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                    <span>{message.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          {peerId && (
            <div className="mt-4 space-y-3">
              {error ? <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <input
                  value={peerId}
                  onChange={(e) => setPeerId(e.target.value)}
                  placeholder="Friend ID"
                  className="rounded-2xl border border-white/10 bg-[#1b1210] p-3 text-white outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={sendTextMessage}
                    disabled={!peerId || !content.trim() || isSending}
                    className="rounded-full bg-lime-500 px-5 py-3 text-sm font-semibold text-[#1b1a15] transition hover:bg-lime-400 disabled:bg-white/10"
                  >
                    {isSending ? 'Sending...' : 'Send text'}
                  </button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-center rounded-3xl border border-dashed border-white/30 bg-[#0f0a08] px-4 py-3 text-sm text-white/80 transition hover:border-lime-400 hover:text-lime-200">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
                  />
                  {mediaFile ? mediaFile.name : 'Attach image/video'}
                </label>
                <label className="flex cursor-pointer items-center justify-center rounded-3xl border border-dashed border-white/30 bg-[#0f0a08] px-4 py-3 text-sm text-white/80 transition hover:border-lime-400 hover:text-lime-200">
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                  />
                  {audioFile ? audioFile.name : 'Attach audio note'}
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    if (mediaFile) {
                      const type = mediaFile.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';
                      sendMediaMessage(mediaFile, type as 'IMAGE' | 'VIDEO');
                    }
                  }}
                  disabled={!peerId || !mediaFile || isSending}
                  className="rounded-full bg-lime-500 px-5 py-3 text-sm font-semibold text-[#1b1a15] transition hover:bg-lime-400 disabled:bg-white/10"
                >
                  Send media
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (audioFile) {
                      sendMediaMessage(audioFile, 'VOICE');
                    }
                  }}
                  disabled={!peerId || !audioFile || isSending}
                  className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-[#08211f] transition hover:bg-sky-400 disabled:bg-white/10"
                >
                  Send audio note
                </button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a message"
                className="w-full rounded-2xl border border-white/10 bg-[#1b1210] p-3 text-white outline-none"
                rows={3}
              />
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
