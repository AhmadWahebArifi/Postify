import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api';
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = () => {
    if (!username.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Username Required',
        text: 'Please enter a username.',
        confirmButtonColor: '#6366f1',
      });
      return false;
    }

    if (!email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email address.',
        confirmButtonColor: '#6366f1',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#6366f1',
      });
      return false;
    }

    if (!password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Required',
        text: 'Please enter a password.',
        confirmButtonColor: '#6366f1',
      });
      return false;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords Do Not Match',
        text: 'Please make sure both passwords match.',
        confirmButtonColor: '#6366f1',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    Swal.fire({
      title: 'Creating your account...',
      text: 'Please wait',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await axios.post(`${API}/register`, { username, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: res.data.userId,
          userId: res.data.userId,
          username: res.data.username,
          email,
        })
      );
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: `Welcome, ${res.data.username}!`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          navigate('/feed');
        },
      });
    } catch (error) {
      console.error('Register failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Register failed. Try a different email.',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center auth-gradient p-6">
      {/* Atmospheric Elements */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-primary-fixed/20 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-tertiary-fixed/20 rounded-full blur-[140px] -z-10"></div>

      {/* Main Authentication Container */}
      <main className="w-full max-w-[440px] z-10">
        {/* Header Branding */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-xl mb-4 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-on-primary text-3xl" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>
              person_add
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-on-background mb-2">Join Postify</h1>
          <p className="text-on-surface-variant body-md font-medium">Create your account to get started</p>
        </div>

        {/* Register Card */}
        <div className="surface-container-lowest glass-effect rounded-xl shadow-[0_12px_40px_-12px_rgba(25,28,30,0.08)] p-10 border border-outline-variant/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase pl-1" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                  person
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/60"
                  id="username"
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase pl-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                  alternate_email
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/60"
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase pl-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/60"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase pl-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
                  lock_reset
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/60"
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Register Action */}
            <button
              className="w-full btn-primary-gradient text-on-primary font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg hover:opacity-95 transition-all transform active:scale-[0.98]"
              type="submit"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-surface-container-lowest px-4 text-outline font-semibold">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors shadow-sm">
              <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBodmTDolR32owMyIPUwCxZDoRdJxKYH2h6vjKeFBeHtDq55Yd-KmdrhpV_79IagTwyd-hHdWCaEHibTS-rhCRal7G-BkkuicbRGDP2qwgHESz2g0ziV8wACqw1elmPmEf2iAZ2gYexUvWq2frlP6Ww7ytYsvGM3WQkGV3Kn2hPVuE_2diadnN5KOUOjsps-EGY6UWyOoPPPWnkx_QH-zQuMkzhYi9TkrEn8OtDu_Bx1Rpr8QLzvQQBfVClekLWIRqY6APKbGh1UzU"/>
              <span className="text-sm font-semibold text-on-surface">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors shadow-sm">
              <span className="material-symbols-outlined text-sky-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                public
              </span>
              <span className="text-sm font-semibold text-on-surface">Twitter</span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <p className="mt-8 text-center text-on-surface-variant body-md font-medium">
          Already have an account? 
          <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1" to="/login">
            Sign in
          </Link>
        </p>

        {/* Support/Legal */}
        <div className="mt-16 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-outline">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </main>
    </div>
  );
};

export default Register;
