import { useState } from 'react'
import api from '../../services/api'
import HeroSection from '../../layouts/HeroSection'

export default function NewsletterSignup() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    organization: '',
    email: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/subscribers', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div>
        <HeroSection title="You're Subscribed!" subtitle="Thank you for joining the Superpowers Project newsletter" />
        <section className="py-12 px-4 max-w-md mx-auto text-center">
          <p className="text-lg">You'll receive news, updates, and announcements from the consortium directly to your inbox.</p>
        </section>
      </div>
    )
  }

  return (
    <div>
      <HeroSection title="Stay Connected" subtitle="Subscribe to the Superpowers Project newsletter" />
      <section className="py-12 px-4 max-w-md mx-auto">
        <div className="card bg-base-200">
          <div className="card-body">
            {error && <div className="alert alert-error"><span>{error}</span></div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text">First Name</span></label>
                <input type="text" name="first_name" className="input input-bordered w-full" value={form.first_name} onChange={handleChange} required />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Last Name</span></label>
                <input type="text" name="last_name" className="input input-bordered w-full" value={form.last_name} onChange={handleChange} required />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Organization</span></label>
                <input type="text" name="organization" className="input input-bordered w-full" value={form.organization} onChange={handleChange} required />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Email</span></label>
                <input type="email" name="email" className="input input-bordered w-full" value={form.email} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
