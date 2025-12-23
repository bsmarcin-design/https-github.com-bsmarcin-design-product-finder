
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-800 to-indigo-800 p-4 flex justify-between items-center sticky top-0 z-10 shadow-lg">
      <h1 className="text-2xl font-bold tracking-tight text-white">
        Avolta
        <span className="text-purple-300">.</span>
      </h1>
      <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center">
        <span className="text-purple-800 font-bold">A</span>
      </div>
    </header>
  );
};

export default Header;
