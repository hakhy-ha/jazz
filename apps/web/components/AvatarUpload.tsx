import React, { useState } from 'react';
import { uploadAvatar } from '../lib/firebase';
import api from '../lib/api';
import { getFirebaseAuth } from '../lib/firebase';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onUploadComplete: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError('');

      // Get Firebase user ID for storage
      const firebaseUser = getFirebaseAuth().currentUser;
      if (!firebaseUser) {
        throw new Error('Not authenticated');
      }

      // Upload to Firebase Storage using Firebase user ID
      const downloadUrl = await uploadAvatar(file, firebaseUser.uid);

      // Update profile with new avatar URL
      await api.patch('/users/me', { avatarUrl: downloadUrl });

      onUploadComplete(downloadUrl);
    } catch (err) {
      setError('Failed to upload avatar. Please try again.');
      console.error('Avatar upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-white/10 overflow-hidden cursor-pointer hover:bg-white/20 transition-colors">
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white/50 text-2xl">
                📷
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
        </div>
      </label>
      <div className="text-sm text-white/60">
        {isUploading ? 'Uploading...' : 'Click to change avatar'}
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
    </div>
  );
}