'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  title: string
  desc: string
  tags: string[]
  emoji: string
  fromColor: string
  toColor: string
  large?: boolean
  delay?: number
}

export default function ProjectCardMotion({ title, desc, tags, emoji, fromColor, toColor, large, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8])

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onMouseLeave() { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
      }}
      whileHover={{
        borderColor: 'rgba(99,102,241,0.5)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.3)',
        transition: { duration: 0.2 },
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: large ? 240 : 200, overflow: 'hidden', position: 'relative' }}>
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: large ? '4rem' : '3.2rem',
          }}
        >
          {emoji}
        </motion.div>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 60%, rgba(8,8,15,0.9))',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Info */}
      <div style={{ padding: large ? '28px' : '22px' }}>
        <h3 style={{ fontWeight: 800, fontSize: large ? '1.2rem' : '1.05rem', marginBottom: 8 }}>
          {title}
        </h3>
        <p style={{ color: 'var(--muted-2)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: 16 }}>
          {desc}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
        {large && (
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              Live Demo ↗
            </a>
            <a href="#" className="btn-outline" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
              GitHub
            </a>
          </div>
        )}
        {!large && (
          <motion.a
            href="#"
            style={{ fontSize: '0.82rem', color: 'var(--accent-1)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            whileHover={{ gap: '8px' }}
          >
            View Project →
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}
