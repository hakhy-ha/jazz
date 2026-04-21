import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { FollowButton } from '../../components/FollowButton';

// Import api separately to avoid module resolution issues
const api = require('../../lib/api').default;

type UserProfile = {
  id: string;
  name: string;
  nickname?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  followersCount?: number;
  followingCount?: number;
};

export default function UserProfilePage() {
  const router = useRouter();
  const { userId } = router.query;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!userId) return;

      try {
        const [profileRes, meRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get('/users/me').catch(() => ({ data: { id: '' } })),
        ]);

        setProfile(profileRes.data);
        setCurrentUserId(meRes.data.id);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <Layout>
        <div className="rounded-3xl border border-white/10 bg-surface p-6 text-white">
          Loading profile...
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="rounded-3xl border border-white/10 bg-surface p-6 text-white">
          User not found
        </div>
      </Layout>
    );
  }

  const handleFollowChange = () => {
    if (userId) {
      api.get(`/users/${userId}`).then(setProfile).catch(() => {});
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-surface p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-white/10 overflow-hidden">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.nickname ? `@${profile.nickname}` : profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white/50 text-2xl">
                    👤
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-lime-400">
                  {profile.nickname ? `@${profile.nickname}` : profile.name}
                </h1>
                {profile.nickname ? (
                  <p className="text-sm text-white/70">{profile.name}</p>
                ) : null}
                <p className="mt-2 text-sm text-white/60">
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {currentUserId && currentUserId !== profile.id && (
              <FollowButton
                userId={profile.id}
                currentUserId={currentUserId}
                onFollowChange={handleFollowChange}
              />
            )}
          </div>
          {profile.bio && (
            <p className="mt-4 text-white/80">{profile.bio}</p>
          )}
          <div className="mt-4 flex gap-6 text-sm text-white/60">
            <div>
              <span className="text-lime-400 font-semibold">{profile.followersCount || 0}</span>{' '}
              Followers
            </div>
            <div>
              <span className="text-lime-400 font-semibold">{profile.followingCount || 0}</span>{' '}
              Following
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}