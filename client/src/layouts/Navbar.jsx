import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <nav className="border-b border-[var(--color-rule)]" style={{ backgroundColor: 'var(--color-paper)' }}>
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-tight" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
          Superpowers Project
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {[
            ['/', 'Home'],
            ['/about', 'About'],
            ['/blog', 'News'],
            ['/members', 'Members'],
            ['/resources', 'Resources'],
          ].map(([to, label]) => (
            <li key={to}>
              <Link to={to} className="text-sm font-medium tracking-wide hover:text-[var(--color-copper)] transition-colors" style={{ color: 'var(--color-ink-soft)' }}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {isAdmin ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="text-sm font-medium cursor-pointer hover:text-[var(--color-copper)]" style={{ color: 'var(--color-ink-soft)' }}>
                {user.name}
                <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 w-48" style={{ backgroundColor: 'var(--color-paper)', border: '1px solid var(--color-rule)', borderRadius: '2px' }}>
                <li><Link to="/admin">Admin Panel</Link></li>
                <li><button onClick={logout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/subscribe" className="btn-copper text-sm">Subscribe</Link>
          )}

          {/* Mobile hamburger */}
          <div className="dropdown dropdown-end lg:hidden">
            <div tabIndex={0} role="button" className="cursor-pointer" style={{ color: 'var(--color-ink)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 w-52" style={{ backgroundColor: 'var(--color-paper)', border: '1px solid var(--color-rule)', borderRadius: '2px' }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/blog">News</Link></li>
              <li><Link to="/members">Members</Link></li>
              <li><Link to="/resources">Resources</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
