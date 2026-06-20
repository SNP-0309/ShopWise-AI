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

  const SAGE_FALLBACK = '#475569';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="adidas-product-card"
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} style={{ display: 'block', position: 'relative' }}>
        <div className="adidas-card-img-container">
          <img 
            referrerPolicy="no-referrer" 
            src={imgError ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' : product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="adidas-card-img"
          />
          {maxDiscount > 10 && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: '#EF4444',
              color: 'white', padding: '0.2rem 0.5rem',
              border: '2px solid black',
              fontSize: '0.7rem', fontWeight: 800,
              fontFamily: 'Oswald, sans-serif',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.9)',
              letterSpacing: '0.05em'
            }}>
              {maxDiscount}% OFF
            </div>
          )}
          {/* Wishlist button */}
          <button
            onClick={(e) => { e.preventDefault(); onWishlist?.(product); }}
            className="adidas-heart-btn"
            title="Wishlist"
          >
            <FiHeart 
              size={18} 
              style={{ 
                fill: isWishlisted ? '#EF4444' : 'none', 
                stroke: isWishlisted ? '#EF4444' : 'currentColor' 
              }} 
            />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="adidas-card-content">
        {/* Store badges */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
          {product.storeListings?.slice(0, 3).map((listing) => (
            <span
              key={listing.store}
              style={{
                fontSize: '0.6rem', fontWeight: 800,
                padding: '0.15rem 0.4rem', borderRadius: 0,
                border: '1px solid black',
                background: 'white',
                color: 'black',
                fontFamily: 'Oswald, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {listing.store}
            </span>
          ))}
          {product.storeListings?.length > 3 && (
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Oswald, sans-serif', fontWeight: 800 }}>+{product.storeListings.length - 3}</span>
          )}
        </div>

        {/* Name */}
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="adidas-card-name" style={{
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
          <FiStar size={12} color="#F59E0B" fill="#F59E0B" />
          <span style={{ fontWeight: 700 }}>{product.rating}</span>
          <span style={{ color: 'var(--text-muted)' }}>({product.reviewCount?.toLocaleString('en-IN')})</span>
        </div>

        {/* Price */}
        {bestListing && (
          <div className="adidas-card-price">
            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span>{formatPrice(bestListing.price)}</span>
              {bestListing.originalPrice > bestListing.price && (
                <span className="adidas-card-original-price">{formatPrice(bestListing.originalPrice)}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              {bestListing.discount > 0 && (
                <span style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: 800 }}>↓ {bestListing.discount}% OFF</span>
              )}
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <FiTruck size={10} /> {bestListing.delivery}
              </span>
            </div>
          </div>
        )}

        {/* Buy button */}
        <Link
          to={`/product/${product.id}`}
          className="adidas-card-btn"
          style={{ textDecoration: 'none' }}
        >
          <FiZap size={13} />
          Compare Prices
        </Link>
      </div>
    </motion.div>
  );
}

