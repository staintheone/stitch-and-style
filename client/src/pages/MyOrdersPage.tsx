import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface OrderItem {
  id: number;
  quantity: number;
  size: string;
  color: string;
  price: number;
  product: { name: string; image: string };
}

interface Order {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  address: string;
  city: string;
  zip: string;
  items: OrderItem[];
}

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    apiFetch('/orders')
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <div className="bg-white border rounded-xl p-12 text-center">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link to="/catalog" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                {/* Order summary row */}
                <div
                  className="flex flex-wrap items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">Order #{order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Item thumbnails */}
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map(item => (
                      <img
                        key={item.id}
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-9 h-9 rounded-full object-cover border-2 border-white"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="text-sm font-bold text-gray-800">${order.total.toFixed(2)}</div>

                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>

                  <span className="text-gray-400 text-xs">{expanded === order.id ? '▲' : '▼'}</span>
                </div>

                {/* Expanded details */}
                {expanded === order.id && (
                  <div className="border-t px-6 py-5 bg-gray-50 space-y-4">
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-lg object-cover border"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{item.product.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-700">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t text-xs text-gray-400">
                      <span className="font-medium text-gray-600">Delivering to: </span>
                      {order.address}, {order.city} — {order.zip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrdersPage;
