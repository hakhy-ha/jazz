import React, { useState } from 'react';
import api from '../lib/api';

interface ProfileEditFormProps {
  profile: any;
  onProfileUpdate: (updatedProfile: any) => void;
}

export function ProfileEditForm({ profile, onProfileUpdate }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    nickname: profile.nickname || '',
    bio: profile.bio || ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const res = await api.patch('/users/me', formData);
      onProfileUpdate(res.data);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name || '',
      nickname: profile.nickname || '',
      bio: profile.bio || ''
    });
    setIsEditing(false);
    setError('');
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-lime-400">Profile Information</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-lime-500 text-black rounded-full font-semibold hover:bg-lime-400 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="text-white/60">Name:</span>
            <span className="ml-2 text-white">{profile.name || 'Not set'}</span>
          </div>
          <div>
            <span className="text-white/60">Nickname:</span>
            <span className="ml-2 text-white">{profile.nickname ? `@${profile.nickname}` : 'Not set'}</span>
          </div>
          <div>
            <span className="text-white/60">Bio:</span>
            <span className="ml-2 text-white">{profile.bio || 'Not set'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-lime-400">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-lime-400"
            placeholder="Enter your name"
            maxLength={128}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Nickname
          </label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-lime-400"
            placeholder="Enter your nickname (without @)"
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-lime-400 resize-none"
            placeholder="Tell us about yourself"
            maxLength={250}
          />
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-lime-500 text-black rounded-full font-semibold hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}