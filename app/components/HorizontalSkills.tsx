'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const amenities = [
  {
    icon: '🏊',
    name: 'Infinity Pool',
    desc: 'A 20-metre heated infinity pool overlooking the jungle canopy and distant ocean horizon.',
    color: '#7ab5a0',
  },
  {
    icon: '🛏️',
    name: '5 Master Suites',
    desc: 'Individually designed suites with king beds, ensuite baths, and private terrace access.',
    color: '#d4a853',
  },
  {
    icon: '🌿',
    name: 'Tropical Gardens',
    desc: 'Manicured 800 m² estate with native palms, fragrant frangipani, and koi ponds.',
    color: '#7ab5a0',
  },
  {
    icon: '🍽️',
    name: 'Private Chef',
    desc: 'An in-house chef curates personalised menus from organic local produce, morning to evening.',
    color: '#c97b4b',
  },
  {
    icon: '💆',
    name: 'Spa & Wellness',
    desc: 'Open-air treatment pavilion with Balinese massage, yoga deck, and steam room.',
    color: '#d4a853',
  },
  {
    icon: '🚗',
    name: 'Chauffeur Service',
    desc: 'Airport transfers, day trips, and island explorations in a luxury SUV with dedicated driver.',
    color: '#c97b4b',
  },
  {
    icon: '🌅',
    name: 'Sunrise Terrace',
    desc: 'An elevated east-facing terrace purpose-built for spectacular Bali sunrise views.',
    color: '#d4a853',
  },
  {
    icon: '🎬',
    name: 'Entertainment',
    desc: 'Cinema room, outdoor projector, high-fidelity sound system, and curated vinyl collection.',
    color: '#7ab5a0',
  },
]

export default function HorizontalSkills() {
  const outerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const track = trackRef.current
    const progress = progressRef.current
    if (!outer || !track || !progress) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const getEnd = () => `+=${track.scrollWidth - outer.offsetWidth + 100}`

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          pin: true,
          scrub: 1.2,
          start: 'top top',
          end: getEnd,
          anticipatePin: 1,
          onUpdate: (self) => {
            progress.style.transform = `scaleX(${self.progress})`
          },
        },
      })

      tl.to(track, { x: () => -(track.scrollWidth - outer.offsetWidth), ease: 'none' })

      const cardsSt = ScrollTrigger.create({
        trigger: outer,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(
            track.querySelectorAll('.hskill-card'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' }
          )
        },
        once: true,
      })

      return () => {
        tl.kill()
        cardsSt.kill()
      }
    })

    mm.add('(max-width: 767px)', () => {
      const st = ScrollTrigger.create({
        trigger: track,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            track.querySelectorAll('.hskill-card'),
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' }
          )
        },
        once: true,
      })
      return () => st.kill()
    })

    return () => { mm.revert() }
  }, [])

  return (
    <div
      ref={outerRef}
      style={{
        position: 'relative',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--border)', zIndex: 10 }}>
        <div
          ref={progressRef}
          style={{ height: '100%', background: 'var(--grad)', transformOrigin: 'left', transform: 'scaleX(0)' }}
        />
      </div>

      {/* Header */}
      <div
        style={{
          padding: 'clamp(40px,5vh,60px) clamp(24px,6vw,100px) 32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          flexWrap: 'wrap', gap: 16,
        }}
      >
        <div>
          <div className="section-label">Included In Every Stay</div>
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            Villa Amenities
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted-2)', fontSize: '0.85rem' }}>
          <span>scroll to explore</span>
          <span style={{ display: 'inline-block', animation: 'pulse-ring 2s ease-in-out infinite', fontSize: '1.1rem' }}>→</span>
        </div>
      </div>

      {/* Scrolling track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex', gap: 20,
          padding: '0 clamp(24px,6vw,100px) clamp(40px,5vh,60px)',
          willChange: 'transform', flexWrap: 'wrap',
        }}
      >
        {amenities.map(({ icon, name, desc, color }) => (
          <div
            key={name}
            className="hskill-card"
            style={{
              minWidth: 260,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderTop: `3px solid ${color}`,
              borderRadius: 'var(--radius)',
              padding: '32px 28px',
              flexShrink: 0,
              opacity: 0,
              transition: 'box-shadow 0.3s, background 0.25s, transform 0.3s',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px ${color}55`
              e.currentTarget.style.background = 'var(--surface-h)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = ''
              e.currentTarget.style.background = 'var(--surface)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${color}22`, border: `1px solid ${color}44`,
                display: 'grid', placeItems: 'center',
                fontSize: '1.5rem', marginBottom: 20,
              }}
            >
              {icon}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 10, color: 'var(--text)' }}>{name}</h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--muted-2)', lineHeight: 1.65 }}>{desc}</p>
            <div style={{ width: 32, height: 2, background: color, borderRadius: 99, marginTop: 20, opacity: 0.6 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
