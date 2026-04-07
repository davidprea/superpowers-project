import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    school_name: '',
    school_url: '',
    role: 'observer',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center py-16 px-4">
      <div className="card w-full max-w-md bg-base-200">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center">Join the Superpowers Project</h2>
          {error && <div className="alert alert-error"><span>{error}</span></div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Contact Name</span></label>
              <input type="text" name="name" className="input input-bordered w-full" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" name="email" className="input input-bordered w-full" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" name="password" className="input input-bordered w-full" value={form.password} onChange={handleChange} required minLength={8} />
            </div>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">School Name</span></label>
              <input type="text" name="school_name" className="input input-bordered w-full" value={form.school_name} onChange={handleChange} required />
            </div>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">School URL</span></label>
              <input type="url" name="school_url" className="input input-bordered w-full" value={form.school_url} onChange={handleChange} placeholder="https://" />
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">How would you like to participate?</span></label>
              <div className="flex flex-col gap-3 mt-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="role" value="observer" className="radio radio-primary mt-1" checked={form.role === 'observer'} onChange={handleChange} />
                  <div>
                    <span className="font-medium">Observer</span>
                    <p className="text-xs text-base-content/60">Receive news and announcements via email</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="radio" name="role" value="member" className="radio radio-primary mt-1" checked={form.role === 'member'} onChange={handleChange} />
                  <div>
                    <span className="font-medium">Full Member</span>
                    <p className="text-xs text-base-content/60">Access member resources and directory (requires admin approval)</p>
                  </div>
                </label>
              </div>
            </div>

            {form.role === 'member' && (
              <div className="alert alert-info">
                <span>Full member access requires admin approval. You will be notified by email once your application is reviewed.</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Register'}
            </button>
          </form>
          <p className="text-center text-sm mt-2">
            Already have an account? <Link to="/login" className="link link-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
