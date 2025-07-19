import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-spotify-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-spotify-green">Album Tracker</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:text-spotify-green transition-colors">Home</a>
            </li>
            <li>
              <a href="#" className="hover:text-spotify-green transition-colors">My Albums</a>
            </li>
            <li>
              <button className="bg-spotify-green hover:bg-green-500 text-white py-1 px-4 rounded-full transition-colors">
                Connect Spotify
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
