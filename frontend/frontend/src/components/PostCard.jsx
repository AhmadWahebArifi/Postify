import React, { useMemo, useState } from 'react';

const PostCard = ({ post, onLike, onComment }) => {
  const [commentText, setCommentText] = useState('');

  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  const isLikedByMe = useMemo(() => {
    const username = localStorage.getItem('username');
    if (!username) return false;
    return (post.likes || []).some((l) => l?.username === username);
  }, [post.likes]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    await onComment(post._id, text);
    setCommentText('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-gray-900">{post.username || 'Unknown'}</div>
        <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
      </div>

      {post.text && <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.text}</p>}

      {post.image && (
        <img src={post.image} alt="Post" className="w-full rounded-lg mb-4" />
      )}

      <div className="flex items-center gap-6 mb-4">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-2 transition-colors ${
            isLikedByMe ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined">favorite</span>
          <span>{likeCount}</span>
        </button>

        <div className="flex items-center gap-2 text-gray-600">
          <span className="material-symbols-outlined">comment</span>
          <span>{commentCount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default PostCard;
