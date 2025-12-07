import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { Button, Card, Input } from '../components/UI';
import { UserProfile } from '../types';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Login: React.FC<{ onLogin: (user: UserProfile) => void }> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    // Simulate Email/Password Authentication
    setTimeout(() => {
      setLoading(false);
      onLogin({
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        provider: 'email'
      });
      navigate('/');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setError('');
    setGoogleLoading(true);
    
    // For a real implementation, you would use Google OAuth 2.0:
    // 1. Redirect to: https://accounts.google.com/o/oauth2/v2/auth
    // 2. With parameters: client_id, redirect_uri, scope, response_type
    // 3. Handle callback with authorization code
    // 4. Exchange code for access token
    // 5. Get user info from Google API
    
    // Demo: Simulating successful Google login
    setTimeout(() => {
      setGoogleLoading(false);
      
      // Generate random user data to simulate different Google accounts
      const randomUsers = [
        {
          id: 'google_' + Date.now(),
          name: 'Alex Morgan',
          email: 'alex.morgan@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          provider: 'google' as const
        },
        {
          id: 'google_' + Date.now(),
          name: 'Sarah Johnson',
          email: 'sarah.j@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          provider: 'google' as const
        },
        {
          id: 'google_' + Date.now(),
          name: 'Michael Chen',
          email: 'mchen@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          provider: 'google' as const
        }
      ];
      
      const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      onLogin(randomUser);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4 shadow-sm">
            <Shield size={40} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your CryptoToolbox account
          </p>
        </div>
        
        {/* Demo Warning */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-sm rounded-lg border border-yellow-200 dark:border-yellow-800">
          <strong>⚠️ Demo Mode:</strong> This is a simulated authentication for demonstration purposes only. Click "Sign in with Google" to simulate federated login with a random Google account.
        </div>
        
        {googleLoading && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded-lg border border-blue-200 dark:border-blue-800 animate-pulse">
            <strong>🔄 Authenticating...</strong> Connecting to Google OAuth service...
          </div>
        )}

        <Card className="p-8 shadow-lg border-t-4 border-t-primary-500">
          <div className="space-y-4 mb-6">
            <Button
              variant="outline"
              className="w-full relative bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 h-11 transition-all"
              onClick={handleGoogleLogin}
              isLoading={googleLoading}
              disabled={loading || googleLoading}
            >
              {!googleLoading && <GoogleIcon />}
              {googleLoading ? 'Connecting to Google...' : 'Sign in with Google'}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-slate-800 px-2 text-gray-500">
                  Or sign in with email
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              name="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              required
              autoFocus
              disabled={loading || googleLoading}
            />
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={loading || googleLoading}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={loading} disabled={googleLoading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-slate-800 px-2 text-gray-500">
                  Or continue without account
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full hover:bg-gray-50 dark:hover:bg-slate-700" 
                onClick={() => navigate('/')}
                disabled={loading || googleLoading}
              >
                Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;