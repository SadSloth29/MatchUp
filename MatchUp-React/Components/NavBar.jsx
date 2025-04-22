import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NavBar = ({ isHome }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-blue-900 px-4 py-3 mb-2 h-14 shadow-sm">
     
      <h1 className="text-lg md:text-2xl font-medium text-gray-100 tracking-wide font-sora drop-shadow-sm">
        <span className="text-gray-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">MATCH</span>
        <span className="text-blue-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)] ml-1">UP</span>
      </h1>

     
      {isHome ? (
        <div className="hidden md:flex gap-4">
          <Link
            to="/login"
            className="px-4 py-1.5 bg-blue-100 text-blue-900 rounded-full text-sm font-medium hover:bg-blue-200 transition-all duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        <div className="hidden md:flex gap-4">
          <Link
            to="/"
            className="px-4 py-1.5 bg-blue-100 text-blue-900 rounded-full text-sm font-medium hover:bg-blue-200 transition-all duration-200"
          >
            Home
          </Link>
        </div>
      )}

      
      {isHome && (
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

         
          {menuOpen && (
            <div className="absolute top-16 right-4 bg-white text-black rounded-xl shadow-lg p-4 w-40 flex flex-col gap-3 z-50">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-100 text-blue-900 rounded-md text-sm font-medium hover:bg-blue-200 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
