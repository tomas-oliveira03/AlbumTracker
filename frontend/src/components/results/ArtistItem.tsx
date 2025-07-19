import React from 'react';
import type { Artist } from '../../types/spotify';

interface ArtistItemProps {
  artist: Artist;
}

const ArtistItem: React.FC<ArtistItemProps> = ({ artist }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-black/50 transition-all transform hover:translate-y-[-4px] hover:shadow-xl text-center group">
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
        {artist.genres && artist.genres.length > 0 && (
          <p className="text-gray-400 text-sm mb-4">
            {artist.genres.slice(0, 2).join(' • ')}
          </p>
        )}
        <button className="w-full py-2 border border-white/20 hover:bg-spotify-green hover:border-transparent text-white rounded-full transition-colors">
          View Artist
        </button>
      </div>
    </div>
  );
};

export default ArtistItem;
