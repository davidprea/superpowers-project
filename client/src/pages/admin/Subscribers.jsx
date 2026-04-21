import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/subscribers')
      .then((res) => setSubscribers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Remove this subscriber?')) return
    try {
      await api.delete(`/subscribers/${id}`)
      setSubscribers(subscribers.filter((s) => s.id !== id))
    } catch {}
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Newsletter Subscribers</h1>

      {loading ? (
        <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Subscribed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td><Link to={`/admin/subscribers/${sub.id}`} className="link link-primary">{sub.first_name} {sub.last_name}</Link></td>
                  <td>{sub.email}</td>
                  <td>{sub.organization}</td>
                  <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-error btn-xs" onClick={() => handleDelete(sub.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscribers.length === 0 && (
            <p className="text-center text-base-content/60 py-8">No subscribers yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
