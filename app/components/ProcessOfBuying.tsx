'use client'

import { useState } from 'react'
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

  return (
    <>
      {/* ── Trigger ── */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
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

        {/* Arrow */}
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: 1 }}
        >
          ↗
        </motion.span>
      </motion.button>

      {/* ── Modal Overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(8,6,3,0.97)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              perspective: '1400px',
            }}
          >
            {/* Ambient glow */}
            <div style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(184,146,42,0.07) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Content panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 80, rotateX: 18, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, rotateX: -12, scale: 0.93 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '90%',
                maxWidth: 700,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: 52, textAlign: 'center' }}
              >
                <p style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '7px',
                  textTransform: 'uppercase',
                  color: '#b8922a',
                  marginBottom: 18,
                }}>
                  Tiny Villa Bali
                </p>
                <h2 style={{
                  fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  color: '#f5ede0',
                  lineHeight: 1,
                  margin: 0,
                }}>
                  Process of Buying
                </h2>

                {/* Animated gold line */}
                <div style={{ position: 'relative', marginTop: 28, height: 1 }}>
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.55, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent 0%, #b8922a 40%, #f0d080 60%, #b8922a 80%, transparent 100%)',
                      transformOrigin: 'center',
                    }}
                  />
                  {/* Center diamond */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.75, duration: 0.4 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(45deg)',
                      width: 7,
                      height: 7,
                      background: '#f0d080',
                    }}
                  />
                </div>
              </motion.div>

              {/* Steps */}
              <div>
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, x: -50, rotateY: -10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{
                      delay: 0.45 + i * 0.18,
                      duration: 0.75,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <motion.div
                      whileHover={{ x: 10, transition: { duration: 0.3 } }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '72px 1fr',
                        gap: 28,
                        padding: '32px 0',
                        borderBottom: i < STEPS.length - 1
                          ? '1px solid rgba(184,146,42,0.1)'
                          : 'none',
                        alignItems: 'start',
                        cursor: 'default',
                      }}
                    >
                      {/* Number */}
                      <div style={{
                        fontSize: '4rem',
                        fontWeight: 900,
                        color: 'rgba(184,146,42,0.12)',
                        lineHeight: 1,
                        letterSpacing: '-3px',
                        userSelect: 'none',
                        paddingTop: 2,
                      }}>
                        {step.n}
                      </div>

                      {/* Text */}
                      <div>
                        <h3 style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          letterSpacing: '5px',
                          textTransform: 'uppercase',
                          color: '#b8922a',
                          marginBottom: 12,
                        }}>
                          {step.title}
                        </h3>
                        <p style={{
                          fontSize: '0.975rem',
                          color: 'rgba(245,237,224,0.58)',
                          lineHeight: 1.85,
                          fontWeight: 300,
                          margin: 0,
                          letterSpacing: '0.2px',
                        }}>
                          {step.body}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setOpen(false)}
              whileHover={{ scale: 1.12, rotate: 90, borderColor: 'rgba(184,146,42,0.6)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: 'absolute',
                top: 32,
                right: 32,
                width: 46,
                height: 46,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                lineHeight: 1,
                transition: 'border-color 0.3s',
              }}
            >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
