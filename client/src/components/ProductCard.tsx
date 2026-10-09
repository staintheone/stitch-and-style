// src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../pages/CatalogPage';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <Link 
      to={`/product/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100"
    >
      {/* Image Container with Zoom & Badges */}
      <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Quick View Pill Hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Details
          </span>
        </div>

        {/* Status Badge */}
        {!product.inStock ? (
          <span className="absolute top-3 left-3 bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Sold Out
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            In Stock
          </span>
        )}
      </div>

      {/* Info Container */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
              {product.sizes?.join(' · ') || 'Essentials'}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 text-sm tracking-wide group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <p className="text-base font-bold text-gray-900 tracking-tight">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex gap-1">
            {product.colors?.slice(0, 3).map((col, idx) => (
              <span 
                key={idx} 
                className="text-[10px] text-gray-500 bg-gray-50 border border-gray-200/80 rounded px-1.5 py-0.5"
              >
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
