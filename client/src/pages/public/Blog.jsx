import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import HeroSection from '../../layouts/HeroSection'

function extractFirstImage(html) {
  if (!html) return null
  const match = html.match(/<img[^>]+src="([^"]+)"/)
  return match ? match[1] : null
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/blog')
      .then((res) => setPosts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <HeroSection title="News & Announcements" subtitle="Updates from the Superpowers Project consortium" />
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <p className="meta-label-copper mb-10">&sect; 01 &mdash; Latest</p>
        {loading ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
        ) : posts.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--color-mute)' }}>No posts yet. Check back soon!</p>
        ) : (
          <div className="flex flex-col gap-0">
            {posts.map((post, i) => {
              const image = extractFirstImage(post.content)
              return (
                <article key={post.id} className={`flex flex-col sm:flex-row gap-6 py-8 ${i > 0 ? 'hairline' : ''}`}>
                  {image && (
                    <div className="sm:w-48 sm:min-w-48 h-36 overflow-hidden" style={{ border: '1px solid var(--color-rule)', borderRadius: '2px' }}>
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <p className="meta-label mb-2">
                      {post.author_name} &middot; {new Date(post.published_at).toLocaleDateString()}
                    </p>
                    <h2 className="font-serif text-2xl mb-1">
                      <Link to={`/blog/${post.slug}`} className="hover:text-[var(--color-copper)] transition-colors" style={{ color: 'var(--color-ink)' }}>{post.title}</Link>
                    </h2>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
