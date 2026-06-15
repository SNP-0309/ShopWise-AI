import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ textAlign: 'center', padding: '6rem 2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ fontSize: '8rem', marginBottom: '1rem', lineHeight: 1 }}>🔍</div>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
        404 — <span className="gradient-text">Not Found</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: 420 }}>
        Looks like this page doesn't exist. Let our AI help you find what you're looking for!
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
        <Link to="/search?q=trending" className="btn btn-secondary btn-lg">Browse Trending</Link>
      </div>
    </motion.div>
  );
}
