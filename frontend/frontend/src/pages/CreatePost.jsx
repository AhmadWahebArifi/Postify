import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Swal from 'sweetalert2';

const CreatePost = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const shouldBeDark = stored === 'dark' || (!stored && window.matchMedia?.('(prefers-color-scheme: dark)')?.matches);
    setIsDark(Boolean(shouldBeDark));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    const base64 = await fileToBase64(file);
    setImage(base64);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    await handleFile(file);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please login first to create a post',
        confirmButtonColor: '#4F46E5',
      });
      navigate('/login');
      return;
    }

    if (!text.trim() && !image.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Content Required',
        text: 'Post must contain text or image',
        confirmButtonColor: '#4F46E5',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Show loading Sweet Alert
    Swal.fire({
      title: 'Creating Post...',
      html: 'Please wait while we publish your post',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await axios.post(
        `${API}/posts`,
        { text, image },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setText('');
      setImage('');
      
      // Show success Sweet Alert
      Swal.fire({
        icon: 'success',
        title: 'Post Published!',
        text: 'Your post has been successfully published',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      }).then(() => {
        navigate('/feed');
      });
    } catch (error) {
      console.error('Failed to create post:', error);
      Swal.fire({
        icon: 'error',
        title: 'Publishing Failed',
        text: error?.response?.data?.message || error?.response?.data || 'Failed to create post',
        confirmButtonColor: '#4F46E5',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased overflow-hidden h-screen">
      {isSidebarOpen && (
        <button
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`h-screen w-64 fixed left-0 top-0 bg-[#f2f4f6] dark:bg-slate-900 flex flex-col p-4 z-50 transition-transform lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:block`}
      >
        <div className="flex items-center gap-3 px-4 py-6 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-lg">architecture</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Digital Architect</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Pro Workspace</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <a
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-xl"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 bg-[#4F46E5] text-white rounded-full px-4 py-2.5 shadow-sm" href="#">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="font-medium">Content Calendar</span>
          </a>
          <a
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-xl"
            href="#"
          >
            <span className="material-symbols-outlined">leaderboard</span>
            <span className="font-medium">Analytics</span>
          </a>
          <a
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-xl"
            href="#"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-medium">Audience</span>
          </a>
          <a
            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 px-4 py-2.5 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors rounded-xl"
            href="#"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium">Settings</span>
          </a>
        </nav>

        <div className="mt-auto p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white/20">
          <p className="text-xs font-semibold text-on-surface-variant mb-3">WORKSPACE USAGE</p>
          <div className="w-full bg-surface-container rounded-full h-1.5 mb-2">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-[10px] text-on-surface-variant">65% of monthly posts used</p>
        </div>
      </aside>

      <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex justify-between items-center px-4 lg:px-8 z-40">
        <div className="flex items-center gap-6">
          <button
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all lg:hidden"
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-full min-w-[320px]">
            <span className="material-symbols-outlined text-outline text-xl">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline"
              placeholder="Search content, tags, or media..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all opacity-80 hover:opacity-100"
            type="button"
            onClick={() => setIsDark((v) => !v)}
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>

          <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all opacity-80 hover:opacity-100">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all opacity-80 hover:opacity-100">
            <span className="material-symbols-outlined">help</span>
          </button>

          <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden lg:block"></div>

          <div className="items-center gap-3 hidden lg:flex">
            <div className="text-right">
              <p className="text-sm font-semibold leading-none">Alex Rivers</p>
              <p className="text-[10px] text-on-surface-variant font-medium mt-1">Creative Director</p>
            </div>
            <img
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIOAlMxgNSg0zbnE9xAzKd1f0ugyb5grn5HM98s5qgD2IhCBEOH_ovYddSlmclD73-1Ww26QIxdlcoEnIRzldsD5D2dCrK7s0WG6Yfy5mPUUkPiM2kiaB5DqNBBpHFyWebezRWekVFY6Uxxp-S32lO_6UThzH_j9LPp4H5odMQ2K-9YOmWbO3_tKNl2wLtK5lHTBqplALZfTgG7W8NLy7MW2NZfoFCw0bYgVpnrih6e5NQhdhUr6JfNx1ieB0XMKbZnV9lYL24WYo"
            />
          </div>
        </div>
      </header>

      <main className="lg:ml-64 pt-16 h-screen overflow-y-auto no-scrollbar bg-surface">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-12 gap-6 lg:gap-8">
          <div className="col-span-12 mb-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-1">Create Post</h2>
                <p className="text-on-surface-variant body-md">Share your thoughts with the community</p>
              </div>
              <button
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={handleSubmit}
                type="button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_12px_40px_-12px_rgba(25,28,30,0.06)] flex flex-col min-h-[500px]">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">Create Your Post</label>
                <textarea
                  className="w-full text-xl font-medium text-on-surface placeholder:text-outline/40 border-none focus:ring-0 resize-none min-h-[300px] leading-relaxed"
                  placeholder="What's on your mind?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
              </div>

              <div
                className="mt-4 p-4 rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low/50 flex flex-col items-center justify-center group hover:border-primary/30 transition-all"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <span className="material-symbols-outlined text-3xl text-outline mb-2 group-hover:text-primary transition-colors">add_a_photo</span>
                <p className="text-sm text-on-surface-variant font-medium">Drag &amp; drop images or video</p>
                <p className="text-xs text-outline mt-1">Supports PNG, JPG up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    await handleFile(file);
                    e.target.value = '';
                  }}
                />
                <button
                  className="mt-3 px-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs font-semibold hover:bg-surface-container-low transition-colors"
                  type="button"
                  onClick={handlePickFile}
                >
                  Choose Image
                </button>
              </div>

              {image && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-on-surface-variant">Image Preview</p>
                    <button
                      className="text-xs font-semibold text-primary hover:underline"
                      type="button"
                      onClick={() => setImage('')}
                    >
                      Remove
                    </button>
                  </div>
                  <img src={image} alt="Preview" className="w-full rounded-xl border border-outline-variant/30" />
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                    <span className="material-symbols-outlined">image</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                    <span className="material-symbols-outlined">mood</span>
                  </button>
                </div>
              </div>
            </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold tracking-tight">Live Preview</h3>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden border border-surface-container-low">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-primary/20"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_vwLH4IyCygkMrMHwu5pPiQnMS6p7L4N4gtG3mf3kYaJRFRswzxpEQfzispLR00-xnvwNDXEnbkRtTu9Zt2PZbQ6r5BvlXedTN5-Z7J5R3s1QplbCrNn8ZI-LaYSm9cr2QLw1HmSEtX5gSZ_GhqWSNivjj0BtUydVredMSnYe2YvuiPrt8PgzhRHay8pvyun61a-x3N7h5Oauzq0wtSkzWt_YiHYQICf4BflckSLNMUNSEJtmS_HSnHFdhAtnBVbTLFHdlqMM8dk"
                      />
                      <div>
                        <p className="text-xs font-bold leading-none">Your Post</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">Just now</p>
                      </div>
                    </div>
                  </div>

                  {text && (
                    <div className="px-4 pb-3">
                      <p className="text-sm leading-relaxed">{text}</p>
                    </div>
                  )}

                  {image && (
                    <div className="aspect-square bg-surface-container-low flex items-center justify-center">
                      <img
                        alt="Preview"
                        className="w-full h-full object-cover"
                        src={image}
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-xl">favorite_border</span>
                        <span className="material-symbols-outlined text-xl">chat_bubble_outline</span>
                        <span className="material-symbols-outlined text-xl">send</span>
                      </div>
                      <span className="material-symbols-outlined text-xl">bookmark_border</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
