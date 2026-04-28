export default function HeroSection({ title, subtitle, children, backgroundImage }) {
  return (
    <div
      className="relative py-14 sm:py-20"
      style={backgroundImage
        ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { backgroundColor: 'var(--color-paper-deep)' }
      }
    >
      {backgroundImage && <div className="absolute inset-0" style={{ backgroundColor: 'rgba(237, 228, 211, 0.85)' }}></div>}
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
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
