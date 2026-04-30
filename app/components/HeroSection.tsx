'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const ThreeBackground = dynamic(() => import('./ThreeBackground'), { ssr: false })

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const stats = [
  { n: '40+', label: 'Projects Delivered' },
  { n: '5yr', label: 'Experience' },
  { n: '98%', label: 'Client Satisfaction' },
]

export default function HeroSection() {
  return (
    <section
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(60px,10vh,120px) clamp(24px,6vw,100px)',
      }}
    >
      {/* Three.js particle canvas */}
      <ThreeBackground />

      {/* Soft orb overlays */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Dot grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Text content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Available for projects · 2025
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
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
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.22}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--muted-2)',
            lineHeight: 1.7,
            maxWidth: 560,
            marginBottom: 40,
          }}
        >
          Full-stack developer specialising in{' '}
          <strong style={{ color: 'var(--text)' }}>premium animations</strong>,
          interactive UI, and AI-assisted development. I turn complex design visions
          into buttery-smooth reality using{' '}
          <strong style={{ color: 'var(--accent-1)' }}>Framer Motion</strong>,{' '}
          <strong style={{ color: 'var(--accent-2)' }}>GSAP</strong>, and{' '}
          <strong style={{ color: 'var(--accent-3)' }}>Three.js</strong>.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.32}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
        >
          <Link href="/projects" className="btn-primary" transitionTypes={['nav-forward']}>
            View Projects ↗
          </Link>
          <Link href="/contact" className="btn-outline" transitionTypes={['nav-forward']}>
            {"Let's Talk"}
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.48}
          style={{ display: 'flex', gap: 48, marginTop: 60, flexWrap: 'wrap' }}
        >
          {stats.map(({ n, label }) => (
            <div key={label}>
              <div
                className="gradient-text"
                style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px' }}
              >
                {n}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted-2)', marginTop: 2 }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative orbit ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
        style={{
          position: 'absolute',
          right: 'clamp(40px, 10vw, 160px)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 320, height: 320,
          display: 'grid',
          placeItems: 'center',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          border: '1px dashed rgba(99,102,241,0.2)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', inset: 32,
          border: '1px dashed rgba(168,85,247,0.2)',
          borderRadius: '50%',
          animation: 'spin-slow 20s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 64,
          border: '1px solid rgba(6,182,212,0.15)',
          borderRadius: '50%',
          animation: 'spin-slow 14s linear infinite reverse',
        }} />
        <motion.div
          animate={{ scale: [0.85, 1, 0.85], boxShadow: ['0 0 0 0 rgba(99,102,241,0.5)', '0 0 0 18px rgba(99,102,241,0)', '0 0 0 0 rgba(99,102,241,0.5)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 80, height: 80,
            background: 'var(--grad)',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontSize: '1.8rem',
            color: '#fff',
          }}
        >
          ✦
        </motion.div>
      </motion.div>
    </section>
  )
}
