import { useState } from 'react';
import api from '../lib/api';

interface LikeButtonProps {
  postId: string;
  initialReactions: Array<{ emoji: string; userId: string }>;
  currentUserId: string;
}

export function LikeButton({ postId, initialReactions, currentUserId }: LikeButtonProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ['❤️', '👍', '😂', '😮', '😢', '🔥'];
  const userReaction = reactions.find((r) => r.userId === currentUserId);

  async function handleReact(emoji: string) {
    try {
      setIsLoading(true);
      // Call your API endpoint to create/update reaction
      // For now, we'll just update the UI
      if (userReaction?.emoji === emoji) {
        // Remove reaction
        setReactions(reactions.filter((r) => r.userId !== currentUserId));
      } else {
        // Add or update reaction
        const newReactions = reactions.filter((r) => r.userId !== currentUserId);
        newReactions.push({ emoji, userId: currentUserId });
        setReactions(newReactions);
      }
      setShowEmojiPicker(false);
    } catch (err) {
      console.error('Error reacting:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={isLoading}
          className="text-xl hover:scale-125 transition-transform disabled:opacity-50"
        >
          {userReaction ? userReaction.emoji : '🤍'}
        </button>
        <span className="text-sm text-white/60">{reactions.length}</span>
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 flex gap-2 bg-[#23150f] border border-white/10 rounded-full p-2">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className="text-lg hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}