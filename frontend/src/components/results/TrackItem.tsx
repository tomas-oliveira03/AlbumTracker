import React from 'react';
import type { Track, Artist, Album } from '../../types/spotify';

interface TrackItemProps {
  track: Track;
  onViewArtist?: (artist: Artist) => void;
  onViewAlbum?: (album: Album) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, onViewArtist, onViewAlbum }) => {
  // Format duration from ms to mm:ss
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle artist name click
  const handleArtistClick = (e: React.MouseEvent, artist: Artist) => {
    e.stopPropagation();
    if (onViewArtist) onViewArtist(artist);
  };
  
  // Handle album click
  const handleAlbumClick = (e: React.MouseEvent, album: Album) => {
    e.stopPropagation();
    if (onViewAlbum) onViewAlbum(album);
  };

  return (
    <div className="flex items-center p-4 hover:bg-white/10 border-b border-gray-800 last:border-b-0 transition-colors group">
      <img 
        src={track.album.images[0]?.url || '/default-album.png'} 
        alt={track.album.name} 
        className="w-14 h-14 object-cover rounded-md mr-4 shadow-lg cursor-pointer"
        onClick={(e) => handleAlbumClick(e, track.album)}
      />
      <div className="flex-grow">
        <h3 className="font-medium text-white text-lg">{track.name}</h3>
        <p className="text-gray-400">
          {track.artists.map((artist, index) => (
            <React.Fragment key={artist.id}>
              {index > 0 && ', '}
              <span 
                onClick={(e) => handleArtistClick(e, artist)}
                className="hover:text-spotify-green hover:underline cursor-pointer transition-colors"
              >
                {artist.name}
              </span>
            </React.Fragment>
          ))}
        </p>
        <p className="text-gray-500 text-sm">
          <span 
            onClick={(e) => handleAlbumClick(e, track.album)}
            className="hover:text-spotify-green hover:underline cursor-pointer transition-colors"
          >
            {track.album.name}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-gray-400">
          {formatDuration(track.duration_ms)}
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-spotify-green hover:bg-green-500 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TrackItem;
