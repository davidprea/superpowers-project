import { useState, useEffect } from 'react'
import api from '../../services/api'

const emptyForm = { school_name: '', location: '', logo_url: '', link: '', description: '', display_order: 0 }

export default function MemberSchools() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = list view, 'new' = add, or school id
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const loadSchools = () => {
    api.get('/members')
      .then((res) => setSchools(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadSchools() }, [])

  const startEdit = (school) => {
    setEditing(school.id)
    setForm({
      school_name: school.school_name,
      location: school.location,
      logo_url: school.logo_url,
      link: school.link || '',
      description: school.description || '',
      display_order: school.display_order || 0,
    })
    setMessage('')
  }

  const startNew = () => {
    setEditing('new')
    setForm(emptyForm)
    setMessage('')
  }

  const cancel = () => {
    setEditing(null)
    setForm(emptyForm)
    setMessage('')
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      if (editing === 'new') {
        await api.post('/members', form)
        setMessage('Member school added.')
      } else {
        await api.patch(`/members/${editing}`, form)
        setMessage('Member school updated.')
      }
      setEditing(null)
      setForm(emptyForm)
      loadSchools()
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this member school?')) return
    await api.delete(`/members/${id}`)
    loadSchools()
  }

  const handleChange = (e) => {
    const value = e.target.name === 'display_order' ? parseInt(e.target.value) || 0 : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  if (loading) return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg"></span></div>

  if (editing !== null) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">{editing === 'new' ? 'Add Member School' : 'Edit Member School'}</h1>
        {message && <div className="alert alert-info mb-4"><span>{message}</span></div>}
        <div className="card bg-base-200 max-w-xl">
          <div className="card-body gap-4">
            <label className="form-control">
              <div className="label"><span className="label-text">School Name *</span></div>
              <input type="text" name="school_name" className="input input-bordered" value={form.school_name} onChange={handleChange} required />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">Location (City, State) *</span></div>
              <input type="text" name="location" className="input input-bordered" value={form.location} onChange={handleChange} required />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">Logo URL *</span></div>
              <input type="url" name="logo_url" className="input input-bordered" value={form.logo_url} onChange={handleChange} required />
            </label>
            {form.logo_url && (
              <div className="bg-base-100 p-4 rounded-lg flex justify-center">
                <img src={form.logo_url} alt="Logo preview" className="h-24 w-auto object-contain" />
              </div>
            )}
            <label className="form-control">
              <div className="label"><span className="label-text">Project Page Link (optional)</span></div>
              <input type="url" name="link" className="input input-bordered" value={form.link} onChange={handleChange} placeholder="https://" />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">Description (optional)</span></div>
              <textarea name="description" className="textarea textarea-bordered h-24" value={form.description} onChange={handleChange} />
            </label>
            <label className="form-control">
              <div className="label"><span className="label-text">Display Order (lower = first)</span></div>
              <input type="number" name="display_order" className="input input-bordered w-24" value={form.display_order} onChange={handleChange} />
            </label>
            <div className="flex gap-2 mt-2">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.school_name || !form.location || !form.logo_url}>
                {saving ? <span className="loading loading-spinner loading-sm"></span> : 'Save'}
              </button>
              <button className="btn btn-ghost" onClick={cancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Member Schools</h1>
        <button className="btn btn-primary btn-sm" onClick={startNew}>Add School</button>
      </div>
      {message && <div className="alert alert-info mb-4"><span>{message}</span></div>}

      {schools.length === 0 ? (
        <p className="text-base-content/60">No member schools yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {schools.map((school) => (
            <div key={school.id} className="card card-side bg-base-200 items-center px-4 py-3">
              <img src={school.logo_url} alt="" className="h-12 w-16 object-contain" />
              <div className="flex-1 ml-4">
                <p className="font-semibold">{school.school_name}</p>
                <p className="text-sm text-base-content/60">{school.location}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-xs" onClick={() => startEdit(school)}>Edit</button>
                <button className="btn btn-error btn-xs" onClick={() => handleDelete(school.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
