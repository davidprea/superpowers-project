import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function AdminTags() {
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tags')
      .then((res) => setTags(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTag.trim()) return
    try {
      const res = await api.post('/tags', { name: newTag.trim() })
      setTags([...tags, res.data])
      setNewTag('')
    } catch {}
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this tag? It will be removed from all users and resources.')) return
    try {
      await api.delete(`/tags/${id}`)
      setTags(tags.filter((t) => t.id !== id))
    } catch {}
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tags</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input type="text" placeholder="New tag name" className="input input-bordered" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
        <button type="submit" className="btn btn-primary">Add Tag</button>
      </form>

      {loading ? (
        <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div key={tag.id} className="badge badge-lg badge-outline gap-2">
              {tag.name}
              <button className="btn btn-ghost btn-xs" onClick={() => handleDelete(tag.id)}>&times;</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
