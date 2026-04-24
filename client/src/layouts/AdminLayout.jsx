import { Link, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/subscribers', label: 'Subscribers' },
  { path: '/admin/tags', label: 'Tags' },
  { path: '/admin/blog', label: 'Blog' },
  { path: '/admin/resources', label: 'Resources' },
  { path: '/admin/members', label: 'Members' },
  { path: '/admin/email', label: 'Email' },
]

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-paper)' }}>
      <aside className="w-64 p-6 border-r" style={{ backgroundColor: 'var(--color-paper-deep)', borderColor: 'var(--color-rule)' }}>
        <h2 className="font-serif text-xl mb-1">
          <Link to="/" style={{ color: 'var(--color-copper)' }}>Superpowers</Link>
        </h2>
        <p className="meta-label mb-6">Admin Panel</p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="block px-3 py-2 text-sm font-medium transition-colors"
                style={{
                  color: location.pathname === item.path ? 'var(--color-copper)' : 'var(--color-ink-soft)',
                  backgroundColor: location.pathname === item.path ? 'var(--color-copper-soft)' : 'transparent',
                  borderRadius: '2px',
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 pt-4 hairline">
          <Link to="/" className="text-sm font-medium hover:text-[var(--color-copper)] transition-colors" style={{ color: 'var(--color-mute)' }}>
            &larr; Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
