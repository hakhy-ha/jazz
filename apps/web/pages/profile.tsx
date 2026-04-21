import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api, { clearAuthTokens } from '../lib/api';
import { useRequireAuth } from '../lib/auth';
import { Layout } from '../components/Layout';
import { firebaseLogout, onFirebaseAuthStateChanged } from '../lib/firebase';
import { AvatarUpload } from '../components/AvatarUpload';
import { ProfileEditForm } from '../components/ProfileEditForm';

export default function ProfilePage() {
  useRequireAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  useEffect(() => {
    loadProfile();

    const unsubscribe = onFirebaseAuthStateChanged((user) => {
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, []);

  async function loadProfile() {
    try {
      const res = await api.get('/users/me');
      setProfile(res.data);
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  }

  async function handleLogout() {
    try {
      await firebaseLogout();
      clearAuthTokens();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  if (!profile) {
    return (
      <Layout>
        <div className="rounded-3xl border border-white/10 bg-surface p-6 text-white">Loading profile...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-surface p-6">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <AvatarUpload
                currentAvatarUrl={profile.avatarUrl}
                onUploadComplete={(url) => {
                  setProfile({ ...profile, avatarUrl: url });
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-lime-400">
                {profile.nickname ? `@${profile.nickname}` : profile.name}
              </h1>
              {profile.nickname ? (
                <p className="text-sm text-white/70">{profile.name}</p>
              ) : null}
              <p className="mt-1 text-sm text-white/70">{profile.email}</p>
            </div>
          </div>
          <ProfileEditForm
            profile={profile}
            onProfileUpdate={setProfile}
          />
        </div>
        <div className="rounded-3xl border border-white/10 bg-surface p-6">
          <h2 className="text-xl font-semibold text-lime-400">Account</h2>
          <div className="mt-4 space-y-3 text-sm text-white/80">
            <div>Joined: {new Date(profile.createdAt).toLocaleDateString()}</div>
            <div>Phone: {profile.phone || 'Not set'}</div>
            {firebaseUser && (
              <div className="mt-4 p-3 rounded-lg bg-lime-500/10 border border-lime-500/20">
                <div className="text-lime-400 font-medium">Firebase Account</div>
                <div className="text-xs mt-1">Authenticated via Google</div>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 w-full rounded-full bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
}
