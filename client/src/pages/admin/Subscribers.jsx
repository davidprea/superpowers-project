import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const emptyForm = { first_name: '', last_name: '', organization: '', email: '' }

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const loadSubscribers = () => {
    api.get('/subscribers')
      .then((res) => setSubscribers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadSubscribers() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await api.post('/subscribers', form)
      setForm(emptyForm)
      setShowForm(false)
      setMessage('Subscriber added.')
      loadSubscribers()
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add subscriber.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this subscriber?')) return
    try {
      await api.delete(`/subscribers/${id}`)
      setSubscribers(subscribers.filter((s) => s.id !== id))
    } catch {}
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-3xl" style={{ color: 'var(--color-ink)' }}>Newsletter Subscribers</h1>
        <button className="btn-copper text-sm" onClick={() => { setShowForm(!showForm); setMessage('') }}>
          {showForm ? 'Cancel' : 'Add Subscriber'}
        </button>
      </div>

      {message && <div className="alert-info p-3 mb-4"><span>{message}</span></div>}

      {showForm && (
        <form onSubmit={handleAdd} className="lab-card-light mb-6 max-w-xl">
          <p className="meta-label-copper mb-4">Add Subscriber</p>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="meta-label block mb-1">First Name</label>
                <input type="text" className="w-full px-3 py-2" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
              </div>
              <div>
                <label className="meta-label block mb-1">Last Name</label>
                <input type="text" className="w-full px-3 py-2" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="meta-label block mb-1">Organization</label>
              <input type="text" className="w-full px-3 py-2" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required />
            </div>
            <div>
              <label className="meta-label block mb-1">Email</label>
              <input type="email" className="w-full px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <button type="submit" className="btn-copper text-sm w-fit" disabled={saving}>
              {saving ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="hairline" style={{ borderBottom: '1px solid var(--color-rule)' }}>
                <th className="text-left py-3 meta-label">Name</th>
                <th className="text-left py-3 meta-label">Email</th>
                <th className="text-left py-3 meta-label">Organization</th>
                <th className="text-left py-3 meta-label">Subscribed</th>
                <th className="text-right py-3 meta-label">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--color-rule)' }}>
                  <td className="py-3"><Link to={`/admin/subscribers/${sub.id}`} className="hover:text-[var(--color-copper)] transition-colors" style={{ color: 'var(--color-copper)' }}>{sub.first_name} {sub.last_name}</Link></td>
                  <td className="py-3" style={{ color: 'var(--color-ink-soft)' }}>{sub.email}</td>
                  <td className="py-3" style={{ color: 'var(--color-ink-soft)' }}>{sub.organization}</td>
                  <td className="py-3" style={{ color: 'var(--color-mute)' }}>{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td className="py-3 text-right">
                    <button className="text-sm hover:text-[var(--color-copper)] transition-colors" style={{ color: 'var(--color-mute)' }} onClick={() => handleDelete(sub.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscribers.length === 0 && (
            <p className="text-center py-8" style={{ color: 'var(--color-mute)' }}>No subscribers yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
