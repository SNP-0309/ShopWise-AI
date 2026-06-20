import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AIChat from './components/ai/AIChat';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

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
          <ErrorBoundary>
            <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
              <Navbar onChatOpen={() => setChatOpen(true)} />

              <main style={{ flex: 1 }}>
                <Suspense fallback={<PageLoader />}>
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                      <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />
                      <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
                      <Route path="/compare" element={<PageWrapper><Compare /></PageWrapper>} />
                      <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />

                      {/* Protected routes — require authentication */}
                      <Route path="/wishlist" element={
                        <ProtectedRoute>
                          <PageWrapper><Wishlist /></PageWrapper>
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <PageWrapper><Dashboard /></PageWrapper>
                        </ProtectedRoute>
                      } />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </main>

              <Footer />

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

              {!chatOpen && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: 'spring' }}
                  onClick={() => setChatOpen(true)}
                  id="ai-chat-bubble"
                  className="adidas-chat-bubble"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Open AI Assistant"
                >
                  ✨
                </motion.button>
              )}
            </div>
          </ErrorBoundary>
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
