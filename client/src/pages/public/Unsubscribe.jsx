import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../../services/api'

export default function Unsubscribe() {
  const [searchParams] = useSearchParams()
  const [email] = useState(searchParams.get('email') || '')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUnsubscribe = async () => {
    setError('')
    setLoading(true)
    try {
      await api.post('/subscribers/unsubscribe', { email })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex justify-center py-24 px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="font-serif text-3xl mb-4" style={{ color: 'var(--color-ink)' }}>You've been unsubscribed</h1>
          <p style={{ color: 'var(--color-ink-soft)' }}>
            <strong>{email}</strong> has been removed from our mailing list. You will no longer receive newsletters from us.
          </p>
          <Link to="/subscribe" className="btn-outline-ink inline-block mt-8 text-sm">Re-subscribe</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center py-24 px-6">
      <div className="lab-card w-full max-w-md">
        <h1 className="font-serif text-3xl mb-2" style={{ color: 'var(--color-ink)' }}>Unsubscribe</h1>
        <p className="mb-6" style={{ color: 'var(--color-ink-soft)' }}>
          Remove <strong>{email}</strong> from the Superpowers Project newsletter?
        </p>

        {error && <div className="alert-error p-3 mb-4"><span>{error}</span></div>}

        <div className="flex flex-col gap-3">
          <button onClick={handleUnsubscribe} className="btn-copper w-full" disabled={loading || !email}>
            {loading ? 'Unsubscribing...' : 'Unsubscribe'}
          </button>
          <Link to="/" className="btn-outline-ink w-full text-center text-sm">
            I changed my mind &mdash; stay subscribed
          </Link>
        </div>
      </div>
    </div>
  )
}
