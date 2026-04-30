'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',          label: 'Home' },
  { href: '/projects',  label: 'Projects' },
  { href: '/contact',   label: 'Contact' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="nav" style={{ viewTransitionName: 'site-nav' }}>
      <Link href="/" className="nav-logo">
        dev<span>.</span>folio
      </Link>
      <ul className="nav-links">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`nav-link ${pathname === href ? 'active' : ''}`}
              transitionTypes={
                links.findIndex(l => l.href === pathname) <
                links.findIndex(l => l.href === href)
                  ? ['nav-forward']
                  : ['nav-back']
              }
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
