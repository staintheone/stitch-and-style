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
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">
            Stitch &amp; Style
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/catalog" className="text-gray-700 hover:text-indigo-600 font-medium">
              Shop
            </Link>
            <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600 font-medium">
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-500 hover:text-indigo-600 text-sm font-medium border-l pl-6 border-gray-300">
                Admin Panel
              </Link>
            )}

            {user ? (
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">
                Logout ({user.name})
              </button>
            ) : (
              <Link to="/login" className="text-sm text-indigo-600 font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
