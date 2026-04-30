import type { Metadata } from 'next'
import Link from 'next/link'
import ProjectCardMotion from '../components/ProjectCardMotion'
import ScrollReveal from '../components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Projects — dev.folio',
  description: 'A showcase of high-end web animation projects and interactive experiences.',
}

const projects = [
  {
    title: 'Aurora Dashboard',
    desc: 'Real-time analytics platform with animated D3 charts, WebSocket live updates, and a dark glassmorphism UI.',
    tags: ['Next.js', 'D3.js', 'Framer Motion', 'WebSockets'],
    emoji: '📊',
    fromColor: '#6366f1',
    toColor: '#a855f7',
    large: true,
  },
  {
    title: 'Parallax Magazine',
    desc: 'Editorial publication site with multi-layer scroll-driven 3D parallax and GSAP ScrollTrigger sequences.',
    tags: ['GSAP', 'ScrollTrigger', 'Three.js', 'React'],
    emoji: '📰',
    fromColor: '#a855f7',
    toColor: '#ec4899',
    large: true,
  },
  {
    title: 'Motion Commerce',
    desc: 'E-commerce store with physics-based cart animations, product reveal sequences, and magnetic button effects.',
    tags: ['Next.js', 'Framer Motion', 'Stripe'],
    emoji: '🛍️',
    fromColor: '#06b6d4',
    toColor: '#6366f1',
    large: false,
  },
  {
    title: 'Particle Universe',
    desc: 'Interactive 3D particle system with custom GLSL shaders. 100k+ particles, locked at 60fps.',
    tags: ['Three.js', 'GLSL', 'WebGL', 'R3F'],
    emoji: '🌌',
    fromColor: '#0f172a',
    toColor: '#1e40af',
    large: false,
  },
  {
    title: 'Brand Identity Kit',
    desc: 'Complete design system and interactive brand guidelines site with live component playground.',
    tags: ['Figma', 'Storybook', 'Design Tokens'],
    emoji: '🎨',
    fromColor: '#f59e0b',
    toColor: '#ef4444',
    large: false,
  },
  {
    title: 'AI Chat Interface',
    desc: 'Streaming chat UI built with Claude API, animated message bubbles, and real-time token streaming effects.',
    tags: ['Claude AI', 'Next.js', 'SSE', 'Framer Motion'],
    emoji: '🤖',
    fromColor: '#10b981',
    toColor: '#06b6d4',
    large: false,
  },
]

export default function ProjectsPage() {
  const featured = projects.filter(p => p.large)
  const rest = projects.filter(p => !p.large)

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,100px) clamp(40px,5vh,60px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="orb orb-1" style={{ opacity: 0.5 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <div className="section-label">Portfolio</div>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 900,
                letterSpacing: '-2px',
                lineHeight: 1.05,
                marginBottom: 20,
              }}
            >
              Selected{' '}
              <span className="gradient-text">Projects</span>
            </h1>
            <p
              style={{
                color: 'var(--muted-2)',
                fontSize: '1.1rem',
                maxWidth: 500,
                lineHeight: 1.7,
              }}
            >
              A curated collection of work spanning motion design,
              full-stack development, and immersive 3D experiences.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Featured (large, 2-col) ────────────────────────── */}
      <section style={{ padding: '0 clamp(24px,6vw,100px) 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
            gap: 24,
          }}
        >
          {featured.map((p, i) => (
            <ProjectCardMotion key={p.title} {...p} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── Rest (3-col) ───────────────────────────────────── */}
      <section
        style={{ padding: '24px clamp(24px,6vw,100px) clamp(80px,10vh,120px)' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {rest.map((p, i) => (
            <ProjectCardMotion key={p.title} {...p} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(40px,6vh,60px) clamp(24px,6vw,100px) clamp(60px,8vh,100px)',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <ScrollReveal>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16 }}>
            Have a project in mind?
          </h2>
          <p style={{ color: 'var(--muted-2)', maxWidth: 380, margin: '0 auto 32px', lineHeight: 1.7 }}>
            {"Let's create something that stands out. Reach out and let's get the conversation started."}
          </p>
          <Link href="/contact" className="btn-primary" transitionTypes={['nav-forward']}>
            Get in Touch ✉️
          </Link>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '28px clamp(24px,6vw,100px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <Link href="/" style={{ fontWeight: 700, letterSpacing: '-0.5px', textDecoration: 'none', color: 'var(--text)' }}>
          dev<span style={{ color: 'var(--accent-1)' }}>.</span>folio
        </Link>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
          © 2025 · Next.js · Framer Motion · GSAP · Three.js
        </span>
      </footer>
    </>
  )
}
