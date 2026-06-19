import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiSun, FiMoon, FiHeart, FiUser, FiMenu, FiX, FiMessageSquare, FiLogOut, FiSettings, FiArrowUpLeft } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';
import NotificationBell from '../common/NotificationBell';

const categories = [
  { name: 'Laptops', emoji: '💻', slug: 'laptop' },
  { name: 'Phones', emoji: '📱', slug: 'phone' },
  { name: 'Audio', emoji: '🎧', slug: 'headphones' },
  { name: 'TVs', emoji: '📺', slug: 'tv' },
  { name: 'Cameras', emoji: '📷', slug: 'camera' },
  { name: 'Fashion', emoji: '👗', slug: 'fashion' },
];

export default function Navbar({ onChatOpen }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef();
  const debouncedQuery = useDebounce(searchQuery, 250);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setSuggestionsLoading(true);
      productAPI.getSuggestions(debouncedQuery)
        .then(({ data }) => {
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        })
        .catch(() => setSuggestions([]))
        .finally(() => setSuggestionsLoading(false));
    } else {
      setSuggestions([]);
      setSuggestionsLoading(false);
    }
  }, [debouncedQuery]);

  const handleSearch = (q = searchQuery) => {
    if (!q.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? 'var(--shadow-md)' : 'none' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', height: '64px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--gradient-primary)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <HiSparkles color="white" size={20} />
            </div>
            <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.15rem' }}>
              Shop<span className="gradient-text">Wise</span> AI
            </span>
          </Link>

          {/* Search Bar (desktop) */}
          <div style={{ flex: 1, maxWidth: 560, position: 'relative' }} ref={searchRef}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-secondary)',
              border: `1.5px solid ${showSuggestions ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: showSuggestions ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)',
              padding: '0.5rem 0.75rem',
              transition: 'border-color 0.2s, border-radius 0.15s',
              boxShadow: showSuggestions ? '0 0 0 3px rgba(108,99,255,0.1)' : 'none',
            }}>
              <FiSearch color={showSuggestions ? 'var(--primary)' : 'var(--text-muted)'} size={18} style={{ transition: 'color 0.2s', flexShrink: 0 }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                placeholder='Search products, brands, or categories...'
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  fontSize: '0.9rem', color: 'var(--text-primary)',
                  fontFamily: 'Inter', outline: 'none',
                }}
              />
              {suggestionsLoading && (
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid var(--border)',
                  borderTopColor: 'var(--primary)',
                  animation: 'spin 0.6s linear infinite',
                  flexShrink: 0,
                }} />
              )}
              {searchQuery && !suggestionsLoading && (
                <button className="btn-icon btn-ghost" style={{ padding: 2, flexShrink: 0 }} onClick={() => { setSearchQuery(''); setSuggestions([]); }}>
                  <FiX size={14} />
                </button>
              )}
            </div>

            {/* Rich Suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--primary)',
                    borderTop: '1px solid var(--border)',
                    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                    overflow: 'hidden',
                    zIndex: 300,
                  }}
                >
                  {/* Trending when input is empty */}
                  {!searchQuery && (
                    <div style={{ padding: '0.75rem 1rem' }}>
                      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>🔥 Trending Searches</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {[
                          'iPhone 15 Pro', 'MacBook Air M3', 'Samsung S24 Ultra',
                          'Sony WH-1000XM5', 'Gaming Laptop', 'OnePlus 12R',
                          'Smart Watch', 'Wireless Earbuds',
                        ].map(tag => (
                          <button
                            key={tag}
                            onMouseDown={() => { setSearchQuery(tag); handleSearch(tag); }}
                            style={{
                              padding: '0.3rem 0.7rem', borderRadius: 20,
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border)',
                              fontSize: '0.78rem', cursor: 'pointer',
                              color: 'var(--text-secondary)',
                              transition: 'all 0.15s',
                              fontFamily: 'Inter',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Browse Categories</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {categories.map(cat => (
                            <button
                              key={cat.slug}
                              onMouseDown={() => handleSearch(cat.slug)}
                              style={{
                                padding: '0.3rem 0.65rem', borderRadius: 8,
                                background: 'transparent', border: '1px solid var(--border)',
                                fontSize: '0.78rem', cursor: 'pointer',
                                color: 'var(--text-secondary)', display: 'flex',
                                alignItems: 'center', gap: '0.3rem',
                                fontFamily: 'Inter',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              {cat.emoji} {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live suggestions while typing */}
                  {searchQuery && suggestions.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.6rem 1rem 0.3rem' }}>Suggestions</p>
                      {suggestions.map((s, i) => {
                        // Bold the matching part
                        const idx = s.toLowerCase().indexOf(searchQuery.toLowerCase());
                        const before = idx >= 0 ? s.slice(0, idx) : s;
                        const match = idx >= 0 ? s.slice(idx, idx + searchQuery.length) : '';
                        const after = idx >= 0 ? s.slice(idx + searchQuery.length) : '';
                        return (
                          <button
                            key={i}
                            onMouseDown={() => { setSearchQuery(s); handleSearch(s); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.75rem',
                              width: '100%', padding: '0.65rem 1rem',
                              background: 'transparent', border: 'none',
                              color: 'var(--text-primary)', fontSize: '0.875rem',
                              cursor: 'pointer', textAlign: 'left',
                              transition: 'background 0.12s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <FiSearch size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                            <span>
                              {before}
                              <strong style={{ color: 'var(--primary)' }}>{match}</strong>
                              {after}
                            </span>
                            <FiArrowUpLeft size={12} color="var(--text-muted)" style={{ marginLeft: 'auto', flexShrink: 0, opacity: 0.5 }} />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* No results state */}
                  {searchQuery && !suggestionsLoading && suggestions.length === 0 && (
                    <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <FiSearch size={14} />
                      Press <kbd style={{ padding: '0.1rem 0.4rem', borderRadius: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.75rem', fontFamily: 'monospace' }}>Enter</kbd> to search for "{searchQuery}"
                    </div>
                  )}

                  {/* Bottom hint */}
                  {searchQuery && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.5rem 1rem',
                      borderTop: '1px solid var(--border)',
                      background: 'var(--bg-secondary)',
                    }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Real-time results via Google Shopping</span>
                      <button
                        onMouseDown={() => handleSearch()}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          padding: '0.25rem 0.6rem', borderRadius: 6,
                          background: 'var(--primary)', color: 'white',
                          border: 'none', fontSize: '0.72rem', cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        <FiSearch size={10} /> Search
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Categories (desktop) */}
          <div style={{ position: 'relative', display: 'none' }} className="categories-nav">
            <button
              className="btn btn-ghost"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
              style={{ fontSize: '0.875rem' }}
            >
              Categories ▾
            </button>
            <AnimatePresence>
              {showCategories && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                  style={{
                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '0.5rem',
                    boxShadow: 'var(--shadow-lg)', display: 'grid',
                    gridTemplateColumns: '1fr 1fr', gap: '0.25rem', minWidth: 220, zIndex: 200,
                  }}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/search?q=${cat.slug}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem', transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>{cat.emoji}</span> {cat.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexShrink: 0 }}>
            {/* AI Chat */}
            <button
              className="btn btn-primary btn-sm"
              onClick={onChatOpen}
              id="open-ai-chat-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <HiSparkles size={14} />
              <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>AI Chat</span>
            </button>

            {/* Theme toggle */}
            <button
              className="btn btn-icon btn-ghost"
              onClick={toggleTheme}
              id="theme-toggle-btn"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="btn btn-icon btn-ghost" style={{ position: 'relative' }} title="Wishlist">
              <FiHeart size={18} />
            </Link>

            {/* Notification Bell */}
            <NotificationBell />

            {/* User */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-icon btn-ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  id="user-menu-btn"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                  ) : (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--gradient-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', color: 'white', fontWeight: 700,
                    }}>
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)', padding: '0.5rem',
                        boxShadow: 'var(--shadow-lg)', minWidth: 180, zIndex: 200,
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.875rem 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.25rem' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                      </div>
                      {[
                        { label: 'Dashboard', icon: <FiUser size={14} />, to: '/dashboard' },
                        { label: 'Wishlist', icon: <FiHeart size={14} />, to: '/wishlist' },
                        { label: 'Settings', icon: <FiSettings size={14} />, to: '/dashboard' },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setShowUserMenu(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.625rem',
                            padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)',
                            fontSize: '0.875rem', transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.625rem',
                          width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-sm)',
                          background: 'transparent', border: 'none',
                          color: 'var(--danger)', fontSize: '0.875rem', cursor: 'pointer',
                          marginTop: '0.25rem', borderTop: '1px solid var(--border)',
                          paddingTop: '0.75rem',
                        }}
                      >
                        <FiLogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
