import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock login function - replace with your actual logic
  const handleLogin = async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (credentials.email === 'error@test.com') {
      throw new Error('Invalid email or password');
    }
    console.log('Login successful!', credentials);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await handleLogin({ email, password });
      // Add your navigation logic here
      alert('Login successful! Redirecting to dashboard...');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '320px',
        margin: '0 auto'
      }}>
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h1>
            <p className="text-gray-600 text-xs">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 border-l-4 border-red-400 rounded">
              <div className="flex items-start">
                <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-red-700 text-xs font-medium">{error}</p>
              </div>
            </div>
          )}

          <div onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-8 pr-2.5 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-xs"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Lock className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-8 pr-8 py-2.5 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-xs text-gray-600">Remember me</span>
              </label>
              <button 
                type="button" 
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2.5 px-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500 font-medium">Or sign in with</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button type="button" className="flex items-center justify-center px-2 py-2 border border-gray-200 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200 group">
              <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">Google</span>
            </button>
            
            <button type="button" className="flex items-center justify-center px-2 py-2 border border-gray-200 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200 group">
              <svg className="w-3.5 h-3.5 mr-1.5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">Facebook</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-xs text-gray-600">
              Don't have an account?{' '}
              <button 
                type="button"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;