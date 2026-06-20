import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiSliders, FiX, FiStar, FiCheck, FiZap } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { productAPI } from '../services/api';

const sortOptions = [
  { label: 'Most Relevant', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Rated', value: 'rating' },
  { label: 'Most Reviewed', value: 'reviews' },
];

const storeFilters = ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Vijay Sales'];

const StoreColors = {
  amazon: '#FF9900', flipkart: '#2874F0', croma: '#00A550',
  relianceDigital: '#E31837', vijaySales: '#1A237E',
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [aiParsed, setAiParsed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('relevance');
  const [maxBudget, setMaxBudget] = useState('');
  const [minRating, setMinRating] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setResults([]);
    productAPI.search({ q: query, maxBudget: maxBudget || undefined, rating: minRating || undefined, sort })
      .then(({ data }) => {
        setResults(data.products || []);
        setRecommendation(data.recommendation);
        setAiParsed(data.aiParsed);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query, sort, maxBudget, minRating]);

  const sortedResults = [...results].sort((a, b) => {
    const aPrice = Math.min(...(a.storeListings?.map((l) => l.price) || [0]));
    const bPrice = Math.min(...(b.storeListings?.map((l) => l.price) || [0]));
    if (sort === 'price_asc') return aPrice - bPrice;
    if (sort === 'price_desc') return bPrice - aPrice;
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'reviews') return b.reviewCount - a.reviewCount;
    return 0;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Search header */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '1.25rem 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 className="adidas-heading" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {loading ? 'Searching...' : `${total} results for "${query}"`}
              </h1>
              {aiParsed && !loading && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {aiParsed.category && (
                    <span className="adidas-badge">📦 {aiParsed.category}</span>
                  )}
                  {aiParsed.budget && (
                    <span className="adidas-badge" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>💰 Under ₹{aiParsed.budget.toLocaleString('en-IN')}</span>
                  )}
                  {aiParsed.usage && (
                    <span className="adidas-badge" style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--info)' }}>🎯 {aiParsed.usage}</span>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="adidas-input"
                style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 1rem', fontSize: '0.85rem', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', fontWeight: 800 }}
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button
                className="adidas-btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <FiSliders size={14} /> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Sidebar Filters */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="adidas-card"
                style={{
                  width: 240, flexShrink: 0,
                  padding: '1.5rem',
                  position: 'sticky', top: 80,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 className="adidas-heading" style={{ fontSize: '1.1rem', fontWeight: 800 }}>Filters</h3>
                  <button className="adidas-btn-secondary" style={{ width: 32, height: 32, padding: 0 }} onClick={() => setFilterOpen(false)}>
                    <FiX size={16} />
                  </button>
                </div>

                {/* Budget */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="adidas-heading" style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', display: 'block' }}>Max Budget (₹)</label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="adidas-input"
                    placeholder="e.g. 70000"
                    style={{ fontSize: '0.875rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {[25000, 50000, 75000, 100000].map((b) => (
                      <button
                        key={b}
                        onClick={() => setMaxBudget(String(b))}
                        className={`adidas-btn-${maxBudget === String(b) ? 'primary' : 'secondary'}`}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', width: 'auto' }}
                      >
                        ₹{(b / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min Rating */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="adidas-heading" style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', display: 'block' }}>Min Rating</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[3, 3.5, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(String(r))}
                        className={`adidas-btn-${minRating === String(r) ? 'primary' : 'secondary'}`}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 2, width: 'auto' }}
                      >
                        <FiStar size={10} fill={minRating === String(r) ? 'white' : '#F59E0B'} color={minRating === String(r) ? 'white' : '#F59E0B'} />
                        {r}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear filters */}
                {(maxBudget || minRating) && (
                  <button
                    className="adidas-btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => { setMaxBudget(''); setMinRating(''); }}
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* AI Recommendation Panel */}
            {recommendation && !loading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="adidas-card"
                style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(54,124,101,0.06)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 0,
                    background: 'black', border: '1px solid black',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <HiSparkles size={18} color="var(--brand-accent)" />
                  </div>
                  <div>
                    <p className="adidas-heading" style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '1.1rem' }}>AI Recommendation</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {recommendation.summary}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                  {recommendation.bestPrice && (
                    <div className="adidas-card" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid black', boxShadow: 'none', padding: '0.75rem' }}>
                      <p className="adidas-heading" style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>💰 Best Price</p>
                      <p className="adidas-heading" style={{ fontSize: '0.85rem', fontWeight: 800 }}>{recommendation.bestPrice.store}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recommendation.bestPrice.reason}</p>
                    </div>
                  )}
                  {recommendation.bestRating && (
                    <div className="adidas-card" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid black', boxShadow: 'none', padding: '0.75rem' }}>
                      <p className="adidas-heading" style={{ fontSize: '0.7rem', color: 'var(--warning)', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>⭐ Best Rated</p>
                      <p className="adidas-heading" style={{ fontSize: '0.85rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{recommendation.bestRating.product}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recommendation.bestRating.reason}</p>
                    </div>
                  )}
                  {recommendation.recommended && (
                    <div className="adidas-card" style={{ background: 'rgba(54,124,101,0.06)', border: '1px solid black', boxShadow: 'none', padding: '0.75rem' }}>
                      <p className="adidas-heading" style={{ fontSize: '0.7rem', color: '#367c65', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>🏆 AI Top Pick</p>
                      <p className="adidas-heading" style={{ fontSize: '0.85rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{recommendation.recommended.product}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recommendation.recommended.reason}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Results grid */}
            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : sortedResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
                <h2 className="adidas-heading" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>No results found</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Try a different search term or remove filters</p>
                <Link to="/" className="adidas-btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex', padding: '0.75rem 2rem' }}>
                  Back to Home
                </Link>
              </div>
            ) : (
              <div className="products-grid">
                {sortedResults.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
