export default function HeroSection({ title, subtitle, children }) {
  return (
    <div className="hero py-16 bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-base-content">{title}</h1>
          {subtitle && <p className="py-4 text-lg text-base-content/70">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}
