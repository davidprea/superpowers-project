import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import api from '../../services/api'

function MenuBar({ editor }) {
  if (!editor) return null

  const addImage = () => {
    const url = prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const addLink = () => {
    const url = prompt('Link URL:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-base-300 bg-base-200 rounded-t-lg">
      <button type="button" className={`btn btn-xs ${editor.isActive('heading', { level: 2 }) ? 'btn-primary' : 'btn-ghost'}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button" className={`btn btn-xs ${editor.isActive('heading', { level: 3 }) ? 'btn-primary' : 'btn-ghost'}`} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button type="button" className={`btn btn-xs ${editor.isActive('bold') ? 'btn-primary' : 'btn-ghost'}`} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button type="button" className={`btn btn-xs ${editor.isActive('italic') ? 'btn-primary' : 'btn-ghost'}`} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
      <button type="button" className={`btn btn-xs ${editor.isActive('bulletList') ? 'btn-primary' : 'btn-ghost'}`} onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
      <button type="button" className="btn btn-xs btn-ghost" onClick={addLink}>Link</button>
      <button type="button" className="btn btn-xs btn-ghost" onClick={addImage}>Image</button>
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
      Link.configure({ openOnClick: false }),
      Image,
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
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={() => handleSave('draft')} disabled={saving}>Save Draft</button>
          <button className="btn btn-primary" onClick={() => handleSave('approved')} disabled={saving}>
            {saving ? <span className="loading loading-spinner loading-sm"></span> : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
