import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function AdminUserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [allTags, setAllTags] = useState([])
  const [userTags, setUserTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    Promise.all([
      api.get(`/users/${id}`),
      api.get('/tags'),
    ])
      .then(([userData, tagData]) => {
        setUser(userData.data)
        setUserTags(userData.data.tags || [])
        setAllTags(tagData.data)
      })
      .catch(() => navigate('/admin/users'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await api.patch(`/users/${id}`, {
        role: user.role,
        can_blog: user.can_blog,
        name: user.name,
        school_name: user.school_name,
        school_url: user.school_url,
      })
      setMessage('User updated successfully.')
    } catch {
      setMessage('Failed to update user.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = async (tagId) => {
    try {
      await api.post(`/users/${id}/tags`, { tag_id: tagId })
      const tag = allTags.find((t) => t.id === parseInt(tagId))
      setUserTags([...userTags, tag])
    } catch {}
  }

  const handleRemoveTag = async (tagId) => {
    try {
      await api.delete(`/users/${id}/tags/${tagId}`)
      setUserTags(userTags.filter((t) => t.id !== tagId))
    } catch {}
  }

  const handleApprove = async () => {
    await api.post(`/users/${id}/approve`)
    setUser({ ...user, member_status: 'approved' })
  }

  const handleReject = async () => {
    await api.post(`/users/${id}/reject`)
    setUser({ ...user, member_status: 'rejected' })
  }

  if (loading) return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg"></span></div>
  if (!user) return null

  const unassignedTags = allTags.filter((t) => !userTags.some((ut) => ut.id === t.id))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User: {user.name}</h1>
      {message && <div className="alert alert-info mb-4"><span>{message}</span></div>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Details</h2>
            <label className="form-control">
              <div className="label"><span className="label-text">Name</span></div>
              <input type="text" className="input input-bordered" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">Email</span></div>
              <input type="email" className="input input-bordered" value={user.email} disabled />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">School Name</span></div>
              <input type="text" className="input input-bordered" value={user.school_name || ''} onChange={(e) => setUser({ ...user, school_name: e.target.value })} />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">School URL</span></div>
              <input type="url" className="input input-bordered" value={user.school_url || ''} onChange={(e) => setUser({ ...user, school_url: e.target.value })} />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">Role</span></div>
              <select className="select select-bordered" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
                <option value="observer">Observer</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="label cursor-pointer justify-start gap-3">
              <input type="checkbox" className="checkbox checkbox-primary" checked={user.can_blog || false} onChange={(e) => setUser({ ...user, can_blog: e.target.checked })} />
              <span className="label-text">Can write blog posts</span>
            </label>

            {user.member_status === 'pending' && (
              <div className="flex gap-2 mt-2">
                <button className="btn btn-success btn-sm" onClick={handleApprove}>Approve</button>
                <button className="btn btn-error btn-sm" onClick={handleReject}>Reject</button>
              </div>
            )}
            {user.member_status && user.member_status !== 'pending' && (
              <p className="text-sm">Status: <span className={`badge ${user.member_status === 'approved' ? 'badge-success' : 'badge-error'}`}>{user.member_status}</span></p>
            )}

            <button className="btn btn-primary mt-4" onClick={handleSave} disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-sm"></span> : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {userTags.length === 0 ? (
                <p className="text-sm text-base-content/60">No tags assigned</p>
              ) : (
                userTags.map((tag) => (
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
