import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string, type: string) => void;
  initialQuery?: string;
  initialType?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  initialQuery = '', 
  initialType = 'track,album,artist' 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  
  // Update state when props change (e.g., from URL navigation)
  useEffect(() => {
    setQuery(initialQuery);
    setSearchType(initialType);
  }, [initialQuery, initialType]);

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
          placeholder="Search tracks, albums or artists..."
          className="flex-grow py-3 px-5 bg-transparent text-white focus:outline-none"
        />
        
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-4 bg-black/30 text-white border-l border-gray-700 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="track,album,artist">All</option>
          <option value="track">Tracks</option>
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
