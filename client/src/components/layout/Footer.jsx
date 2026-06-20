import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi2';
import { FiGithub, FiTwitter, FiInstagram, FiMail, FiHeart } from 'react-icons/fi';
import logoImg from '../../assets/logo.png';


const footerLinks = {
  Product: [
    { label: 'Search Products', to: '/search' },
    { label: 'Compare', to: '/compare' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Dashboard', to: '/dashboard' },
  ],
  Categories: [
    { label: 'Laptops', to: '/search?q=laptop' },
    { label: 'Smartphones', to: '/search?q=phone' },
    { label: 'Audio', to: '/search?q=headphones' },
    { label: 'Televisions', to: '/search?q=tv' },
  ],
  Stores: [
    { label: 'Amazon India', href: 'https://amazon.in', external: true },
    { label: 'Flipkart', href: 'https://flipkart.com', external: true },
    { label: 'Croma', href: 'https://croma.com', external: true },
    { label: 'Reliance Digital', href: 'https://reliancedigital.in', external: true },
  ],
};

const socials = [
  { icon: <FiGithub size={18} />, href: 'https://github.com', label: 'GitHub' },
  { icon: <FiTwitter size={18} />, href: 'https://twitter.com', label: 'Twitter' },
  { icon: <FiInstagram size={18} />, href: 'https://instagram.com', label: 'Instagram' },
  { icon: <FiMail size={18} />, href: 'mailto:hello@shopwise.ai', label: 'Email' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '4rem 0 2rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr repeat(3, auto)',
          gap: '3rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
        }}>
          {/* Brand */}
          <div style={{ maxWidth: 320 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', textDecoration: 'none' }}>
              <div style={{
                width: 38, height: 38,
                borderRadius: 8,
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'black',
                border: '2px solid black',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.9)',
              }}>
                <img src={logoImg} alt="" style={{ width: '130%', height: 'auto', marginTop: '-5%', display: 'block' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase' }}>
                Shop<span style={{ color: 'var(--brand-accent)' }}>Wise</span> AI
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              India's smartest AI-powered shopping aggregator. Compare prices across Amazon, Flipkart, Croma & 7+ stores instantly.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="btn btn-icon btn-ghost"
                  style={{ border: '1px solid var(--border)' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
                {group}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map(link => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        style={{ color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2026 ShopWise AI. All rights reserved. Made with <FiHeart size={12} style={{ display: 'inline', color: '#ef4444', margin: '0 2px' }} /> for smart Indian shoppers.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
