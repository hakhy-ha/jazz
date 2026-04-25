import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import api from '../lib/api';
import { uploadFile } from '../lib/firebase';
import { useRequireAuth } from '../lib/auth';
import { Heart, MessageCircle, Share2, Music, Plus, User, Search, Home, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activePostIndex, setActivePostIndex] = useState(0);

  useEffect(() => {
    loadFeed();
    loadCurrentUser();
  }, []);

  async function loadFeed() {
    try {
      const res = await api.get('/posts');
      // For TikTok feel, we want mostly videos, but we'll show all posts
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / window.innerHeight);
    if (index !== activePostIndex) {
      setActivePostIndex(index);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden">
      <Head>
        <title>Jazz - Feed</title>
      </Head>
      
      {currentUserId && <NotificationSetup userId={currentUserId} />}

      {/* Top Navigation Overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <Link href="/live" className="pointer-events-auto">
          <Search className="w-6 h-6 text-white drop-shadow-md" />
        </Link>
        <div className="flex gap-4 font-semibold text-lg drop-shadow-md">
          <button className="text-white/60 pointer-events-auto">Following</button>
          <button className="text-white border-b-2 border-white pb-1 pointer-events-auto">For You</button>
        </div>
        <Link href="/live" className="pointer-events-auto">
          <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center">
            <Plus className="w-4 h-4 text-white drop-shadow-md" />
          </div>
        </Link>
      </div>

      {/* Full Screen Vertical Snap Container */}
      <div 
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
        onScroll={handleScroll}
      >
        {posts.length === 0 ? (
          <div className="h-screen w-full flex items-center justify-center snap-start text-white/50">
            Loading feed...
          </div>
        ) : (
          posts.map((post, index) => (
            <VideoPost 
              key={post.id} 
              post={post} 
              isActive={index === activePostIndex} 
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 px-6 py-3 flex justify-between items-center pb-safe">
        <Link href="/feed" className="flex flex-col items-center gap-1 text-white">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition">
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium">Chat</span>
        </Link>
        <Link href="/live" className="flex items-center justify-center -mt-6">
          <div className="bg-gradient-to-tr from-tiktokCyan to-tiktokPink p-[2px] rounded-xl">
            <div className="bg-white text-black px-4 py-1.5 rounded-xl font-bold flex items-center gap-1">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </Link>
        <Link href="/notifications" className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition">
          <Bell className="w-6 h-6" />
          <span className="text-[10px] font-medium">Inbox</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
}

function VideoPost({ post, isActive, currentUserId }: { post: Post, isActive: boolean, currentUserId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.reactions.length);
  const [showHeart, setShowHeart] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const hasLiked = post.reactions.some(r => r.userId === currentUserId && r.emoji === '❤️');
    setIsLiked(hasLiked);
  }, [post.reactions, currentUserId]);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDoubleTap = async (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHeartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);

    if (!isLiked && currentUserId) {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      try {
        await api.post(`/posts/${post.id}/reactions`, { emoji: '❤️' });
      } catch (error) {
        console.error('Failed to like', error);
      }
    }
  };

  const handleLikeClick = async () => {
    if (!currentUserId) return;
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    try {
      if (isLiked) {
        // Find reaction id and delete (assuming API supports this)
        const reaction = post.reactions.find(r => r.userId === currentUserId && r.emoji === '❤️');
        if (reaction) await api.delete(`/posts/${post.id}/reactions/${reaction.id}`);
      } else {
        await api.post(`/posts/${post.id}/reactions`, { emoji: '❤️' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-full relative snap-start bg-black">
      {/* Media Layer */}
      <div 
        className="absolute inset-0 z-0 flex items-center justify-center bg-[#0a0a0a]"
        onClick={handleTogglePlay}
        onDoubleClick={handleDoubleTap}
      >
        {post.mediaType === 'VIDEO' ? (
          <video 
            ref={videoRef}
            src={post.mediaUrl}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={false}
          />
        ) : post.mediaUrl ? (
          <img 
            src={post.mediaUrl} 
            alt="Post content" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface to-black flex items-center justify-center p-8">
            <h2 className="text-3xl font-bold text-center leading-relaxed drop-shadow-lg text-white">
              {post.caption}
            </h2>
          </div>
        )}

        {/* Double tap heart animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 1, rotate: -15 }}
              animate={{ scale: [0, 1.2, 1], opacity: [1, 1, 0], y: -100 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute z-50 pointer-events-none"
              style={{ left: heartPos.x - 50, top: heartPos.y - 50 }}
            >
              <Heart className="w-24 h-24 fill-tiktokPink text-tiktokPink drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play button overlay */}
        {!isPlaying && post.mediaType === 'VIDEO' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
            <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-md">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
            </div>
          </div>
        )}
      </div>

      {/* Overlay Gradient for readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* Content Layer (Bottom Left) */}
      <div className="absolute bottom-[80px] left-0 w-[75%] p-4 z-20 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-lg drop-shadow-md hover:underline cursor-pointer">
            @{post.user.nickname || post.user.name.split(' ')[0]}
          </div>
          <button className="text-xs bg-tiktokPink text-white px-2 py-0.5 rounded border border-transparent font-semibold">
            Follow
          </button>
        </div>
        
        {post.caption && post.mediaUrl && (
          <div className="text-sm drop-shadow-md line-clamp-3">
            {post.caption}
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm mt-1">
          <Music className="w-4 h-4 animate-spin-slow" />
          <span className="marquee drop-shadow-md">
            Original sound - {post.user.nickname || post.user.name}
          </span>
        </div>
      </div>

      {/* Actions Layer (Bottom Right) */}
      <div className="absolute bottom-[90px] right-4 z-20 flex flex-col items-center gap-6">
        <div className="relative group cursor-pointer">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-surface">
            {post.user.avatarUrl ? (
              <img src={post.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white font-bold">
                {post.user.name[0]}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-tiktokPink rounded-full w-5 h-5 flex items-center justify-center border border-white">
            <Plus className="w-3 h-3 text-white" />
          </div>
        </div>

        <button onClick={handleLikeClick} className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-black/60 transition">
            <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-tiktokPink text-tiktokPink' : 'text-white'}`} />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">{likesCount}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-black/60 transition">
            <MessageCircle className="w-6 h-6 text-white" fill="white" />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">{post.comments.length}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-black/60 transition">
            <Share2 className="w-6 h-6 text-white" fill="white" />
          </div>
          <span className="text-xs font-semibold drop-shadow-md">Share</span>
        </button>

        <div className="w-10 h-10 rounded-full bg-zinc-800 animate-spin-slow mt-2 border-[8px] border-zinc-900 flex items-center justify-center overflow-hidden shadow-xl">
          {post.user.avatarUrl ? (
            <img src={post.user.avatarUrl} className="w-full h-full object-cover" />
          ) : (
            <Music className="w-4 h-4 text-white" />
          )}
        </div>
      </div>
    </div>
  );
}
