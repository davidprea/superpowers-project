import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function BlogManager() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const params = filter ? { status: filter } : {}
    api.get('/blog/admin', { params })
      .then((res) => setPosts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter])

  const handleApprove = async (id) => {
    await api.post(`/blog/${id}/approve`)
    setPosts(posts.map((p) => p.id === id ? { ...p, approval_status: 'approved' } : p))
  }

  const handleReject = async (id) => {
    await api.post(`/blog/${id}/reject`)
    setPosts(posts.map((p) => p.id === id ? { ...p, approval_status: 'rejected' } : p))
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    await api.delete(`/blog/${id}`)
    setPosts(posts.filter((p) => p.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link to="/admin/blog/new" className="btn btn-primary">New Post</Link>
      </div>

      <div className="mb-4">
        <select className="select select-bordered select-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="draft">Drafts</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Published</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.author_name}</td>
                  <td>
                    <span className={`badge ${post.approval_status === 'approved' ? 'badge-success' : post.approval_status === 'pending' ? 'badge-warning' : post.approval_status === 'rejected' ? 'badge-error' : 'badge-ghost'}`}>
                      {post.approval_status}
                    </span>
                  </td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/admin/blog/${post.id}/edit`} className="btn btn-ghost btn-xs">Edit</Link>
                      {post.approval_status === 'pending' && (
                        <>
                          <button className="btn btn-success btn-xs" onClick={() => handleApprove(post.id)}>Approve</button>
                          <button className="btn btn-error btn-xs" onClick={() => handleReject(post.id)}>Reject</button>
                        </>
                      )}
                      <button className="btn btn-ghost btn-xs text-error" onClick={() => handleDelete(post.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
