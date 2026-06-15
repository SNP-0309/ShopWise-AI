import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiTruck, FiZap } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const StoreColors = {
  amazon: '#FF9900',
  flipkart: '#2874F0',
  croma: '#00A550',
  relianceDigital: '#E31837',
  vijaySales: '#1A237E',
  myntra: '#FF3F6C',
  ajio: '#E64A19',
};

export default function ProductCard({ product, index = 0, onWishlist, isWishlisted }) {
  const [imgError, setImgError] = useState(false);
  
  if (!product) return null;

  const bestListing = product.storeListings?.reduce((a, b) => (a.price < b.price ? a : b));
  const highestPrice = product.storeListings ? Math.max(...product.storeListings.map((l) => l.originalPrice || l.price)) : 0;
  const maxDiscount = product.storeListings ? Math.max(...product.storeListings.map((l) => l.discount || 0)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="product-card card"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} style={{ display: 'block', position: 'relative' }}>
        <div style={{
          width: '100%', aspectRatio: '1', overflow: 'hidden',
          background: 'var(--bg-secondary)',
          position: 'relative',
        }}>
          <img
            src={imgError ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' : product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          {maxDiscount > 10 && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'var(--gradient-amber)',
              color: 'white', padding: '0.2rem 0.5rem',
              borderRadius: 6, fontSize: '0.7rem', fontWeight: 700,
            }}>
              {maxDiscount}% OFF
            </div>
          )}
          {/* Wishlist button */}
          <button
            onClick={(e) => { e.preventDefault(); onWishlist?.(product); }}
            className={`heart-btn ${isWishlisted ? 'active' : ''}`}
            style={{
              position: 'absolute', top: 12, right: 12,
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border)',
              color: isWishlisted ? '#EF4444' : 'var(--text-secondary)',
              fontSize: '1rem',
            }}
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Store badges */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {product.storeListings?.slice(0, 3).map((listing) => (
            <span
              key={listing.store}
              style={{
                fontSize: '0.65rem', fontWeight: 700,
                padding: '0.15rem 0.45rem', borderRadius: 4,
                background: StoreColors[listing.store] + '15',
                color: StoreColors[listing.store],
                border: `1px solid ${StoreColors[listing.store]}30`,
              }}
            >
              {listing.store.charAt(0).toUpperCase() + listing.store.slice(1)}
            </span>
          ))}
          {product.storeListings?.length > 3 && (
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>+{product.storeListings.length - 3}</span>
          )}
        </div>

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 style={{
            fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.4,
            color: 'var(--text-primary)',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <FiStar size={12} color="#F59E0B" fill="#F59E0B" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{product.rating}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({product.reviewCount?.toLocaleString('en-IN')})</span>
        </div>

        {/* Price */}
        {bestListing && (
          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="price" style={{ fontSize: '1.2rem' }}>{formatPrice(bestListing.price)}</span>
              {bestListing.originalPrice > bestListing.price && (
                <span className="price-original">{formatPrice(bestListing.originalPrice)}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              {bestListing.discount > 0 && (
                <span className="discount-tag">↓ {bestListing.discount}% off</span>
              )}
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <FiTruck size={10} /> {bestListing.delivery}
              </span>
            </div>
          </div>
        )}

        {/* Buy button */}
        <Link
          to={`/product/${product.id}`}
          className="btn btn-primary buy-btn"
          style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
        >
          <FiZap size={14} />
          Compare Prices
        </Link>
      </div>
    </motion.div>
  );
}
