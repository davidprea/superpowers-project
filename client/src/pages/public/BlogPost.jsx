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
  if (!post) return <div className="text-center p-12"><h2 className="text-2xl font-bold">Post not found</h2><Link to="/blog" className="btn btn-primary mt-4">Back to Blog</Link></div>

  return (
    <article className="py-12 px-4 max-w-3xl mx-auto">
      <Link to="/blog" className="btn btn-ghost btn-sm mb-4">&larr; Back to News</Link>
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-base-content/60 mb-8">
        By {post.author_name} &middot; {new Date(post.published_at).toLocaleDateString()}
      </p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
