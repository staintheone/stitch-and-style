import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-400 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-white font-bold text-lg mb-3">Stitch &amp; Style</h3>
        <p className="text-sm">Quality clothing for every occasion. Designed with care, made to last.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="hover:text-white">Home</Link></li>
          <li><Link to="/catalog" className="hover:text-white">Shop</Link></li>
          <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Contact</h4>
        <p className="text-sm">hello@stitchandstyle.com</p>
        <p className="text-sm mt-1">&copy; {new Date().getFullYear()} Stitch &amp; Style</p>
      </div>
    </div>
  </footer>
);

export default Footer;
