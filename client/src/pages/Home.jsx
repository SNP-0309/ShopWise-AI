import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiSearch, FiArrowRight, FiZap, FiShield, FiStar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { productAPI } from '../services/api';
import logoImg from '../assets/logo.png';


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

const AdidasHero = ({ searchQuery, setSearchQuery, handleSearch, HERO_QUERIES, heroPlaceholder, stores }) => {
  return (
    <div>
      <div className="adidas-hero">
        {/* Panel 1: Left - Real Laptop/Typing Image with Overlay */}
        <div className="adidas-panel">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80" 
            alt="Smart Shopping" 
            referrerPolicy="no-referrer"
          />
          <div className="adidas-overlay" />
          
          {/* Content Overlay */}
          <div className="adidas-content" style={{ padding: '2rem 1.5rem' }}>
            <div className="adidas-block-title">COMPARE 7+ STORES</div>
            <div className="adidas-block-text">
              Instantly track prices across Amazon, Flipkart, Croma, Reliance Digital & more. Never overpay again.
            </div>
            
            {/* Inline Button Group */}
            <div className="adidas-btn-group">
              <Link to="/search?q=laptop" className="adidas-btn-action">
                TECH →
              </Link>
              <Link to="/search?q=fashion" className="adidas-btn-action">
                FASHION →
              </Link>
              <Link to="/search?q=deals" className="adidas-btn-action">
                DEALS →
              </Link>
            </div>
          </div>
        </div>

        {/* Panel 2: Middle - Core Search & Slogan with Solid Brand Background */}
        <div className="adidas-panel-center" style={{ overflow: 'hidden' }}>
          {/* Subtle Adidas Three Stripes Background Graphic */}
          <div className="adidas-stripes">
            <div className="adidas-stripe" />
            <div className="adidas-stripe" />
            <div className="adidas-stripe" />
          </div>

          <div style={{
            position: 'absolute', width: '250px', height: '250px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
            top: '10%', pointerEvents: 'none',
          }} />

          <span style={{
            background: 'rgba(255, 255, 255, 0.12)', border: '2px solid black',
            borderRadius: 0, padding: '0.375rem 1rem',
            fontSize: '0.7rem', fontWeight: 800, color: 'white',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em',
            boxShadow: '3px 3px 0px rgba(0,0,0,0.9)',
            zIndex: 1,
            fontFamily: 'Oswald, sans-serif'
          }}>
            <HiSparkles size={12} style={{ color: 'var(--brand-accent)' }} />
            Powered by Gemini + Groq AI
          </span>

          <img 
            src={logoImg} 
            alt="ShopWise AI" 
            style={{ 
              width: '180px', 
              height: 'auto', 
              marginBottom: '1rem',
              border: '2px solid black',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.9)',
              background: 'black',
              zIndex: 1
            }} 
          />
          <p className="adidas-center-sub" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            COMPARE. DECIDE. SAVE.
          </p>

          {/* Integrated Search Bar */}
          <div className="adidas-search-container">
            <div className="adidas-search-box">
              <FiSearch size={20} color="#475569" style={{ flexShrink: 0 }} />
              <input
                id="hero-search-input"
                className="adidas-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={HERO_QUERIES[heroPlaceholder]}
              />
              <button
                id="hero-search-btn"
                className="adidas-search-btn"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>

          <Link 
            to="/search?q=laptop+mouse+headphones+under+80000" 
            style={{ 
              color: 'white', 
              fontWeight: 800, 
              fontSize: '0.8rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              borderBottom: '2px solid var(--brand-accent)', 
              paddingBottom: '2px', 
              transition: 'color 0.2s',
              zIndex: 1,
              fontFamily: 'Oswald, sans-serif',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
          >
            Try AI Shopping Agent →
          </Link>
        </div>

        {/* Panel 3: Right - Real Product close-up image with Stark Overlay */}
        <div className="adidas-panel adidas-panel-last">
          <img 
            src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80" 
            alt="Premium Products" 
            referrerPolicy="no-referrer"
          />
          <div className="adidas-overlay" />
          
          {/* Content Overlay */}
          <div className="adidas-content" style={{ padding: '2rem 1.5rem' }}>
            <div className="adidas-block-title">AI DECISION ENGINE</div>
            <div className="adidas-block-text">
              Don't read thousands of reviews. Our AI summarizes pros, cons, and verdict for you instantly.
            </div>

            {/* Inline Button Group */}
            <div className="adidas-btn-group">
              <button 
                onClick={() => {
                  document.getElementById('open-ai-chat-btn')?.click();
                }}
                className="adidas-btn-action"
              >
                CHAT WITH AI →
              </button>
              <Link to="/search?q=laptop+mouse+headphones+under+80000" className="adidas-btn-action">
                TRY COPILOT →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width strip of stores searches across */}
      <div className="store-strip">
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Oswald, sans-serif' }}>Searches across:</span>
        {stores.map((s) => (
          <span
            key={s.name}
            style={{
              background: 'var(--bg-card)',
              border: '2px solid black',
              borderRadius: 0,
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.9)',
              fontFamily: 'Oswald, sans-serif'
            }}
          >
            {s.emoji} {s.name}
          </span>
        ))}
      </div>
    </div>
  );
};

