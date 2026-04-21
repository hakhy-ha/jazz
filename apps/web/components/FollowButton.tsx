import { useEffect, useState } from 'react';
import api from '../lib/api';

interface FollowButtonProps {
  userId: string;
  currentUserId: string;
  onFollowChange?: () => void;
}

export function FollowButton({ userId, currentUserId, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId === currentUserId) {
      return;
    }

    async function checkFollowStatus() {
      try {
        const res = await api.get(`/follows/${userId}/is-following`);
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error('Error checking follow status:', err);
      }
    }

    checkFollowStatus();
  }, [userId, currentUserId]);

  async function handleToggleFollow() {
    try {
      setIsLoading(true);

      if (isFollowing) {
        await api.delete(`/follows/${userId}`);
      } else {
        await api.post(`/follows/${userId}`);
      }

      setIsFollowing(!isFollowing);
      onFollowChange?.();
    } catch (err) {
      console.error('Error toggling follow:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-full font-semibold transition-colors ${
        isFollowing
          ? 'bg-white/10 text-white hover:bg-white/20'
          : 'bg-lime-500 text-black hover:bg-lime-600'
      } disabled:opacity-50`}
    >
      {isLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}