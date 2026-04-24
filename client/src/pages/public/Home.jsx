import { Link } from 'react-router-dom'
import HeroSection from '../../layouts/HeroSection'
import meshBg from '../../assets/mesh_network.png'

export default function Home() {
  return (
    <div>
      <HeroSection
        title="The Superpowers Project"
        subtitle="A consortium of schools pioneering AI-based student portfolio assessment"
        backgroundImage={meshBg}
      >
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/about" className="btn-copper">Learn More</Link>
          <Link to="/subscribe" className="btn-outline-ink">Subscribe</Link>
        </div>
      </HeroSection>

      <section className="py-24 px-6 max-w-[1400px] mx-auto">
        <p className="meta-label-copper mb-10">&sect; 01 &mdash; What We Do</p>
        <div className="grid md:grid-cols-3 gap-0 border border-[var(--color-ink)]" style={{ borderRadius: '2px' }}>
          {[
            { num: '01', title: 'Collaborate', desc: 'Connect with educators exploring innovative approaches to student assessment through AI-powered portfolios.' },
            { num: '02', title: 'Share Resources', desc: 'Access a growing library of tools, research, and best practices for portfolio assessment.' },
            { num: '03', title: 'Stay Informed', desc: 'Keep up with the latest news, developments, and insights from consortium members.' },
          ].map((item, i) => (
            <div key={item.num} className="p-9" style={{ borderRight: i < 2 ? '1px solid var(--color-rule)' : 'none' }}>
              <p className="meta-label mb-4">{item.num}</p>
              <h2 className="font-serif text-2xl mb-3" style={{ color: 'var(--color-ink)' }}>{item.title}</h2>
              <p style={{ color: 'var(--color-ink-soft)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
