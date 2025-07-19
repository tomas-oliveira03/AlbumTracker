import React from 'react';
import type { Artist } from '../../types/spotify';

interface ArtistItemProps {
  artist: Artist;
  onViewArtist: (artist: Artist) => void;
}

const ArtistItem: React.FC<ArtistItemProps> = ({ artist, onViewArtist }) => {
  // Helper function to format follower numbers
  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M followers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K followers`;
    }
    return `${count} followers`;
  };

  return (
    <div 
      className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-black/50 transition-all transform hover:translate-y-[-4px] hover:shadow-xl group cursor-pointer"
      onClick={() => onViewArtist(artist)}
    >
      <div className="relative">
        <img 
          src={artist.images?.[0]?.url || '/default-artist.png'} 
          alt={artist.name} 
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <div className="bg-spotify-green hover:scale-110 p-3 rounded-full shadow-lg transform transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-white text-lg truncate">{artist.name}</h3>
        {artist.followers && (
          <p className="text-gray-400 text-sm mb-3">
            {formatFollowers(artist.followers.total)}
          </p>
        )}
        {artist.genres && artist.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 text-xs">
            {artist.genres.slice(0, 2).map((genre, idx) => (
              <span key={idx} className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistItem;
