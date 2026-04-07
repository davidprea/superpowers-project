import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../services/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')

  useEffect(() => {
    const params = {}
    if (roleFilter) params.role = roleFilter
    if (statusFilter) params.status = statusFilter
    api.get('/users', { params })
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [roleFilter, statusFilter])

  const handleApprove = async (id) => {
    await api.post(`/users/${id}/approve`)
    setUsers(users.map((u) => u.id === id ? { ...u, member_status: 'approved' } : u))
  }

  const handleReject = async (id) => {
    await api.post(`/users/${id}/reject`)
    setUsers(users.map((u) => u.id === id ? { ...u, member_status: 'rejected' } : u))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className="flex gap-4 mb-4">
        <select className="select select-bordered select-sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="observer">Observer</option>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <select className="select select-bordered select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>School</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><Link to={`/admin/users/${user.id}`} className="link link-primary">{user.name}</Link></td>
                  <td>{user.email}</td>
                  <td><span className="badge badge-outline">{user.role}</span></td>
                  <td>
                    {user.member_status && (
                      <span className={`badge ${user.member_status === 'approved' ? 'badge-success' : user.member_status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                        {user.member_status}
                      </span>
                    )}
                  </td>
                  <td>{user.school_name}</td>
                  <td>
                    {user.member_status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="btn btn-success btn-xs" onClick={() => handleApprove(user.id)}>Approve</button>
                        <button className="btn btn-error btn-xs" onClick={() => handleReject(user.id)}>Reject</button>
                      </div>
                    )}
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
