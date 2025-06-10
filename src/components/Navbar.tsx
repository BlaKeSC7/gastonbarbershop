import React, { useState } from 'react';
import { Search, Menu, User, X, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories } from '../data/products';

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Monitor size={24} className="mr-2" />
            <span className="font-bold text-2xl">SH Computers</span>
          </Link>

          <div className="hidden md:block flex-grow mx-6">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Buscar productos"
                className="w-full px-4 py-2 text-black rounded-l-md focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-primary-light hover:bg-primary-dark px-4 rounded-r-md transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/quotes" className="hover:text-primary-light flex flex-col items-center">
              <span className="text-xs">Solicitar</span>
              <span className="text-xs">Cotización</span>
            </Link>
            <Link to="/customers" className="hover:text-primary-light flex flex-col items-center">
              <User size={20} />
              <span className="text-xs mt-1">Clientes</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-white">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className="md:hidden py-2">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Buscar productos"
              className="w-full px-4 py-2 text-black rounded-l-md focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-primary-light hover:bg-primary-dark px-3 rounded-r-md transition-colors"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-dark py-3">
          <div className="max-w-7xl mx-auto px-4 space-y-3">
            <Link 
              to="/quotes" 
              className="block text-white hover:text-primary-light py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Solicitar Cotización
            </Link>
            <Link 
              to="/customers" 
              className="block text-white hover:text-primary-light py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Clientes
            </Link>
            <div className="border-t border-primary-light pt-2">
              <h3 className="font-bold mb-1">Categorías</h3>
              {categories.map(category => (
                <Link 
                  key={category}
                  to={`/category/${category}`} 
                  className="block text-white hover:text-primary-light py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-primary-dark py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6">
            {categories.map(category => (
              <Link 
                key={category}
                to={`/category/${category}`} 
                className="text-white hover:text-primary-light text-sm"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;