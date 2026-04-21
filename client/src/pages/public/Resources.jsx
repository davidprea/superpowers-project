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
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Search resources..."
            className="input input-bordered flex-1 min-w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select select-bordered" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            <option value="">All Tags</option>
            {tags.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-base-content/60">No resources found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((resource) => (
              <div key={resource.id} className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="link link-primary">
                      {resource.title}
                    </a>
                  </h3>
                  <p>{resource.description}</p>
                  {resource.tags?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {resource.tags.map((t) => <span key={t.id} className="badge badge-outline">{t.name}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
