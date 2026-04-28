import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'admin'
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)
  const mobileRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-rule)]" style={{ backgroundColor: 'var(--color-paper)' }}>
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between relative">
        <Link to="/" className="font-serif text-2xl tracking-tight" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
          Superpowers Project
        </Link>

        {/* Desktop nav — centered on the full bar */}
        <ul className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {[
            ['/', 'Home'],
            ['/about', 'About'],
            ['/blog', 'News'],
            ['/members', 'Members'],
            ['/resources', 'Resources'],
          ].map(([to, label]) => (
            <li key={to}>
              <Link to={to} className="text-sm font-medium tracking-wide hover:text-[var(--color-copper)] transition-colors" style={{ color: isActive(to) ? 'var(--color-copper)' : 'var(--color-ink-soft)' }}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {isAdmin ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-sm font-medium cursor-pointer hover:text-[var(--color-copper)] transition-colors"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                {user.name}
                <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen && (
                <ul className="absolute right-0 mt-3 z-10 p-2 w-48 flex flex-col gap-1" style={{ backgroundColor: 'var(--color-paper)', border: '1px solid var(--color-rule)', borderRadius: '2px' }}>
                  <li><Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm hover:text-[var(--color-copper)] transition-colors" style={{ color: 'var(--color-ink-soft)' }}>Admin Panel</Link></li>
                  <li><button onClick={() => { logout(); setMenuOpen(false) }} className="block w-full text-left px-3 py-2 text-sm hover:text-[var(--color-copper)] transition-colors" style={{ color: 'var(--color-ink-soft)' }}>Logout</button></li>
                </ul>
              )}
            </div>
          ) : (
            <Link to="/subscribe" className="btn-copper text-sm">Subscribe</Link>
          )}

          {/* Mobile hamburger */}
          <div className="relative lg:hidden" ref={mobileRef}>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="cursor-pointer" style={{ color: 'var(--color-ink)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
            {mobileOpen && (
              <ul className="absolute right-0 mt-3 z-10 p-3 w-52 flex flex-col gap-1" style={{ backgroundColor: 'var(--color-paper)', border: '1px solid var(--color-rule)', borderRadius: '2px' }}>
                {[['/', 'Home'], ['/about', 'About'], ['/blog', 'News'], ['/members', 'Members'], ['/resources', 'Resources']].map(([to, label]) => (
                  <li key={to}><Link to={to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm hover:text-[var(--color-copper)] transition-colors" style={{ color: isActive(to) ? 'var(--color-copper)' : 'var(--color-ink-soft)' }}>{label}</Link></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
