import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { NodeSelection } from '@tiptap/pm/state'
import api from '../../services/api'

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const attr = element.getAttribute('width')
          if (attr) {
            const n = parseInt(attr, 10)
            if (Number.isFinite(n) && n > 0) return n
          }
          const styleW = element.style?.width
          if (styleW) {
            const n = parseInt(styleW, 10)
            if (Number.isFinite(n) && n > 0) return n
          }
          return null
        },
        renderHTML: (attrs) => {
          if (!attrs.width) return {}
          return { style: `width: ${attrs.width}px; height: auto` }
        },
      },
      href: {
        default: null,
        parseHTML: (element) =>
          element.parentElement?.tagName === 'A'
            ? element.parentElement.getAttribute('href')
            : null,
        renderHTML: () => ({}),
      },
    }
  },
  renderHTML({ node, HTMLAttributes }) {
    const img = ['img', HTMLAttributes]
    if (node.attrs.href) {
      return [
        'a',
        {
          href: node.attrs.href,
          target: '_blank',
          rel: 'noopener noreferrer',
          style: 'display: inline-block; line-height: 0',
        },
        img,
      ]
    }
    return img
  },
})

function ImageDialog({ onInsert, onClose }) {
  const fileInputRef = useRef(null)
  const [url, setUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submitUrl = (e) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    onInsert(trimmed)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await api.post('/uploads/image', form)
      onInsert(data.url)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed')
      setUploading(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(27, 26, 23, 0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="lab-card-light"
        style={{ background: 'var(--color-paper)', width: '100%', maxWidth: '480px', padding: '28px' }}
      >
        <div className="flex justify-between items-baseline mb-5">
          <h2 className="font-serif text-2xl" style={{ color: 'var(--color-ink)' }}>Add Image</h2>
          <button type="button" onClick={onClose} className="tool-btn" aria-label="Close">×</button>
        </div>

        <form onSubmit={submitUrl}>
          <p className="meta-label mb-2">Paste URL</p>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
              style={{ flex: 1, padding: '8px 10px' }}
            />
            <button type="submit" className="btn-copper" disabled={!url.trim() || uploading}>Insert</button>
          </div>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div style={{ flex: 1, height: '1px', background: 'var(--color-rule)' }} />
          <span className="meta-label">or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-rule)' }} />
        </div>

        <p className="meta-label mb-2">Upload from your computer</p>
        <button
          type="button"
          className="btn-outline-ink"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{ width: '100%' }}
        >
          {uploading ? 'Uploading…' : 'Choose file'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {error && (
          <p className="mt-4" style={{ color: 'var(--color-copper)', fontSize: '14px' }}>{error}</p>
        )}
      </div>
    </div>
  )
}

function ImageEditDialog({ initial, onApply, onClose }) {
  const [widthVal, setWidthVal] = useState(initial.width ? String(initial.width) : '')
  const [hrefVal, setHrefVal] = useState(initial.href || '')

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    let width = null
    const trimmedW = widthVal.trim()
    if (trimmedW) {
      const n = parseInt(trimmedW, 10)
      if (Number.isFinite(n) && n > 0) width = n
    }
    let href = null
    const trimmedH = hrefVal.trim()
    if (trimmedH) {
      href = /^https?:\/\//i.test(trimmedH) ? trimmedH : `https://${trimmedH}`
    }
    onApply({ width, href })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(27, 26, 23, 0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="lab-card-light"
        style={{ background: 'var(--color-paper)', width: '100%', maxWidth: '420px', padding: '24px' }}
      >
        <div className="flex justify-between items-baseline mb-5">
          <h2 className="font-serif text-xl" style={{ color: 'var(--color-ink)' }}>Image Settings</h2>
          <button type="button" onClick={onClose} className="tool-btn" aria-label="Close">×</button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="meta-label mb-2">Width (px)</p>
            <input
              type="number"
              min="1"
              autoFocus
              value={widthVal}
              onChange={(e) => setWidthVal(e.target.value)}
              placeholder="auto"
              style={{ width: '100%', height: '32px', padding: '0 10px' }}
            />
          </div>
          <div>
            <p className="meta-label mb-2">Link URL (optional)</p>
            <input
              type="url"
              value={hrefVal}
              onChange={(e) => setHrefVal(e.target.value)}
              placeholder="https://…"
              style={{ width: '100%', height: '32px', padding: '0 10px' }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="submit" className="btn-copper">Apply</button>
          <button type="button" className="btn-outline-ink" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

function MenuBar({ editor }) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  if (!editor) return null

  const insertImage = (src) => {
    editor.chain().focus().setImage({ src }).run()
    setImageDialogOpen(false)
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
    <>
      <div className="flex flex-wrap gap-1 p-2" style={{ background: 'var(--color-paper-deep)', borderBottom: '1px solid var(--color-rule)' }}>
        <button type="button" className={cls(editor.isActive('heading', { level: 2 }))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={cls(editor.isActive('heading', { level: 3 }))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" className={cls(editor.isActive('bold'))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
        <button type="button" className={cls(editor.isActive('italic'))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
        <button type="button" className={cls(editor.isActive('bulletList'))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
        <button type="button" className={cls(editor.isActive('blockquote'))} onMouseDown={prevent} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button type="button" className={cls(editor.isActive('link'))} onMouseDown={prevent} onClick={addLink}>Link</button>
        <button type="button" className={cls(false)} onMouseDown={prevent} onClick={() => setImageDialogOpen(true)}>Image</button>
      </div>
      {imageDialogOpen && (
        <ImageDialog onInsert={insertImage} onClose={() => setImageDialogOpen(false)} />
      )}
    </>
  )
}

export default function BlogEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!!id)
  const [imageEdit, setImageEdit] = useState(null)
  const isEdit = !!id

  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-48 focus:outline-none',
      },
      handleClickOn: (view, pos, node, nodePos, event) => {
        if (node.type.name !== 'image') return false
        event.preventDefault()
        if (event.target.tagName !== 'IMG') return false
        const tr = view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos))
        view.dispatch(tr)
        setImageEdit({ pos: nodePos, attrs: { ...node.attrs } })
        return true
      },
    },
  })

  const applyImageEdit = ({ width, href }) => {
    if (!editor || !imageEdit) return
    const node = editor.state.doc.nodeAt(imageEdit.pos)
    if (!node || node.type.name !== 'image') {
      setImageEdit(null)
      return
    }
    const tr = editor.state.tr.setNodeMarkup(imageEdit.pos, undefined, {
      ...node.attrs,
      width,
      href,
    })
    editor.view.dispatch(tr)
    setImageEdit(null)
  }

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
        {imageEdit && (
          <ImageEditDialog
            initial={imageEdit.attrs}
            onApply={applyImageEdit}
            onClose={() => setImageEdit(null)}
          />
        )}
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
