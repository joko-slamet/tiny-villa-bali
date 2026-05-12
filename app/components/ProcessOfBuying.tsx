'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    title: 'House Viewing',
    body: "We are here to help you find the perfect place for your family. Depending on your needs, we'll suggest properties to view and book you in for your viewing.",
  },
  {
    n: '02',
    title: 'Negotiating Terms',
    body: "Once you've found the property of your dreams and are ready to place an offer, we will negotiate the best terms to suit your budget and needs.",
  },
  {
    n: '03',
    title: 'Close Care-Free',
    body: "We don't play around – that means that our bold and confident approach to closing results in you walking away with the keys to your new dream property.",
  },
]

export default function ProcessOfBuying() {
  const [open, setOpen] = useState(false)
  const clickSound = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    clickSound.current = new Audio('/assets/audio/click.wav')
    clickSound.current.volume = 0.5
    clickSound.current.load()
  }, [])

  return (
    <>
      {/* ── Trigger ── */}
      <motion.button
        onClick={() => {
          if (clickSound.current) {
            clickSound.current.currentTime = 0
            clickSound.current.play().catch(() => {})
          }
          setOpen(true)
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute',
          bottom: 'clamp(16px, 4vw, 40px)',
          left: 'clamp(16px, 4vw, 40px)',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'linear-gradient(135deg, rgba(184,146,42,0.18) 0%, rgba(20,15,8,0.75) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(184,146,42,0.55)',
          borderRadius: 99,
          padding: '13px 24px',
          cursor: 'pointer',
          color: '#f0d88a',
          boxShadow: '0 0 24px rgba(184,146,42,0.2), 0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Outer ping ring */}
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 10, height: 10, flexShrink: 0 }}>
          <motion.span
            animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: '#b8922a',
            }}
          />
          <motion.span
            animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: '#b8922a',
            }}
          />
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f0d080', display: 'block', position: 'relative', zIndex: 1 }} />
        </span>

        <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
          Process of Buying
        </span>

        {/* 3D Arrow */}
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shadow layer — depth illusion */}
            <path d="M3.5 13.5 L13.5 3.5" stroke="rgba(80,50,0,0.35)" strokeWidth="2.8" strokeLinecap="round"/>
            <path d="M7 3.5 L13.5 3.5 L13.5 10" stroke="rgba(80,50,0,0.35)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            {/* Arrowhead face */}
            <path d="M3 13 L13 3" stroke="#f0d080" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6.5 3 L13 3 L13 9.5" stroke="#f0d080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            {/* Top highlight */}
            <path d="M7 3 L13 3" stroke="rgba(255,245,180,0.7)" strokeWidth="0.8" strokeLinecap="round"/>
          </svg>
        </motion.span>
      </motion.button>

      {/* ── Click-outside catcher ── */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9998 }} />
      )}

      {/* ── Popover card ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              bottom: 'clamp(100px, 14vw, 116px)',
              left: 'clamp(16px, 4vw, 40px)',
              width: 'min(calc(100vw - 32px), 400px)',
              zIndex: 9999,
              background: 'rgba(255,251,242,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(184,146,42,0.3)',
              borderRadius: 20,
              boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 0 60px rgba(184,146,42,0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Gold top border line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: 2,
                background: 'linear-gradient(90deg, transparent, #b8922a, #f0d080, #b8922a, transparent)',
                transformOrigin: 'left',
              }}
            />

            {/* Content */}
            <div style={{ padding: '24px 28px 28px' }}>
              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <p style={{
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '5px',
                  textTransform: 'uppercase',
                  color: '#b8922a',
                  marginBottom: 6,
                }}>
                  Tiny Villa Bali
                </p>
                <h2 style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  color: '#1a1208',
                  margin: 0,
                  lineHeight: 1.2,
                }}>
                  Process of Buying
                </h2>
              </div>

              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr',
                      gap: 16,
                      padding: '18px 0',
                      borderBottom: i < STEPS.length - 1 ? '1px solid rgba(184,146,42,0.08)' : 'none',
                      alignItems: 'start',
                    }}
                  >
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 900,
                      color: 'rgba(184,146,42,0.25)',
                      lineHeight: 1,
                      letterSpacing: '-1px',
                      userSelect: 'none',
                      paddingTop: 1,
                    }}>
                      {step.n}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        color: '#b8922a',
                        marginBottom: 6,
                      }}>
                        {step.title}
                      </h3>
                      <p style={{
                        fontSize: '0.82rem',
                        color: 'rgba(30,20,10,0.55)',
                        lineHeight: 1.75,
                        fontWeight: 300,
                        margin: 0,
                      }}>
                        {step.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow pointing down to button */}
            <div style={{
              position: 'absolute',
              bottom: -8,
              left: 32,
              width: 16,
              height: 16,
              background: 'rgba(255,251,242,0.97)',
              border: '1px solid rgba(184,146,42,0.3)',
              borderTop: 'none',
              borderLeft: 'none',
              transform: 'rotate(45deg)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
