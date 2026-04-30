'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Stat { n: string; label: string }

export default function GSAPCounter({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const items = el.querySelectorAll('[data-counter]')
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div
      ref={ref}
      style={{ display: 'flex', gap: 48, marginTop: 60, flexWrap: 'wrap' }}
    >
      {stats.map(({ n, label }) => (
        <div key={label} data-counter style={{ opacity: 0 }}>
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
    </div>
  )
}
