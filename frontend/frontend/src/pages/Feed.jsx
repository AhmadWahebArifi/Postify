import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);

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

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }
      const res = await axios.put(`${API}/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = res.data;
      setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }
      const res = await axios.post(`${API}/comment/${postId}`, {
        text: commentText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = res.data;
      setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Feed</h1>
          <Link
            to="/create-post"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Post
          </Link>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onLike={handleLike} onComment={handleComment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
