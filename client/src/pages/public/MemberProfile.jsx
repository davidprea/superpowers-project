import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'

export default function MemberProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/profiles/${id}`)
      .then((res) => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg"></span></div>
  if (!profile) return <div className="text-center p-12"><h2 className="text-2xl font-bold">Profile not found</h2><Link to="/members" className="btn btn-primary mt-4">Back to Members</Link></div>

  return (
    <div className="py-12 px-4 max-w-3xl mx-auto">
      <Link to="/members" className="btn btn-ghost btn-sm mb-4">&larr; Back to Members</Link>
      <div className="card bg-base-200">
        <div className="card-body">
          <h1 className="card-title text-3xl">{profile.school_name}</h1>
          <p className="text-base-content/60">{profile.name}</p>
          {profile.school_url && (
            <a href={profile.school_url} target="_blank" rel="noopener noreferrer" className="link link-primary">
              {profile.school_url}
            </a>
          )}
          {profile.description && <p className="mt-4">{profile.description}</p>}
        </div>
      </div>
    </div>
  )
}
