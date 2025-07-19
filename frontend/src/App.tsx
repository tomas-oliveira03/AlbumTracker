import { useState } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/results/SearchResults';
import { connectSpotify } from './services/spotifyApi';
import type { SearchResults as SearchResultsType } from './types/spotify';
import { searchSpotify } from './services/spotifyApi';
import './App.css';

function App() {
  const [searchResults, setSearchResults] = useState<SearchResultsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string, type: string) => {
    setIsLoading(true);
    try {
      const results = await searchSpotify(query, type);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      // In a real app, you'd want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header with blurred background effect - full width */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-gray-800 w-full">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3">
          <h1 className="text-3xl font-bold text-spotify-green">Album Tracker</h1>
          <div className="w-full max-w-3xl">
            <SearchBar onSearch={handleSearch} />
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
            <SearchResults results={searchResults} isLoading={isLoading} />
          </div>
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
