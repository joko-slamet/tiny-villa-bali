import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '../components/ContactForm'
import SocialLinks from '../components/SocialLinks'
import ScrollReveal from '../components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Contact — dev.folio',
  description: 'Get in touch to discuss your project.',
}

const faqs = [
  {
    q: 'What is your typical project timeline?',
    a: 'Small sites (3-5 pages): 2-3 weeks. Complex apps: 6-12 weeks. I will give a precise estimate after our first call.',
  },
  {
    q: 'Do you work with AI tools?',
    a: 'Absolutely — Claude AI is central to my workflow for code generation, component design, and animation prototyping. It ships results faster without sacrificing quality.',
  },
  {
    q: 'What animation libraries do you use?',
    a: 'Framer Motion for React-native animations, GSAP + ScrollTrigger for complex timelines, Three.js for 3D, and native CSS for performance-critical micro-interactions.',
  },
  {
    q: 'Can you handle both design and development?',
    a: 'Yes — I work from Figma mockups or can design from scratch in-browser. I will suggest UX improvements as part of every project.',
  },
]

export default function ContactPage() {
  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,100px) clamp(40px,5vh,60px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="orb orb-2" style={{ opacity: 0.6 }} />
        <div className="orb orb-3" style={{ opacity: 0.4 }} />

        <ScrollReveal style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
          <div className="section-label">Contact</div>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            {"Let's Work "}
            <span className="gradient-text-cyan">Together</span>
          </h1>
          <p style={{ color: 'var(--muted-2)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            Have a project that needs high-end animations and a developer who
            uses AI to deliver at speed? Let&apos;s talk.
          </p>
        </ScrollReveal>
      </section>

      {/* ── Main Content ─────────────────────────────────── */}
      <section
        style={{
          padding: '0 clamp(24px,6vw,100px) clamp(80px,10vh,120px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48,
          alignItems: 'start',
        }}
      >
        <ScrollReveal>
          <ContactForm />
        </ScrollReveal>

        <div>
          <ScrollReveal delay={0.1}>
            <div
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 32,
              }}
            >
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: '#10b981',
                animation: 'pulse-ring 2s ease-in-out infinite',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Available for new projects</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted-2)' }}>
                  Typical response within 12 hours
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
              {[
                { n: '40+', label: 'Projects Done' },
                { n: '< 24h', label: 'Response Time' },
                { n: '5 ★', label: 'Client Rating' },
                { n: '2 wk', label: 'Fastest Delivery' },
              ].map(({ n, label }) => (
                <div key={label} className="stat-card">
                  <div className="stat-number gradient-text">{n}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <SocialLinks />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(60px,6vh,80px) clamp(24px,6vw,100px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <ScrollReveal style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">FAQ</div>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)' }}>
            Common Questions
          </h2>
        </ScrollReveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20,
            maxWidth: 1000,
            margin: '0 auto',
          }}
        >
          {faqs.map(({ q, a }, i) => (
            <ScrollReveal key={q} delay={i * 0.08}>
              <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>
                  {q}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-2)', lineHeight: 1.65 }}>{a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
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
