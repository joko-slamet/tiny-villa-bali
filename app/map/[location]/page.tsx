'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const details: Record<string, {
  name: string
  label: string
  address: string
  description: string
  coords: string
  facts: { icon: string; text: string }[]
}> = {
  'villa-serenara': {
    name: 'Villa Serenara',
    label: 'Our Villa',
    address: 'Jl. Raya Ubud, Ubud, Gianyar Regency, Bali 80571',
    description:
      'Nestled in the heart of Ubud, Villa Serenara offers an exclusive retreat surrounded by lush tropical gardens and the gentle sounds of a nearby river. The villa sits on a private 1.5-hectare estate with unobstructed views of the jungle canopy.',
    coords: '-8.5069, 115.2625',
    facts: [
      { icon: '🚗', text: '45 min from Ngurah Rai Airport' },
      { icon: '🌿', text: 'Set within 1.5 ha of private tropical garden' },
      { icon: '🏞️', text: 'Overlooking Campuhan Ridge jungle valley' },
      { icon: '🛕', text: '5 min walk to Ubud Sacred Monkey Forest' },
    ],
  },
  'ngurah-rai': {
    name: 'Ngurah Rai International Airport',
    label: 'Nearest Airport',
    address: 'Jl. Raya Gusti Ngurah Rai, Tuban, Kuta, Badung Regency, Bali 80361',
    description:
      'Ngurah Rai International Airport is the main international gateway to Bali, serving direct flights from major cities across Asia, Australia, and Europe. Our concierge team can arrange private airport transfers directly to Villa Serenara.',
    coords: '-8.7467, 115.1671',
    facts: [
      { icon: '✈️', text: 'Direct flights from SIN, KUL, SYD, DOH & more' },
      { icon: '🚗', text: '45 min drive north to Villa Serenara' },
      { icon: '🧳', text: 'Private transfer available — contact concierge' },
      { icon: '🕐', text: 'Terminal 2 for all international arrivals' },
    ],
  },
}

export default function LocationDetailPage({
  params,
}: {
  params: Promise<{ location: string }>
}) {
  const { location } = use(params)
  const detail = details[location]

  if (!detail) {
    return (
      <section style={{ minHeight: 'calc(100vh - var(--nav-h))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Location not found.</p>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vh, 80px) clamp(24px, 6vw, 80px)',
        background: 'var(--bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 640 }}>

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease }}
        >
          <Link
            href="/map"
            transitionTypes={['nav-back']}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--muted-2)',
              textDecoration: 'none',
              marginBottom: 32,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Map
          </Link>
        </motion.div>

        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          {detail.label}
        </motion.p>

        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease }}
        >
          {detail.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease }}
          style={{ color: 'var(--muted-2)', fontSize: '0.88rem', marginBottom: 24, marginTop: -8 }}
        >
          📍 {detail.address}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease }}
          style={{ color: 'var(--muted-2)', lineHeight: 1.75, marginBottom: 36 }}
        >
          {detail.description}
        </motion.p>

        {/* Facts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34, ease }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
            marginBottom: 40,
          }}
        >
          {detail.facts.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.38 + i * 0.06, ease }}
              className="card"
              style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <span style={{ fontSize: '1.2rem' }}>{f.icon}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted-2)', lineHeight: 1.4 }}>{f.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Coords */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55, ease }}
          style={{ fontSize: '0.78rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}
        >
          {detail.coords}
        </motion.p>

      </div>
    </motion.section>
  )
}
