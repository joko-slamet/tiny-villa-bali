'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  Variants,
} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const images = [
  {
    src: '/assets/images/1_bed_new.png',
    alt: 'Bedroom 1',
    bg: '#cec4b1',
    name: 'Canggu Residence',
    status: 'Completed',
    units: '12 (1 bedroom)',
    location: 'Canggu, Bali',
    available: false,
    slug: "canggu-residence",
  },
  {
    src: '/assets/images/2_bed_new.png',
    alt: 'Bedroom 2',
    bg: '#cebeaf',
    name: 'Bingin Residence',
    status: 'Completed',
    units: '16 (1 bedroom)',
    location: 'Bingin, Bali',
    available: false,
    slug: "bingin-residence",
  },
]

const sweepVariants: Variants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? -75 : 75, rotateX: dir > 0 ? -22 : 22, y: dir > 0 ? -60 : 60, opacity: 0 }),
  center: { 
    rotateY: 0, rotateX: 0, y: 0, opacity: 1,
    transition: {
      duration: 2.2,
      ease: [0.4, 0, 0.2, 1],
      opacity: { delay: 1.0, duration: 1.2, ease: "easeInOut" }
    }
  },
  exit: (dir: number) => ({ 
    rotateY: dir > 0 ? 75 : -75, rotateX: dir > 0 ? 22 : -22, y: dir > 0 ? 60 : -60, opacity: 0,
    transition: {
      duration: 2.2,
      ease: [0.4, 0, 0.2, 1],
      opacity: { duration: 1.0, ease: "easeInOut" }
    }
  }),
}


