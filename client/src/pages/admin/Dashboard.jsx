import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/subscribers/stats/count'),
      api.get('/blog/admin'),
      api.get('/resources/admin'),
    ])
      .then(([subRes, blogRes, resRes]) => {
        const pendingPosts = blogRes.data.filter((p) => p.approval_status === 'pending').length
        const pendingResources = resRes.data.filter((r) => r.approval_status === 'pending').length
        setStats({
          total_subscribers: parseInt(subRes.data.total_subscribers) || 0,
          pending_posts: pendingPosts,
          pending_resources: pendingResources,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">Newsletter Subscribers</div>
          <div className="stat-value">{stats?.total_subscribers || 0}</div>
          <div className="stat-actions"><Link to="/admin/subscribers" className="btn btn-sm">View All</Link></div>
        </div>
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">Pending Posts</div>
          <div className="stat-value text-info">{stats?.pending_posts || 0}</div>
          <div className="stat-actions"><Link to="/admin/blog" className="btn btn-sm btn-info">Review</Link></div>
        </div>
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">Pending Resources</div>
          <div className="stat-value text-warning">{stats?.pending_resources || 0}</div>
          <div className="stat-actions"><Link to="/admin/resources" className="btn btn-sm btn-warning">Review</Link></div>
        </div>
      </div>
    </div>
  )
}
