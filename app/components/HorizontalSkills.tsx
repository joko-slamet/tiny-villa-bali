'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skills = [
  {
    icon: '🎨',
    name: 'Framer Motion',
    desc: 'React-native animations, page transitions, and gesture-driven interactions.',
    color: '#6366f1',
  },
  {
    icon: '💅',
    name: 'GSAP + ScrollTrigger',
    desc: 'Professional timeline animations, scroll-driven sequences, and pin effects.',
    color: '#a855f7',
  },
  {
    icon: '🌐',
    name: 'Three.js / WebGL',
    desc: '3D scenes, custom GLSL shaders, particle systems, and post-processing effects.',
    color: '#06b6d4',
  },
  {
    icon: '⚡',
    name: 'Next.js 16',
    desc: 'App Router, React Server Components, View Transitions, edge functions.',
    color: '#818cf8',
  },
  {
    icon: '🔷',
    name: 'TypeScript',
    desc: 'Type-safe architecture, clean APIs, maintainable at scale.',
    color: '#3b82f6',
  },
  {
    icon: '🎯',
    name: 'CSS Advanced',
    desc: 'Custom keyframes, scroll-driven animations, modern cascade layers.',
    color: '#ec4899',
  },
  {
    icon: '🤖',
    name: 'Claude AI',
    desc: 'AI-accelerated workflow: rapid prototyping, complex animation code generation.',
    color: '#a855f7',
  },
  {
    icon: '🚀',
    name: 'Web Performance',
    desc: 'Core Web Vitals, bundle optimisation, 60fps targets across all devices.',
    color: '#10b981',
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
      const getEnd = () =>
        `+=${track.scrollWidth - outer.offsetWidth + 100}`

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

      tl.to(track, {
        x: () => -(track.scrollWidth - outer.offsetWidth),
        ease: 'none',
      })

      // Cards fade/scale in from right as they enter
      gsap.fromTo(
        track.querySelectorAll('.hskill-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: outer,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )

      return () => {
        tl.kill()
      }
    })

    // Mobile: just show as vertical grid, animate in
    mm.add('(max-width: 767px)', () => {
      gsap.fromTo(
        track.querySelectorAll('.hskill-card'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: track,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    })

    return () => {
      mm.revert()
    }
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
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: 'var(--border)',
          zIndex: 10,
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            background: 'var(--grad)',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      {/* Header row */}
      <div
        style={{
          padding: 'clamp(40px,5vh,60px) clamp(24px,6vw,100px) 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div className="section-label">Tech Stack</div>
          <h2
            style={{
              fontSize: 'clamp(1.6rem,3vw,2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
            }}
          >
            Tools &amp; Technologies
          </h2>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--muted-2)',
            fontSize: '0.85rem',
          }}
        >
          <span>scroll to explore</span>
          <span
            style={{
              display: 'inline-block',
              animation: 'pulse-ring 2s ease-in-out infinite',
              fontSize: '1.1rem',
            }}
          >
            →
          </span>
        </div>
      </div>

      {/* Scrolling track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 20,
          padding: '0 clamp(24px,6vw,100px) clamp(40px,5vh,60px)',
          willChange: 'transform',
          flexWrap: 'wrap', // becomes grid on mobile
        }}
      >
        {skills.map(({ icon, name, desc, color }) => (
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
                width: 52, height: 52,
                borderRadius: 14,
                background: `${color}22`,
                border: `1px solid ${color}44`,
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.5rem',
                marginBottom: 20,
              }}
            >
              {icon}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 10, color: 'var(--text)' }}>
              {name}
            </h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--muted-2)', lineHeight: 1.65 }}>{desc}</p>
            <div
              style={{
                width: 32, height: 2,
                background: color,
                borderRadius: 99,
                marginTop: 20,
                opacity: 0.6,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

