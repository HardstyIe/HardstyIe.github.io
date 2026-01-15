import { useState } from 'react';
import { Link } from 'react-router';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-carambar-yellow via-carambar-orange to-carambar-red shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
          <img src="/carambar.png" alt="Carambar" className="h-12 w-auto" />
          <span className="text-3xl font-bold text-white drop-shadow-lg">
            Carambar Jokes
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/random"
            className="text-white text-xl font-semibold hover:text-carambar-blue hover:scale-110 transition-all duration-200 flex items-center h-full"
          >
            🎲 Blague Random
          </Link>
          <Link
            to="/jokes"
            className="text-white text-xl font-semibold hover:text-carambar-blue hover:scale-110 transition-all duration-200 flex items-center h-full"
          >
            📚 Toutes les Blagues
          </Link>
          <Link
            to="/jokes/add"
            className="bg-white text-xl text-carambar-red font-bold px-4 py-2 rounded-full hover:bg-carambar-red hover:text-white transition-all duration-200 shadow-md flex items-center h-full"
          >
            ➕ Ajouter
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white text-3xl focus:outline-none"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 pb-4 space-y-3">
          <Link
            to="/random"
            onClick={() => setIsMenuOpen(false)}
            className="block text-center text-white font-semibold bg-carambar-blue bg-opacity-30 px-4 py-3 rounded-lg hover:bg-opacity-50 transition"
          >
            🎲 Blague Random
          </Link>
          <Link
            to="/jokes"
            onClick={() => setIsMenuOpen(false)}
            className="block text-center text-white font-semibold bg-carambar-blue bg-opacity-30 px-4 py-3 rounded-lg hover:bg-opacity-50 transition"
          >
            📚 Toutes les Blagues
          </Link>
          <Link
            to="/jokes/add"
            onClick={() => setIsMenuOpen(false)}
            className="block bg-white text-carambar-red font-bold px-4 py-3 rounded-lg text-center hover:bg-carambar-red hover:text-white transition shadow-md"
          >
            ➕ Ajouter une Blague
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
