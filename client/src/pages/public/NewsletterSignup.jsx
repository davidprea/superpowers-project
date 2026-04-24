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
        <section className="py-20 px-6 max-w-md mx-auto text-center">
          <p style={{ color: 'var(--color-ink-soft)' }}>You'll receive news, updates, and announcements from the consortium directly to your inbox.</p>
        </section>
      </div>
    )
  }

  return (
    <div>
      <HeroSection title="Stay Connected" subtitle="Subscribe to the Superpowers Project newsletter" />
      <section className="py-20 px-6 max-w-md mx-auto">
        <div className="lab-card">
          <p className="meta-label-copper mb-6">&sect; Subscribe</p>
          {error && <div className="alert-error p-3 mb-4"><span>{error}</span></div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="meta-label block mb-2">First Name</label>
              <input type="text" name="first_name" className="w-full px-4 py-2" value={form.first_name} onChange={handleChange} required />
            </div>
            <div>
              <label className="meta-label block mb-2">Last Name</label>
              <input type="text" name="last_name" className="w-full px-4 py-2" value={form.last_name} onChange={handleChange} required />
            </div>
            <div>
              <label className="meta-label block mb-2">Organization</label>
              <input type="text" name="organization" className="w-full px-4 py-2" value={form.organization} onChange={handleChange} required />
            </div>
            <div>
              <label className="meta-label block mb-2">Email</label>
              <input type="email" name="email" className="w-full px-4 py-2" value={form.email} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-copper w-full" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
