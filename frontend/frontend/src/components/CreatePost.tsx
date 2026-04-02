import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API from '../api'
import './CreatePost.css'

export default function CreatePost() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 10MB now)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      alert('Please write some content for your post')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first')
      navigate('/login')
      return
    }

    setIsSubmitting(true)
    
    try {
      console.log('Creating post with API:', `${API}/posts`)
      console.log('Token:', token.substring(0, 20) + '...')
      console.log('Has image:', !!selectedImage)
      console.log('Image size:', selectedImage ? selectedImage.length : 0)
      
      // Always include image if selected
      const postData: any = {
        text: content
      }

      if (selectedImage) {
        postData.image = selectedImage
        console.log('Including image in post data')
      }

      const res = await axios.post(`${API}/posts`, postData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      console.log('Post created successfully:', res.data)

      // Create post object for localStorage display
      const newPost = {
        id: res.data._id,
        content: res.data.text,
        image: res.data.image,
        author: {
          name: res.data.username,
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggTpFIL8KvpnYNPuxFANvscDLzSyx0epIZE19Y6pTbg8IA2l_UEfkwg2C33CpXaf4gd1uJ6euWNHtJVaVEciZTBAPsdbFWe0kIB32MqJ0Asx3K9Klwikmb7q8sjjbqH-7sFdhi318YCQ88dJo8uuwvSl71xtHiy_f_c33jgSJREE-ajXjyKZmLlTrLj2ZL3w1nrp4hqMGgjV2ggDVgGTM5nIxxbf7MygLAtrEr9Z9SvQLZ_fII38x_G4xCrx3NliW49U8UV2K4CQ'
        },
        timestamp: 'Just now',
        likes: res.data.likes?.length || 0,
        comments: res.data.comments?.length || 0
      }
      
      // Save to localStorage for immediate display
      localStorage.setItem('newPost', JSON.stringify(newPost))
      
      // Show success message and navigate after a short delay
      alert('Post created successfully!')
      setTimeout(() => {
        navigate('/')
      }, 500)
    } catch (error: any) {
      console.error('Failed to create post:', error)
      console.error('Error response:', error?.response?.data)
      console.error('Error status:', error?.response?.status)
      
      // Fallback: save post locally even if API fails
      const fallbackPost = {
        id: Date.now().toString(),
        content,
        image: selectedImage,
        author: {
          name: 'Your Name',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggTpFIL8KvpnYNPuxFANvscDLzSyx0epIZE19Y6pTbg8IA2l_UEfkwg2C33CpXaf4gd1uJ6euWNHtJVaVEciZTBAPsdbFWe0kIB32MqJ0Asx3K9Klwikmb7q8sjjbqH-7sFdhi318YCQ88dJo8uuwvSl71xtHiy_f_c33jgSJREE-ajXjyKZmLlTrLj2ZL3w1nrp4hqMGgjV2ggDVgGTM5nIxxbf7MygLAtrEr9Z9SvQLZ_fII38x_G4xCrx3NliW49U8UV2K4CQ'
        },
        timestamp: 'Just now',
        likes: 0,
        comments: 0
      }
      
      localStorage.setItem('newPost', JSON.stringify(fallbackPost))
      
      alert(`Backend error: ${error?.response?.data || error?.message}. Post saved locally.`)
      setTimeout(() => {
        navigate('/')
      }, 500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="createpost-container">
      {/* Header */}
      <header className="createpost-header">
        <div className="createpost-header-content">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Feed
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              navigate('/login')
            }}
            className="logout-button"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="createpost-main">
        <form onSubmit={handleSubmit} className="createpost-form">
          <div className="form-header">
            <h1 className="createpost-title">Create New Post</h1>
            <p className="createpost-subtitle">Share your thoughts with the community</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              What's on your mind?
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-textarea"
              placeholder="Share your thoughts, ideas, or anything interesting..."
              required
            />
            <div className={`character-count ${content.length > 500 ? 'error' : content.length > 400 ? 'warning' : ''}`}>
              {content.length}/500
            </div>
          </div>

          <div className="image-upload-section">
            <label htmlFor="image-upload" className="image-upload-label">
              <span className="material-symbols-outlined image-upload-icon">add_photo_alternate</span>
              <span className="image-upload-text">Click to upload an image</span>
              <span className="image-upload-hint">PNG, JPG, GIF up to 10MB</span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-input"
            />
            
            {selectedImage && (
              <div className="image-preview">
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="image-preview-img"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="remove-image-button"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="submit-button"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined loading-spinner">refresh</span>
                Publishing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Publish Post
              </>
            )}
          </button>
          {/* Posting Options */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Post Options</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-600">chat</span>
                  <span className="text-gray-700 font-medium">Allow comments</span>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-600">share</span>
                  <span className="text-gray-700 font-medium">Enable sharing</span>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(!content.trim() && !selectedImage) || isSubmitting}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Publishing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">send</span>
                  Publish Post
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
