import React, { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../utils/api';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

  const allSizes = useMemo(() => [...new Set(products.flatMap(p => p.sizes || []))].sort(), [products]);
  const allColors = useMemo(() => [...new Set(products.flatMap(p => p.colors || []))].sort(), [products]);

  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setStockFilter('all');
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      const sizeOk = selectedSizes.length === 0 || (p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
      const colorOk = selectedColors.length === 0 || (p.colors && p.colors.some(c => selectedColors.includes(c)));
      const stockOk = stockFilter === 'all' || (stockFilter === 'inStock' && p.inStock) || (stockFilter === 'outOfStock' && !p.inStock);
      return sizeOk && colorOk && stockOk;
    });
  }, [products, selectedSizes, selectedColors, stockFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-white border-b border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 block mb-2">
              Ready-To-Wear • 2026 Collection
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-gray-950 tracking-tight">
              Curated Wardrobe
            </h1>
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Showing {filtered.length} of {products.length} Items
          </p>
        </div>
      </section>

      {/* Main Catalog Section */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-64 shrink-0">
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
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">Loading collection…</p>
            </div>
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
