import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <Link to="/catalog" className="text-indigo-600 hover:underline">Continue shopping</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 border rounded-lg p-4">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.size} &middot; {item.color}</p>
                    <p className="text-indigo-600 font-semibold">${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                    >−</button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >Remove</button>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-6 flex items-center justify-between">
              <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
              <div className="text-right">
                <p className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</p>
                <Link
                  to="/checkout"
                  className="mt-3 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
