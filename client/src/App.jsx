import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import AIChat from './components/ai/AIChat';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Compare = lazy(() => import('./pages/Compare'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div style={{ textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 1rem' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
    </div>
  </div>
);

function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <Navbar onChatOpen={() => setChatOpen(true)} />

            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                  <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />
                  <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
                  <Route path="/compare" element={<PageWrapper><Compare /></PageWrapper>} />
                  <Route path="/wishlist" element={<PageWrapper><Wishlist /></PageWrapper>} />
                  <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                  <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </Suspense>

            {/* Floating AI Chat */}
            <AIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                },
              }}
            />

            {/* AI Chat Bubble (always visible) */}
            {!chatOpen && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                onClick={() => setChatOpen(true)}
                id="ai-chat-bubble"
                style={{
                  position: 'fixed', bottom: '2rem', right: '2rem',
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(108,99,255,0.45)',
                  zIndex: 150,
                  color: 'white', fontSize: '1.5rem',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Open AI Assistant"
              >
                ✨
              </motion.button>
            )}
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

export default App;
