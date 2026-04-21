import React, { useState } from 'react';
import api from '../lib/api';

interface CommentSectionProps {
  postId: string;
  comments: Array<{ id: string; content: string; user: { name: string; nickname?: string } }>;
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsList, setCommentsList] = useState(comments);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      // Note: You'll need to create this endpoint in your API
      // For now, we'll just add it to the UI
      setCommentsList([
        ...commentsList,
        {
          id: Date.now().toString(),
          content: newComment,
          user: { name: 'You', nickname: 'you' },
        },
      ]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-lime-400 hover:underline"
      >
        {isExpanded ? 'Hide' : 'Show'} comments ({commentsList.length})
      </button>

      {isExpanded && (
        <div className="space-y-3 border-t border-white/10 pt-3">
          {commentsList.map((comment) => (
            <div key={comment.id} className="text-sm">
              <span className="font-semibold text-white/80">
                {comment.user.nickname ? `@${comment.user.nickname}` : comment.user.name}:
              </span>
              <p className="text-white/60 mt-1">{comment.content}</p>
            </div>
          ))}

          <form onSubmit={handleSubmitComment} className="mt-3 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-full bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:bg-white/20 transition-colors"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-3 py-2 rounded-full bg-lime-500 text-black font-semibold text-sm hover:bg-lime-600 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? '...' : 'Post'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}