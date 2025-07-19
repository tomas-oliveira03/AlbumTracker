import React from 'react';
import type { Album } from '../../types/spotify';

interface AlbumItemProps {
  album: Album;
  onViewAlbum: (album: Album) => void;
}

const AlbumItem: React.FC<AlbumItemProps> = ({ album, onViewAlbum }) => {
  return (
    <div 
      className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-black/50 transition-all transform hover:translate-y-[-4px] hover:shadow-xl group cursor-pointer"
      onClick={() => onViewAlbum(album)}
    >
      <div className="relative">
        <img 
          src={album.images[0]?.url || '/default-album.png'} 
          alt={album.name} 
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
        <h3 className="font-medium text-white text-lg truncate">{album.name}</h3>
        <p className="text-gray-400 text-sm truncate mb-3">
          {album.artists.map(artist => artist.name).join(', ')}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{album.release_date.split('-')[0]}</span>
          <span>{album.total_tracks} tracks</span>
        </div>
      </div>
    </div>
  );
};

export default AlbumItem;
