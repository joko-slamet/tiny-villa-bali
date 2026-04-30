'use client'

import { motion } from 'framer-motion'

const socials = [
  { label: 'GitHub',    icon: '⌥', href: '#', handle: '@devfolio' },
  { label: 'LinkedIn',  icon: '◈', href: '#', handle: 'in/devfolio' },
  { label: 'Twitter/X', icon: '✦', href: '#', handle: '@devfolio' },
  { label: 'Dribbble',  icon: '◇', href: '#', handle: 'devfolio' },
]

export default function SocialLinks() {
  return (
    <div>
      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          marginBottom: 16,
        }}
      >
        Find Me Online
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {socials.map(({ label, icon, href, handle }, i) => (
          <motion.a
            key={label}
            href={href}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            whileHover={{
              borderColor: 'rgba(99,102,241,0.4)',
              background: 'rgba(99,102,241,0.06)',
              x: 4,
              transition: { duration: 0.2 },
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 18px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              textDecoration: 'none',
              color: 'var(--text)',
            }}
          >
            <span style={{ color: 'var(--accent-1)', fontSize: '1.1rem', width: 20, textAlign: 'center' }}>
              {icon}
            </span>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-2)' }}>{handle}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '0.8rem' }}>↗</span>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
