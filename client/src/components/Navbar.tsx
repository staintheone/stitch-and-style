import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/catalog" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-widest text-gray-900 group-hover:text-indigo-600 transition-colors uppercase font-serif">
              Stitch &amp; Style
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mb-2"></span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            <Link 
              to="/catalog" 
              className="text-xs font-semibold uppercase tracking-widest text-gray-600 hover:text-gray-900 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 hover:after:w-full after:transition-all"
            >
              Collection
            </Link>

            {user && (
              <Link 
                to="/orders" 
                className="text-xs font-semibold uppercase tracking-widest text-gray-600 hover:text-gray-900 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 hover:after:w-full after:transition-all"
              >
                My Orders
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 hover:bg-indigo-100 transition"
              >
                Admin Panel
              </Link>
            )}

            {/* Shopping Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
              title="Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                <span className="text-xs text-gray-500 font-medium">
                  {user.name}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="text-xs font-semibold uppercase tracking-wider text-rose-500 hover:text-rose-700 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-xs font-semibold uppercase tracking-widest px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all rounded-full"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
