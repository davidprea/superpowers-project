import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import HeroSection from '../../layouts/HeroSection'

export default function Members() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/profiles')
      .then((res) => setProfiles(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <HeroSection title="Member Schools" subtitle="Meet the schools in the Superpowers Project consortium" />
      <section className="py-12 px-4 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
        ) : profiles.length === 0 ? (
          <p className="text-center text-base-content/60">No member profiles yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Link key={profile.id} to={`/members/${profile.id}`} className="card bg-base-200 hover:shadow-lg transition-shadow">
                <div className="card-body">
                  <h3 className="card-title">{profile.school_name}</h3>
                  <p className="text-sm text-base-content/60">{profile.name}</p>
                  {profile.description && <p className="text-sm mt-2">{profile.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
