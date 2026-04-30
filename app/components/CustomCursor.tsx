'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)

  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)

  // Dot follows cursor exactly
  const dotX = useTransform(rawX, v => v - 5)
  const dotY = useTransform(rawY, v => v - 5)

  // Ring follows with spring lag
  const springX = useSpring(rawX, { stiffness: 110, damping: 16, mass: 0.5 })
  const springY = useSpring(rawY, { stiffness: 110, damping: 16, mass: 0.5 })
  const ringX = useTransform(springX, v => v - 20)
  const ringY = useTransform(springY, v => v - 20)

  // Magnetic targets
  const magnetRef = useRef<Map<Element, { lx: () => void; ll: () => void }>>(new Map())

  useEffect(() => {
    // Hide on touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    setVisible(true)
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    // Attach hover state to interactive elements
    const attach = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
        if (magnetRef.current.has(el)) return
        const lx = () => setHovering(true)
        const ll = () => setHovering(false)
        el.addEventListener('mouseenter', lx)
        el.addEventListener('mouseleave', ll)
        magnetRef.current.set(el, { lx, ll })
      })
    }
    attach()

    // Re-attach when DOM changes
    const mo = new MutationObserver(attach)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      document.documentElement.style.cursor = ''
      mo.disconnect()
      magnetRef.current.forEach(({ lx, ll }, el) => {
        el.removeEventListener('mouseenter', lx)
        el.removeEventListener('mouseleave', ll)
      })
    }
  }, [rawX, rawY])

  if (!visible) return null

  return (
    <>
      {/* Dot — follows exactly */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 10, height: 10,
          x: dotX, y: dotY,
          borderRadius: '50%',
          background: 'var(--accent-1)',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
        }}
        animate={{
          scale: clicking ? 0.4 : hovering ? 0 : 1,
          opacity: hovering ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring — spring lag */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 40, height: 40,
          x: ringX, y: ringY,
          borderRadius: '50%',
          border: '1.5px solid rgba(99,102,241,0.7)',
          pointerEvents: 'none',
          zIndex: 99998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{
          scale: clicking ? 0.75 : hovering ? 1.8 : 1,
          borderColor: hovering
            ? 'rgba(99,102,241,1)'
            : 'rgba(99,102,241,0.7)',
          background: hovering
            ? 'rgba(99,102,241,0.08)'
            : 'transparent',
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  )
}