const MIN_ZOOM = 1
const MAX_ZOOM = 5

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export default function HeroSection() {
  const tiltRef           = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const [current, setCurrent]     = useState(0)
  const [direction, setDirection] = useState(1)

  const zoomRef = useRef(1)
  const panRef  = useRef({ x: 0, y: 0 })
  const [transform, setTransform] = useState({ zoom: 1, x: 0, y: 0 })

  const isDragging  = useRef(false)
  const dragStart   = useRef({ mx: 0, my: 0, px: 0, py: 0 })
  const [dragging, setDragging] = useState(false)

  const clickSound = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    clickSound.current = new Audio('/assets/audio/click.wav')
    clickSound.current.volume = 0.5
    clickSound.current.load()
  }, [])

  const mx  = useMotionValue(0)
  const my  = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 18 })
  const smy = useSpring(my, { stiffness: 60, damping: 18 })
  const tiltY = useTransform(smx, [-1, 1], [-6, 6])
  const tiltX = useTransform(smy, [-1, 1], [4, -4])

  const [isHovered, setIsHovered] = useState(false)
  
  const imgParallaxX = useTransform(smx, [-1, 1], [15, -15])
  const imgParallaxY = useTransform(smy, [-1, 1], [15, -15])

  function handleTiltMove(e: React.MouseEvent<HTMLDivElement>) {
    if (zoomRef.current > 1) return
    setIsHovered(true)
    const rect = tiltRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width * 2 - 1)
    my.set((e.clientY - rect.top)  / rect.height * 2 - 1)
  }

  function handleTiltLeave() { 
    mx.set(0)
    my.set(0)
    setIsHovered(false)
  }

  useEffect(() => {
    const el = imageContainerRef.current
    if (!el) return

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const rect = el!.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top

      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
      const oldZoom = zoomRef.current
      const newZoom = clamp(oldZoom * factor, MIN_ZOOM, MAX_ZOOM)

      const W = rect.width
      const H = rect.height

      let newX = cx - newZoom * (cx - panRef.current.x) / oldZoom
      let newY = cy - newZoom * (cy - panRef.current.y) / oldZoom

      newX = clamp(newX, -(newZoom - 1) * W, 0)
      newY = clamp(newY, -(newZoom - 1) * H, 0)

      zoomRef.current   = newZoom
      panRef.current    = { x: newX, y: newY }
      setTransform({ zoom: newZoom, x: newX, y: newY })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (zoomRef.current <= 1) return
    isDragging.current = true
    setDragging(true)
    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      px: panRef.current.x,
      py: panRef.current.y,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    const rect = imageContainerRef.current?.getBoundingClientRect()
    if (!rect) return

    const W = rect.width
    const H = rect.height
    const z = zoomRef.current

    const newX = clamp(dragStart.current.px + (e.clientX - dragStart.current.mx), -(z - 1) * W, 0)
    const newY = clamp(dragStart.current.py + (e.clientY - dragStart.current.my), -(z - 1) * H, 0)

    panRef.current = { x: newX, y: newY }
    setTransform({ zoom: z, x: newX, y: newY })
  }, [])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
    setDragging(false)
  }, [])

  const handleDoubleClick = useCallback(() => {
    zoomRef.current = 1
    panRef.current  = { x: 0, y: 0 }
    setTransform({ zoom: 1, x: 0, y: 0 })
  }, [])

  function navigate(dir: number) {
    const next = current + dir
    if (next < 0 || next >= images.length) return

    // Play click sound
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play().catch(() => {})
    }

    zoomRef.current = 1
    panRef.current  = { x: 0, y: 0 }
    setTransform({ zoom: 1, x: 0, y: 0 })
    setDirection(dir)
    setCurrent(next)
  }

  function goTo(i: number) {
    if (i === current) return
    zoomRef.current = 1
    panRef.current  = { x: 0, y: 0 }
    setTransform({ zoom: 1, x: 0, y: 0 })
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
  }

  const isZoomed = transform.zoom > 1

  const navBtnBase: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(28,21,16,0.85)',
    zIndex: 10,
    padding: '20px 10px',
  }

  const verticalLabelStyle: React.CSSProperties = {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    fontSize: '0.8rem',
    fontWeight: 800,
    letterSpacing: '4px',
    textTransform: 'uppercase',
    opacity: 0.8,
    whiteSpace: 'nowrap',
  }

  return (
    <motion.section
      animate={{ backgroundColor: images[current].bg }}
      transition={{ duration: 1.8, ease: 'easeInOut' }}
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div className="orb orb-1" style={{ opacity: 0.45 }} />
      <div className="orb orb-3" style={{ opacity: 0.3  }} />

      <div
        ref={tiltRef}
        onMouseMove={handleTiltMove}
        onMouseLeave={handleTiltLeave}
        style={{ width: '100%', maxWidth: 1200, position: 'relative', zIndex: 1, padding: '0 16px' }}
      >
        {/* Image carousel */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX: tiltX, rotateY: tiltY }}
        >
          <div
            ref={imageContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1514 / 651',
              perspective: '900px',
              perspectiveOrigin: '50% 50%',
              cursor: isZoomed ? (dragging ? 'grabbing' : 'grab') : 'default',
              userSelect: 'none',
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
                transition={{ duration: 2.2 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 28,
                  transformOrigin: 'center center 2000px',
                  overflow: 'visible',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transformOrigin: '0 0',
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
                    transition: isDragging.current
                      ? 'none'
                      : 'transform 0.12s cubic-bezier(0.22,1,0.36,1)',
                    willChange: 'transform',
                  }}
                >
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: -40,
                      x: imgParallaxX,
                      y: imgParallaxY,
                    }}
                  >
                    <Image
                      src={images[current].src}
                      alt={images[current].alt}
                      fill
                      style={{ objectFit: 'cover', pointerEvents: 'none' }}
                      priority
                    />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Zoom badge */}
            <AnimatePresence>
              {isZoomed && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    right: 14,
                    background: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    padding: '4px 10px',
                    borderRadius: 99,
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                >
                  {Math.round(transform.zoom * 100)}% · double-click to reset
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Decorative info strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ marginTop: 20 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'start', gap: 24 }}>

            {/* Left — metadata */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`meta-${current}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'rgba(28,21,16,0.4)', letterSpacing: '0.3px' }}>
                  {images[current].location}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.68rem', color: 'rgba(28,21,16,0.35)', fontWeight: 500 }}>
                  <span>{images[current].status}</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span>{images[current].units}</span>
                  <span style={{ opacity: 0.4 }}>·</span>
                  <span style={{ color: images[current].available ? '#059669' : 'rgba(28,21,16,0.35)' }}>
                    {images[current].available ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Center — title + button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`title-${current}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                  style={{
                    fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    margin: 0,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {images[current].name}
                </motion.h2>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <Link
                  href={`/map?location=${images[current].slug}`}
                  className="btn-primary"
                  transitionTypes={['nav-forward']}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                    <line x1="9" y1="3" x2="9" y2="18"/>
                    <line x1="15" y1="6" x2="15" y2="21"/>
                  </svg>
                  View Location
                </Link>
              </motion.div>
            </div>

            {/* Right — slide dots */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', paddingTop: 4 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {images.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => goTo(i)}
                    animate={{
                      width: i === current ? 24 : 6,
                      background: i === current ? 'rgba(28,21,16,0.5)' : 'rgba(28,21,16,0.18)',
                    }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: 4, borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Left arrow */}
      <AnimatePresence>
        {current > 0 && (
          <motion.button
            key={`nav-left-${current}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(-1)}
            style={{ ...navBtnBase, left: 24 }}
            className="group"
          >
            <motion.span 
              style={verticalLabelStyle}
              whileHover={{ opacity: 1, color: '#000' }}
            >
              {images[current - 1].name}
            </motion.span>
            <div style={{ width: 2, height: 60, background: 'rgba(28,21,16,0.35)' }} />
            <motion.div
              whileHover={{ scale: 1.15, y: -8, background: 'rgba(28,21,16,0.08)' }}
              style={{
                width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(28,21,16,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Right arrow */}
      <AnimatePresence>
        {current < images.length - 1 && (
          <motion.button
            key={`nav-right-${current}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(1)}
            style={{ ...navBtnBase, right: 24 }}
            className="group"
          >
            <motion.div
              whileHover={{ scale: 1.15, y: 8, background: 'rgba(28,21,16,0.08)' }}
              style={{
                width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(28,21,16,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </motion.div>
            <div style={{ width: 2, height: 60, background: 'rgba(28,21,16,0.35)' }} />
            <motion.span 
              style={{ ...verticalLabelStyle, transform: 'none', writingMode: 'vertical-rl' }}
              whileHover={{ opacity: 1, color: '#000' }}
            >
              {images[current + 1].name}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
