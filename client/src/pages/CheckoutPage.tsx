import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Placed!</h1>
            <p className="text-gray-600 mb-6">Thank you for shopping with Stitch &amp; Style.</p>
            <Link to="/catalog" className="text-indigo-600 hover:underline">Continue Shopping</Link>
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
            <p className="text-gray-500 mb-4">Nothing in cart.</p>
            <Link to="/catalog" className="text-indigo-600 hover:underline">Go shopping</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order summary */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="font-semibold mb-3">Order Summary</h2>
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1">
                  <span>{item.product.name} ({item.size}/{item.color}) × {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
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
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" required className="border rounded px-3 py-2 col-span-1" />
                <input type="text" placeholder="Last Name" required className="border rounded px-3 py-2 col-span-1" />
                <input type="email" placeholder="Email" required className="border rounded px-3 py-2 col-span-2" />
                <input type="text" placeholder="Address" required className="border rounded px-3 py-2 col-span-2" />
                <input type="text" placeholder="City" required className="border rounded px-3 py-2" />
                <input type="text" placeholder="ZIP Code" required className="border rounded px-3 py-2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Place Order — ${totalPrice.toFixed(2)}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
