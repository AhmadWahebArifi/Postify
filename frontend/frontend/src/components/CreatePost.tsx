import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API from '../api'

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-xl bg-white/90">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back to Home</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Info */}
          <div className="flex items-center gap-4 pb-8">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCggTpFIL8KvpnYNPuxFANvscDLzSyx0epIZE19Y6pTbg8IA2l_UEfkwg2C33CpXaf4gd1uJ6euWNHtJVaVEciZTBAPsdbFWe0kIB32MqJ0Asx3K9Klwikmb7q8sjjbqH-7sFdhi318YCQ88dJo8uuwvSl71xtHiy_f_c33jgSJREE-ajXjyKZmLlTrLj2ZL3w1nrp4hqMGgjV2ggDVgGTM5nIxxbf7MygLAtrEr9Z9SvQLZ_fII38x_G4xCrx3NliW49U8UV2K4CQ"
              alt="Your avatar"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-100"
            />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Your Name</h3>
              <p className="text-sm text-gray-500">Share your thoughts with the community</p>
            </div>
          </div>

          {/* Content Input */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share your thoughts, ideas, or updates with the community..."
              className="w-full min-h-[200px] resize-none border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-xl leading-relaxed"
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500 mt-4">
              {content.length}/500 characters
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900">Add Image</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Optional</span>
            </div>
            
            {selectedImage ? (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Selected image"
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                  <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">add_photo_alternate</span>
                  <p className="text-xl text-gray-600 font-medium mb-2">Click to upload an image</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
            )}
          </div>

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
