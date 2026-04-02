import React, { useState } from 'react';
import axios from 'axios';
import API from '../api';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email address.',
        confirmButtonColor: '#6366f1'
      });
      return false;
    }
    
    if (!password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Required',
        text: 'Please enter your password.',
        confirmButtonColor: '#6366f1'
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#6366f1'
      });
      return false;
    }
    
    return true;
  };

  const handleSocialLogin = (provider) => {
    Swal.fire({
      icon: 'info',
      title: `${provider} Login`,
      text: `${provider} authentication is coming soon!`,
      confirmButtonColor: '#6366f1',
      showClass: {
        popup: 'animate__animated animate__fadeIn'
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    // Show loading SweetAlert
    Swal.fire({
      title: 'Signing in...',
      text: 'Please wait while we verify your credentials',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: res.data.userId,
          userId: res.data.userId,
          username: res.data.username,
          email,
        })
      );
      
      // Show success SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome back, ${res.data.username}!`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          navigate('/feed');
        }
      });
    } catch (error) {
      console.error('Login failed:', error);
      
      // Show error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Please check your credentials and try again.',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Try Again',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center auth-gradient px-4 py-6 sm:px-6 sm:py-8">
      {/* Atmospheric Elements */}
      <div className="fixed top-20 left-4 sm:left-20 w-32 h-32 sm:w-64 sm:h-64 bg-primary-fixed/20 rounded-full blur-[80px] sm:blur-[120px] -z-10 hidden sm:block"></div>
      <div className="fixed bottom-20 right-4 sm:right-20 w-40 h-40 sm:w-80 sm:h-80 bg-tertiary-fixed/20 rounded-full blur-[100px] sm:blur-[140px] -z-10 hidden sm:block"></div>

      {/* Main Authentication Container */}
      <main className="w-full max-w-[420px] sm:max-w-[440px] z-10 mx-auto">
        {/* Header Branding */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary rounded-xl mb-2 sm:mb-3 lg:mb-4 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-on-primary text-xl sm:text-2xl lg:text-3xl" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tighter text-on-background mb-2">Postify</h1>
          <p className="text-on-surface-variant body-md font-medium text-xs sm:text-sm lg:text-base">Welcome back to your workspace</p>
        </div>

        {/* Login Card */}
        <div className="surface-container-lowest glass-effect rounded-xl shadow-[0_12px_40px_-12px_rgba(25,28,30,0.08)] p-4 sm:p-6 lg:p-8 border border-outline-variant/10">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase pl-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-outline text-base sm:text-lg lg:text-xl">
                  alternate_email
                </span>
                <input
                  className="w-full pl-9 sm:pl-11 lg:pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/60 text-sm sm:text-base"
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
              <div className="flex justify-between items-center px-1">
                <label className="block text-xs font-bold tracking-widest text-on-surface-variant uppercase" htmlFor="password">
                  Password
                </label>
                <a className="text-xs font-semibold text-primary hover:text-primary-container transition-colors" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-outline text-base sm:text-lg lg:text-xl">
                  lock
                </span>
                <input
                  className="w-full pl-9 sm:pl-11 lg:pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface placeholder:text-outline/60 text-sm sm:text-base"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Login Action */}
            <button
              className="w-full btn-primary-gradient text-on-primary font-bold py-3 sm:py-3.5 rounded-lg shadow-md hover:shadow-lg hover:opacity-95 transition-all transform active:scale-[0.98] text-sm sm:text-base"
              type="submit"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-surface-container-lowest px-3 sm:px-4 text-outline font-semibold text-xs">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button 
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 bg-white border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors shadow-sm"
            >
              <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBodmTDolR32owMyIPUwCxZDoRdJxKYH2h6vjKeFBeHtDq55Yd-KmdrhpV_79IagTwyd-hHdWCaEHibTS-rhCRal7G-BkkuicbRGDP2qwgHESz2g0ziV8wACqw1elmPmEf2iAZ2gYexUvWq2frlP6Ww7ytYsvGM3WQkGV3Kn2hPVuE_2diadnN5KOUOjsps-EGY6UWyOoPPPWnkx_QH-zQuMkzhYi9TkrEn8OtDu_Bx1Rpr8QLzvQQBfVClekLWIRqY6APKbGh1UzU"/>
              <span className="text-xs sm:text-sm font-semibold text-on-surface">Google</span>
            </button>
            <button 
              type="button"
              onClick={() => handleSocialLogin('Twitter')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 bg-white border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sky-500 text-lg sm:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                public
              </span>
              <span className="text-xs sm:text-sm font-semibold text-on-surface">Twitter</span>
            </button>
          </div>
        </div>

          <p className="mt-4 sm:mt-6 lg:mt-8 text-center text-on-surface-variant body-md font-medium text-xs sm:text-sm lg:text-base">
            Don't have an account? 
            <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1" to="/register">
              Create one
            </Link>
          </p>

        {/* Support/Legal */}
        <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-outline">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <span className="w-1 h-1 bg-outline-variant rounded-full hidden sm:block"></span>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <span className="w-1 h-1 bg-outline-variant rounded-full hidden sm:block"></span>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </main>
    </div>
  );
};

export default Login;
