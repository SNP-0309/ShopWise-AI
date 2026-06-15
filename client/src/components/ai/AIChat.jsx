import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { aiAPI } from '../../services/api';

const SUGGESTIONS = [
  'Best phone under ₹30,000',
  'Compare iPhone 15 vs Galaxy S24',
  'Gaming laptop for coding and gaming',
  'Best wireless headphones',
  'Laptop + mouse + headphones under ₹80,000',
];

const generateSessionId = () => `sw_${Date.now()}_${Math.random().toString(36).slice(2)}`;

export default function AIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m **ShopWise AI**, your personal shopping assistant.\n\nI can help you:\n- 🔍 Find the best products for your budget\n- 💰 Compare prices across Amazon, Flipkart & more\n- ⭐ Summarize thousands of reviews\n- 🛒 Create a complete shopping list\n\nWhat are you looking for today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const { data } = await aiAPI.chat({
        messages: updatedMessages.filter((m) => m.role !== 'system').slice(-10),
        sessionId,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '⚠️ I\'m having trouble connecting to my AI brain. Please check your API key configuration.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-float">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsMinimized(false)}
            style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(108,99,255,0.4)',
              border: 'none', cursor: 'pointer', color: 'white',
            }}
          >
            <HiSparkles size={24} />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              width: 380,
              maxHeight: 600,
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.25rem',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <HiSparkles size={20} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>ShopWise AI</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <div className="pulse-dot" style={{ background: '#4ADE80' }} />
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem' }}>Online • Powered by Groq</span>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
              >
                <FiMinimize2 size={16} />
              </button>
              <button
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  <div
                    className={`chat-message ${msg.role}`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                </motion.div>
              ))}

              {loading && (
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div className="chat-message assistant" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: 'var(--primary)',
                          animation: `pulse-anim 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length === 1 && (
              <div style={{ padding: '0 1rem 0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {SUGGESTIONS.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: '0.3rem 0.7rem', borderRadius: 999,
                      background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)',
                      color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: '0.875rem 1rem',
              borderTop: '1px solid var(--border)',
              display: 'flex', gap: '0.5rem', alignItems: 'center',
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask anything about products..."
                style={{
                  flex: 1, background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '0.625rem 0.875rem',
                  fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'Inter',
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: 38, height: 38, borderRadius: 'var(--radius-md)',
                  background: input.trim() ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                  color: input.trim() ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                <FiSend size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
