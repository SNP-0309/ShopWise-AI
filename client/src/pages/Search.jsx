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
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                {loading ? 'Searching...' : `${total} results for "${query}"`}
              </h1>
              {aiParsed && !loading && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {aiParsed.category && (
                    <span className="badge badge-primary">📦 {aiParsed.category}</span>
                  )}
                  {aiParsed.budget && (
                    <span className="badge badge-success">💰 Under ₹{aiParsed.budget.toLocaleString('en-IN')}</span>
                  )}
                  {aiParsed.usage && (
                    <span className="badge badge-cyan">🎯 {aiParsed.usage}</span>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field"
                style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button
                className="btn btn-secondary btn-sm"
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
                style={{
                  width: 240, flexShrink: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  position: 'sticky', top: 80,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Filters</h3>
                  <button className="btn-ghost btn-icon" onClick={() => setFilterOpen(false)}>
                    <FiX size={16} />
                  </button>
                </div>

                {/* Budget */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Max Budget (₹)</label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="input-field"
                    placeholder="e.g. 70000"
                    style={{ fontSize: '0.875rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {[25000, 50000, 75000, 100000].map((b) => (
                      <button
                        key={b}
                        onClick={() => setMaxBudget(String(b))}
                        className={`btn btn-sm ${maxBudget === String(b) ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                      >
                        ₹{(b / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min Rating */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Min Rating</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[3, 3.5, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(String(r))}
                        className={`btn btn-sm ${minRating === String(r) ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 2 }}
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
                    className="btn btn-secondary btn-sm"
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
                className="ai-panel"
                style={{ marginBottom: '1.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <HiSparkles size={18} color="white" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.95rem' }}>AI Recommendation</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {recommendation.summary}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                  {recommendation.bestPrice && (
                    <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '0.75rem' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>💰 Best Price</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{recommendation.bestPrice.store}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recommendation.bestPrice.reason}</p>
                    </div>
                  )}
                  {recommendation.bestRating && (
                    <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '0.75rem' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--warning)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>⭐ Best Rated</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{recommendation.bestRating.product}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recommendation.bestRating.reason}</p>
                    </div>
                  )}
                  {recommendation.recommended && (
                    <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 10, padding: '0.75rem' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>🏆 AI Top Pick</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{recommendation.recommended.product}</p>
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
                <h2 style={{ marginBottom: '0.5rem' }}>No results found</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Try a different search term or remove filters</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
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
