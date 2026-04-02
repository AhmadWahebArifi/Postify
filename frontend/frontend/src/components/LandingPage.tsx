import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API from '../api'
import SpinLoader from './SpinLoader'
import Swal from 'sweetalert2'
import './LandingPage.css'

interface Post {
  id: string
  content: string
  image?: string
  author: {
    name: string
    avatar: string
  }
  timestamp: string
  likes: Array<{ userId: string; username: string }>
  comments: Array<{ userId: string; username: string; text: string; createdAt: string }>
  likedByUser?: boolean
  commentsList?: Comment[]
}

interface Comment {
  userId: string
  username: string
  text: string
  createdAt: string
}

const mockPosts: Post[] = [
  {
    id: '1',
    content: 'Just launched our new feature! 🚀 Check out the amazing dashboard analytics that help you track your social media performance in real-time.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLzwp4eS1IPrVw11A70eRqpb89ivwmaKbvS_8qYNswUjdCIDgy57iyozciZ6V9vDrpzIdpBc3jbzSaAIbwO1f3nbpqPpRaI_NTESmnLkJa-n2A56qFdVY41tPifGhflFuUOvWgxEYufIufFyQxJAPAI69vWmVD98FwUD-j0oxanO8Behefn4I8AQsj6goy3e6OmeVMzR3nsHf8BCk-KCfxIAGkiS3UmiOuOElK1DlsHp9RCqaSKHF1dkGAgMdcu4kRGkagT4kHhVc',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggTpFIL8KvpnYNPuxFANvscDLzSyx0epIZE19Y6pTbg8IA2l_UEfkwg2C33CpXaf4gd1uJ6euWNHtJVaVEciZTBAPsdbFWe0kIB32MqJ0Asx3K9Klwikmb7q8sjjbqH-7sFdhi318YCQ88dJo8uuwvSl71xtHiy_f_c33jgSJREE-ajXjyKZmLlTrLj2ZL3w1nrp4hqMGgjV2ggDVgGTM5nIxxbf7MygLAtrEr9Z9SvQLZ_fII38x_G4xCrx3NliW49U8UV2K4CQ'
    },
    timestamp: '2 hours ago',
    likes: [],
    comments: []
  },
  {
    id: '2',
    content: 'Working on something big! The future of social media management is here. Stay tuned for our announcement next week. 🎯',
    author: {
      name: 'Mike Chen',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaAV3CQzCDHbrOl5zV7b_rqAsXnAN7izAx9HQqwIOrWOOeBMSBvTaVg45RI5dq54VDw2OQ3ZKAvJzgqdVv6xV1IvKv0kZSofSO205PEVnJO1LNd5gfhpN5vD4mqoczpXDE5yASMlwlf4fYl4foSORFwqHwSWXtwPn5I6SIUDCcMtfKgUr5cElNHK9S-6MG490i0p-NrIcwVOuatfaPWNtsod5cZOu-v66NZv_5l0zdjT_jCeoBSfcaRtI2htx379xv4mSrjYUVvGE'
    },
    timestamp: '5 hours ago',
    likes: [],
    comments: []
  },
  {
    id: '3',
    content: 'Pro tip: Schedule your posts during peak engagement hours for maximum reach. Our analytics show the best times are 9-11 AM and 7-9 PM! 📊',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLzwp4eS1IPrVw11A70eRqpb89ivwmaKbvS_8qYNswUjdCIDgy57iyozciZ6V9vDrpzIdpBc3jbzSaAIbwO1f3nbpqPpRaI_NTESmnLkJa-n2A56qFdVY41tPifGhflFuUOvWgxEYufIufFyQxJAPAI69vWmVD98FwUD-j0oxanO8Behefn4I8AQsj6goy3e6OmeVMzR3nsHf8BCk-KCfxIAGkiS3UmiOuOElK1DlsHp9RCqaSKHF1dkGAgMdcu4kRGkagT4kHhVc',
    author: {
      name: 'Emily Davis',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggTpFIL8KvpnYNPuxFANvscDLzSyx0epIZE19Y6pTbg8IA2l_UEfkwg2C33CpXaf4gd1uJ6euWNHtJVaVEciZTBAPsdbFWe0kIB32MqJ0Asx3K9Klwikmb7q8sjjbqH-7sFdhi318YCQ88dJo8uuwvSl71xtHiy_f_c33jgSJREE-ajXjyKZmLlTrLj2ZL3w1nrp4hqMGgjV2ggDVgGTM5nIxxbf7MygLAtrEr9Z9SvQLZ_fII38x_G4xCrx3NliW49U8UV2K4CQ'
    },
    timestamp: '1 day ago',
    likes: [],
    comments: []
  }
]

