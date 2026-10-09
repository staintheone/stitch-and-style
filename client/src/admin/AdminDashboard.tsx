import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Product } from '../pages/CatalogPage';

type Tab = 'overview' | 'products' | 'orders';

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
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  createdAt: string;
  user: { id: number; name: string; email: string };
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [productList, setProductList] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalProducts: 0, inStock: 0, outOfStock: 0, totalOrders: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsData, statsData, ordersData] = await Promise.all([
          apiFetch('/products'),
          apiFetch('/admin/stats'),
          apiFetch('/admin/orders'),
        ]);
        setProductList(productsData);
        setStats(statsData);
        setOrders(ordersData);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      setProductList(prev => prev.filter(p => p.id !== id));
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
    } catch {
      alert('Failed to delete product.');
    }
  };

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await apiFetch(`/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch {
      alert('Failed to update order status.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link
            to="/admin/add-product"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
          >
            + Add Product
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border rounded-lg p-1 w-fit">
          {(['overview', 'products', 'orders'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition ${
                tab === t ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t}
              {t === 'orders' && orders.length > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading dashboard…</p>
        ) : (
          <>
            {/* ── OVERVIEW TAB ── */}
            {tab === 'overview' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Total Products', value: stats.totalProducts, color: 'text-indigo-600' },
                  { label: 'In Stock',        value: stats.inStock,        color: 'text-green-600' },
                  { label: 'Out of Stock',    value: stats.outOfStock,     color: 'text-red-500'   },
                  { label: 'Total Orders',    value: stats.totalOrders,    color: 'text-purple-600'},
                  { label: 'Total Users',     value: stats.totalUsers,     color: 'text-blue-600'  },
                ].map(card => (
                  <div key={card.label} className="bg-white border rounded-xl p-5 text-center shadow-sm">
                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                    <p className="text-gray-500 text-xs mt-1">{card.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── PRODUCTS TAB ── */}
            {tab === 'products' && (
              <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Product', 'Price', 'Sizes', 'Colors', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {productList.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded" />
                          {p.name}
                        </td>
                        <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-500">{p.sizes.join(', ')}</td>
                        <td className="px-6 py-4 text-gray-500">{p.colors.join(', ')}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 'orders' && (
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <div className="bg-white border rounded-xl p-10 text-center text-gray-400 text-sm">
                    No orders placed yet.
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                      {/* Order header row */}
                      <div
                        className="flex flex-wrap items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">
                            Order #{order.id} &nbsp;·&nbsp;
                            <span className="text-gray-500 font-normal">
                              {order.firstName} {order.lastName}
                            </span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{order.user.email} &nbsp;·&nbsp; {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>

                        <div className="text-sm font-semibold text-gray-800">${order.total.toFixed(2)}</div>

                        {/* Status dropdown */}
                        <select
                          value={order.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>

                        <span className="text-gray-400 text-xs">{expandedOrder === order.id ? '▲ hide' : '▼ details'}</span>
                      </div>

                      {/* Expanded order items */}
                      {expandedOrder === order.id && (
                        <div className="border-t px-6 py-4 bg-gray-50">
                          <p className="text-xs text-gray-500 mb-3 font-semibold uppercase">Items</p>
                          <div className="space-y-3">
                            {order.items.map(item => (
                              <div key={item.id} className="flex items-center gap-4">
                                <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg border" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">{item.product.name}</p>
                                  <p className="text-xs text-gray-400">Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t text-xs text-gray-400">
                            <span className="font-medium text-gray-600">Delivery address: </span>
                            {order.address}, {order.city} — {order.zip}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
