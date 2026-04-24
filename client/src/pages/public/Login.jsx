import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center py-24 px-6">
      <div className="lab-card w-full max-w-md">
        <p className="meta-label-copper mb-6">&sect; Admin</p>
        <h2 className="font-serif text-3xl mb-8" style={{ color: 'var(--color-ink)' }}>Login</h2>
        {error && <div className="alert-error p-3 mb-4"><span>{error}</span></div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="meta-label block mb-2">Email</label>
            <input type="email" className="w-full px-4 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="meta-label block mb-2">Password</label>
            <input type="password" className="w-full px-4 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-copper w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
