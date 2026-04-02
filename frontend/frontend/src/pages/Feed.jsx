import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Swal from 'sweetalert2';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/posts`);
      setPosts(res.data);
      console.log('Fetched posts:', res.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Authentication Required',
          text: 'Please login first to like posts',
          confirmButtonColor: '#4F46E5',
        });
        return;
      }

      // Get current user info for proper identification
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = user.id || user.userId;

      // Find the current post to check if already liked
      const currentPost = posts.find(p => p._id === postId);
      const wasLiked = currentPost && currentPost.likes?.some((like) => like.userId === currentUserId);

      // Optimistic UI update
      setPosts((prev) => prev.map((p) => {
        if (p._id === postId) {
          const updatedLikes = wasLiked 
            ? p.likes.filter((like) => like.userId !== currentUserId)
            : [...(p.likes || []), { userId: currentUserId, username: user.username || 'Anonymous' }];
          return { ...p, likes: updatedLikes };
        }
        return p;
      }));

      const res = await axios.put(`${API}/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update with server response to ensure consistency
      const updated = res.data;
      setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch (error) {
      console.error('Failed to like post:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to like post. Please try again.',
        confirmButtonColor: '#4F46E5',
      });
      // Revert by refetching posts on error
      fetchPosts();
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Authentication Required',
          text: 'Please login first to comment',
          confirmButtonColor: '#4F46E5',
        });
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add comment. Please try again.',
        confirmButtonColor: '#4F46E5',
      });
    }
  };

  const handleDeleteComment = async (postId, commentIndex) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Authentication Required',
          text: 'Please login first',
          confirmButtonColor: '#4F46E5',
        });
        return;
      }
      
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Delete Comment',
        text: 'Are you sure you want to delete this comment?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      });
      
      if (!result.isConfirmed) return;

      const res = await axios.delete(`${API}/comment/${postId}/${commentIndex}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = res.data;
      setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Comment deleted successfully',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete comment. Please try again.',
        confirmButtonColor: '#4F46E5',
      });
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
            <PostCard 
              key={post._id} 
              post={post} 
              onLike={handleLike} 
              onComment={handleComment}
              onDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
