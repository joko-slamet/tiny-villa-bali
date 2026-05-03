'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const images = [
  { src: '/assets/images/1_bed_new.png', alt: 'Bedroom 1', bg: '#cec4b1' },
  { src: '/assets/images/2_bed_new.png', alt: 'Bedroom 2', bg: '#cebeaf' },
]

const sweepVariants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? 80 : -80 }),
  center: { rotateY: 0 },
  exit:   (dir: number) => ({ rotateY: dir > 0 ? -80 : 80 }),
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

  // Zoom / pan — stored in refs to avoid stale closures in wheel handler
  const zoomRef = useRef(1)
  const panRef  = useRef({ x: 0, y: 0 })
  const [transform, setTransform] = useState({ zoom: 1, x: 0, y: 0 })

  // Drag-to-pan
  const isDragging  = useRef(false)
  const dragStart   = useRef({ mx: 0, my: 0, px: 0, py: 0 })
  const [dragging, setDragging] = useState(false)

  // Tilt
  const mx  = useMotionValue(0)
  const my  = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 18 })
  const smy = useSpring(my, { stiffness: 60, damping: 18 })
  const tiltY = useTransform(smx, [-1, 1], [-6, 6])
  const tiltX = useTransform(smy, [-1, 1], [4, -4])

  function handleTiltMove(e: React.MouseEvent<HTMLDivElement>) {
    if (zoomRef.current > 1) return  // disable tilt when zoomed
    const rect = tiltRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width * 2 - 1)
    my.set((e.clientY - rect.top)  / rect.height * 2 - 1)
  }

  function handleTiltLeave() { mx.set(0); my.set(0) }

  // Non-passive wheel event for zoom at cursor
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

      // Keep cursor point fixed during zoom
      let newX = cx - newZoom * (cx - panRef.current.x) / oldZoom
      let newY = cy - newZoom * (cy - panRef.current.y) / oldZoom

      // Clamp pan so image never exposes background
      newX = clamp(newX, -(newZoom - 1) * W, 0)
      newY = clamp(newY, -(newZoom - 1) * H, 0)

      zoomRef.current   = newZoom
      panRef.current    = { x: newX, y: newY }
      setTransform({ zoom: newZoom, x: newX, y: newY })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Drag-to-pan handlers
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

  // Double-click to reset
  const handleDoubleClick = useCallback(() => {
    zoomRef.current = 1
    panRef.current  = { x: 0, y: 0 }
    setTransform({ zoom: 1, x: 0, y: 0 })
  }, [])

  function navigate(dir: number) {
    const next = current + dir
    if (next < 0 || next >= images.length) return
    // Reset zoom on navigate
    zoomRef.current = 1
    panRef.current  = { x: 0, y: 0 }
    setTransform({ zoom: 1, x: 0, y: 0 })
    setDirection(dir)
    setCurrent(next)
  }

  const isZoomed = transform.zoom > 1

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
        // overflow: 'hidden',
      }}
    >
      <div className="orb orb-1" style={{ opacity: 0.45 }} />
      <div className="orb orb-3" style={{ opacity: 0.3  }} />

      <div
        ref={tiltRef}
        onMouseMove={handleTiltMove}
        onMouseLeave={handleTiltLeave}
        style={{ width: '100%', maxWidth: 780, position: 'relative', zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX: tiltX, rotateY: tiltY }}
        >
          {/* Image carousel + zoom container */}
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
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 28,
                  // overflow: 'hidden',
                  transformOrigin: 'center center 900px',
                }}
              >
                {/* Zoom/pan layer */}
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
                  <Image
                    src={images[current].src}
                    alt={images[current].alt}
                    fill
                    style={{ objectFit: 'cover', pointerEvents: 'none' }}
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Zoom level badge */}
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

        {/* Button below image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}
        >
          <Link href="/map" className="btn-primary" transitionTypes={['nav-forward']}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" y1="3" x2="9" y2="18"/>
              <line x1="15" y1="6" x2="15" y2="21"/>
            </svg>
            View Location
          </Link>
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
