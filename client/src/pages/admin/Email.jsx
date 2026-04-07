import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function AdminEmail() {
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [preview, setPreview] = useState(null)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [lastNewsDate, setLastNewsDate] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/tags'),
      api.get('/email/last-news-date'),
    ]).then(([tagRes, newsRes]) => {
      setTags(tagRes.data)
      setLastNewsDate(newsRes.data.last_date)
    }).catch(() => {})
  }, [])

  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
    setPreview(null)
  }

  const handlePreview = async () => {
    try {
      const res = await api.post('/email/preview', { tag_ids: selectedTags })
      setPreview(res.data)
    } catch {}
  }

  const handleSend = async () => {
    if (!confirm(`Send this email to ${preview.recipient_count} recipients?`)) return
    setSending(true)
    try {
      await api.post('/email/send', { tag_ids: selectedTags, subject, body })
      setMessage('Email sent successfully!')
      setSubject('')
      setBody('')
      setSelectedTags([])
      setPreview(null)
    } catch {
      setMessage('Failed to send email.')
    } finally {
      setSending(false)
    }
  }

  const daysSinceLastNews = lastNewsDate
    ? Math.floor((Date.now() - new Date(lastNewsDate).getTime()) / 86400000)
    : null

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Compose Email</h1>

      {daysSinceLastNews !== null && daysSinceLastNews < 7 && (
        <div className="alert alert-warning mb-4">
          <span>A "News & Announcements" email was sent {daysSinceLastNews} day(s) ago. Consider waiting to maintain a weekly cadence.</span>
        </div>
      )}

      {message && <div className="alert alert-info mb-4"><span>{message}</span></div>}

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-semibold mb-2">Select recipient tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={`badge badge-lg cursor-pointer ${selectedTags.includes(tag.id) ? 'badge-primary' : 'badge-outline'}`}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-outline btn-sm w-fit" onClick={handlePreview} disabled={selectedTags.length === 0}>
          Preview Recipients
        </button>

        {preview && (
          <div className="alert alert-info">
            <span>This email will be sent to <strong>{preview.recipient_count}</strong> recipient(s).</span>
          </div>
        )}

        <input type="text" placeholder="Subject" className="input input-bordered" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <textarea placeholder="Email body..." className="textarea textarea-bordered h-48" value={body} onChange={(e) => setBody(e.target.value)} />

        <button
          className="btn btn-primary w-fit"
          onClick={handleSend}
          disabled={!subject || !body || selectedTags.length === 0 || !preview || sending}
        >
          {sending ? <span className="loading loading-spinner loading-sm"></span> : `Send to ${preview?.recipient_count || 0} Recipients`}
        </button>
      </div>
    </div>
  )
}
