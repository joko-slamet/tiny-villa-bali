'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const markers = [
  {
    slug: 'canggu-residence',
    name: 'Canggu Residence',
    desc: 'Our exclusive 5-bedroom private villa in Ubud',
    // position as % of image — adjust x/y to match actual map
    x: 46,
    y: 36,
  },
  {
    slug: 'binging-residence',
    name: 'Binging Residence',
    desc: '45 min drive from the villa',
    x: 54,
    y: 48,
  },
]

export default function MapPage() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vh, 80px) clamp(24px, 6vw, 80px)',
        background: 'var(--bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 900 }}>
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          Location
        </motion.p>

        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
        >
          Find Us
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.28, ease }}
          style={{ marginTop: 32, borderRadius: 24, overflow: 'hidden', position: 'relative' }}
        >
          <Image
            src="/assets/images/map.png"
            alt="Villa Serenara Location Map"
            width={2594}
            height={1632}
            style={{ display: 'block', width: '100%', height: 'auto' }}
            priority
          />

          {/* Markers */}
          {markers.map((m, i) => (
            <motion.div
              key={m.slug}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.15, ease }}
              style={{
                position: 'absolute',
                left: `${m.x}%`,
                top: `${m.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
              onMouseEnter={() => setHovered(m.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link href={`/map/${m.slug}`} transitionTypes={['nav-forward']} style={{ textDecoration: 'none' }}>
                {/* Pulse ring */}
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(184,146,42,0.25)',
                  animation: 'pulse-ring 2s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />

                {/* Google Maps-style pin */}
                <motion.span
                  whileHover={{ scale: 1.2, y: -3 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'block', cursor: 'pointer', position: 'relative', lineHeight: 0 }}
                >
                  <svg
                    width="28" height="38"
                    viewBox="0 0 28 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: 'drop-shadow(0 3px 8px rgba(184,146,42,0.55))' }}
                  >
                    {/* Pin body */}
                    <path
                      d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 24 14 24S28 23.333 28 14C28 6.268 21.732 0 14 0z"
                      fill="#b8922a"
                    />
                    {/* Inner circle */}
                    <circle cx="14" cy="13" r="5.5" fill="#fff" opacity="0.9" />
                  </svg>
                </motion.span>

                {/* Tooltip */}
                <AnimatePresence>
                  {hovered === m.slug && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.18, ease }}
                      style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 10px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(28,21,16,0.9)',
                        backdropFilter: 'blur(12px)',
                        color: '#fff',
                        borderRadius: 10,
                        padding: '8px 14px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 2 }}>{m.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)' }}>{m.desc}</div>
                      {/* Caret */}
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid rgba(28,21,16,0.9)',
                      }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