const AdidasPromoOffers = () => {
  const promos = [
    {
      subtitle: 'Premium Laptops',
      title: 'UPGRADE YOUR SETUP',
      deal: 'UP TO 40% OFF INTEL & M3',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      link: '/search?q=laptop',
      btnText: 'EXPLORE TECH'
    },
    {
      subtitle: 'Flagship Phones',
      title: 'ICONS NEVER MISS',
      deal: 'MINIMUM 25% SAVINGS',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      link: '/search?q=phone',
      btnText: 'SHOP PHONES'
    },
    {
      subtitle: 'Audiophile Gear',
      title: 'PURE AUDIO ESSENTIALS',
      deal: 'FLAT 30% OFF ANC HEARABLES',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      link: '/search?q=headphones',
      btnText: 'SHOP AUDIO'
    },
    {
      subtitle: 'Smart Wearables',
      title: 'SAVINGS OF THE SEASON',
      deal: 'FLAT 50% OFF TARGETS',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      link: '/search?q=smartwatch',
      btnText: 'SPECIAL OFFERS'
    }
  ];

  return (
    <div className="adidas-promo-grid">
      {promos.map((promo, idx) => (
        <div key={idx} className="adidas-promo-card">
          <img src={promo.image} alt={promo.title} referrerPolicy="no-referrer" />
          <div className="adidas-promo-overlay" />
          <div className="adidas-promo-content">
            <span className="adidas-promo-subtitle">{promo.subtitle}</span>
            <h3 className="adidas-promo-title">{promo.title}</h3>
            <span className="adidas-promo-deal">{promo.deal}</span>
            <Link to={promo.link} className="adidas-promo-btn">
              {promo.btnText} →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

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
      <AdidasHero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch} 
        HERO_QUERIES={HERO_QUERIES} 
        heroPlaceholder={heroPlaceholder}
        stores={stores}
      />

      {/* ===== ADIDAS PROMO OFFERS ===== */}
      <AdidasPromoOffers />

      {/* ===== SHOP BY CATEGORY ===== */}
      <section style={{ background: 'var(--bg-primary)', borderBottom: '2px solid var(--border)', padding: '3rem 0' }}>
        <div className="container">
          <div className="adidas-category-header-row" style={{ borderBottom: '2px solid var(--border)' }}>
            <h2 className="adidas-category-title">Shop by Category</h2>
            <Link to="/search?q=deals" className="adidas-category-shopall" style={{ textDecoration: 'none' }}>
              Shop All →
            </Link>
          </div>
          <div className="adidas-cat-grid">
            {[
              { label: 'Laptops', slug: 'laptop', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80' },
              { label: 'Phones', slug: 'phone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80' },
              { label: 'Audio', slug: 'headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
              { label: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80' },
            ].map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/search?q=${cat.slug}`} className="adidas-cat-card" style={{ textDecoration: 'none' }}>
                  <img src={cat.image} alt={cat.label} referrerPolicy="no-referrer" />
                  <div className="adidas-cat-overlay" />
                  <div className="adidas-cat-label">{cat.label}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED DEALS ===== */}
      <section style={{ background: 'var(--bg-primary)', borderBottom: '2px solid var(--border)', padding: '3rem 0' }} ref={featuredRef}>
        <div className="container">
          <div className="adidas-category-header-row" style={{ borderBottom: '2px solid var(--border)', marginBottom: '2rem' }}>
            <h2 className="adidas-category-title">🔥 Featured Deals</h2>
            <Link to="/search?q=deals" className="adidas-category-shopall" style={{ textDecoration: 'none' }}>
              View All →
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
      <section style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border)', padding: '4rem 0' }}>
        <div className="container">
          <div className="adidas-category-header-row" style={{ borderBottom: '2px solid var(--border)', marginBottom: '2.5rem' }}>
            <h2 className="adidas-category-title">Why ShopWise AI?</h2>
            <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              AI-Powered • Real-Time Data
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '2px solid var(--border)',
                  borderRadius: 0,
                  padding: '1.75rem',
                  boxShadow: '4px 4px 0px rgba(0,0,0,0.15)',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  cursor: 'default'
                }}
                whileHover={{ y: -4, boxShadow: '6px 6px 0px rgba(0,0,0,0.3)' }}
              >
                <div style={{
                  width: 48, height: 48,
                  background: 'black',
                  border: '2px solid black',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color, marginBottom: '1rem',
                  boxShadow: '3px 3px 0px ' + f.color
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRENDING ===== */}
      <section style={{ background: 'var(--bg-primary)', borderBottom: '2px solid var(--border)', padding: '3rem 0' }}>
        <div className="container">
          <div className="adidas-category-header-row" style={{ borderBottom: '2px solid var(--border)', marginBottom: '2rem' }}>
            <h2 className="adidas-category-title">📈 Trending Now</h2>
            <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              What people are searching for
            </span>
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
            className="adidas-ai-banner"
          >
            <h3 className="adidas-ai-banner-text">
              Meet Your AI Shopping Agent — Plan your entire setup within your budget
            </h3>
            <Link to="/search?q=laptop+mouse+headphones+under+80000" className="adidas-ai-banner-btn">
              Try AI Shopping Agent <FiArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="adidas-category-header-row" style={{ marginBottom: '2.5rem' }}>
            <h2 className="adidas-category-title">Loved by Shoppers</h2>
            <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              Real Stories • Real Savings
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="adidas-testimonial-card"
              >
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FiStar key={j} size={14} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', flexGrow: 1 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}>
                  <div className="adidas-testimonial-avatar">{t.avatar}</div>
                  <div>
                    <h4 className="adidas-testimonial-name">{t.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                      {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

