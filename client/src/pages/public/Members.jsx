import { useState, useEffect } from 'react'
import api from '../../services/api'
import HeroSection from '../../layouts/HeroSection'

function MemberCard({ school_name, location, logo_url, link, description }) {
  const content = (
    <div className="lab-card-light h-full flex flex-col items-center text-center hover:border-[var(--color-ink)] transition-colors">
      <div className="px-4 pt-2 pb-4">
        <img
          src={logo_url}
          alt={`${school_name} logo`}
          className="h-24 w-auto object-contain"
        />
      </div>
      <h3 className="font-serif text-xl mb-1" style={{ color: 'var(--color-ink)' }}>{school_name}</h3>
      <p className="meta-label mb-2">{location}</p>
      {description && <p className="text-sm mt-1" style={{ color: 'var(--color-ink-soft)' }}>{description}</p>}
      {link && (
        <p className="meta-label-copper mt-3">Visit project page &rarr;</p>
      )}
    </div>
  )

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="no-underline">
        {content}
      </a>
    )
  }

  return content
}

export default function Members() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/members')
      .then((res) => setSchools(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <HeroSection title="Member Organizations" subtitle="Meet the schools and other organizations in the Superpowers Project" />
      <section className="py-20 px-6 max-w-[1400px] mx-auto">
        <p className="meta-label-copper mb-10">&sect; 01 &mdash; Consortium</p>
        <div className="max-w-[68ch] mb-12">
          <p style={{ color: 'var(--color-ink-soft)' }}>
            The Superpowers Project brings together a growing community of schools and other educational organizations pioneering
            AI-based student portfolio assessment. Our members are committed to exploring
            innovative approaches to recognizing and developing student strengths.
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
        ) : schools.length === 0 ? (
          <p style={{ color: 'var(--color-mute)' }}>Member schools coming soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <MemberCard key={school.id} {...school} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
