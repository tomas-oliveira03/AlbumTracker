import React from 'react';
import type { Album } from '../types/spotify';

interface AlbumDetailProps {
  album: Album;
  isLoading: boolean;
  onBack: () => void;
}

const AlbumDetail: React.FC<AlbumDetailProps> = ({ album, isLoading, onBack }) => {
  // Format duration from ms to mm:ss
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  // Format release date
  const formatReleaseDate = (date: string) => {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
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

  const tracks = album?.tracks?.items || [];

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
        {/* Album header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
          {/* Album cover */}
          <div className="md:w-64 md:h-64 w-full max-w-xs mx-auto md:mx-0 aspect-square rounded-lg overflow-hidden shadow-xl">
            <img 
              src={album.images?.[0]?.url || '/default-album.png'} 
              alt={album.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Album info */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-gray-400 uppercase text-sm font-medium">{album.album_type || 'Album'}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-1 mb-2">{album.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-medium">{album.artists?.map(a => a.name).join(', ')}</span>
                <span className="text-gray-400 text-sm">• {album.release_date && formatReleaseDate(album.release_date)}</span>
                <span className="text-gray-400 text-sm">• {album.total_tracks} songs</span>
              </div>
              {album.label && (
                <p className="text-gray-400 text-sm mt-2">Label: {album.label}</p>
              )}
              {album.popularity && (
                <div className="mt-4 flex items-center">
                  <span className="text-gray-400 text-sm mr-2">Popularity:</span>
                  <div className="bg-gray-800 rounded-full h-2 w-32 overflow-hidden">
                    <div 
                      className="bg-spotify-green h-full" 
                      style={{ width: `${album.popularity}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-400">{album.popularity}/100</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button className="bg-spotify-green hover:bg-green-500 text-white py-2 px-6 rounded-full transition-colors">
                Save to Library
              </button>
              {album.external_urls?.spotify && (
                <a 
                  href={album.external_urls.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-transparent border border-gray-600 hover:border-white text-white py-2 px-6 rounded-full transition-colors"
                >
                  Open in Spotify
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Tracks list */}
        <div className="px-6 md:px-8 pb-8">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Tracks</h2>
          
          {tracks.length > 0 ? (
            <div className="bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-gray-800">
                  <tr className="text-left text-gray-400 text-sm">
                    <th className="p-3 w-12">#</th>
                    <th className="p-3">Title</th>
                    <th className="p-3 hidden md:table-cell">Artist</th>
                    <th className="p-3 w-16 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track, index) => (
                    <tr key={track.id} className="border-b border-gray-800 last:border-b-0 hover:bg-white/5 group">
                      <td className="p-3 text-gray-400">{track.track_number || (index + 1)}</td>
                      <td className="p-3">
                        <div className="font-medium text-white">{track.name}</div>
                        <div className="text-gray-400 text-sm md:hidden">{track.artists.map(a => a.name).join(', ')}</div>
                      </td>
                      <td className="p-3 text-gray-400 hidden md:table-cell">{track.artists.map(a => a.name).join(', ')}</td>
                      <td className="p-3 text-gray-400 text-right">{formatDuration(track.duration_ms)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No tracks available for this album.</p>
          )}
        </div>

        {/* Copyright information */}
        {album.copyrights && album.copyrights.length > 0 && (
          <div className="px-6 md:px-8 pb-8 text-gray-500 text-xs">
            {album.copyrights.map((copyright, index) => (
              <p key={index}>{copyright.text}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetail;
