import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '../components/ContactForm'
import ScrollReveal from '../components/ScrollReveal'
import StaggerGrid, { StaggerItem } from '../components/StaggerGrid'

export const metadata: Metadata = {
  title: 'Book a Stay — Villa Serenara',
  description: 'Enquire about availability and reserve your exclusive stay at Villa Serenara, Bali.',
}

const faqs = [
  {
    q: 'What is the minimum stay?',
    a: 'We require a minimum of 3 nights. For peak season (July–August, December–January) we recommend booking at least 7 nights to fully experience everything the villa offers.',
  },
  {
    q: 'What is included in the rate?',
    a: 'Daily breakfast and afternoon tea prepared by your private chef, housekeeping, 24-hour concierge, high-speed WiFi, and use of all villa facilities including the pool, spa pavilion, and gym.',
  },
  {
    q: 'How many guests can the villa accommodate?',
    a: 'Villa Serenara sleeps up to 10 adults across 5 master suites. We can arrange additional accommodation for larger groups through our partner properties.',
  },
  {
    q: 'Do you offer airport transfers?',
    a: 'Yes — complimentary round-trip transfers from Ngurah Rai International Airport (DPS) are included for all bookings of 5 nights or more. Our chauffeur will meet you in the arrivals hall.',
  },
]

const contactDetails = [
  { icon: '📧', label: 'Email', value: 'concierge@villaserenara.com' },
  { icon: '📞', label: 'Phone', value: '+62 812 0000 0000' },
  { icon: '📍', label: 'Location', value: 'Ubud, Bali, Indonesia' },
  { icon: '🕐', label: 'Response Time', value: 'Within 24 hours' },
]

export default function BookingPage() {
  return (
    <>
      {/* ── Header ────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,100px) clamp(40px,5vh,60px)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div className="orb orb-2" style={{ opacity: 0.5 }} />
        <div className="orb orb-3" style={{ opacity: 0.35 }} />

        <ScrollReveal style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
          <div className="section-label">Book a Stay</div>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900, letterSpacing: '-2px',
              lineHeight: 1.05, marginBottom: 20,
            }}
          >
            Reserve Your{' '}
            <span className="gradient-text-teal">Escape</span>
          </h1>
          <p style={{ color: 'var(--muted-2)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            Villa Serenara accepts a single exclusive booking at a time.
            Complete the form and our concierge team will confirm your dates within 24 hours.
          </p>
        </ScrollReveal>
      </section>

      {/* ── Main: form + contact info ─────────────────── */}
      <section
        style={{
          padding: '0 clamp(24px,6vw,100px) clamp(80px,10vh,120px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48, alignItems: 'start',
        }}
      >
        <ScrollReveal>
          <ContactForm />
        </ScrollReveal>

        <div>
          {/* Availability badge */}
          <ScrollReveal delay={0.1}>
            <div
              style={{
                background: 'rgba(122,181,160,0.08)',
                border: '1px solid rgba(122,181,160,0.25)',
                borderRadius: 12, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32,
              }}
            >
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: '#7ab5a0',
                animation: 'pulse-ring 2s ease-in-out infinite',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Accepting enquiries for 2025–2026</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted-2)' }}>
                  High demand — early booking advised
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Key stats */}
          <ScrollReveal delay={0.15}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
              {[
                { n: '3+', label: 'Nights Min.' },
                { n: '10', label: 'Max Guests' },
                { n: '5★', label: 'Guest Rating' },
                { n: '< 24h', label: 'Response' },
              ].map(({ n, label }) => (
                <div key={label} className="stat-card">
                  <div className="stat-number gradient-text">{n}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Contact details */}
          <ScrollReveal delay={0.2}>
            <div
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '28px', display: 'flex', flexDirection: 'column', gap: 20,
              }}
            >
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>Direct Contact</h3>
              {contactDetails.map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(60px,6vh,80px) clamp(24px,6vw,100px)',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-2)',
        }}
      >
        <ScrollReveal style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">FAQ</div>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)' }}>
            Common Questions
          </h2>
        </ScrollReveal>
        <StaggerGrid
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20, maxWidth: 1000, margin: '0 auto',
          }}
        >
          {faqs.map(({ q, a }) => (
            <StaggerItem key={q}>
              <div className="card" style={{ padding: '28px', height: '100%' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10, lineHeight: 1.45, color: 'var(--accent-1)' }}>
                  {q}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-2)', lineHeight: 1.7 }}>{a}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '28px clamp(24px,6vw,100px)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}
      >
        <Link href="/" style={{ fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.9rem', textDecoration: 'none', color: 'var(--text)' }}>
          Villa <span style={{ color: 'var(--accent-1)' }}>Serenara</span>
        </Link>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
          © 2025 · Bali, Indonesia · All rights reserved
        </span>
      </footer>
    </>
  )
}
