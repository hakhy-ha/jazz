import { useEffect, useState } from 'react';
import api from '../lib/api';
import { uploadFile } from '../lib/firebase';
import { useRequireAuth } from '../lib/auth';
import { Layout } from '../components/Layout';
import { CommentSection } from '../components/CommentSection';
import { LikeButton } from '../components/LikeButton';
import { NotificationSetup } from '../components/NotificationSetup';

type Post = {
  id: string;
  caption?: string;
  mediaUrl?: string;
  mediaType: string;
  createdAt: string;
  user: { id: string; name: string; nickname?: string; avatarUrl?: string };
  comments: { id: string; content: string; user: { name: string; nickname?: string } }[];
  reactions: { id: string; emoji: string; userId: string }[];
};

export default function FeedPage() {
  useRequireAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeed();
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  async function loadFeed() {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error loading feed:', err);
    }
  }

  async function loadCurrentUser() {
    try {
      const res = await api.get('/users/me');
      setCurrentUserId(res.data.id);
    } catch (err) {
      // User not logged in
    }
  }

  async function handleCreatePost() {
    if (!caption.trim() && !selectedFile) {
      setError('Add a caption or attach a photo/video before posting.');
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      let mediaUrl: string | undefined;
      let mediaType = 'IMAGE';

      if (selectedFile) {
        mediaUrl = await uploadFile(selectedFile, 'posts');
        if (selectedFile.type.startsWith('video/')) {
          mediaType = 'VIDEO';
        }
      }

      await api.post('/posts', {
        caption: caption.trim() || undefined,
        mediaUrl,
        mediaType
      });

      setCaption('');
      setSelectedFile(null);
      setPreviewUrl('');
      await loadFeed();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Unable to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <Layout>
      {currentUserId && <NotificationSetup userId={currentUserId} />}
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-surface p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-lime-400">Your feed</h1>
              <p className="mt-2 text-sm text-white/70">Latest posts from your Jazz friends and community.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.location.assign('/live')}
                className="rounded-full bg-lime-500 px-5 py-3 text-sm font-semibold text-[#1b1a15] transition hover:bg-lime-400"
              >
                Start live stream
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#16100d] p-6">
          <h2 className="text-2xl font-semibold text-white">Create a new post</h2>
          <p className="mt-2 text-sm text-white/70">Upload a feed update with text, image, or video.</p>
          <div className="mt-6 space-y-4">
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Share what you're doing..."
              className="w-full rounded-3xl border border-white/10 bg-[#120b09] p-4 text-white outline-none focus:border-lime-400"
              rows={4}
            />
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <label className="flex cursor-pointer items-center justify-center rounded-3xl border border-dashed border-white/30 bg-[#0f0a08] px-4 py-3 text-center text-sm text-white/80 transition hover:border-lime-400 hover:text-lime-200">
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                />
                {selectedFile ? selectedFile.name : 'Attach photo or video'}
              </label>
              <button
                type="button"
                onClick={handleCreatePost}
                disabled={isPosting}
                className="rounded-full bg-lime-500 px-5 py-3 text-sm font-semibold text-[#1b1a15] transition hover:bg-lime-400 disabled:bg-white/10"
              >
                {isPosting ? 'Posting...' : 'Upload feed'}
              </button>
            </div>
            {previewUrl ? (
              <div className="rounded-3xl border border-white/10 bg-black p-4">
                {selectedFile?.type.startsWith('video/') ? (
                  <video src={previewUrl} controls className="w-full rounded-3xl" />
                ) : (
                  <img src={previewUrl} alt="Preview" className="w-full rounded-3xl object-cover" />
                )}
              </div>
            ) : null}
            {error ? <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
          </div>
        </div>

        {posts.map((post) => (
          <article key={post.id} className="rounded-3xl border border-white/10 bg-[#23150f]/80 p-6 shadow-xl">
            <div className="flex items-center gap-3 pb-4">
              <div className="h-12 w-12 rounded-full bg-white/10 overflow-hidden">
                {post.user.avatarUrl ? (
                  <img
                    src={post.user.avatarUrl}
                    alt={post.user.nickname ? `@${post.user.nickname}` : post.user.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <div className="font-semibold">
                  {post.user.nickname ? `@${post.user.nickname}` : post.user.name}
                </div>
                {post.user.nickname ? (
                  <div className="text-sm text-white/50">{post.user.name}</div>
                ) : null}
                <div className="text-sm text-white/60">{new Date(post.createdAt).toLocaleString()}</div>
              </div>
            </div>
            {post.caption ? <p className="pb-4 text-white/90">{post.caption}</p> : null}
            {post.mediaUrl ? (
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
                {post.mediaType === 'VIDEO' ? (
                  <video src={post.mediaUrl} controls className="h-72 w-full rounded-3xl object-cover" />
                ) : (
                  <img src={post.mediaUrl} alt="post media" className="h-72 w-full object-cover" />
                )}
              </div>
            ) : null}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {currentUserId && (
                  <LikeButton
                    postId={post.id}
                    initialReactions={post.reactions}
                    currentUserId={currentUserId}
                  />
                )}
                <div className="text-sm text-white/60">
                  {post.comments.length} comments
                </div>
              </div>
            </div>
            {currentUserId && (
              <CommentSection
                postId={post.id}
                comments={post.comments}
              />
            )}
          </article>
        ))}
      </div>
    </Layout>
  );
}
