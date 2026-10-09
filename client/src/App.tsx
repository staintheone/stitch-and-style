// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboard from './admin/AdminDashboard';
import AddProductPage from './admin/AddProductPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Auth page is now the root */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />

          {/* Main store */}
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />

          {/* Admin routes — protected */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/add-product" element={<ProtectedRoute requireAdmin={true}><AddProductPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
