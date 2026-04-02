import React, { useMemo, useState } from 'react';

const PostCard = ({ post, onLike, onComment, onDeleteComment }) => {
  const [commentText, setCommentText] = useState('');

  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  const isLikedByMe = useMemo(() => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = user.id || user.userId;
    
    if (!currentUserId) return false;
    return (post.likes || []).some((l) => l?.userId === currentUserId);
  }, [post.likes]);

  const canDeleteComment = (comment) => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = user.id || user.userId;
    
    return comment.userId === currentUserId;
  };

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
        <img src={post.image} alt="Post" className="w-full rounded-lg mb-4 object-contain" style={{ maxHeight: 'none' }} />
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

      {/* Display comments */}
      {post.comments && post.comments.length > 0 && (
        <div className="mt-4 space-y-2">
          {post.comments.map((comment, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 relative">
              <div className="flex justify-between items-start">
                <div className="font-medium text-sm text-gray-900">{comment.username}</div>
                {canDeleteComment(comment) && (
                  <button
                    onClick={() => onDeleteComment && onDeleteComment(post._id, index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete comment"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-700 mt-1">{comment.text}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(comment.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
