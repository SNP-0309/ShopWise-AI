import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiSearch, FiMic, FiArrowRight, FiZap, FiTrendingUp, FiShield, FiStar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { productAPI } from '../services/api';

const categories = [
  { icon: '💻', label: 'Laptops', slug: 'laptop' },
  { icon: '📱', label: 'Phones', slug: 'phone' },
  { icon: '🎧', label: 'Audio', slug: 'headphones' },
  { icon: '📺', label: 'TVs', slug: 'tv' },
  { icon: '📷', label: 'Cameras', slug: 'camera' },
  { icon: '⌚', label: 'Watches', slug: 'smartwatch' },
  { icon: '🖱️', label: 'Accessories', slug: 'mouse' },
  { icon: '👗', label: 'Fashion', slug: 'fashion' },
];

const stores = [
  { name: 'Amazon', color: '#FF9900', emoji: '🛒' },
  { name: 'Flipkart', color: '#2874F0', emoji: '🛍️' },
  { name: 'Croma', color: '#00A550', emoji: '🏪' },
  { name: 'Reliance Digital', color: '#E31837', emoji: '📱' },
  { name: 'Vijay Sales', color: '#1A237E', emoji: '🏬' },
  { name: 'Myntra', color: '#FF3F6C', emoji: '👗' },
  { name: 'Ajio', color: '#E64A19', emoji: '👔' },
];

const features = [
  { icon: <HiSparkles size={24} />, title: 'AI-Powered Search', desc: 'Type naturally — "gaming laptop under ₹70k for coding". Our AI understands you.', color: '#6C63FF' },
  { icon: <FiZap size={24} />, title: 'Instant Comparison', desc: 'Compare prices from 7+ stores in milliseconds. Never overpay again.', color: '#F59E0B' },
  { icon: <FiStar size={24} />, title: 'Review Summarizer', desc: 'AI reads thousands of reviews and gives you the key pros, cons & verdict.', color: '#06B6D4' },
  { icon: <FiShield size={24} />, title: 'Price Drop Alerts', desc: 'Set a target price. We\'ll notify you the moment it drops. Simple.', color: '#10B981' },
];

const testimonials = [
  { name: 'Aryan K.', location: 'Mumbai', text: 'Saved ₹8,000 on my gaming laptop compared to what Amazon showed me first! ShopWise AI found Flipkart had a better deal I never would have found.', rating: 5, avatar: '🧑‍💻' },
  { name: 'Priya S.', location: 'Bangalore', text: 'The AI review summarizer is incredible. Instead of reading 2000 reviews, I got the key points in 10 seconds. Bought the right phone first try!', rating: 5, avatar: '👩‍💼' },
  { name: 'Rahul M.', location: 'Delhi', text: 'The AI shopping agent planned my entire college setup — laptop, mouse, headphones — all under ₹80,000. Mind-blowing feature!', rating: 5, avatar: '🎓' },
];

