'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const details: Record<string, {
  name: string
  label: string
  address: string
  description: string
  coords: string
  image: string
  facts: { icon: string; label: string; value: string }[]
}> = {
  'villa-serenara': {
    name: 'Villa Serenara',
    label: 'Our Villa',
    address: 'Jl. Raya Ubud, Ubud, Gianyar Regency, Bali 80571',
    description:
      'Nestled in the heart of Ubud, Villa Serenara is an exclusive sanctuary surrounded by lush tropical gardens and the gentle sounds of a nearby river. Perched on a private 1.5-hectare estate, the villa commands unobstructed views across the jungle canopy — a world apart from everything ordinary.',
    coords: '8°30\'25"S  115°15\'45"E',
    image: '/assets/images/1_bed_new.png',
    facts: [
      { icon: '✈️', label: 'Airport', value: '45 min from Ngurah Rai' },
      { icon: '🌿', label: 'Estate', value: '1.5 hectares private' },
      { icon: '🏞️', label: 'View', value: 'Campuhan Ridge jungle' },
      { icon: '🛕', label: 'Nearby', value: 'Sacred Monkey Forest' },
      { icon: '🏊', label: 'Pool', value: '20m infinity pool' },
      { icon: '🍽️', label: 'Dining', value: 'Private chef on request' },
    ],
  },
  'ngurah-rai': {
    name: 'Ngurah Rai Airport',
    label: 'Nearest Airport',
    address: 'Jl. Raya Gusti Ngurah Rai, Tuban, Kuta, Badung Regency, Bali 80361',
    description:
      'Ngurah Rai International Airport is Bali\'s principal gateway, connecting the island to major cities across Asia, Australia, and Europe. Our dedicated concierge team coordinates seamless private transfers directly to Villa Serenara — your journey into luxury begins the moment you land.',
    coords: '8°44\'48"S  115°10\'2"E',
    image: '/assets/images/2_bed_new.png',
    facts: [
      { icon: '✈️', label: 'Routes', value: 'SIN · KUL · SYD · DOH' },
      { icon: '🚗', label: 'Transfer', value: '45 min to Villa Serenara' },
      { icon: '🧳', label: 'Arrival', value: 'Terminal 2 international' },
      { icon: '🕐', label: 'Service', value: 'Private transfer 24 / 7' },
      { icon: '💼', label: 'Concierge', value: 'Meet & greet available' },
      { icon: '🛂', label: 'Visa', value: 'Visa on arrival for 80+ nations' },
    ],
  },
}

function Divider() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, margin: '40px 0',
    }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 0l2 6h6l-5 3.6 1.9 6L8 12 3.1 15.6 5 9.6 0 6h6z" fill="var(--accent-1)" opacity="0.6"/>
      </svg>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Hero image */}
      <div style={{ position: 'relative', height: 'clamp(260px, 42vh, 520px)', overflow: 'hidden' }}>
        <Image
          src={detail.image}
          alt={detail.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* Gradient overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(184,146,42,0.12) 0%, transparent 60%)',
        }} />

        {/* Back button over hero */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease }}
          style={{ position: 'absolute', top: 28, left: 'clamp(24px, 5vw, 56px)' }}
        >
          <Link
            href="/map"
            transitionTypes={['nav-back']}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px',
              color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.18)',
              padding: '8px 16px', borderRadius: 99,
              transition: 'background 0.2s',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Map
          </Link>
        </motion.div>

        {/* Hero label + title over image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          style={{
            position: 'absolute', bottom: 'clamp(28px, 5vh, 52px)',
            left: 'clamp(24px, 5vw, 56px)',
          }}
        >
          <p style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '4px',
            textTransform: 'uppercase', color: '#e8c870', marginBottom: 8,
          }}>
            {detail.label}
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
            color: '#fff', lineHeight: 1.1, letterSpacing: '-0.5px',
            textShadow: '0 2px 24px rgba(0,0,0,0.3)',
          }}>
            {detail.name}
          </h1>
        </motion.div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 800, margin: '0 auto',
        padding: 'clamp(40px, 6vh, 72px) clamp(24px, 5vw, 56px)',
      }}>

        {/* Coords badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 99,
            border: '1px solid var(--border-h)',
            background: 'var(--surface)',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', color: 'var(--muted-2)', fontFamily: 'var(--font-mono)' }}>
              {detail.coords}
            </span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.36, ease }}
          style={{
            fontSize: 'clamp(1rem, 1.6vw, 1.125rem)',
            lineHeight: 1.85, color: 'var(--muted-2)',
            fontWeight: 400,
          }}
        >
          {detail.description}
        </motion.p>

        <Divider />

        {/* Address */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.44, ease }}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '20px 24px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            marginBottom: 40,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
            <circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
          <span style={{ fontSize: '0.88rem', color: 'var(--muted-2)', lineHeight: 1.6 }}>{detail.address}</span>
        </motion.div>

        {/* Facts grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          {detail.facts.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.54 + i * 0.05, ease }}
              style={{
                padding: '20px 22px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,146,42,0.4)'
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(184,146,42,0.04)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                ;(e.currentTarget as HTMLElement).style.background = 'var(--surface)'
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-1)', marginBottom: 5 }}>{f.label}</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>{f.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.82, ease }}
          style={{ marginTop: 52, display: 'flex', gap: 14, flexWrap: 'wrap' }}
        >
          <Link href="/contact" className="btn-primary" transitionTypes={['nav-forward']}>
            Book a Stay
          </Link>
          <Link href="/map" className="btn-outline" transitionTypes={['nav-back']}>
            ← Back to Map
          </Link>
        </motion.div>

      </div>
    </motion.div>
  )
}
