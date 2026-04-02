import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreatePost() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    
    // Create new post object
    const newPost = {
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
    
    // Save to localStorage for demo purposes
    localStorage.setItem('newPost', JSON.stringify(newPost))
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back to Home</span>
          </button>
          <h1 className="text-xl font-semibold">Create Post</h1>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 pb-6">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCggTpFIL8KvpnYNPuxFANvscDLzSyx0epIZE19Y6pTbg8IA2l_UEfkwg2C33CpXaf4gd1uJ6euWNHtJVaVEciZTBAPsdbFWe0kIB32MqJ0Asx3K9Klwikmb7q8sjjbqH-7sFdhi318YCQ88dJo8uuwvSl71xtHiy_f_c33jgSJREE-ajXjyKZmLlTrLj2ZL3w1nrp4hqMGgjV2ggDVgGTM5nIxxbf7MygLAtrEr9Z9SvQLZ_fII38x_G4xCrx3NliW49U8UV2K4CQ"
              alt="Your avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">Your Name</h3>
              <p className="text-sm text-gray-500">Posting to your feed</p>
            </div>
          </div>

          {/* Content Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share your thoughts with the community..."
              className="w-full min-h-[150px] resize-none border-none focus:ring-0 text-gray-900 placeholder-gray-500 text-lg leading-relaxed"
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {content.length}/500
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Add Image</h3>
              <span className="text-sm text-gray-500">Optional</span>
            </div>
            
            {selectedImage ? (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Selected image"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">add_photo_alternate</span>
                  <p className="text-gray-600">Click to upload an image</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
            )}
          </div>

          {/* Posting Options */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Post Options</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Allow comments</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700">Enable sharing</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
