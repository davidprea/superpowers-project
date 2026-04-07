import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function MemberRoute() {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>
  if (!user) return <Navigate to="/login" />
  if (user.role === 'admin') return <Outlet />
  if (user.role === 'member' && user.member_status === 'approved') return <Outlet />

  return <Navigate to="/" />
}
