import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function AdminSubscriberDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subscriber, setSubscriber] = useState(null)
  const [allTags, setAllTags] = useState([])
  const [subTags, setSubTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    Promise.all([
      api.get(`/subscribers/${id}`),
      api.get('/tags'),
    ])
      .then(([subData, tagData]) => {
        setSubscriber(subData.data)
        setSubTags(subData.data.tags || [])
        setAllTags(tagData.data)
      })
      .catch(() => navigate('/admin/subscribers'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await api.patch(`/subscribers/${id}`, {
        first_name: subscriber.first_name,
        last_name: subscriber.last_name,
        organization: subscriber.organization,
        email: subscriber.email,
      })
      setMessage('Subscriber updated successfully.')
    } catch {
      setMessage('Failed to update subscriber.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = async (tagId) => {
    try {
      await api.post(`/subscribers/${id}/tags`, { tag_id: tagId })
      const tag = allTags.find((t) => t.id === parseInt(tagId))
      setSubTags([...subTags, tag])
    } catch {}
  }

  const handleRemoveTag = async (tagId) => {
    try {
      await api.delete(`/subscribers/${id}/tags/${tagId}`)
      setSubTags(subTags.filter((t) => t.id !== tagId))
    } catch {}
  }

  const handleDelete = async () => {
    if (!confirm('Remove this subscriber?')) return
    await api.delete(`/subscribers/${id}`)
    navigate('/admin/subscribers')
  }

  if (loading) return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg"></span></div>
  if (!subscriber) return null

  const unassignedTags = allTags.filter((t) => !subTags.some((st) => st.id === t.id))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Subscriber: {subscriber.first_name} {subscriber.last_name}</h1>
      {message && <div className="alert alert-info mb-4"><span>{message}</span></div>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Details</h2>
            <label className="form-control">
              <div className="label"><span className="label-text">First Name</span></div>
              <input type="text" className="input input-bordered" value={subscriber.first_name} onChange={(e) => setSubscriber({ ...subscriber, first_name: e.target.value })} />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">Last Name</span></div>
              <input type="text" className="input input-bordered" value={subscriber.last_name} onChange={(e) => setSubscriber({ ...subscriber, last_name: e.target.value })} />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">Organization</span></div>
              <input type="text" className="input input-bordered" value={subscriber.organization} onChange={(e) => setSubscriber({ ...subscriber, organization: e.target.value })} />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">Email</span></div>
              <input type="email" className="input input-bordered" value={subscriber.email} onChange={(e) => setSubscriber({ ...subscriber, email: e.target.value })} />
            </label>

            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <span className="loading loading-spinner loading-sm"></span> : 'Save Changes'}
              </button>
              <button className="btn btn-error btn-outline" onClick={handleDelete}>Remove Subscriber</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {subTags.length === 0 ? (
                <p className="text-sm text-base-content/60">No tags assigned</p>
              ) : (
                subTags.map((tag) => (
                  <span key={tag.id} className="badge badge-primary gap-1">
                    {tag.name}
                    <button className="btn btn-ghost btn-xs" onClick={() => handleRemoveTag(tag.id)}>&times;</button>
                  </span>
                ))
              )}
            </div>
            {unassignedTags.length > 0 && (
              <select className="select select-bordered select-sm" onChange={(e) => { if (e.target.value) handleAddTag(e.target.value); e.target.value = '' }} defaultValue="">
                <option value="" disabled>Add tag...</option>
                {unassignedTags.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
