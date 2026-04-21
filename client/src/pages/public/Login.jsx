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
    <div className="flex justify-center py-16 px-4">
      <div className="card w-full max-w-md bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center">Admin Login</h2>
          {error && <div className="alert alert-error"><span>{error}</span></div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" className="input input-bordered w-full" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
