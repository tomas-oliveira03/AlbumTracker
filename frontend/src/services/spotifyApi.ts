import type { SearchResults } from '../types/spotify';

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust to your backend URL

export const searchSpotify = async (query: string, type: string): Promise<SearchResults> => {
  try {
    // This would connect to your backend API which in turn calls Spotify
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&type=${type}`);
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching Spotify:', error);
    throw error;
  }
};

export const connectSpotify = () => {
  // This would redirect to your backend's Spotify authorization endpoint
  window.location.href = `${API_BASE_URL}/auth/spotify`;
};
