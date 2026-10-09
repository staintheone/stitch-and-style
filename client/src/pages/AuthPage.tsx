import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

type Tab = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ── LOGIN ──────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      login(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/catalog');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // ── REGISTER ──────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); 
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      login(data.token, data.user);
      navigate('/catalog');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Editorial Left Hero Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
          alt="Fashion Editorial"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        
        <div className="relative z-10 flex flex-col justify-between p-16 text-white w-full">
          <div>
            <span className="text-2xl font-black tracking-widest uppercase font-serif">
              Stitch &amp; Style
            </span>
          </div>

          <div className="space-y-4 max-w-md">
            <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
              Autumn / Winter Edition
            </span>
            <h2 className="text-4xl font-serif font-light leading-snug">
              Curated silhouettes designed for modern living.
            </h2>
            <p className="text-sm text-gray-300 font-light leading-relaxed">
              Join our members club for exclusive early access to drops, private previews, and seamless order management.
            </p>
          </div>

          <div className="text-xs tracking-widest uppercase text-gray-400">
            Crafted with uncompromising care
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-gray-50/50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-black tracking-widest uppercase font-serif text-gray-900">
              Stitch &amp; Style
            </h1>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Contemporary Wardrobe</p>
          </div>

          {/* Clean Segmented Tab Switcher */}
          <div className="flex border-b border-gray-100 mb-8">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-bold transition-all relative ${
                tab === 'login'
                  ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest font-bold transition-all relative ${
                tab === 'register'
                  ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {success}
            </div>
          )}

          {/* ── SIGN IN ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Authenticating…' : 'Access Account'}
              </button>
            </form>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating Account…' : 'Join Membership'}
              </button>
            </form>
          )}

          {/* Guest Link */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => navigate('/catalog')}
              className="text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition font-medium"
            >
              Continue as Guest &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
