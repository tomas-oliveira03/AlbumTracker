import React, { useEffect, useState } from 'react';
import { getCurrentUser, type User, isAuthenticated, getAuthToken } from '../services/authApi';

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    // Check if user is authenticated before making the API call
    if (!isAuthenticated()) {
      console.log('Not authenticated, showing access denied');
      setAccessDenied(true);
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        if (!token) {
          setAccessDenied(true);
          return;
        }

        const userData = await getCurrentUser(token);
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        
        // If it's an authentication error (401), show access denied
        if (err instanceof Error && 
            (err.message.includes('Unauthorized') || 
             err.message.includes('Authentication') ||
             err.message.includes('401'))) {
          setAccessDenied(true);
          return;
        }
        
        setError(err instanceof Error ? err.message : 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleGoBack = () => {
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  const handleLogin = () => {
    window.history.pushState({}, '', '/login');
    window.location.reload();
  };

  const handleRegister = () => {
    window.history.pushState({}, '', '/register');
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Access Denied UI
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={handleGoBack}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>

          <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800 text-center">
            <svg className="w-20 h-20 mx-auto text-red-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m-6 0a6 6 0 1112 0 6 6 0 01-12 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-300 mb-8">You need to be logged in to view this page.</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={handleLogin}
                className="bg-transparent border border-white/30 hover:border-white text-white py-3 px-8 rounded-full transition-all text-lg font-medium"
              >
                Login
              </button>
              <button 
                onClick={handleRegister}
                className="bg-spotify-green hover:bg-green-500 text-white py-3 px-8 rounded-full transition-all transform hover:scale-105 text-lg font-medium"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800">
          <h1 className="text-3xl font-bold text-white mb-8">User Profile</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-10 h-10 border-t-2 border-b-2 border-spotify-green rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
              {error}
            </div>
          ) : user ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-spotify-green flex items-center justify-center text-white text-3xl font-bold">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm">Display Name</p>
                  <p className="text-white text-lg font-medium">{user.displayName}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white text-lg font-medium">{user.email}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm">User ID</p>
                  <p className="text-white text-lg font-medium break-all">{user.id}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm">Account Created</p>
                  <p className="text-white text-lg font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              No user data found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
