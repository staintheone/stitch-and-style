import React, { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../utils/api';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Define product type locally since we deleted the static file
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch('/products');
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const allSizes = useMemo(() => [...new Set(products.flatMap(p => p.sizes))].sort(), [products]);
  const allColors = useMemo(() => [...new Set(products.flatMap(p => p.colors))].sort(), [products]);

  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setStockFilter('all');
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const sizeOk = selectedSizes.length === 0 || p.sizes.some(s => selectedSizes.includes(s));
      const colorOk = selectedColors.length === 0 || p.colors.some(c => selectedColors.includes(c));
      const stockOk = stockFilter === 'all' || (stockFilter === 'inStock' && p.inStock) || (stockFilter === 'outOfStock' && !p.inStock);
      return sizeOk && colorOk && stockOk;
    });
  }, [products, selectedSizes, selectedColors, stockFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex gap-8">
        <aside className="w-60 shrink-0 hidden md:block">
          <FilterSidebar
            allSizes={allSizes}
            allColors={allColors}
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            stockFilter={stockFilter}
            onToggleSize={toggleSize}
            onToggleColor={toggleColor}
            onStockChange={setStockFilter}
            onClear={clearFilters}
          />
        </aside>
        <main className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Our Collection</h1>
          {loading ? (
            <p className="text-gray-500 py-10">Loading products...</p>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CatalogPage;
