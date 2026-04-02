import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API from '../api'

interface Post {
  id: string
  content: string
  image?: string
  author: {
    name: string
    avatar: string
  }
  timestamp: string
  likes: number
  comments: number
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
    likes: 42,
    comments: 8
  },
  {
    id: '2',
    content: 'Working on something big! The future of social media management is here. Stay tuned for our announcement next week. 🎯',
    author: {
      name: 'Mike Chen',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaAV3CQzCDHbrOl5zV7b_rqAsXnAN7izAx9HQqwIOrWOOeBMSBvTaVg45RI5dq54VDw2OQ3ZKAvJzgqdVv6xV1IvKv0kZSofSO205PEVnJO1LNd5gfhpN5vD4mqoczpXDE5yASMlwlf4fYl4foSORFwqHwSWXtwPn5I6SIUDCcMtfKgUr5cElNHK9S-6MG490i0p-NrIcwVOuatfaPWNtsod5cZOu-v66NZv_5l0zdjT_jCeoBSfcaRtI2htx379xv4mSrjYUVvGE'
    },
    timestamp: '5 hours ago',
    likes: 28,
    comments: 5
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
    likes: 67,
    comments: 12
  }
]

function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        
        <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
        
        {post.image && (
          <img 
            src={post.image} 
            alt="Post image"
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
        )}
        
        <div className="flex items-center gap-6 text-gray-500">
          <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined">favorite_border</span>
            <span className="text-sm">{post.likes}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
            <span className="material-symbols-outlined">chat_bubble_outline</span>
            <span className="text-sm">{post.comments}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch posts from API
  useEffect(() => {
    fetchPosts()
  }, [])

  // Check for newly created post in localStorage
  useEffect(() => {
    const newPost = localStorage.getItem('newPost')
    if (newPost) {
      const parsedPost = JSON.parse(newPost)
      setPosts(prev => [parsedPost, ...prev])
      localStorage.removeItem('newPost')
    }
  }, [])

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from API:', `${API}/posts`)
      const res = await axios.get(`${API}/posts`)
      console.log('Posts fetched from API:', res.data)
      
      const formattedPosts = res.data.map((post: any) => ({
        id: post._id,
        content: post.text,
        image: post.image,
        author: {
          name: post.username,
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCggTpFIL8KvpnYNPuxFANvscDLzSyx0epIZE19Y6pTbg8IA2l_UEfkwg2C33CpXaf4gd1uJ6euWNHtJVaVEciZTBAPsdbFWe0kIB32MqJ0Asx3K9Klwikmb7q8sjjbqH-7sFdhi318YCQ88dJo8uuwvSl71xtHiy_f_c33jgSJREE-ajXjyKZmLlTrLj2ZL3w1nrp4hqMGgjV2ggDVgGTM5nIxxbf7MygLAtrEr9Z9SvQLZ_fII38x_G4xCrx3NliW49U8UV2K4CQ'
        },
        timestamp: new Date(post.createdAt).toLocaleString(),
        likes: post.likes?.length || 0,
        comments: post.comments?.length || 0
      }))
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

  const handleLogout = () => {
    // Clear any authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Navigate to login page
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 h-16 border-b border-gray-100">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-gray-900">Postify</span>
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/" className="text-indigo-600 font-bold border-b-2 border-indigo-600 text-sm py-1">Home</Link>
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm py-1">Features</a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm py-1">About</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-sm text-gray-500 pr-2">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-48 text-gray-900 p-0" 
              placeholder="Search posts..." 
              type="text"
            />
          </div>
          <button className="material-symbols-outlined text-gray-500 p-2 hover:bg-gray-100 rounded-full transition-colors">
            notifications
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 px-6 bg-gradient-to-br from-indigo-50 to-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold tracking-wide">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                NEW: MULTI-PLATFORM SYNC
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 leading-[1.1]">
                Elevate your <br/><span className="text-indigo-600">social presence</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                The professional workspace for digital curators. Draft, schedule, and analyze your content across all platforms with atmospheric precision.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  to="/create-post"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Create New Post
                </Link>
                <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200">
                  View Live Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                  alt="Dashboard Preview" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-60" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLzwp4eS1IPrVw11A70eRqpb89ivwmaKbvS_8qYNswUjdCIDgy57iyozciZ6V9vDrpzIdpBc3jbzSaAIbwO1f3nbpqPpRaI_NTESmnLkJa-n2A56qFdVY41tPifGhflFuUOvWgxEYufIufFyQxJAPAI69vWmVD98FwUD-j0oxanO8Behefn4I8AQsj6goy3e6OmeVMzR3nsHf8BCk-KCfxIAGkiS3UmiOuOElK1DlsHp9RCqaSKHF1dkGAgMdcu4kRGkagT4kHhVc"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                        <span className="material-symbols-outlined">schedule</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold">Upcoming Post</div>
                        <div className="text-xs text-gray-500">Scheduled for 10:00 AM</div>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-indigo-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Purpose-built for growth</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Skip the clutter. Postify provides the exact tools you need to master your digital footprint without the noise.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[2rem] space-y-6 hover:translate-y-[-4px] transition-transform duration-300 shadow-sm">
                <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>calendar_month</span>
                </div>
                <h3 className="text-xl font-bold">Smart Scheduling</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI-driven timing suggestions that ensure your content hits the feed when your audience is most active.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[2rem] space-y-6 hover:translate-y-[-4px] transition-transform duration-300 shadow-sm">
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>query_stats</span>
                </div>
                <h3 className="text-xl font-bold">Depth Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Go beyond likes. Track conversion paths, sentiment analysis, and long-term retention metrics effortlessly.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[2rem] space-y-6 hover:translate-y-[-4px] transition-transform duration-300 shadow-sm">
                <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>hub</span>
                </div>
                <h3 className="text-xl font-bold">Multi-Platform Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  One workspace for LinkedIn, Instagram, X, and TikTok. Tailor your message for each platform in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Feed Section */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight">Latest Posts</h2>
              <p className="text-gray-600">See what our community is sharing on their home feed</p>
              <button 
                onClick={fetchPosts}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                🔄 Refresh Posts
              </button>
            </div>
            
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-4xl text-gray-400 animate-spin">refresh</span>
                  <p className="text-gray-500 mt-4">Loading posts...</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-4xl text-gray-400">post_add</span>
                  <p className="text-gray-500 mt-4">No posts yet. Be the first to create one!</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-12">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Load More Posts
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
            <div className="col-span-2 space-y-6">
              <span className="text-2xl font-bold tracking-tighter">Postify</span>
              <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
                The ultimate social architecture for modern brands and creators. Designed for clarity, built for results.
              </p>
              <div className="flex gap-4">
                <a className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all" href="#">
                  <span className="material-symbols-outlined text-sm">public</span>
                </a>
                <a className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all" href="#">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-sm">Product</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a className="hover:text-indigo-600" href="#">Scheduler</a></li>
                <li><a className="hover:text-indigo-600" href="#">Analytics</a></li>
                <li><a className="hover:text-indigo-600" href="#">Integrations</a></li>
                <li><a className="hover:text-indigo-600" href="#">Changelog</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-sm">Company</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a className="hover:text-indigo-600" href="#">About Us</a></li>
                <li><a className="hover:text-indigo-600" href="#">Careers</a></li>
                <li><a className="hover:text-indigo-600" href="#">Blog</a></li>
                <li><a className="hover:text-indigo-600" href="#">Press</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-sm">Support</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a className="hover:text-indigo-600" href="#">Help Center</a></li>
                <li><a className="hover:text-indigo-600" href="#">Status</a></li>
                <li><a className="hover:text-indigo-600" href="#">Privacy</a></li>
                <li><a className="hover:text-indigo-600" href="#">Terms</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="font-bold text-sm">Resources</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a className="hover:text-indigo-600" href="#">Guides</a></li>
                <li><a className="hover:text-indigo-600" href="#">Webinars</a></li>
                <li><a className="hover:text-indigo-600" href="#">Podcast</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-100 gap-6">
            <p className="text-xs text-gray-600">© 2024 Postify Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a className="text-xs text-gray-600 hover:text-gray-900" href="#">Privacy Policy</a>
              <a className="text-xs text-gray-600 hover:text-gray-900" href="#">Cookies</a>
              <a className="text-xs text-gray-600 hover:text-gray-900" href="#">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
