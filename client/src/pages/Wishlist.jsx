import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiExternalLink, FiBell, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function Wishlist() {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('wishlist');

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    Promise.all([userAPI.getWishlist(), userAPI.getAlerts()])
      .then(([wRes, aRes]) => {
        const items = wRes.data.wishlist?.flatMap((w) => w.products) || [];
        setWishlist(items);
        setAlerts(aRes.data.alerts || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleRemove = async (productId) => {
    try {
      await userAPI.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((p) => p.productId !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
  };

  const handleDeleteAlert = async (id) => {
    try {
      await userAPI.deleteAlert(id);
      setAlerts((prev) => prev.filter((a) => a._id !== id));
      toast.success('Alert deleted');
    } catch { toast.error('Failed to delete alert'); }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</p>
        <h1 style={{ marginBottom: '0.5rem' }}>Your Wishlist</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Sign in to save products and get price alerts.</p>
        <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '4rem' }}>
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Wishlist & Alerts</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          {[
            { key: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: '❤️' },
            { key: 'alerts', label: `Price Alerts (${alerts.length})`, icon: '🔔' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`btn ${tab === t.key ? 'btn-primary' : 'btn-ghost'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card skeleton" style={{ height: 200 }} />
            ))}
          </div>
        ) : tab === 'wishlist' ? (
          wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</p>
              <h2 style={{ marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Search for products and click the heart icon to save them here.</p>
              <Link to="/" className="btn btn-primary">Explore Products</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {wishlist.map((item, i) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card"
                  style={{ padding: '1.25rem' }}
                >
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/product/${item.productId}`}>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </p>
                      </Link>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{item.store}</p>
                      {item.price && <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>{formatPrice(item.price)}</p>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <Link to={`/product/${item.productId}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                      View Product
                    </Link>
                    <button
                      className="btn btn-secondary btn-icon btn-sm"
                      onClick={() => handleRemove(item.productId)}
                      style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</p>
              <h2 style={{ marginBottom: '0.5rem' }}>No price alerts</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Open a product page and click the bell icon to set a price drop alert.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alerts.map((alert, i) => (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card"
                  style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  {alert.productImage && (
                    <img src={alert.productImage} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.productName}</p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Current: <strong style={{ color: 'var(--text-primary)' }}>{formatPrice(alert.currentPrice)}</strong></span>
                      <span style={{ color: 'var(--success)' }}>Target: <strong>{formatPrice(alert.targetPrice)}</strong></span>
                      <span className={`badge ${alert.triggered ? 'badge-success' : 'badge-primary'}`}>
                        {alert.triggered ? '✅ Triggered' : '⏳ Watching'}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary btn-icon btn-sm"
                    onClick={() => handleDeleteAlert(alert._id)}
                    style={{ color: 'var(--danger)' }}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
