import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { marked } from 'marked'
import HeroSection from '../../layouts/HeroSection'
import meshBg from '../../assets/mesh_network.png'

function parseSection(raw) {
  const lines = raw.split('\n')
  const titleLine = lines.find((l) => l.startsWith('## '))
  const title = titleLine ? titleLine.replace(/^## /, '') : ''
  const rest = lines.filter((l) => l !== titleLine).join('\n').trim()
  const paragraphs = rest.split(/\n\n+/)
  const blurb = paragraphs[0] || ''
  const essay = paragraphs.slice(1).join('\n\n')
  return { title, blurb, essay }
}

export default function Home() {
  const [sections, setSections] = useState([])
  const essayRefs = useRef([])

  useEffect(() => {
    fetch('/home.md')
      .then((res) => res.text())
      .then((text) => {
        const parts = text.split(/^---$/m).map((s) => s.trim()).filter(Boolean)
        setSections(parts.map(parseSection))
      })
      .catch(() => {})
  }, [])

  const scrollToEssay = (i) => {
    essayRefs.current[i]?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <HeroSection
        title="The Superpowers Project"
        subtitle="A coalition of educators pioneering AI-based student portfolio assessment"
        backgroundImage={meshBg}
      >
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/about" className="btn-copper">Learn More</Link>
          <Link to="/subscribe" className="btn-outline-ink">Subscribe</Link>
        </div>
      </HeroSection>

      {/* Blurb cards */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-3 gap-0 border border-[var(--color-ink)]" style={{ borderRadius: '2px' }}>
          {sections.map((sec, i) => (
            <div
              key={i}
              className="p-9 cursor-pointer hover:bg-[var(--color-paper-deep)] transition-colors"
              style={{ borderRight: i < sections.length - 1 ? '1px solid var(--color-rule)' : 'none' }}
              onClick={() => scrollToEssay(i)}
            >
              <h2 className="font-serif text-xl mb-3" style={{ color: 'var(--color-ink)', lineHeight: 1.2 }}>{sec.title}</h2>
              <p className="text-sm" style={{ color: 'var(--color-ink-soft)' }}>{sec.blurb}</p>
              <p className="meta-label-copper mt-4 text-xs">Read more &darr;</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full essays */}
      <section className="pb-24 px-6 max-w-[68ch] mx-auto">
        {sections.map((sec, i) => (
          <div key={i} ref={(el) => (essayRefs.current[i] = el)} className={i > 0 ? 'mt-16 pt-16 hairline' : ''} style={{ scrollMarginTop: '80px' }}>
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: marked(sec.essay) }} />
          </div>
        ))}
      </section>
    </div>
  )
}