function PostCard({ post, onUpdate }: { post: Post; onUpdate: () => void }) {
  const [likes, setLikes] = useState(post.likes?.length || 0)
  const [comments, setComments] = useState(post.comments?.length || 0)
  const [isLiked, setIsLiked] = useState(post.likedByUser || false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentsList, setCommentsList] = useState<Comment[]>(post.commentsList || post.comments || [])
  const [loadingComments, setLoadingComments] = useState(false)

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Authentication Required',
          text: 'Please login to like posts',
          confirmButtonColor: '#6366f1'
        })
        return
      }

      // Get current user info for proper identification
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const currentUserId = user.id || user.userId
      
      console.log('Current user ID:', currentUserId)
      console.log('Post likes:', post.likes)
      
      // Check if already liked by this user
      const wasLiked = post.likes?.some((like: any) => like.userId === currentUserId)
      console.log('Was liked:', wasLiked)
      
      // Toggle like state
      setIsLiked(!wasLiked)
      setLikes(wasLiked ? likes - 1 : likes + 1)

      // Call API to like/unlike
      await axios.put(`${API}/like/${post.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log('Like API call completed')
      
      // Update parent to refresh posts
      onUpdate()
    } catch (error) {
      console.error('Failed to like post:', error)
      // Revert on error
      setIsLiked(isLiked)
      setLikes(isLiked ? likes + 1 : likes - 1)
    }
  }

  const handleComment = async () => {
    if (!newComment.trim()) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Authentication Required',
          text: 'Please login to comment',
          confirmButtonColor: '#6366f1'
        })
        return
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Optimistic UI update
      const commentData: Comment = {
        userId: user.id,
        username: user.username || 'Anonymous',
        text: newComment,
        createdAt: new Date().toISOString()
      }
      
      setCommentsList(prev => [...prev, commentData])
      setComments(comments + 1)
      setNewComment('')

      await axios.post(`${API}/comment/${post.id}`, {
        text: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Update parent to refresh posts
      onUpdate()
    } catch (error) {
      console.error('Failed to comment:', error)
      // Revert on error
      setCommentsList(prev => prev.slice(0, -1))
      setComments(comments - 1)
    }
  }

  const loadComments = async () => {
    if (!showComments && commentsList.length === 0) {
      setLoadingComments(true)
      try {
        const res = await axios.get(`${API}/comments/${post.id}`)
        setCommentsList(res.data)
      } catch (error) {
        console.error('Failed to load comments:', error)
      } finally {
        setLoadingComments(false)
      }
    }
    setShowComments(!showComments)
  }

  const handleDeleteComment = async (commentIndex: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Authentication Required',
          text: 'Please login to delete comments',
          confirmButtonColor: '#6366f1'
        })
        return
      }

      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Delete Comment?',
        text: 'Are you sure you want to delete this comment? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      })

      if (!result.isConfirmed) return

      // Show loading
      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      await axios.delete(`${API}/comment/${post.id}/${commentIndex}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Remove comment from local state
      setCommentsList(prev => prev.filter((_, index) => index !== commentIndex))
      setComments(comments - 1)
      
      // Update parent to refresh posts
      onUpdate()

      // Show success
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Comment has been deleted.',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      })
    } catch (error) {
      console.error('Failed to delete comment:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete comment. Please try again.',
        confirmButtonColor: '#6366f1'
      })
    }
  }

  const canDeleteComment = (comment: Comment) => {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const currentUserId = user.id || user.userId
    
    return comment.userId === currentUserId
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Post from Postify',
        text: post.content,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${post.content} - ${window.location.href}`)
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        text: 'Post link copied to clipboard!',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      })
    }
  }

  return (
    <div className="postcard">
      <div className="postcard-content">
        <div className="postcard-header">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="postcard-avatar"
          />
          <div className="postcard-author-info">
            <h4>{post.author.name}</h4>
            <p>{post.timestamp}</p>
          </div>
        </div>
        
        <p className="postcard-text">{post.content}</p>
        
        {post.image && (
          <img 
            src={post.image} 
            alt="Post image"
            className="postcard-image"
          />
        )}
        
        <div className="postcard-actions">
          <button 
            onClick={handleLike}
            className={`postcard-action-button ${isLiked ? 'liked' : ''}`}
          >
            <span className="material-symbols-outlined">
              {isLiked ? 'favorite' : 'favorite_border'}
            </span>
            <span className="postcard-action-count">{likes}</span>
          </button>
          <button 
            onClick={loadComments}
            className="postcard-action-button comment"
          >
            <span className="material-symbols-outlined">chat_bubble_outline</span>
            <span className="postcard-action-count">{comments}</span>
          </button>
          <button 
            onClick={handleShare}
            className="postcard-action-button share"
          >
            <span className="material-symbols-outlined">share</span>
            <span className="postcard-action-count">Share</span>
          </button>
        </div>

        {showComments && (
          <div className="comments-section">
            {/* Display existing comments */}
            {commentsList.length > 0 && (
              <div className="comments-list" style={{ marginBottom: '1rem' }}>
                {commentsList.map((comment, index) => (
                  <div key={index} className="comment-item" style={{ 
                    padding: '0.75rem', 
                    backgroundColor: '#f9fafb', 
                    borderRadius: '0.5rem', 
                    marginBottom: '0.5rem',
                    position: 'relative'
                  }}>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      {comment.username}
                      {canDeleteComment(comment) && (
                        <button
                          onClick={() => handleDeleteComment(index)}
                          style={{
                            float: 'right',
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            padding: '0.25rem'
                          }}
                          title="Delete comment"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {comment.text}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {loadingComments && (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <SpinLoader size="small" text="Loading comments..." />
              </div>
            )}
            
            <div className="comment-input-container">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <button
                onClick={handleComment}
                className="comment-submit-button"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from API:', `${API}/posts`)
      const res = await axios.get(`${API}/posts`)
      console.log('Posts fetched from API:', res.data)
      
      const token = localStorage.getItem('token')
      const currentUserId = token ? (JSON.parse(localStorage.getItem('user') || '{}').id || JSON.parse(localStorage.getItem('user') || '{}').userId) : null
      
      const formattedPosts = res.data.map((post: any) => {
        // Check if current user liked this post
        const likedByUser = currentUserId && post.likes?.some((like: any) => like.userId === currentUserId)
        
        return {
          id: post._id,
          content: post.text,
          image: post.image,
          author: {
            name: post.username,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggTpFIL8KvpnYNPuxFANvscDLzSyx0epIZE19Y6pTbg8IA2l_UEfkwg2C33CpXaf4gd1uJ6euWNHtJVaVEciZTBAPsdbFWe0kIB32MqJ0Asx3K9Klwikmb7q8sjjbqH-7sFdhi318YCQ88dJo8uuwvSl71xtHiy_f_c33jgSJREE-ajXjyKZmLlTrLj2ZL3w1nrp4hqMGgjV2ggDVgGTM5nIxxbf7MygLAtrEr9Z9SvQLZ_fII38x_G4xCrx3NliW49U8UV2K4CQ'
          },
          timestamp: new Date(post.createdAt).toLocaleString(),
          likes: post.likes || [],
          comments: post.comments || [],
          likedByUser,
          commentsList: post.comments || []
        }
      })
      
      setPosts(formattedPosts)
      console.log('Formatted posts set:', formattedPosts)
    } catch (error: any) {
      console.error('Failed to fetch posts:', error)
      console.error('Error details:', error?.response?.data || error?.message || 'Unknown error')
      // Fallback to mock posts if API fails
      console.log('Using fallback mock posts')
      setPosts(mockPosts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    
    // Check for new post from localStorage
    const newPost = localStorage.getItem('newPost')
    if (newPost) {
      const parsedPost = JSON.parse(newPost)
      setPosts(prev => [parsedPost, ...prev])
      localStorage.removeItem('newPost')
    }
  }, [])

  const handleLogout = () => {
    // Clear any authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="landingpage-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="material-symbols-outlined navbar-icon">auto_awesome</span>
            Postify
          </Link>
          <div className="navbar-actions">
            <Link to="/create-post" className="navbar-link">
              <span className="material-symbols-outlined">add_circle</span>
              Create New Post
            </Link>
            <button onClick={handleLogout} className="logout-button">
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="material-symbols-outlined">auto_awesome</span>
              NEW: MULTI-PLATFORM SYNC
            </div>
            <h1 className="hero-title">
              Elevate your <br/><span className="highlight">social presence</span>
            </h1>
            <p className="hero-description">
              The professional workspace for digital curators. Draft, schedule, and analyze your content across all platforms with atmospheric precision.
            </p>
            <div className="hero-actions">
              <Link to="/create-post" className="hero-button">
                <span className="material-symbols-outlined">add_circle</span>
                Create New Post
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img 
              alt="Dashboard Preview" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLzwp4eS1IPrVw11A70eRqpb89ivwmaKbvS_8qYNswUjdCIDgy57iyozciZ6V9vDrpzIdpBc3jbzSaAIbwO1f3nbpqPpRaI_NTESmnLkJa-n2A56qFdVY41tPifGhflFuUOvWgxEYufIufFyQxJAPAI69vWmVD98FwUD-j0oxanO8Behefn4I8AQsj6goy3e6OmeVMzR3nsHf8BCk-KCfxIAGkiS3UmiOuOElK1DlsHp9RCqaSKHF1dkGAgMdcu4kRGkagT4kHhVc"
            />
            <div className="hero-image-overlay">
              <div className="hero-image-stats">
                <div className="stat-card">
                  <div className="stat-number">2.5M+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">50M+</div>
                  <div className="stat-label">Posts Created</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">100+</div>
                  <div className="stat-label">Platforms</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Feed Section */}
      <section className="posts-section">
        <div className="posts-header">
          <h2 className="posts-title">Latest Posts</h2>
          <p className="posts-description">See what our community is sharing on their home feed</p>
          <button 
            onClick={fetchPosts}
            className="refresh-button"
          >
            🔄 Refresh Posts
          </button>
        </div>
        
        <div className="posts-container">
          <div className="posts-grid">
            {loading ? (
              <div className="loading-state">
                <SpinLoader size="large" text="Loading posts..." />
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
              ))
            ) : (
              <div className="empty-state">
                <span className="material-symbols-outlined empty-icon">chat_bubble_outline</span>
                <p className="empty-text">No posts yet. Be the first to share something!</p>
              </div>
            )}
          </div>
          
          {posts.length > 0 && (
            <div className="load-more-container">
              <button className="load-more-button">Load More Posts</button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
