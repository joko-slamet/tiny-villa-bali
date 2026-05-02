'use client'

import { useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import Image from 'next/image'

const images = [
  { src: '/assets/images/1_bed.jpeg', alt: 'Bedroom 1', bg: '#cec4b1' },
  { src: '/assets/images/2_bed.jpeg', alt: 'Bedroom 2', bg: '#cebeaf' },
]

// Pivot at viewer: pure rotateY, transformOrigin pushed to the viewer's eye position.
// No x translation — perspective geometry handles the lateral arc naturally.
const sweepVariants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? 80 : -80 }),
  center: { rotateY: 0 },
  exit:   (dir: number) => ({ rotateY: dir > 0 ? -80 : 80 }),
}

export default function HeroSection() {
  const tiltRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent]     = useState(0)
  const [direction, setDirection] = useState(1)

  const mx  = useMotionValue(0)
  const my  = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 18 })
  const smy = useSpring(my, { stiffness: 60, damping: 18 })

  const tiltY = useTransform(smx, [-1, 1], [-6, 6])
  const tiltX = useTransform(smy, [-1, 1], [4, -4])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = tiltRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width * 2 - 1)
    my.set((e.clientY - rect.top)  / rect.height * 2 - 1)
  }

  function handleMouseLeave() { mx.set(0); my.set(0) }

  function navigate(dir: number) {
    const next = current + dir
    if (next < 0 || next >= images.length) return
    setDirection(dir)
    setCurrent(next)
  }

  const arrowBase: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.18)',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1c1510',
    zIndex: 10,
  }

  return (
    <motion.section
      animate={{ backgroundColor: images[current].bg }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="orb orb-1" style={{ opacity: 0.45 }} />
      <div className="orb orb-3" style={{ opacity: 0.3  }} />

      {/* Subtle mouse-tilt wrapper */}
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ width: '100%', maxWidth: 780, position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX: tiltX, rotateY: tiltY }}
        >
          {/*
            Perspective is set HERE — direct parent of the rotating elements.
            This makes the rotateY feel like the user is standing inside
            a wide-angle room and turning their head.
          */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1514 / 651',
              perspective: '900px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={sweepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 28,
                  overflow: 'hidden',
                  transformOrigin: 'center center 900px',
                }}
              >
                <Image
                  src={images[current].src}
                  alt={images[current].alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Left arrow */}
      <AnimatePresence>
        {current > 0 && (
          <motion.button
            key="left"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            onClick={() => navigate(-1)}
            style={{ ...arrowBase, left: 16 }}
            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.32)' }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Right arrow */}
      <AnimatePresence>
        {current < images.length - 1 && (
          <motion.button
            key="right"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25 }}
            onClick={() => navigate(1)}
            style={{ ...arrowBase, right: 16 }}
            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.32)' }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
