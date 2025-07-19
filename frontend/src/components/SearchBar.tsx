import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string, type: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('track,album,artist');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex rounded-full overflow-hidden border border-gray-700 bg-black/50 focus-within:ring-2 focus-within:ring-spotify-green">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, albums or artists..."
          className="flex-grow py-3 px-5 bg-transparent text-white focus:outline-none"
        />
        
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-4 bg-black/30 text-white border-l border-gray-700 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="track,album,artist">All</option>
          <option value="track">Songs</option>
          <option value="album">Albums</option>
          <option value="artist">Artists</option>
        </select>
        
        <button
          type="submit"
          className="bg-spotify-green hover:bg-green-500 text-white font-medium py-3 px-6 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
