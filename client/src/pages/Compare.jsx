import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { productAPI, aiAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { useDebounce } from '../hooks/useDebounce';

const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function Compare() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoadingSearch(true);
    try {
      const { data } = await productAPI.search({ q: searchQuery });
      setSearchResults(data.products?.slice(0, 6) || []);
    } catch {}
    finally { setLoadingSearch(false); }
  };

  const addToCompare = (product) => {
    if (selectedProducts.length >= 4) return;
    if (selectedProducts.find((p) => p.id === product.id)) return;
    setSelectedProducts((prev) => [...prev, product]);
    setComparison(null);
  };

  const removeFromCompare = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
    setComparison(null);
  };

  const handleCompare = async () => {
    if (selectedProducts.length < 2) return;
    setLoadingCompare(true);
    try {
      const { data } = await aiAPI.compare({ products: selectedProducts });
      setComparison(data.comparison);
    } catch {}
    finally { setLoadingCompare(false); }
  };

  const allSpecKeys = selectedProducts.length > 0
    ? [...new Set(selectedProducts.flatMap((p) => Object.keys(p.specs || {})))]
    : [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '4rem' }}>
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="adidas-heading" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Compare Products</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Add up to 4 products and get an AI-powered side-by-side comparison</p>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: '0.75rem', maxWidth: 600, margin: '0 auto 2rem' }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder='Search products to compare...'
            className="adidas-input"
          />
          <button className="adidas-btn-primary" style={{ padding: '0.75rem 1.5rem', width: 'auto' }} onClick={handleSearch} disabled={loadingSearch}>
            {loadingSearch ? '...' : 'Search'}
          </button>
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <p className="adidas-heading" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Click a product to add it to comparison ({selectedProducts.length}/4)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {searchResults.map((product) => {
                const isSelected = selectedProducts.find((p) => p.id === product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => !isSelected && addToCompare(product)}
                    style={{
                      cursor: isSelected ? 'default' : 'pointer',
                      opacity: isSelected ? 0.5 : 1,
                      border: isSelected ? '2px solid black' : '2px solid transparent',
                      borderRadius: 0,
                      boxShadow: isSelected ? '3px 3px 0px rgba(0,0,0,0.9)' : 'none',
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected products */}
        {selectedProducts.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 className="adidas-heading" style={{ fontSize: '1.4rem' }}>Comparing {selectedProducts.length} Products</h2>
              <button
                className="adidas-btn-primary"
                style={{ padding: '0.65rem 1.25rem' }}
                onClick={handleCompare}
                disabled={selectedProducts.length < 2 || loadingCompare}
              >
                <HiSparkles size={16} />
                {loadingCompare ? 'Analyzing...' : 'AI Compare'}
              </button>
            </div>

            {/* AI Comparison result */}
            {comparison && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="adidas-card"
                style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(54,124,101,0.06)' }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 0, background: 'black', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <HiSparkles size={18} color="var(--brand-accent)" />
                  </div>
                  <div>
                    <p className="adidas-heading" style={{ fontWeight: 800, marginBottom: '0.25rem' }}>AI Verdict</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{comparison.summary}</p>
                  </div>
                </div>
                {comparison.winner && (
                  <div className="adidas-card" style={{ background: 'rgba(54,124,101,0.06)', border: '1px solid black', boxShadow: 'none', padding: '0.75rem' }}>
                    <p className="adidas-heading" style={{ fontSize: '0.85rem', color: '#367c65', fontWeight: 800 }}>🏆 Winner: {comparison.winner}</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{comparison.winnerReason}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Comparison table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid black' }}>
                {/* Product headers */}
                <thead>
                  <tr>
                    <th className="adidas-heading" style={{ padding: '1rem', background: 'var(--bg-secondary)', border: '2px solid black', width: 150, textAlign: 'left', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Spec</th>
                    {selectedProducts.map((p) => (
                      <th key={p.id} style={{ padding: '1rem', background: 'var(--bg-secondary)', border: '2px solid black', textAlign: 'center', minWidth: 200 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <img referrerPolicy="no-referrer" src={p.image} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 0, border: '1.5px solid black' }} />
                          <p className="adidas-heading" style={{ fontSize: '0.8rem', fontWeight: 800, lineHeight: 1.3 }}>{p.name}</p>
                          <p className="adidas-heading" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {formatPrice(Math.min(...(p.storeListings?.map((l) => l.price) || [0])))}
                          </p>
                          <button onClick={() => removeFromCompare(p.id)} style={{ background: 'none', border: '2px solid var(--danger)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.72rem', padding: '0.2rem 0.5rem', fontFamily: 'Oswald', textTransform: 'uppercase', fontWeight: 800 }}>
                            <FiTrash2 size={10} /> Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Rating row */}
                  <tr>
                    <td className="adidas-heading" style={{ padding: '0.875rem 1rem', border: '2px solid black', fontSize: '0.8rem', fontWeight: 800 }}>Rating</td>
                    {selectedProducts.map((p) => (
                      <td key={p.id} style={{ padding: '0.875rem', border: '2px solid black', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                        ⭐ {p.rating} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>({p.reviewCount?.toLocaleString('en-IN')})</span>
                      </td>
                    ))}
                  </tr>
                  {/* Spec rows */}
                  {allSpecKeys.map((key) => (
                    <tr key={key}>
                      <td className="adidas-heading" style={{ padding: '0.875rem 1rem', border: '2px solid black', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800 }}>{key}</td>
                      {selectedProducts.map((p) => (
                        <td key={p.id} style={{ padding: '0.875rem', border: '2px solid black', textAlign: 'center', fontSize: '0.85rem' }}>
                          {p.specs?.[key] || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add more */}
            {selectedProducts.length < 4 && (
              <button
                className="adidas-btn-secondary"
                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <FiPlus size={16} /> Add Another Product
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {selectedProducts.length === 0 && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</p>
            <h2 className="adidas-heading" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Start Comparing</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto' }}>
              Search for products above, then add them to compare side by side with AI-powered insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
