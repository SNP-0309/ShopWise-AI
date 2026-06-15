import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiSun, FiMoon, FiHeart, FiBell, FiUser, FiMenu, FiX, FiMessageSquare, FiLogOut, FiSettings } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';

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
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef();
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      productAPI.getSuggestions(debouncedQuery)
        .then(({ data }) => { setSuggestions(data.suggestions || []); setShowSuggestions(true); })
        .catch(() => {});
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
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
          <div style={{ flex: 1, maxWidth: 520, position: 'relative' }} ref={searchRef}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.5rem 0.75rem',
              transition: 'var(--transition)',
            }}
            onFocus={() => {}}
            >
              <FiSearch color="var(--text-muted)" size={18} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder='Search "gaming laptop under ₹70000"...'
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  fontSize: '0.9rem', color: 'var(--text-primary)',
                  fontFamily: 'Inter',
                }}
              />
              {searchQuery && (
                <button className="btn-icon btn-ghost" style={{ padding: 2 }} onClick={() => setSearchQuery('')}>
                  <FiX size={14} />
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    overflow: 'hidden',
                    zIndex: 200,
                  }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={() => { setSearchQuery(s); handleSearch(s); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        width: '100%', padding: '0.75rem 1rem',
                        background: 'transparent', border: 'none',
                        color: 'var(--text-primary)', fontSize: '0.875rem',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <FiSearch size={14} color="var(--text-muted)" />
                      {s}
                    </button>
                  ))}
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
            <Link to="/wishlist" className="btn btn-icon btn-ghost" style={{ position: 'relative' }}>
              <FiHeart size={18} />
            </Link>

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
