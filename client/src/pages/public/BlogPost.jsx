import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/blog/${slug}`)
      .then((res) => setPost(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg"></span></div>
  if (!post) return <div className="text-center p-12"><h2 className="font-serif text-2xl">Post not found</h2><Link to="/blog" className="btn-copper mt-4 inline-block">Back to Blog</Link></div>

  return (
    <article className="py-20 px-6 max-w-[68ch] mx-auto">
      <Link to="/blog" className="meta-label hover:text-[var(--color-copper)] transition-colors">&larr; Back to News</Link>
      <h1 className="font-serif text-4xl sm:text-5xl mt-8 mb-4" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{post.title}</h1>
      <p className="meta-label mb-12">
        {post.author_name} &middot; {new Date(post.published_at).toLocaleDateString()}
      </p>
      <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
