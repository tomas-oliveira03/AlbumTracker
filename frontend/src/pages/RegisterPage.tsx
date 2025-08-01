import React, { useState } from 'react';
const API_BASE_URL = '/api';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, displayName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to home page after successful registration
      window.history.pushState({}, '', '/');
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Or{' '}
            <a 
              href="/login" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/login');
                window.location.reload();
              }}
              className="font-medium text-spotify-green hover:text-green-500"
            >
              sign in to your account
            </a>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white focus:outline-none focus:ring-spotify-green focus:border-spotify-green focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">Display Name</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white focus:outline-none focus:ring-spotify-green focus:border-spotify-green focus:z-10 sm:text-sm"
                placeholder="Display Name"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white focus:outline-none focus:ring-spotify-green focus:border-spotify-green focus:z-10 sm:text-sm"
                placeholder="Password (min 8 characters)"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 placeholder-gray-500 text-white focus:outline-none focus:ring-spotify-green focus:border-spotify-green focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-spotify-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              window.location.reload();
            }}
            className="text-sm text-gray-400 hover:text-white"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
