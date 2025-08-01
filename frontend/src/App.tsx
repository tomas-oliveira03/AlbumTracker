import { useState, useEffect, useRef } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/results/SearchResults';
import ArtistDetail from './components/ArtistDetail';
import AlbumDetail from './components/AlbumDetail';
import TrackDetail from './components/TrackDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import { getArtistInfo, getAlbumById, getTrackById } from './services/spotifyApi';
import { isAuthenticated, getStoredUser, logout, type User as AuthUser } from './services/authApi';
import type { SearchResults as SearchResultsType, Artist, Album, Track } from './types/spotify';
import { searchSpotify } from './services/spotifyApi';
import './App.css';

interface ArtistDetailData {
  artist: Artist;
  albums: Album[];
}

// Interface for tracking in-flight requests
interface RequestTracking {
  albumRequests: Record<string, boolean>;
  trackRequests: Record<string, boolean>;
  artistRequests: Record<string, boolean>;
  searchRequests: Record<string, boolean>;
}

function App() {
  const [searchResults, setSearchResults] = useState<SearchResultsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<{query: string, type: string}>({
    query: '',
    type: 'track,album,artist'
  });
  const [artistData, setArtistData] = useState<ArtistDetailData | null>(null);
  const [, setArtistLoading] = useState(false);
  
  // Add auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  
  // Use ref to track in-flight requests to prevent duplicates
  const inFlightRequests = useRef<RequestTracking>({
    albumRequests: {},
    trackRequests: {},
    artistRequests: {},
    searchRequests: {},
  });

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        // Try to get user from localStorage
        const user = getStoredUser();
        if (user) {
          setCurrentUser(user);
        }
      }
    };
    
    checkAuth();
  }, []);

  // Parse URL and update state based on current location
  const handleUrlChange = () => {
    const path = window.location.pathname;
    
    // Check if we're on a login or register page
    if (path === '/login' || path === '/register') {
      return;
    }
    
    // Check if we're viewing a track page
    if (path.startsWith('/track/')) {
      const trackId = path.substring('/track/'.length);
      if (trackId) {
        // If we don't have this track loaded, we should fetch it
        if (!selectedTrack || selectedTrack.id !== trackId) {
          loadTrack(trackId);
        }
      }
    }
    // Check if we're viewing an album page
    else if (path.startsWith('/album/')) {
      const albumId = path.substring('/album/'.length);
      if (albumId) {
        // If we don't have this album loaded, we should fetch it
        if (!selectedAlbum || selectedAlbum.id !== albumId) {
          loadAlbum(albumId);
        }
      }
    }
    // Check if we're viewing an artist page
    else if (path.startsWith('/artist/')) {
      const artistId = path.substring('/artist/'.length);
      if (artistId) {
        // If we don't have this artist loaded, we should fetch it
        if (!artistData || artistData.artist.id !== artistId) {
          loadArtist(artistId);
        }
      }
    }
    // Check if we're on a search path
    else if (path.startsWith('/search/')) {
      // Clear selected artist, album, and track when navigating to search
      setSelectedArtist(null);
      setSelectedAlbum(null);
      setSelectedTrack(null);
      
      const searchParamsString = path.substring('/search/'.length);
      const params = new URLSearchParams(searchParamsString);
      
      const type = params.get('type');
      const name = params.get('name');
      
      if (type && name) {
        // Only perform search if params changed
        if (searchParams.query !== name || searchParams.type !== type) {
          setSearchParams({
            query: name,
            type: type
          });
          
          // Create a request key
          const requestKey = `${name}:${type}`;
          
          // Only make the request if it's not already in flight
          if (!inFlightRequests.current.searchRequests[requestKey]) {
            inFlightRequests.current.searchRequests[requestKey] = true;
            
            setIsLoading(true);
            searchSpotify(name, type)
              .then(results => {
                setSearchResults(results);
                setIsLoading(false);
              })
              .catch(error => {
                console.error('Search failed:', error);
                setIsLoading(false);
              })
              .finally(() => {
                // Remove the request from tracking once complete
                delete inFlightRequests.current.searchRequests[requestKey];
              });
          }
        }
      }
    }
    // Home page (root path)
    else if (path === '/') {
      setSelectedArtist(null);
      setSelectedAlbum(null);
      setSelectedTrack(null);
      setSearchResults(null);
    }
  };

  const loadArtist = async (artistId: string) => {
    // Check if this artist request is already in flight
    if (inFlightRequests.current.artistRequests[artistId]) {
      return;
    }
    
    // Mark this request as in flight
    inFlightRequests.current.artistRequests[artistId] = true;
    
    setArtistLoading(true);
    try {
      const data = await getArtistInfo(artistId);
      setArtistData(data);
      setSelectedArtist(data.artist);
    } catch (error) {
      console.error('Failed to load artist:', error);
      // Fallback to home page if artist can't be loaded
      window.history.pushState({}, '', '/');
      setSelectedArtist(null);
    } finally {
      setArtistLoading(false);
      // Remove from in-flight tracking
      delete inFlightRequests.current.artistRequests[artistId];
    }
  };

  const loadAlbum = async (albumId: string) => {
    // Check if this album request is already in flight
    if (inFlightRequests.current.albumRequests[albumId]) {
      return;
    }
    
    // Mark this request as in flight
    inFlightRequests.current.albumRequests[albumId] = true;
    
    setDetailsLoading(true);
    try {
      const data = await getAlbumById(albumId);
      setSelectedAlbum(data);
      setSelectedArtist(null);
    } catch (error) {
      console.error('Failed to load album:', error);
      // Fallback to home page if album can't be loaded
      window.history.pushState({}, '', '/');
      setSelectedAlbum(null);
    } finally {
      setDetailsLoading(false);
      // Remove from in-flight tracking
      delete inFlightRequests.current.albumRequests[albumId];
    }
  };

  const loadTrack = async (trackId: string) => {
    // Check if this track request is already in flight
    if (inFlightRequests.current.trackRequests[trackId]) {
      return;
    }
    
    // Mark this request as in flight
    inFlightRequests.current.trackRequests[trackId] = true;
    
    setDetailsLoading(true);
    try {
      const data = await getTrackById(trackId);
      setSelectedTrack(data);
      setSelectedArtist(null);
      setSelectedAlbum(null);
    } catch (error) {
      console.error('Failed to load track:', error);
      // Fallback to home page if track can't be loaded
      window.history.pushState({}, '', '/');
      setSelectedTrack(null);
    } finally {
      setDetailsLoading(false);
      // Remove from in-flight tracking
      delete inFlightRequests.current.trackRequests[trackId];
    }
  };

  // Initial URL parsing on component mount
  useEffect(() => {
    handleUrlChange();
    
    // Add listener for browser back/forward navigation
    window.addEventListener('popstate', handleUrlChange);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleSearch = async (query: string, type: string) => {
    // Clear the detail views when performing a new search
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setSelectedTrack(null);
    
    // Update URL with search parameters in the path
    const searchParams = new URLSearchParams();
    searchParams.set('type', type);
    searchParams.set('name', query);
    
    // Update the URL without refreshing the page
    const newUrl = `/search/${searchParams.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    // Update searchParams state when a new search is performed
    setSearchParams({ query, type });
    
    // Create a request key
    const requestKey = `${query}:${type}`;
    
    // Only make the request if it's not already in flight
    if (!inFlightRequests.current.searchRequests[requestKey]) {
      inFlightRequests.current.searchRequests[requestKey] = true;
      
      setIsLoading(true);
      try {
        const results = await searchSpotify(query, type);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
        // Remove the request from tracking once complete
        delete inFlightRequests.current.searchRequests[requestKey];
      }
    }
  };

  // Add a click handler for the app logo to return to home
  const handleHomeClick = () => {
    // Clear all states to return to home
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setSelectedTrack(null);
    setSearchResults(null);
    setSearchParams({
      query: '',
      type: 'track,album,artist'
    });
    
    // Update URL to home
    window.history.pushState({}, '', '/');
  };

  const handleViewArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setSelectedAlbum(null);
    setSelectedTrack(null);
    
    // Clean URL - use a simple /artist/id pattern
    const newUrl = `/artist/${artist.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    // Load artist details
    loadArtist(artist.id);
    
    // Scroll to top when viewing artist
    window.scrollTo(0, 0);
  };

  const handleViewAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setSelectedArtist(null);
    setSelectedTrack(null);
    
    // Clean URL - use a simple /album/id pattern
    const newUrl = `/album/${album.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    // Load album details
    loadAlbum(album.id);
    
    // Scroll to top when viewing album
    window.scrollTo(0, 0);
  };

  // Add track view handler
  const handleViewTrack = (track: Track) => {
    setSelectedTrack(track);
    setSelectedAlbum(null);
    setSelectedArtist(null);
    
    // Clean URL - use a simple /track/id pattern
    const newUrl = `/track/${track.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    // Load track details
    loadTrack(track.id);
    
    // Scroll to top when viewing track
    window.scrollTo(0, 0);
  };

  const handleBackToSearch = () => {
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setSelectedTrack(null);
    
    // Check if we have active search params to return to
    if (searchParams.query) {
      // Rebuild the search URL
      const params = new URLSearchParams();
      params.set('type', searchParams.type);
      params.set('name', searchParams.query);
      
      const newUrl = `/search/${params.toString()}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else {
      // No search was performed, just go to home
      window.history.pushState({}, '', '/');
    }
  };

  // Navigate to login page
  const handleLoginClick = () => {
    window.history.pushState({}, '', '/login');
    window.location.reload();
  };

  // Navigate to register page
  const handleRegisterClick = () => {
    window.history.pushState({}, '', '/register');
    window.location.reload();
  };

  // Navigate to profile page
  const handleProfileClick = () => {
    window.history.pushState({}, '', '/profile');
    window.location.reload();
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };


  // Render appropriate content based on the current path
  if (window.location.pathname === '/login') {
    return <LoginPage />;
  }
  
  if (window.location.pathname === '/register') {
    return <RegisterPage />;
  }
  
  if (window.location.pathname === '/profile') {
    return <UserProfilePage />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header with blurred background effect - full width */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800 w-full">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3">
          <h1 
            className="text-3xl font-bold text-spotify-green cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleHomeClick}
          >
            Album Tracker
          </h1>
          <div className="w-full max-w-3xl">
            <SearchBar 
              onSearch={handleSearch} 
              initialQuery={searchParams.query} 
              initialType={searchParams.type}
            />
          </div>
          <div className="flex space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span 
                  className="text-gray-300 hover:text-white cursor-pointer transition-colors"
                  onClick={handleProfileClick}
                >
                  {currentUser?.displayName || 'User'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="whitespace-nowrap bg-transparent border border-gray-700 hover:border-white text-white py-2 px-6 rounded-full transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleLoginClick}
                  className="whitespace-nowrap bg-transparent border border-gray-700 hover:border-white text-white py-2 px-6 rounded-full transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={handleRegisterClick}
                  className="whitespace-nowrap bg-spotify-green hover:bg-green-500 text-white py-2 px-6 rounded-full transition-all transform hover:scale-105 font-medium"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content - full width */}
      <main className="flex-grow w-full">
        {/* Show track detail if a track is selected */}
        {selectedTrack ? (
          <div className="w-full px-4 py-8">
            <TrackDetail 
              track={selectedTrack} 
              isLoading={detailsLoading}
              onBack={handleBackToSearch} 
              onViewArtist={handleViewArtist}
              onViewAlbum={handleViewAlbum}
            />
          </div>
        ) : selectedAlbum ? (
          <div className="w-full px-4 py-8">
            <AlbumDetail 
              album={selectedAlbum} 
              isLoading={detailsLoading}
              onBack={handleBackToSearch} 
              onViewArtist={handleViewArtist}
              onViewTrack={handleViewTrack}
            />
          </div>
        ) : selectedArtist ? (
          <div className="w-full px-4 py-8">
            <ArtistDetail 
              artist={selectedArtist} 
              albums={artistData?.albums || []} 
              isLoading={detailsLoading}
              onBack={handleBackToSearch} 
              onViewAlbum={handleViewAlbum}
            />
          </div>
        ) : (
          <>
            {/* Hero section with animated gradient */}
            {!searchResults && !isLoading && (
              <div className="relative py-20 md:py-32 overflow-hidden w-full">
                {/* Background elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-spotify-green/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
                
                {/* Content */}
                <div className="w-full text-center relative z-10 px-4">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
                    Track Your Music Journey
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                    Discover new music, keep track of albums you've listened to, and sync your listening history.
                  </p>
                  
                  {!isLoggedIn && (
                    <div className="flex flex-wrap justify-center gap-4">
                      <button 
                        onClick={handleLoginClick}
                        className="bg-transparent border border-white/30 hover:border-white text-white py-3 px-8 rounded-full transition-all text-lg font-medium"
                      >
                        Login
                      </button>
                      <button 
                        onClick={handleRegisterClick}
                        className="bg-spotify-green hover:bg-green-500 text-white py-3 px-8 rounded-full transition-all transform hover:scale-105 text-lg font-medium"
                      >
                        Register
                      </button>
                    </div>
                  )}
                  
                  {isLoggedIn && (
                    <div className="flex flex-wrap justify-center gap-4">
                      <button 
                        className="bg-spotify-green hover:bg-green-500 text-white py-3 px-8 rounded-full transition-all transform hover:scale-105 text-lg font-medium"
                      >
                        Browse Music
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Search results */}
            {(searchResults || isLoading) && (
              <div className="w-full px-4 py-8">
                <SearchResults 
                  results={searchResults} 
                  isLoading={isLoading} 
                  onViewArtist={handleViewArtist}
                  onViewAlbum={handleViewAlbum}
                  onViewTrack={handleViewTrack}
                />
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Footer - full width */}
      <footer className="w-full py-6 bg-black/40 backdrop-blur-sm border-t border-gray-800">
        <div className="w-full px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">Album Tracker &copy; {new Date().getFullYear()}</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-spotify-green transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-spotify-green transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-spotify-green transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-spotify-green transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
