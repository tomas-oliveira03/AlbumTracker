import React from 'react';
import type { SearchResults as SearchResultsType } from '../../types/spotify';
import TrackItem from './TrackItem';
import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';

interface SearchResultsProps {
  results: SearchResultsType | null;
  isLoading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-20 text-gray-400">
        Search for songs, albums, or artists to see results
      </div>
    );
  }

  const hasTracks = results.tracks && results.tracks.items.length > 0;
  const hasAlbums = results.albums && results.albums.items.length > 0;
  const hasArtists = results.artists && results.artists.items.length > 0;

  if (!hasTracks && !hasAlbums && !hasArtists) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">😕</div>
        <h3 className="text-2xl font-bold mb-2">No results found</h3>
        <p className="text-gray-400">Try a different search term or category</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 max-w-7xl mx-auto">
      {hasTracks && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Songs</h2>
            <button className="text-spotify-green hover:underline">View all</button>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden">
            {results.tracks!.items.slice(0, 5).map(track => (
              <TrackItem key={track.id} track={track} />
            ))}
          </div>
        </div>
      )}

      {hasAlbums && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Albums</h2>
            <button className="text-spotify-green hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {results.albums!.items.slice(0, 5).map(album => (
              <AlbumItem key={album.id} album={album} />
            ))}
          </div>
        </div>
      )}

      {hasArtists && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Artists</h2>
            <button className="text-spotify-green hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {results.artists!.items.slice(0, 5).map(artist => (
              <ArtistItem key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
