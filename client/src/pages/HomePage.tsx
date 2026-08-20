import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* Hero */}
    <section className="flex-1 bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Stitch &amp; Style</h1>
        <p className="text-xl text-gray-600 mb-8">Quality clothing for every occasion. Designed with care, made to last.</p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/catalog"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
          >
            Shop Now
          </Link>
          <Link
            to="/catalog"
            className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    </section>

    {/* Feature Highlights */}
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-4xl mb-3">🚚</div>
          <h3 className="font-semibold text-lg mb-1">Free Shipping</h3>
          <p className="text-gray-500 text-sm">On orders over $50</p>
        </div>
        <div>
          <div className="text-4xl mb-3">↩️</div>
          <h3 className="font-semibold text-lg mb-1">Easy Returns</h3>
          <p className="text-gray-500 text-sm">30-day return policy</p>
        </div>
        <div>
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-semibold text-lg mb-1">Secure Checkout</h3>
          <p className="text-gray-500 text-sm">100% secure payment</p>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default HomePage;
