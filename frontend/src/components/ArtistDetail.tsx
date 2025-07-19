import React from 'react';
import type { Artist, Album } from '../types/spotify';
import { connectSpotify } from '../services/spotifyApi';

interface ArtistDetailProps {
  artist: Artist;
  albums: Album[];
  isLoading: boolean;
  onBack: () => void;
  onViewAlbum: (album: Album) => void;
}

const ArtistDetail: React.FC<ArtistDetailProps> = ({ 
  artist, 
  albums, 
  isLoading, 
  onBack,
  onViewAlbum 
}) => {
  // Function to format follower numbers
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M followers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K followers`;
    }
    return `${count} followers`;
  };

  // Open artist on Spotify
  const openOnSpotify = () => {
    if (artist.external_urls?.spotify) {
      window.open(artist.external_urls.spotify, '_blank');
    }
  };

  return (
    <div className="w-full pb-12">
      {/* Back button */}
      <button 
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to search results
      </button>

      <div className="bg-black/30 backdrop-blur-md rounded-xl overflow-hidden">
        {/* Artist header */}
        <div className="relative">
          {/* Hero image with gradient overlay */}
          <div className="w-full h-64 md:h-80 overflow-hidden relative">
            {artist.images && artist.images.length > 0 ? (
              <img 
                src={artist.images[0].url} 
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>

          {/* Artist info overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Profile picture */}
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-black shadow-xl bg-gray-900 flex-shrink-0">
              {artist.images && artist.images.length > 0 ? (
                <img 
                  src={artist.images[0].url} 
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-4xl">🎤</span>
                </div>
              )}
            </div>

            {/* Artist name and stats */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{artist.name}</h1>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {artist.followers && (
                  <span className="text-gray-300">
                    {formatFollowers(artist.followers.total)}
                  </span>
                )}
                {artist.popularity && (
                  <span className="text-gray-300 flex items-center">
                    <span className="mr-1">Popularity:</span>
                    <span className="bg-spotify-green text-black font-bold rounded-full px-2 py-0.5 text-sm">
                      {artist.popularity}/100
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Artist content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div>
              {/* Popularity section - replaced genres */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Popularity</h2>
                <div className="flex items-center">
                  <div className="bg-gray-800 rounded-full h-4 w-full overflow-hidden">
                    <div 
                      className="bg-spotify-green h-full" 
                      style={{ width: `${artist.popularity || 0}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-lg font-medium">{artist.popularity || 0}/100</span>
                </div>
              </div>
              
              {/* External links */}
              <div>
                <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Links</h2>
                <div className="flex flex-col gap-3">
                  {artist.external_urls?.spotify && (
                    <button 
                      onClick={openOnSpotify}
                      className="flex items-center bg-spotify-green hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      Open on Spotify
                    </button>
                  )}
                  <button 
                    onClick={connectSpotify}
                    className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Follow Artist
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right column - For future expansion (e.g. top tracks, related artists) */}
            <div>
              <div className="bg-gray-800/50 rounded-lg p-6 flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Top Tracks Coming Soon</h3>
                <p className="text-gray-400 text-center">We're working on bringing you the artist's top tracks and more!</p>
              </div>
            </div>
          </div>
          
          {/* Albums section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Albums</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-spotify-green"></div>
              </div>
            ) : albums.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {albums.map(album => (
                  <div 
                    key={album.id} 
                    className="bg-black/30 rounded-lg overflow-hidden group hover:bg-black/40 transition-all cursor-pointer"
                    onClick={() => onViewAlbum(album)}
                  >
                    <div className="relative">
                      <img 
                        src={album.images[0]?.url || '/default-album.png'} 
                        alt={album.name} 
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <button className="bg-spotify-green hover:scale-110 p-3 rounded-full shadow-lg transform transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-white truncate">{album.name}</h3>
                      <p className="text-gray-400 text-sm">{album.release_date.split('-')[0]} • {album.total_tracks} tracks</p>
                      <button className="mt-2 w-full py-1.5 text-sm bg-gray-800 hover:bg-spotify-green text-white rounded transition-colors">
                        Track Album
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No albums found for this artist.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
