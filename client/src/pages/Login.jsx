import { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowLeft, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// — Validation helpers —

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$%...)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

/** Strip HTML tags and limit length to prevent XSS and abuse */
const sanitizeName = (raw) => raw.replace(/<[^>]*>/g, '').trim().slice(0, 100);

export default function Login() {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});

  // Redirect target
  const from = location.state?.from?.pathname || '/';

  // — Derived validation state —
  const passwordStrength = useMemo(() => {
    const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
    return { passed, total: PASSWORD_RULES.length, percent: Math.round((passed / PASSWORD_RULES.length) * 100) };
  }, [password]);

  const strengthColor = passwordStrength.percent <= 40 ? '#ef4444' : passwordStrength.percent <= 70 ? '#f59e0b' : '#22c55e';
  const strengthLabel = passwordStrength.percent <= 40 ? 'Weak' : passwordStrength.percent <= 70 ? 'Medium' : 'Strong';

  const validate = () => {
    if (isRegister) {
      const cleanName = sanitizeName(name);
      if (!cleanName || cleanName.length < 2) return 'Name must be at least 2 characters.';
    }
    if (!email) return 'Email is required.';
    if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address.';
    if (!password) return 'Password is required.';
    if (isRegister && passwordStrength.passed < PASSWORD_RULES.length) {
      return 'Password does not meet all requirements.';
    }
    if (!isRegister && password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ name: true, email: true, password: true });

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      let res;
      if (isRegister) {
        res = await register(sanitizeName(name), email.trim().toLowerCase(), password);
      } else {
        res = await login(email.trim().toLowerCase(), password);
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

  const inputWrapperStyle = { position: 'relative' };
  const iconStyle = { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' };

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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} autoComplete="on" noValidate>
          {/* — Name Field (Register only) — */}
          {isRegister && (
            <div>
              <label htmlFor="name-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Name</label>
              <div style={inputWrapperStyle}>
                <FiUser style={iconStyle} size={16} />
                <input
                  id="name-input"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem', width: '100%' }}
                  maxLength={100}
                  autoComplete="name"
                />
              </div>
              {touched.name && name.length > 0 && sanitizeName(name).length < 2 && (
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>Name must be at least 2 characters.</p>
              )}
            </div>
          )}

          {/* — Email Field — */}
          <div>
            <label htmlFor="email-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <div style={inputWrapperStyle}>
              <FiMail style={iconStyle} size={16} />
              <input
                id="email-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className="input-field"
                style={{ paddingLeft: '2.5rem', width: '100%' }}
                maxLength={254}
                autoComplete="email"
              />
            </div>
            {touched.email && email.length > 0 && !EMAIL_REGEX.test(email) && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>Please enter a valid email address.</p>
            )}
          </div>

          {/* — Password Field — */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label htmlFor="password-input" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
              {!isRegister && (
                <a href="#" style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot?</a>
              )}
            </div>
            <div style={inputWrapperStyle}>
              <FiLock style={iconStyle} size={16} />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className="input-field"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', width: '100%' }}
                maxLength={128}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem',
                }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>

            {/* Password Strength Meter — only in register mode */}
            {isRegister && password.length > 0 && (
              <div style={{ marginTop: '0.6rem' }}>
                {/* Strength bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      width: `${passwordStrength.percent}%`,
                      background: strengthColor,
                      transition: 'width 0.3s ease, background 0.3s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: strengthColor, minWidth: 50, textAlign: 'right' }}>{strengthLabel}</span>
                </div>

                {/* Individual rules */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <span key={rule.label} style={{ fontSize: '0.72rem', color: passed ? '#22c55e' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {passed ? '✓' : '○'} {rule.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* — Submit — */}
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
            onClick={() => { setIsRegister(!isRegister); setError(''); setTouched({}); setPassword(''); }}
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

