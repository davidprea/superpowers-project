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

  // Auto-preview whenever tags change
  useEffect(() => {
    api.post('/email/preview', { tag_ids: selectedTags })
      .then((res) => setPreview(res.data))
      .catch(() => {})
  }, [selectedTags])

  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
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
          <span>A newsletter was sent {daysSinceLastNews} day(s) ago. Consider waiting to maintain a weekly cadence.</span>
        </div>
      )}

      {message && <div className="alert alert-info mb-4"><span>{message}</span></div>}

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-semibold mb-2">Filter by tags (none selected = all subscribers):</h3>
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

        {preview && (
          <div className="card bg-base-200">
            <div className="card-body py-4">
              <h3 className="font-semibold">
                Recipients ({preview.recipient_count})
                {selectedTags.length === 0 && <span className="font-normal text-base-content/60"> — all subscribers</span>}
              </h3>
              {preview.recipients.length === 0 ? (
                <p className="text-sm text-base-content/60">No subscribers match the selected tags.</p>
              ) : (
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Organization</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.recipients.map((r) => (
                        <tr key={r.id}>
                          <td>{r.first_name} {r.last_name}</td>
                          <td>{r.email}</td>
                          <td>{r.organization}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <input type="text" placeholder="Subject" className="input input-bordered" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <textarea placeholder="Email body..." className="textarea textarea-bordered h-48" value={body} onChange={(e) => setBody(e.target.value)} />

        <button
          className="btn btn-primary w-fit"
          onClick={handleSend}
          disabled={!subject || !body || !preview || preview.recipient_count === 0 || sending}
        >
          {sending ? <span className="loading loading-spinner loading-sm"></span> : `Send to ${preview?.recipient_count || 0} Recipients`}
        </button>
      </div>
    </div>
  )
}
