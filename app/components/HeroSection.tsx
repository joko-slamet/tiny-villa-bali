'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Load Three.js scene client-side only (no SSR)
const ThreeHeroScene = dynamic(() => import('./ThreeHeroScene'), { ssr: false })

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
})

export default function HeroSection() {
  return (
    <section
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#08080f',
      }}
    >
      {/* ── Three.js: full-screen bloom scene ───────────── */}
      <ThreeHeroScene />

      {/* ── Left gradient fade (so text stays readable) ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(8,8,15,0.92) 0%, rgba(8,8,15,0.7) 45%, rgba(8,8,15,0.1) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Text content ─────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '52%',
          padding: 'clamp(60px,10vh,120px) 0 clamp(60px,10vh,120px) clamp(24px,6vw,100px)',
        }}
      >
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.85, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          Available for projects · 2025
        </motion.div>

        <motion.h1
          {...fadeUp(0.12)}
          style={{
            fontSize: 'clamp(2.6rem, 5vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: '-2px',
            marginBottom: 24,
          }}
        >
          Crafting{' '}
          <span className="shimmer-text">High-End</span>
          <br />
          Web Experiences
        </motion.h1>

        <motion.p
          {...fadeUp(0.24)}
          style={{
            fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
            color: 'var(--muted-2)',
            lineHeight: 1.75,
            maxWidth: 520,
            marginBottom: 40,
          }}
        >
          Full-stack developer specialising in{' '}
          <strong style={{ color: 'var(--text)' }}>premium animations</strong>{' '}
          and interactive UI. I ship impressive results using{' '}
          <strong style={{ color: '#818cf8' }}>Framer Motion</strong>,{' '}
          <strong style={{ color: '#c084fc' }}>GSAP</strong>, and{' '}
          <strong style={{ color: '#22d3ee' }}>Three.js</strong> — accelerated by
          Claude AI.
        </motion.p>

        <motion.div
          {...fadeUp(0.35)}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <Link href="/projects" className="btn-primary" transitionTypes={['nav-forward']}>
            View Projects ↗
          </Link>
          <Link href="/contact" className="btn-outline" transitionTypes={['nav-forward']}>
            {"Let's Talk"}
          </Link>
        </motion.div>

        {/* Stat row */}
        <motion.div
          {...fadeUp(0.5)}
          style={{ display: 'flex', gap: 40, marginTop: 56, flexWrap: 'wrap' }}
        >
          {[
            { n: '40+', label: 'Projects Delivered' },
            { n: '5yr', label: 'Experience' },
            { n: '98%', label: 'Client Satisfaction' },
          ].map(({ n, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.1 }}
            >
              <div
                className="gradient-text"
                style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px' }}
              >
                {n}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted-2)', marginTop: 3 }}>
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 2,
          color: 'var(--muted)',
          fontSize: '0.72rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 1.5, height: 32,
            background: 'linear-gradient(to bottom, rgba(99,102,241,0.8), transparent)',
          }}
        />
      </motion.div>
    </section>
  )
}
