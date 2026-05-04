import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import api from '../../services/api'

function MenuBar({ editor }) {
  if (!editor) return null

  const addImage = () => {
    const url = prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const addLink = () => {
    let url = prompt('Link URL:')
    if (!url) return
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url
    editor.chain().focus().setLink({ href: url, target: '_blank' }).run()
  }

  const prevent = (e) => e.preventDefault()
  const cls = (active) => `tool-btn${active ? ' is-active' : ''}`

  return (
    <div className="flex flex-wrap gap-1 p-2" style={{ background: 'var(--color-paper-deep)', borderBottom: '1px solid var(--color-rule)' }}>
      <button type="button" className={cls(editor.isActive('heading', { level: 2 }))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button" className={cls(editor.isActive('heading', { level: 3 }))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button type="button" className={cls(editor.isActive('bold'))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
      <button type="button" className={cls(editor.isActive('italic'))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
      <button type="button" className={cls(editor.isActive('bulletList'))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
      <button type="button" className={cls(editor.isActive('link'))} onMouseDown={prevent} onClick={addLink}>Link</button>
      <button type="button" className={cls(false)} onMouseDown={prevent} onClick={addImage}>Image</button>
    </div>
  )
}

export default function BlogEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!!id)
  const isEdit = !!id

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-48 focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (id && editor) {
      api.get(`/blog/admin/${id}`)
        .then((res) => {
          setTitle(res.data.title)
          editor.commands.setContent(res.data.content || '')
        })
        .catch(() => navigate('/admin/blog'))
        .finally(() => setLoading(false))
    }
  }, [id, editor, navigate])

  const handleSave = async (status) => {
    setSaving(true)
    try {
      const data = { title, content: editor.getHTML(), approval_status: status }
      if (isEdit) {
        await api.patch(`/blog/${id}`, data)
      } else {
        await api.post('/blog', data)
      }
      navigate('/admin/blog')
    } catch {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Post' : 'New Post'}</h1>
      <div className="flex flex-col gap-4">
        <input type="text" placeholder="Post title" className="input input-bordered text-xl" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="border border-base-300 rounded-lg">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            className="btn-outline-ink"
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            type="button"
            className="btn-copper"
            onClick={() => handleSave('approved')}
            disabled={saving}
          >
            {saving ? <span className="loading loading-spinner loading-sm"></span> : 'Publish'}
          </button>
          <button
            type="button"
            className="btn-outline-ink"
            onClick={() => navigate('/admin/blog')}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
