export const ProductCardSkeleton = () => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <div className="skeleton" style={{ width: '100%', aspectRatio: '1' }} />
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        <div className="skeleton" style={{ width: 60, height: 18, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 60, height: 18, borderRadius: 4 }} />
      </div>
      <div className="skeleton" style={{ width: '90%', height: 16 }} />
      <div className="skeleton" style={{ width: '70%', height: 16 }} />
      <div className="skeleton" style={{ width: 80, height: 14, borderRadius: 999 }} />
      <div className="skeleton" style={{ width: '60%', height: 28 }} />
      <div className="skeleton" style={{ width: '100%', height: 38, borderRadius: 12 }} />
    </div>
  </div>
);

export const TextSkeleton = ({ lines = 3, width = '100%' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton"
        style={{ height: 16, width: i === lines - 1 ? '60%' : width }}
      />
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 1rem' }}>
    <div className="skeleton" style={{ width: 300, height: 48, borderRadius: 12 }} />
    <div className="skeleton" style={{ width: 200, height: 24, borderRadius: 8 }} />
    <div className="skeleton" style={{ width: '100%', maxWidth: 600, height: 64, borderRadius: 32 }} />
  </div>
);

export default { ProductCardSkeleton, TextSkeleton, HeroSkeleton };
