import { useState, useEffect } from 'react'
import api from '../../services/api'
import HeroSection from '../../layouts/HeroSection'

function MemberCard({ school_name, location, logo_url, link, description }) {
  const content = (
    <div className="card bg-base-200 hover:shadow-lg transition-shadow h-full">
      <figure className="px-8 pt-8">
        <img
          src={logo_url}
          alt={`${school_name} logo`}
          className="h-24 w-auto object-contain"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h3 className="card-title text-lg">{school_name}</h3>
        <p className="text-sm text-base-content/60">{location}</p>
        {description && <p className="text-sm mt-1">{description}</p>}
        {link && (
          <p className="text-xs text-primary mt-1">Visit project page &rarr;</p>
        )}
      </div>
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
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="prose max-w-none mb-10">
          <p>
            The Superpowers Project brings together a growing community of schools and other educational organizations pioneering
            AI-based student portfolio assessment. Our members are committed to exploring
            innovative approaches to recognizing and developing student strengths.
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
        ) : schools.length === 0 ? (
          <p className="text-center text-base-content/60">Member schools coming soon.</p>
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
