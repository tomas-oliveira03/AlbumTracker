import type { SearchResults } from '../types/spotify';

// Use relative URL path when using Vite proxy
const API_BASE_URL = '/api';

export const searchSpotify = async (query: string, type: string): Promise<SearchResults> => {
  try {
    let url;
    
    // Handle different search types with appropriate endpoints
    if (type === 'artist') {
      url = `${API_BASE_URL}/search/artist?name=${encodeURIComponent(query)}`;
    } else if (type === 'album') {
      url = `${API_BASE_URL}/search/album?name=${encodeURIComponent(query)}`;
    } else if (type === 'track') {
      url = `${API_BASE_URL}/search/track?name=${encodeURIComponent(query)}`;
    } else {
      // Default for multiple types or other searches
      url = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&type=${type}`;
    }
    
    console.log(`Fetching from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Search failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Search response:', data);
    return data;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    throw error;
  }
};

export const getArtistInfo = async (id: string) => {
  try {
    const url = `${API_BASE_URL}/artist/${id}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch artist details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching artist:', error);
    throw error;
  }
};

export const getAlbumById = async (id: string) => {
  try {
    const url = `${API_BASE_URL}/album/${id}`;
    console.log(`Fetching album details from: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch album details: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Album details response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching album:', error);
    throw error;
  }
};

export const connectSpotify = () => {
  window.location.href = `${API_BASE_URL}/auth/spotify`;
};
