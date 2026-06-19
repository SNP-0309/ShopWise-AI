import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * Catches render errors and shows a friendly fallback UI instead of crashing the whole app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: '5rem' }}>⚠️</div>
          <h2 style={{ fontFamily: 'Sora', fontSize: '1.75rem', color: 'var(--text-primary)' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480, lineHeight: 1.7 }}>
            An unexpected error occurred. Don't worry — your data is safe.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '1rem',
              fontSize: '0.75rem', color: 'var(--danger)',
              maxWidth: 600, overflowX: 'auto', textAlign: 'left',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            >
              🔄 Reload Page
            </button>
            <Link to="/" className="btn btn-secondary">
              🏠 Go Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
