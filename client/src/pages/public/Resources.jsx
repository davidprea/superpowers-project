import { useState, useEffect } from 'react'
import api from '../../services/api'
import HeroSection from '../../layouts/HeroSection'

export default function Resources() {
  const [resources, setResources] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/resources'),
      api.get('/tags'),
    ])
      .then(([resData, tagData]) => {
        setResources(resData.data)
        setTags(tagData.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = resources.filter((r) => {
    const matchesSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !selectedTag || r.tags?.some((t) => t.id === parseInt(selectedTag))
    return matchesSearch && matchesTag
  })

  return (
    <div>
      <HeroSection title="Resource Library" subtitle="Curated resources for AI-based student portfolio assessment" />
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <p className="meta-label-copper mb-10">&sect; 01 &mdash; Browse</p>
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <input
            type="text"
            placeholder="Search resources..."
            className="flex-1 min-w-48 px-4 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="px-4 py-2" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            <option value="">All Tags</option>
            {tags.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'var(--color-mute)' }}>No resources found.</p>
        ) : (
          <div className="flex flex-col gap-0">
            {filtered.map((resource, i) => (
              <div key={resource.id} className={`py-8 ${i > 0 ? 'hairline' : ''}`}>
                <h3 className="font-serif text-xl mb-1">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-copper)] transition-colors" style={{ color: 'var(--color-ink)' }}>
                    {resource.title}
                  </a>
                </h3>
                <p className="mt-2" style={{ color: 'var(--color-ink-soft)' }}>{resource.description}</p>
                {resource.tags?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {resource.tags.map((t) => <span key={t.id} className="lab-badge">{t.name}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
