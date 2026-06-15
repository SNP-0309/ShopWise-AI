import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiHeart, FiBell, FiTrash2, FiClock, FiSettings, FiCamera } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'alerts') {
      userAPI.getAlerts()
        .then(({ data }) => setAlerts(data.alerts || []))
        .catch(() => {});
    } else if (activeTab === 'history') {
      userAPI.getSearchHistory()
        .then(({ data }) => setHistory(data.history || []))
        .catch(() => {});
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile({ name });
      if (res?.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(res?.message || 'Update failed');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      await userAPI.deleteAlert(id);
      setAlerts(alerts.filter(a => a._id !== id));
      toast.success('Price alert deleted');
    } catch {
      toast.error('Failed to delete alert');
    }
  };

  return (
    <div style={{ minHeight: '90vh', background: 'var(--bg-primary)', padding: '3rem 1.5rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem' }}>
        
        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', color: 'white', fontWeight: 800
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{user?.name}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
          </div>

          {[
            { id: 'profile', label: 'My Profile', icon: <FiUser /> },
            { id: 'alerts', label: 'Price Alerts', icon: <FiBell /> },
            { id: 'history', label: 'Search History', icon: <FiClock /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                justifyContent: 'flex-start',
                background: activeTab === tab.id ? 'var(--gradient-primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(108,99,255,0.2)' : 'none'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card" style={{ padding: '2.5rem 2rem', background: 'var(--bg-card)' }}>
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>👤 Profile Information</h2>
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 480 }}>
                <div>
                  <label htmlFor="dashboard-name-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                  <input
                    id="dashboard-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="dashboard-email-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
                  <input
                    id="dashboard-email-input"
                    type="email"
                    value={email}
                    disabled
                    className="input-field"
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
                <button id="dashboard-save-profile-btn" type="submit" disabled={loading} className="btn btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🔔 Active Price Alerts</h2>
              {alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔔</p>
                  <p>You don't have any active price alerts set up yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {alerts.map((alert) => (
                    <div key={alert._id} className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <img src={alert.productImage} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{alert.productName}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Current: <span style={{ fontWeight: 700 }}>₹{alert.currentPrice?.toLocaleString('en-IN')}</span> | Target: <span style={{ color: 'var(--success)', fontWeight: 700 }}>₹{alert.targetPrice?.toLocaleString('en-IN')}</span>
                          </p>
                        </div>
                      </div>
                      <button id={`delete-alert-${alert._id}`} onClick={() => handleDeleteAlert(alert._id)} className="btn btn-ghost" style={{ color: 'var(--danger)', padding: 8 }}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>⏱️ Recent Search History</h2>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔎</p>
                  <p>Your search history is empty.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {history.map((h, i) => (
                    <div key={i} className="card" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 500 }}>"{h.query}"</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(h.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
