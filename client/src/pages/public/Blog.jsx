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
      <section className="py-12 px-4 max-w-3xl mx-auto">
        {loading ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
        ) : posts.length === 0 ? (
          <p className="text-center text-base-content/60">No posts yet. Check back soon!</p>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => {
              const image = extractFirstImage(post.content)
              return (
                <article key={post.id} className="card bg-base-200 card-side flex-col sm:flex-row overflow-hidden">
                  {image && (
                    <figure className="sm:w-48 sm:min-w-48 h-48 sm:h-auto">
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  )}
                  <div className="card-body">
                    <h2 className="card-title">
                      <Link to={`/blog/${post.slug}`} className="link link-hover">{post.title}</Link>
                    </h2>
                    <p className="text-sm text-base-content/60">
                      By {post.author_name} &middot; {new Date(post.published_at).toLocaleDateString()}
                    </p>
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
