const API_BASE_URL = '/api';

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

// Check if user is logged in (from cookie or localStorage)
export const isAuthenticated = (): boolean => {
  // Check for auth cookie
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const authCookie = cookies.find(cookie => cookie.startsWith('auth_tkeN='));
  
  // Also check localStorage as fallback
  const token = localStorage.getItem('token');
  
  return !!authCookie || !!token;
};

// Get the authentication token (from cookie or localStorage)
export const getAuthToken = (): string | null => {
  // First try to get from cookie
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const authCookie = cookies.find(cookie => cookie.startsWith('auth_tkeN='));
  
  if (authCookie) {
    return authCookie.split('=')[1];
  }
  
  // Fallback to localStorage
  return localStorage.getItem('token');
};

// Get the current user from localStorage
export const getStoredUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
  return null;
};

// Log out function
export const logout = async (): Promise<void> => {
  try {
    // Get the auth token
    const token = getAuthToken();
    
    // Call the server logout endpoint
    if (token) {
      await fetch(`${API_BASE_URL}/user/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Continue with client-side logout even if server call fails
  } finally {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cookie (by setting expiration in the past)
    document.cookie = 'auth_tkeN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Reload the page to reset state
    window.location.href = '/';
  }
};

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/user/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user profile');
  }

  return response.json();
};
