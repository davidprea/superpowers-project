export default function HeroSection({ title, subtitle, children, backgroundImage }) {
  return (
    <div
      className="relative py-24 sm:py-32"
      style={backgroundImage
        ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { backgroundColor: 'var(--color-paper-deep)' }
      }
    >
      {backgroundImage && <div className="absolute inset-0" style={{ backgroundColor: 'rgba(237, 228, 211, 0.85)' }}></div>}
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <p className="meta-label-copper mb-6">The Superpowers Project</p>
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}
