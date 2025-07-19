import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/results/SearchResults';
import ArtistDetail from './components/ArtistDetail';
import AlbumDetail from './components/AlbumDetail';
import { connectSpotify, getArtistById, getAlbumById } from './services/spotifyApi';
import type { SearchResults as SearchResultsType, Artist, Album } from './types/spotify';
import { searchSpotify } from './services/spotifyApi';
import './App.css';

interface ArtistDetailData {
  artist: Artist;
  albums: Album[];
}

function App() {
  const [searchResults, setSearchResults] = useState<SearchResultsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<{query: string, type: string}>({
    query: '',
    type: 'track,album,artist'
  });
  const [artistData, setArtistData] = useState<ArtistDetailData | null>(null);
  const [artistLoading, setArtistLoading] = useState(false);

  // Parse URL and update state based on current location
  const handleUrlChange = () => {
    const path = window.location.pathname;
    
    // Check if we're viewing an album page
    if (path.startsWith('/album/')) {
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
      // Clear selected artist and album when navigating to search
      setSelectedArtist(null);
      setSelectedAlbum(null);
      
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
          searchSpotify(name, type)
            .then(results => {
              setSearchResults(results);
              setIsLoading(false);
            })
            .catch(error => {
              console.error('Search failed:', error);
              setIsLoading(false);
            });
          setIsLoading(true);
        }
      }
    }
    // Home page (root path)
    else if (path === '/') {
      setSelectedArtist(null);
      setSelectedAlbum(null);
      setSearchResults(null);
    }
  };

  const loadArtist = async (artistId: string) => {
    setArtistLoading(true);
    try {
      const data = await getArtistById(artistId);
      setArtistData(data);
      setSelectedArtist(data.artist);
    } catch (error) {
      console.error('Failed to load artist:', error);
      // Fallback to home page if artist can't be loaded
      window.history.pushState({}, '', '/');
      setSelectedArtist(null);
    } finally {
      setArtistLoading(false);
    }
  };

  const loadAlbum = async (albumId: string) => {
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
    
    setIsLoading(true);
    
    // Update URL with search parameters in the path
    const searchParams = new URLSearchParams();
    searchParams.set('type', type);
    searchParams.set('name', query);
    
    // Update the URL without refreshing the page
    const newUrl = `/search/${searchParams.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    // Update searchParams state when a new search is performed
    setSearchParams({ query, type });
    
    try {
      const results = await searchSpotify(query, type);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a click handler for the app logo to return to home
  const handleHomeClick = () => {
    // Clear all states to return to home
    setSelectedArtist(null);
    setSelectedAlbum(null);
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
    
    // Clean URL - use a simple /album/id pattern
    const newUrl = `/album/${album.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    // Load album details
    loadAlbum(album.id);
    
    // Scroll to top when viewing album
    window.scrollTo(0, 0);
  };

  const handleBackToSearch = () => {
    setSelectedArtist(null);
    setSelectedAlbum(null);
    
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
          <button 
            onClick={connectSpotify}
            className="whitespace-nowrap bg-spotify-green hover:bg-green-500 text-white py-2 px-6 rounded-full transition-all transform hover:scale-105 font-medium"
          >
            Connect Spotify
          </button>
        </div>
      </header>
      
      {/* Main content - full width */}
      <main className="flex-grow w-full">
        {/* Show album detail if an album is selected */}
        {selectedAlbum ? (
          <div className="w-full px-4 py-8">
            <AlbumDetail 
              album={selectedAlbum} 
              isLoading={detailsLoading}
              onBack={handleBackToSearch} 
              onViewArtist={handleViewArtist}
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
                    Discover new music, keep track of albums you've listened to, and connect with Spotify to sync your listening history.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={connectSpotify}
                      className="bg-spotify-green hover:bg-green-500 text-white py-3 px-8 rounded-full transition-all transform hover:scale-105 text-lg font-medium"
                    >
                      Connect with Spotify
                    </button>
                    <button 
                      className="bg-white/10 hover:bg-white/20 text-white py-3 px-8 rounded-full border border-white/20 transition-all"
                    >
                      Browse Albums
                    </button>
                  </div>
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
