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
    <div className="min-h-screen flex bg-base-100">
      <aside className="w-64 bg-base-200 p-4 border-r border-base-300">
        <h2 className="text-xl font-bold mb-4 px-2">
          <Link to="/" className="text-primary">Superpowers</Link>
        </h2>
        <p className="text-xs uppercase tracking-wider text-base-content/50 px-2 mb-2">Admin Panel</p>
        <ul className="menu w-full">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4 border-t border-base-300">
          <Link to="/" className="btn btn-ghost btn-sm w-full">Back to Site</Link>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
