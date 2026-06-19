import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX, FiCheck, FiShoppingBag, FiTrendingDown, FiInfo } from 'react-icons/fi';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const iconFor = (type) => {
  if (type === 'price_drop') return <FiTrendingDown size={14} style={{ color: 'var(--success)' }} />;
  if (type === 'order') return <FiShoppingBag size={14} style={{ color: 'var(--primary)' }} />;
  return <FiInfo size={14} style={{ color: 'var(--accent)' }} />;
};

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();
    // Poll every 60s for new notifications
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await userAPI.getNotifications();
      const notifs = data.notifications || [];
      setNotifications(notifs);
      setUnread(notifs.filter(n => !n.read).length);
    } catch {
      // Non-fatal: user may not be authed or DB may be unavailable
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="btn btn-icon btn-ghost"
        onClick={() => setOpen(!open)}
        title="Notifications"
        id="notification-bell-btn"
        style={{ position: 'relative' }}
      >
        <FiBell size={18} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 16, height: 16, borderRadius: '50%',
            background: 'var(--danger)', color: 'white',
            fontSize: '0.6rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-primary)',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
              width: 340, maxHeight: 420, overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              zIndex: 250,
            }}
          >
            {/* Header */}
            <div style={{
              padding: '0.875rem 1rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiBell size={16} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                {unread > 0 && (
                  <span style={{
                    background: 'var(--danger)', color: 'white',
                    borderRadius: 999, padding: '0.1rem 0.45rem',
                    fontSize: '0.68rem', fontWeight: 700,
                  }}>{unread}</span>
                )}
              </div>
              <button className="btn-icon btn-ghost" onClick={() => setOpen(false)} style={{ padding: 4 }}>
                <FiX size={14} />
              </button>
            </div>

            {/* Content */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <div className="spinner" style={{ width: 24, height: 24, margin: '0 auto 0.5rem' }} />
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔔</p>
                  <p style={{ fontSize: '0.875rem' }}>No notifications yet</p>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Price alerts will appear here</p>
                </div>
              ) : (
                notifications.map((n, i) => (
                  <div
                    key={n._id || i}
                    style={{
                      padding: '0.875rem 1rem',
                      borderBottom: '1px solid var(--border)',
                      background: n.read ? 'transparent' : 'rgba(108,99,255,0.04)',
                      transition: 'background 0.15s',
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 2,
                    }}>
                      {iconFor(n.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>
                        {n.message}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                    {!n.read && (
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', marginTop: 6, flexShrink: 0 }} />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div style={{
                padding: '0.625rem 1rem',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                display: 'flex', justifyContent: 'center',
              }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setUnread(0); setOpen(false); }}
                  style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                >
                  <FiCheck size={12} /> Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
