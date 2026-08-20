import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Product } from '../pages/CatalogPage'; // Reuse interface

const AdminDashboard: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [stats, setStats] = useState({ totalProducts: 0, inStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [productsData, statsData] = await Promise.all([
          apiFetch('/products'),
          apiFetch('/admin/stats')
        ]);
        setProductList(productsData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      setProductList(prev => prev.filter(p => p.id !== id));
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm font-semibold">
            + Add Product
          </button>
        </div>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border rounded-lg p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-indigo-600">{stats.totalProducts}</p>
                <p className="text-gray-500 text-sm">Total Products</p>
              </div>
              <div className="bg-white border rounded-lg p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-green-600">{stats.inStock}</p>
                <p className="text-gray-500 text-sm">In Stock</p>
              </div>
              <div className="bg-white border rounded-lg p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
                <p className="text-gray-500 text-sm">Out of Stock</p>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Sizes</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Colors</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {productList.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{p.name}</td>
                      <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.sizes.join(', ')}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.colors.join(', ')}</td>
                      <td className="px-6 py-4">
                        {p.inStock ? (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">In Stock</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">Out of Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-indigo-600 hover:underline text-sm mr-3">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
