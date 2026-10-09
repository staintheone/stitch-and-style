import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="bg-gray-950 text-gray-400 mt-24 border-t border-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="inline-block">
            <span className="text-xl font-black tracking-widest text-white uppercase font-serif">
              Stitch &amp; Style
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-gray-500 max-w-sm">
            Curated wardrobe essentials crafted with precision and sustainable craftsmanship. Elevate your everyday aesthetics.
          </p>
        </div>

        {/* Collection Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/catalog" className="hover:text-white transition-colors">All Apparel</Link></li>
            <li><Link to="/catalog" className="hover:text-white transition-colors">Seasonal Arrivals</Link></li>
            <li><Link to="/catalog" className="hover:text-white transition-colors">Minimalist Staples</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
            Customer Care
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Your Bag</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Account Access</Link></li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
            Concierge
          </h4>
          <p className="text-xs text-gray-500 mb-2">support@stitchandstyle.com</p>
          <p className="text-xs text-gray-500">Mon - Fri, 9:00AM - 6:00PM EST</p>
          <div className="mt-4 flex gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Global Shipping Active</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-600">
        <p>&copy; {new Date().getFullYear()} Stitch &amp; Style Inc. All rights reserved.</p>
        <p className="tracking-widest uppercase">Designed for Elegance</p>
      </div>
    </div>
  </footer>
);

export default Footer;
