import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: '',
    sizes: '',
    colors: '',
    inStock: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          image: form.image,
          sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
          colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
          inStock: form.inStock,
        }),
      });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="text-indigo-600 hover:underline text-sm">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 shadow-sm space-y-5">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              name="name" required value={form.name} onChange={handleChange}
              placeholder="e.g. Classic White Tee"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              name="price" type="number" step="0.01" min="0" required value={form.price} onChange={handleChange}
              placeholder="e.g. 29.99"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              name="image" required value={form.image} onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {form.image && (
              <img src={form.image} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded border" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sizes <span className="text-gray-400 font-normal">(comma-separated, e.g. S, M, L, XL)</span>
            </label>
            <input
              name="sizes" required value={form.sizes} onChange={handleChange}
              placeholder="S, M, L, XL"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colors <span className="text-gray-400 font-normal">(comma-separated, e.g. Red, Blue)</span>
            </label>
            <input
              name="colors" required value={form.colors} onChange={handleChange}
              placeholder="Red, Blue, Black"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox" id="inStock" name="inStock"
              checked={form.inStock} onChange={handleChange}
              className="h-4 w-4 accent-indigo-600"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-700">In Stock</label>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddProductPage;
