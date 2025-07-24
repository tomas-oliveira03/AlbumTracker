import React from 'react';
import type { Track, Artist, Album } from '../types/spotify';

interface TrackDetailProps {
  track: Track;
  isLoading: boolean;
  onBack: () => void;
  onViewArtist: (artist: Artist) => void;
  onViewAlbum: (album: Album) => void;
}

const TrackDetail: React.FC<TrackDetailProps> = ({ 
  track, 
  isLoading, 
  onBack, 
  onViewArtist, 
  onViewAlbum 
}) => {
  // Format duration from ms to mm:ss
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  if (isLoading) {
    return (
      <div className="w-full pb-12">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-spotify-green"></div>
        </div>
      </div>
    );
  }

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
        Back
      </button>

      <div className="bg-black/30 backdrop-blur-md rounded-xl overflow-hidden">
        {/* Track header */}
        <div className="relative">
          <div className="w-full h-64 overflow-hidden relative">
            <img 
              src={track.album.images[0]?.url || '/default-album.png'} 
              alt={track.album.name}
              className="w-full h-full object-cover blur-sm opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
          </div>

          {/* Track info overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 flex items-end gap-6">
            {/* Album cover */}
            <div 
              onClick={() => onViewAlbum(track.album)}
              className="w-40 h-40 rounded-md overflow-hidden shadow-xl cursor-pointer transform transition-transform hover:scale-105"
            >
              <img 
                src={track.album.images[0]?.url || '/default-album.png'} 
                alt={track.album.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Track name and artists */}
            <div>
              <span className="text-gray-400 uppercase text-sm font-medium">Track</span>
              <h1 className="text-4xl font-bold text-white mt-1 mb-3">{track.name}</h1>
              <p className="text-xl">
                {track.artists.map((artist, index) => (
                  <React.Fragment key={artist.id}>
                    {index > 0 && ', '}
                    <button 
                      onClick={() => onViewArtist(artist)}
                      className="hover:text-spotify-green hover:underline transition-colors"
                    >
                      {artist.name}
                    </button>
                  </React.Fragment>
                ))}
              </p>
              <p className="text-gray-400 mt-1">
                From the album{' '}
                <button 
                  onClick={() => onViewAlbum(track.album)}
                  className="hover:text-spotify-green hover:underline transition-colors"
                >
                  {track.album.name}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Track content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div>
              {/* Track details */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Track Details</h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span>{formatDuration(track.duration_ms)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Album</span>
                    <button 
                      onClick={() => onViewAlbum(track.album)}
                      className="hover:text-spotify-green hover:underline transition-colors text-right"
                    >
                      {track.album.name}
                    </button>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Release Date</span>
                    <span>{track.album.release_date}</span>
                  </li>
                </ul>
              </div>
              
              {/* External links */}
              <div>
                <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Links</h2>
                <div className="flex flex-col gap-3">
                  {track.album.external_urls?.spotify && (
                    <a 
                      href={track.album.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-spotify-green hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      Open on Spotify
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column */}
            <div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Artists</h2>
                <div className="space-y-4">
                  {track.artists.map(artist => (
                    <div 
                      key={artist.id}
                      onClick={() => onViewArtist(artist)}
                      className="flex items-center gap-4 p-3 bg-black/30 rounded-lg hover:bg-black/50 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        {artist.images && artist.images.length > 0 ? (
                          <img 
                            src={artist.images[0].url} 
                            alt={artist.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{artist.name}</h3>
                        {artist.genres && artist.genres.length > 0 && (
                          <p className="text-sm text-gray-400">{artist.genres.slice(0, 2).join(', ')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Album section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">From the Album</h2>
            
            <div 
              onClick={() => onViewAlbum(track.album)}
              className="bg-black/30 rounded-lg p-4 flex items-center gap-6 hover:bg-black/50 cursor-pointer transition-colors"
            >
              <img 
                src={track.album.images[0]?.url || '/default-album.png'} 
                alt={track.album.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-medium text-xl">{track.album.name}</h3>
                <p className="text-gray-400">{track.album.artists.map(a => a.name).join(', ')}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {track.album.release_date.split('-')[0]} • {track.album.total_tracks} tracks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetail;