const HERO_QUERIES = [
  '"Gaming laptop under ₹70,000 for coding..."',
  '"Best phone camera under ₹30,000..."',
  '"Wireless headphones with ANC..."',
  '"Compare iPhone 15 vs Galaxy S24..."',
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [heroPlaceholder, setHeroPlaceholder] = useState(0);
  const featuredRef = useRef();
  const featuredInView = useInView(featuredRef, { once: true });

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroPlaceholder((p) => (p + 1) % HERO_QUERIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    productAPI.getTrending()
      .then(({ data }) => setTrending(data.products || []))
      .catch(() => {})
      .finally(() => setLoadingTrending(false));
    
    productAPI.getFeatured()
      .then(({ data }) => setFeatured(data.deals || []))
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '4rem 1.5rem' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
          >
            <span style={{
              background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: 999, padding: '0.375rem 1rem',
              fontSize: '0.8rem', fontWeight: 600, color: '#A78BFA',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              <HiSparkles size={14} />
              Powered by Gemini + Groq AI
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '1.25rem' }}
          >
            Shop Smarter with{' '}
            <span className="gradient-text">AI Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.65)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}
          >
            Compare prices across Amazon, Flipkart, Croma & 7+ stores. AI-powered recommendations, review summaries, and price alerts — all in one place.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ maxWidth: 680, margin: '0 auto' }}
          >
            <div className="search-hero">
              <HiSparkles size={20} color="rgba(255,255,255,0.6)" />
              <input
                id="hero-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={HERO_QUERIES[heroPlaceholder]}
                style={{ flex: 1 }}
              />
              <button
                id="hero-search-btn"
                onClick={handleSearch}
                className="btn btn-primary btn-lg"
                style={{ borderRadius: 20, padding: '0.75rem 1.5rem' }}
              >
                <FiSearch size={18} />
                Search
              </button>
            </div>
          </motion.div>

          {/* Store logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Searches across</span>
            {stores.map((s) => (
              <span
                key={s.name}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '0.25rem 0.6rem',
                  fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)',
                }}
              >
                {s.emoji} {s.name}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section-sm" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Browse by Category</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Find the best deals across all product categories</p>
          </div>
          <div className="categories-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))' }}>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/search?q=${cat.slug}`}>
                  <div className="category-pill">
                    <span className="icon">{cat.icon}</span>
                    <span className="label">{cat.label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DEALS ===== */}
      <section className="section" ref={featuredRef}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>🔥 Featured Deals</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Today's best prices, curated by AI</p>
            </div>
            <Link to="/search?q=deals" className="btn btn-secondary btn-sm">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="products-grid">
            {loadingFeatured
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
              Why <span className="gradient-text">ShopWise AI?</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              We combine real-time marketplace data with AI to help you make smarter purchases — every time.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card"
                style={{ padding: '1.75rem' }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: f.color + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color, marginBottom: '1rem',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING ===== */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                <FiTrendingUp style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--primary)' }} />
                Trending Now
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>What people are searching for</p>
            </div>
          </div>
          <div className="products-grid">
            {loadingTrending
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : trending.slice(0, 4).map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        </div>
      </section>

      {/* ===== AI BANNER ===== */}
      <section className="section-sm">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'var(--gradient-hero)',
              borderRadius: 'var(--radius-2xl)',
              padding: '3rem',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <div style={{
              position: 'absolute', width: 300, height: 300,
              background: 'radial-gradient(circle, rgba(108,99,255,0.4) 0%, transparent 70%)',
              top: -100, right: -50, pointerEvents: 'none',
            }} />
            <HiSparkles size={40} color="#A78BFA" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.75rem' }}>
              Meet Your AI Shopping Agent
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 480, margin: '0 auto 2rem', fontSize: '1rem' }}>
              Tell our AI your budget and needs. It'll create a complete shopping plan across multiple categories — all within your budget.
            </p>
            <Link to="/search?q=laptop+mouse+headphones+under+80000" className="btn btn-primary btn-lg">
              Try AI Shopping Agent <FiArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Loved by Shoppers</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Real stories from real users who saved money with ShopWise AI</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card"
                style={{ padding: '1.75rem' }}
              >
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FiStar key={j} size={14} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2rem' }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '3rem 0 1.5rem',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 32, height: 32, background: 'var(--gradient-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HiSparkles color="white" size={16} />
                </div>
                <span style={{ fontFamily: 'Sora', fontWeight: 800 }}>ShopWise AI</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                India's smartest shopping aggregator. Compare prices, read AI summaries, and save money every time.
              </p>
            </div>
            {[
              { heading: 'Product', links: ['Search', 'Compare', 'Wishlist', 'AI Chat', 'Price Alerts'] },
              { heading: 'Stores', links: ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Vijay Sales'] },
              { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Privacy', 'Terms'] },
            ].map((col) => (
              <div key={col.heading}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>{col.heading}</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', transition: 'color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      >{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© 2026 ShopWise AI. All rights reserved.</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Made with ❤️ for smart Indian shoppers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
