import React from 'react';
import type { Artist, Album, Track } from '../../types/spotify';

import TrackItem from './TrackItem';
import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';

// Define a specific interface for the search results structure
interface ApiSearchResults {
  items: (Artist | Album | Track)[];
  href?: string;
  limit?: number;
  next?: string | null;
  offset?: number;
  previous?: string | null;
  total?: number;
}

interface SearchResultsProps {
  results: ApiSearchResults | null;
  isLoading: boolean;
  onViewArtist: (artist: Artist) => void;
  onViewAlbum: (album: Album) => void;
  onViewTrack: (track: Track) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading, 
  onViewArtist,
  onViewAlbum,
  onViewTrack
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  // No results state
  if (!results) {
    return (
      <div className="text-center py-20 text-gray-400">
        Search for tracks, albums, or artists to see results
      </div>
    );
  }

  console.log('Search results:', results);

  // Check if results has items
  const items = results?.items || [];
  
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">😕</div>
        <h3 className="text-2xl font-bold mb-2">No results found</h3>
        <p className="text-gray-400">Try a different search term or category</p>
      </div>
    );
  }

  // Determine the type of items by checking the first item
  const itemType = items[0]?.type || 'unknown';

  return (
    <div className="w-full space-y-12 max-w-7xl mx-auto">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {itemType === 'track' ? 'Tracks' : 
             itemType === 'album' ? 'Albums' : 
             itemType === 'artist' ? 'Artists' : 'Results'}
          </h2>
          <span className="text-gray-400">
            Found {results.total || items.length} results
          </span>
        </div>

        {/* Track results - enhanced display */}
        {itemType === 'track' && (
          <div className="bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden">
            {items
              .filter((item): item is Track => item.type === 'track')
              .map(track => (
                <TrackItem 
                  key={track.id} 
                  track={track} 
                  onViewArtist={onViewArtist}
                  onViewAlbum={onViewAlbum}
                  onViewTrack={onViewTrack}
                />
              ))}
          </div>
        )}

        {/* Album results */}
        {itemType === 'album' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {items
              .filter((item): item is Album => item.type === 'album')
              .map(album => (
                <AlbumItem 
                  key={album.id} 
                  album={album} 
                  onViewAlbum={onViewAlbum} 
                  onViewArtist={onViewArtist}
                />
              ))}
          </div>
        )}

        {/* Artist results */}
        {itemType === 'artist' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {items
              .filter((item): item is Artist => item.type === 'artist')
              .map(artist => (
                <ArtistItem key={artist.id} artist={artist} onViewArtist={onViewArtist} />
              ))}
          </div>
        )}

        {/* Unknown type */}
        {itemType === 'unknown' && (
          <div className="text-center py-10">
            <p className="text-gray-400">Received data in an unknown format.</p>
            <pre className="mt-4 bg-gray-800 p-4 rounded-lg text-left text-sm overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
