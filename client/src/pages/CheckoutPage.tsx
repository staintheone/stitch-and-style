import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    address: '', city: '', zip: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          items: items.map(item => ({
            productId: item.product.id,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });
      clearCart();
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-3">Order Placed!</h1>
            <p className="text-gray-500 mb-6">Thank you for shopping with Stitch &amp; Style.<br />We'll get your order ready soon.</p>
            <Link to="/catalog" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link to="/catalog" className="text-indigo-600 hover:underline">Go shopping</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order summary */}
            <div className="border rounded-xl p-4 bg-gray-50">
              <h2 className="font-semibold mb-3">Order Summary</h2>
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1.5">
                  <span className="text-gray-700">
                    {item.product.name}
                    <span className="text-gray-400 ml-1">({item.size} / {item.color}) × {item.quantity}</span>
                  </span>
                  <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping info */}
            <div>
              <h2 className="font-semibold mb-3">Shipping Information</h2>

              {/* Must be logged in */}
              {!user && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-lg mb-4">
                  You need to <Link to="/login" className="underline font-semibold">sign in</Link> to place an order.
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                  <input name="firstName" required value={form.firstName} onChange={handleChange}
                    placeholder="Jane"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                  <input name="lastName" required value={form.lastName} onChange={handleChange}
                    placeholder="Doe"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                  <input name="address" required value={form.address} onChange={handleChange}
                    placeholder="123 Main Street"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                  <input name="city" required value={form.city} onChange={handleChange}
                    placeholder="New York"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">ZIP Code</label>
                  <input name="zip" required value={form.zip} onChange={handleChange}
                    placeholder="10001"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !user}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Placing Order…' : `Place Order — $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
