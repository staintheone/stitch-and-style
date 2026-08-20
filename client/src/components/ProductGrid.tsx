import React from 'react';
import { Product } from '../data/products';
import ProductCard from './ProductCard';

const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  if (products.length === 0) {
    return <p className="text-gray-500 text-center py-12">No products match your filters.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
