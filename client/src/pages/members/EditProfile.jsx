import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function EditProfile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ school_name: '', school_url: '', name: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/profiles/me')
      .then((res) => setForm({
        school_name: res.data.school_name || '',
        school_url: res.data.school_url || '',
        name: res.data.name || '',
        description: res.data.description || '',
      }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await api.patch('/profiles/me', form)
      setMessage('Profile updated successfully.')
    } catch {
      setMessage('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div className="py-12 px-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      {message && <div className="alert alert-info mb-4"><span>{message}</span></div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="form-control">
          <div className="label"><span className="label-text">Contact Name</span></div>
          <input type="text" className="input input-bordered" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className="form-control">
          <div className="label"><span className="label-text">School Name</span></div>
          <input type="text" className="input input-bordered" value={form.school_name} onChange={(e) => setForm({ ...form, school_name: e.target.value })} required />
        </label>
        <label className="form-control">
          <div className="label"><span className="label-text">School URL</span></div>
          <input type="url" className="input input-bordered" value={form.school_url} onChange={(e) => setForm({ ...form, school_url: e.target.value })} />
        </label>
        <label className="form-control">
          <div className="label"><span className="label-text">Description</span></div>
          <textarea className="textarea textarea-bordered h-32" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="loading loading-spinner loading-sm"></span> : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
