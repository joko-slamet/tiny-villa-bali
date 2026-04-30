import Link from 'next/link'
import HeroSection from './components/HeroSection'
import ScrollReveal from './components/ScrollReveal'
import StaggerGrid from './components/StaggerGrid'
import ProjectCardMotion from './components/ProjectCardMotion'

const skills = [
  { icon: '⚡', name: 'React / Next.js' },
  { icon: '🎨', name: 'Framer Motion' },
  { icon: '🌐', name: 'Three.js / WebGL' },
  { icon: '💅', name: 'GSAP + ScrollTrigger' },
  { icon: '🔷', name: 'TypeScript' },
  { icon: '🎯', name: 'CSS Animations' },
  { icon: '🖼️', name: 'UI/UX Design' },
  { icon: '🚀', name: 'Web Performance' },
  { icon: '🤖', name: 'Claude AI' },
  { icon: '☁️', name: 'Vercel / Edge' },
]

const services = [
  {
    icon: '✦',
    title: 'Motion Design',
    desc: 'Micro-interactions, page transitions, and scroll-driven animations using Framer Motion and GSAP.',
    color: '#6366f1',
  },
  {
    icon: '◈',
    title: '3D & WebGL',
    desc: 'Immersive 3D experiences, particle systems, and custom GLSL shaders powered by Three.js.',
    color: '#a855f7',
  },
  {
    icon: '◇',
    title: 'Full-Stack Dev',
    desc: 'Next.js App Router, server components, edge functions, and scalable API design.',
    color: '#06b6d4',
  },
]

const featured = [
  {
    title: 'Aurora Dashboard',
    desc: 'Real-time analytics platform with animated D3 charts and WebSocket live updates.',
    tags: ['Next.js', 'D3.js', 'Framer Motion'],
    emoji: '📊',
    fromColor: '#6366f1',
    toColor: '#a855f7',
    large: true,
  },
  {
    title: 'Parallax Magazine',
    desc: 'Editorial site with scroll-driven 3D parallax layers built with GSAP ScrollTrigger.',
    tags: ['GSAP', 'Three.js', 'React'],
    emoji: '📰',
    fromColor: '#a855f7',
    toColor: '#ec4899',
    large: true,
  },
  {
    title: 'Motion Commerce',
    desc: 'E-commerce store with physics-based cart animations and product reveal sequences.',
    tags: ['Next.js', 'Framer Motion', 'Stripe'],
    emoji: '🛍️',
    fromColor: '#06b6d4',
    toColor: '#6366f1',
    large: false,
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero (Framer Motion + Three.js) ───────────── */}
      <HeroSection />

      {/* ── Services (GSAP stagger on scroll) ─────────── */}
      <section
        style={{
          padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,100px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <ScrollReveal style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-label">What I Do</div>
          <h2 className="section-title">
            From Concept to{' '}
            <span className="gradient-text">Pixel-Perfect</span>
          </h2>
          <p style={{ color: 'var(--muted-2)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Combining technical precision with creative vision to build interfaces
            that are as impressive under the hood as they look on screen.
          </p>
        </ScrollReveal>

        <StaggerGrid
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            maxWidth: 1000,
            margin: '0 auto',
          }}
        >
          {services.map(({ icon, title, desc, color }) => (
            <div key={title} className="card" style={{ padding: '36px 32px' }}>
              <div
                style={{
                  width: 52, height: 52,
                  borderRadius: 14,
                  background: `${color}22`,
                  border: `1px solid ${color}44`,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1.4rem',
                  marginBottom: 20,
                  color,
                }}
              >
                {icon}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 10 }}>{title}</h3>
              <p style={{ color: 'var(--muted-2)', fontSize: '0.9rem', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </StaggerGrid>
      </section>

      {/* ── Skills (GSAP stagger) ──────────────────────── */}
      <section
        style={{
          padding: 'clamp(40px,6vh,80px) clamp(24px,6vw,100px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <ScrollReveal
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <div className="section-label">Tech Stack</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Tools &amp; Technologies
            </h2>
          </div>
          <p style={{ color: 'var(--muted-2)', fontSize: '0.9rem', maxWidth: 320, lineHeight: 1.6 }}>
            I stay on the cutting edge — using Claude AI to prototype animations
            and ship faster without sacrificing quality.
          </p>
        </ScrollReveal>

        <StaggerGrid
          stagger={0.06}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
        >
          {skills.map(({ icon, name }) => (
            <div key={name} className="skill-pill">
              <span>{icon}</span>
              {name}
            </div>
          ))}
        </StaggerGrid>
      </section>

      {/* ── Featured Work (Framer Motion 3D tilt cards) ── */}
      <section
        style={{
          padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,100px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <ScrollReveal
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 48,
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div>
            <div className="section-label">Selected Work</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Projects</h2>
          </div>
          <Link href="/projects" className="btn-outline" transitionTypes={['nav-forward']}>
            View All →
          </Link>
        </ScrollReveal>

        {/* Featured large cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
            gap: 24,
            marginBottom: 24,
          }}
        >
          {featured.filter(p => p.large).map((p, i) => (
            <ProjectCardMotion key={p.title} {...p} delay={i * 0.1} />
          ))}
        </div>

        {/* Small cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {featured.filter(p => !p.large).map((p, i) => (
            <ProjectCardMotion key={p.title} {...p} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,100px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <ScrollReveal>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.12) 100%)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 24,
              padding: 'clamp(40px,6vw,72px)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
              width: 300, height: 300,
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div className="section-label">Ready to start?</div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-1px',
                marginBottom: 16,
              }}
            >
              {"Let's build something "}
              <span className="gradient-text">extraordinary</span>
            </h2>
            <p style={{ color: 'var(--muted-2)', maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Drop me a message and I&apos;ll get back within 24 hours. Let&apos;s talk about your vision.
            </p>
            <Link href="/contact" className="btn-primary" transitionTypes={['nav-forward']}>
              Start a Conversation ✉️
            </Link>
          </div>
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
        <span style={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
          dev<span style={{ color: 'var(--accent-1)' }}>.</span>folio
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
          © 2025 · Next.js · Framer Motion · GSAP · Three.js
        </span>
      </footer>
    </>
  )
}
