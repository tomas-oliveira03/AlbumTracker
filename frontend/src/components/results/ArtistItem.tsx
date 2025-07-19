import React from 'react';
import type { Artist } from '../../types/spotify';

interface ArtistItemProps {
  artist: Artist;
  onViewArtist: (artist: Artist) => void;
}

const ArtistItem: React.FC<ArtistItemProps> = ({ artist, onViewArtist }) => {
  return (
    <div 
      className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-black/50 transition-all transform hover:translate-y-[-4px] hover:shadow-xl text-center group cursor-pointer"
      onClick={() => onViewArtist(artist)}
    >
      <div className="relative">
        <img 
          src={artist.images?.[0]?.url || '/default-artist.png'} 
          alt={artist.name} 
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <h3 className="absolute bottom-3 left-0 right-0 font-bold text-xl px-3 truncate">{artist.name}</h3>
      </div>
      <div className="p-4">
        <div className="mt-2">
          {artist.followers && (
            <p className="text-gray-400 text-sm mb-4">
              {formatFollowers(artist.followers.total)}
            </p>
          )}
        </div>
        <div 
          className="w-full py-2 border border-white/20 group-hover:bg-spotify-green group-hover:border-transparent text-white rounded-full transition-colors"
        >
          View Artist
        </div>
      </div>
    </div>
  );
};

// Helper function to format follower numbers
const formatFollowers = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M followers`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K followers`;
  }
  return `${count} followers`;
};

export default ArtistItem;
