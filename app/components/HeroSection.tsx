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

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '120vw' : '-120vw' }),
  center: { x: 0 },
  exit:  (dir: number) => ({ x: dir > 0 ? '-120vw' : '120vw' }),
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent]     = useState(0)
  const [direction, setDirection] = useState(1)

  const mx  = useMotionValue(0)
  const my  = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 100, damping: 16 })
  const smy = useSpring(my, { stiffness: 100, damping: 16 })

  const rotateY = useTransform(smx, [-1, 1], [-14, 14])
  const rotateX = useTransform(smy, [-1, 1], [10, -10])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
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

      {/* Card */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1200,
          width: '100%',
          maxWidth: 780,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ borderRadius: 28, overflow: 'hidden' }}
            >
              <Image
                src={images[current].src}
                alt={images[current].alt}
                width={2500}
                height={2500}
                style={{ display: 'block', width: '100%', height: 'auto' }}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Left arrow — screen edge */}
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

      {/* Right arrow — screen edge */}
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
