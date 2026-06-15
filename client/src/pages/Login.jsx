import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect target
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all fields');
      return;
    }

    try {
      let res;
      if (isRegister) {
        res = await register(name, email, password);
      } else {
        res = await login(email, password);
      }
      
      if (res?.success) {
        toast.success(isRegister ? 'Account created!' : 'Signed in successfully!');
        navigate(from, { replace: true });
      } else {
        setError(res?.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during authentication');
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)',
        top: '10%', left: '10%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
        bottom: '10%', right: '10%', pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '2.5rem 2rem',
          position: 'relative',
          zIndex: 10,
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Back Link */}
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          transition: 'color 0.2s'
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <FiArrowLeft size={14} /> Back to home
        </Link>

        {/* Logo/Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 44, height: 44,
            background: 'var(--gradient-primary)',
            borderRadius: 12,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 15px rgba(108,99,255,0.3)'
          }}>
            <HiSparkles color="white" size={24} />
          </div>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.35rem' }}>
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {isRegister ? 'Join ShopWise AI for smart tracking & alerts' : 'Sign in to access your wishlist and alerts'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: 'var(--danger)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem'
            }}
          >
            <FiAlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isRegister && (
            <div>
              <label htmlFor="name-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                <input
                  id="name-input"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
              <input
                id="email-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label htmlFor="password-input" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
              {!isRegister && (
                <a href="#" style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot?</a>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            id="toggle-auth-mode-btn"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit'
            }}
          >
            {isRegister ? 'Sign In' : 'Sign Up Free'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
