import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function ResourceManager() {
  const [resources, setResources] = useState([])
  const [allTags, setAllTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/resources/admin', { params: filter ? { status: filter } : {} }),
      api.get('/tags'),
    ])
      .then(([resData, tagData]) => {
        setResources(resData.data)
        setAllTags(tagData.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter])

  const handleApprove = async (id) => {
    await api.post(`/resources/${id}/approve`)
    setResources(resources.map((r) => r.id === id ? { ...r, approval_status: 'approved' } : r))
  }

  const handleReject = async (id) => {
    await api.post(`/resources/${id}/reject`)
    setResources(resources.map((r) => r.id === id ? { ...r, approval_status: 'rejected' } : r))
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this resource?')) return
    await api.delete(`/resources/${id}`)
    setResources(resources.filter((r) => r.id !== id))
  }

  const handleAddTag = async (resourceId, tagId) => {
    await api.post(`/resources/${resourceId}/tags`, { tag_id: tagId })
    const tag = allTags.find((t) => t.id === parseInt(tagId))
    setResources(resources.map((r) => r.id === resourceId ? { ...r, tags: [...(r.tags || []), tag] } : r))
  }

  const handleRemoveTag = async (resourceId, tagId) => {
    await api.delete(`/resources/${resourceId}/tags/${tagId}`)
    setResources(resources.map((r) => r.id === resourceId ? { ...r, tags: (r.tags || []).filter((t) => t.id !== tagId) } : r))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Resources</h1>
      <div className="mb-4">
        <select className="select select-bordered select-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
      ) : (
        <div className="flex flex-col gap-4">
          {resources.map((resource) => (
            <div key={resource.id} className="card bg-base-200">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="card-title">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="link link-primary">{resource.title}</a>
                      <span className={`badge badge-sm ${resource.approval_status === 'approved' ? 'badge-success' : resource.approval_status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                        {resource.approval_status}
                      </span>
                    </h3>
                    <p className="text-sm text-base-content/60">By {resource.submitter_name}</p>
                    <p className="mt-1">{resource.description}</p>
                  </div>
                  <div className="flex gap-1">
                    {resource.approval_status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-xs" onClick={() => handleApprove(resource.id)}>Approve</button>
                        <button className="btn btn-error btn-xs" onClick={() => handleReject(resource.id)}>Reject</button>
                      </>
                    )}
                    <button className="btn btn-ghost btn-xs text-error" onClick={() => handleDelete(resource.id)}>Delete</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(resource.tags || []).map((t) => (
                    <span key={t.id} className="badge badge-primary gap-1">
                      {t.name}
                      <button className="btn btn-ghost btn-xs" onClick={() => handleRemoveTag(resource.id, t.id)}>&times;</button>
                    </span>
                  ))}
                  <select className="select select-bordered select-xs" onChange={(e) => { if (e.target.value) handleAddTag(resource.id, e.target.value); e.target.value = '' }} defaultValue="">
                    <option value="" disabled>+ Tag</option>
                    {allTags.filter((t) => !(resource.tags || []).some((rt) => rt.id === t.id)).map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
