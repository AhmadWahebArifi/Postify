import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ text: '', image: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/posts`);
      setPosts(res.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/posts`, newPost, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewPost({ text: '', image: '' });
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      // You'll need to get userId from token or user context
      const userId = 'current-user-id'; // TODO: Get from auth context or decode JWT
      await axios.put(`${API}/like/${postId}`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const token = localStorage.getItem('token');
      // You'll need to get userId from token or user context
      const userId = 'current-user-id'; // TODO: Get from auth context or decode JWT
      await axios.post(`${API}/comment/${postId}`, {
        userId,
        text: commentText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Feed</h1>
        
        {/* Create Post Form */}
        <form onSubmit={handleCreatePost} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What's on your mind?"
            rows={3}
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
          />
          <input
            className="w-full p-3 mt-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Image URL (optional)"
            value={newPost.image}
            onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
          />
          <button
            className="mt-3 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            type="submit"
          >
            Post
          </button>
        </form>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md p-6">
              {/* Post Text */}
              <p className="text-gray-800 mb-4">{post.text}</p>
              
              {/* Post Image */}
              {post.image && (
                <img 
                  src={post.image} 
                  alt="Post" 
                  className="w-full rounded-lg mb-4"
                />
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-6 mb-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    favorite
                  </span>
                  <span>{post.likes?.length || 0}</span>
                </button>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="material-symbols-outlined">
                    comment
                  </span>
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>

              {/* Comments Section */}
              {post.comments && post.comments.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Comments</h3>
                  <div className="space-y-2">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-800">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
