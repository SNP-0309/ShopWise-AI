import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiBell, FiExternalLink, FiStar, FiTruck, FiCheck, FiX, FiShare2 } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { productAPI } from '../services/api';
import { TextSkeleton } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const StoreColors = {
  amazon: '#FF9900', flipkart: '#2874F0', croma: '#00A550',
  relianceDigital: '#E31837', vijaySales: '#1A237E', myntra: '#FF3F6C', ajio: '#E64A19',
};

const StoreNames = {
  amazon: 'Amazon', flipkart: 'Flipkart', croma: 'Croma',
  relianceDigital: 'Reliance Digital', vijaySales: 'Vijay Sales', myntra: 'Myntra', ajio: 'Ajio',
};

// Get display name for any store key (including unknown SerpAPI sellers)
const getStoreName = (storeKey) =>
  StoreNames[storeKey] || (storeKey ? storeKey.charAt(0).toUpperCase() + storeKey.slice(1) : 'Store');

// Build a buy URL: use real URL if valid, otherwise fall back to Google Shopping search
const getBuyUrl = (url, productName, storeKey) => {
  if (url && url !== '#') return url;
  const storeName = getStoreName(storeKey);
  return `https://www.google.com/search?q=${encodeURIComponent(productName + ' buy on ' + storeName)}&tbm=shop`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [priceHistory, setPriceHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [alertTarget, setAlertTarget] = useState('');
  const [showAlertForm, setShowAlertForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    productAPI.getById(id)
      .then(({ data }) => {
        setProduct(data.product);
        setReviewSummary(data.reviewSummary);
        setPriceHistory(data.priceHistory);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddAlert = async () => {
    if (!isAuthenticated) { toast.error('Please sign in to set alerts'); return; }
    if (!alertTarget) { toast.error('Enter a target price'); return; }
    try {
      const bestListing = product.storeListings.reduce((a, b) => a.price < b.price ? a : b);
      await userAPI.createAlert({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        store: bestListing.store,
        currentPrice: bestListing.price,
        targetPrice: parseInt(alertTarget),
      });
      toast.success('Price alert set! We\'ll notify you.');
      setShowAlertForm(false);
    } catch { toast.error('Failed to set alert'); }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-xl)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: 32, width: '80%' }} />
            <div className="skeleton" style={{ height: 20, width: '50%' }} />
            <div className="skeleton" style={{ height: 48, width: '60%' }} />
            <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <p style={{ fontSize: '3rem' }}>😕</p>
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Go Home</Link>
      </div>
    );
  }

  const bestListing = product.storeListings?.reduce((a, b) => a.price < b.price ? a : b);
  const sortedListings = [...(product.storeListings || [])].sort((a, b) => a.price - b.price);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '4rem' }}>
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link>
          <span>/</span>
          <Link to={`/search?q=${product.category}`} style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{product.name}</span>
        </div>

        {/* Product Main */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '3rem', marginBottom: '3rem' }}>
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                background: 'var(--bg-secondary)', marginBottom: '1rem',
                aspectRatio: '1',
              }}
            >
              <img
                src={product.images?.[activeImg] || product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 72, height: 72, borderRadius: 'var(--radius-md)',
                      overflow: 'hidden', border: `2px solid ${i === activeImg ? 'var(--primary)' : 'var(--border)'}`,
                      padding: 0, cursor: 'pointer', background: 'var(--bg-secondary)',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Brand + Name */}
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{product.brand}</span>
              <h1 style={{ fontSize: '1.6rem', lineHeight: 1.3, marginBottom: '0.75rem' }}>{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={14} color="#F59E0B" fill={i < Math.floor(product.rating) ? '#F59E0B' : 'none'} />
                  ))}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{product.rating}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>({product.reviewCount?.toLocaleString('en-IN')} reviews)</span>
              </div>
            </div>

            {/* Best Price */}
            {bestListing && (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Best price on {getStoreName(bestListing.store)}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span className="price">{formatPrice(bestListing.price)}</span>
                  {bestListing.originalPrice > bestListing.price && (
                    <span className="price-original">{formatPrice(bestListing.originalPrice)}</span>
                  )}
                  {bestListing.discount > 0 && (
                    <span className="discount-tag">{bestListing.discount}% off</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <FiTruck size={12} />
                  <span>Delivery in {bestListing.delivery}</span>
                  {bestListing.inStock ? (
                    <><FiCheck size={12} color="var(--success)" /> <span style={{ color: 'var(--success)' }}>In Stock</span></>
                  ) : (
                    <><FiX size={12} color="var(--danger)" /> <span style={{ color: 'var(--danger)' }}>Out of Stock</span></>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href={getBuyUrl(bestListing?.url, product.name, bestListing?.store)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <FiExternalLink size={16} />
                {bestListing?.isFallback ? `Search on ${getStoreName(bestListing?.store)}` : `Buy on ${getStoreName(bestListing?.store)}`}
              </a>
              <button
                className="btn btn-secondary btn-icon btn-lg"
                onClick={() => setShowAlertForm(!showAlertForm)}
                title="Set Price Alert"
              >
                <FiBell size={18} />
              </button>
              <button className="btn btn-secondary btn-icon btn-lg" title="Share">
                <FiShare2 size={18} />
              </button>
            </div>

            {/* Price alert form */}
            {showAlertForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="ai-panel"
              >
                <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  🔔 Set Price Drop Alert
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    value={alertTarget}
                    onChange={(e) => setAlertTarget(e.target.value)}
                    placeholder="Target price (₹)"
                    className="input-field"
                    style={{ fontSize: '0.875rem' }}
                  />
                  <button className="btn btn-primary" onClick={handleAddAlert}>Set</button>
                </div>
              </motion.div>
            )}

            {/* Specs preview */}
            {product.specs && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Key Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {Object.entries(product.specs).slice(0, 6).map(([key, val]) => (
                    <div key={key} style={{
                      background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem 0.75rem',
                    }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key}</p>
                      <p style={{ fontSize: '0.82rem', fontWeight: 500 }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price comparison table */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>💰 Price Comparison</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="compare-table" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Store</th>
                  <th>Price</th>
                  <th>Original</th>
                  <th>Discount</th>
                  <th>Delivery</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedListings.map((listing, i) => (
                  <tr key={listing.store} style={{ background: i === 0 ? 'rgba(108,99,255,0.04)' : '' }}>
                    <td style={{ textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: StoreColors[listing.store] || '#6C63FF' }} />
                        <span style={{ fontWeight: i === 0 ? 700 : 500, fontSize: '0.875rem' }}>
                          {getStoreName(listing.store)}
                        </span>
                        {i === 0 && <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>BEST</span>}
                        {listing.isFallback && <span className="badge badge-secondary" style={{ fontSize: '0.6rem', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>SEARCH LINK</span>}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: i === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                      {formatPrice(listing.price)}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatPrice(listing.originalPrice || listing.price)}</td>
                    <td>
                      {listing.discount > 0 && (
                        <span className="badge badge-success">{listing.discount}%</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{listing.delivery}</td>
                    <td>
                      <span className={`badge ${listing.inStock ? 'badge-success' : 'badge-danger'}`}>
                        {listing.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <a
                        href={getBuyUrl(listing.url, product.name, listing.store)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm"
                        style={{
                          background: (StoreColors[listing.store] || '#6C63FF') + '20',
                          color: StoreColors[listing.store] || '#6C63FF',
                          border: `1px solid ${(StoreColors[listing.store] || '#6C63FF')}40`,
                          fontSize: '0.75rem',
                        }}
                      >
                        {listing.isFallback ? 'Search' : 'Buy'} <FiExternalLink size={10} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two-column: Price chart + AI Review */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Price History Chart */}
          {priceHistory?.prices && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>📈 Price History</h2>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Current', value: priceHistory.currentPrice, color: 'var(--primary)' },
                  { label: 'Lowest', value: priceHistory.lowestPrice, color: 'var(--success)' },
                  { label: 'Highest', value: priceHistory.highestPrice, color: 'var(--danger)' },
                ].map((item) => (
                  <div key={item.label} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{item.label}</p>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: item.color }}>{formatPrice(item.value)}</p>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={priceHistory.prices?.slice(-14)} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="recordedAt" tick={false} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v) => [formatPrice(v), 'Price']}
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#6C63FF" strokeWidth={2} fill="url(#priceGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* AI Review Summary */}
          {reviewSummary && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HiSparkles size={16} color="white" />
                </div>
                <h2 style={{ fontSize: '1.1rem' }}>AI Review Summary</h2>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem', fontStyle: 'italic' }}>
                "{reviewSummary.verdict}"
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.5rem' }}>✅ Pros</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {reviewSummary.pros?.map((pro, i) => (
                      <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.35rem' }}>
                        <span style={{ color: 'var(--success)', flexShrink: 0 }}>+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.5rem' }}>❌ Cons</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {reviewSummary.cons?.map((con, i) => (
                      <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.35rem' }}>
                        <span style={{ color: 'var(--danger)', flexShrink: 0 }}>−</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full specs */}
        {product.specs && (
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>📋 Full Specifications</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: '0.15rem' }}>{key}</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
