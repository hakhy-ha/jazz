export type UserProfile = {
  id: string;
  email: string;
  phone?: string | null;
  name: string;
  nickname?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
};

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: string;
};

export type MessageType = 'TEXT' | 'VOICE' | 'IMAGE' | 'VIDEO' | 'FILE';

export type MessageStatus = 'SENT' | 'DELIVERED' | 'SEEN';

export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  content?: string | null;
  mediaUrl?: string | null;
  type: MessageType;
  status: MessageStatus;
  createdAt: string;
};

export type PostItem = {
  id: string;
  userId: string;
  caption?: string | null;
  mediaUrl?: string | null;
  mediaType: 'IMAGE' | 'VIDEO';
  createdAt: string;
};

export type NotificationItem = {
  id: string;
  userId: string;
  type: 'MESSAGE' | 'FRIEND_REQUEST' | 'COMMENT' | 'REACTION' | 'STREAM';
  payload: Record<string, unknown>;
  read: boolean;
  createdAt: string;
};
