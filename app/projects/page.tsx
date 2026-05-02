import type { Metadata } from 'next'
import Link from 'next/link'
import ProjectCardMotion from '../components/ProjectCardMotion'
import ScrollReveal from '../components/ScrollReveal'
import StaggerGrid, { StaggerItem } from '../components/StaggerGrid'

export const metadata: Metadata = {
  title: 'Gallery — Villa Serenara',
  description: 'Explore the spaces and suites of Villa Serenara, Bali\'s premier private luxury villa.',
}

const featured = [
  {
    title: 'The Master Suite',
    desc: 'A soaring 90 m² sanctuary with a king four-poster bed, private sundeck, and volcanic-stone soaking tub overlooking the gardens.',
    tags: ['King Bed', 'Ocean View', 'Private Deck'],
    emoji: '🛏️',
    fromColor: '#d4a853',
    toColor: '#c97b4b',
    large: true,
  },
  {
    title: 'The Infinity Pool',
    desc: 'Our 20-metre heated pool appears to dissolve into the jungle canopy. An underwater sound system and floating daybed complete the experience.',
    tags: ['Heated', '20m Length', 'Jungle View'],
    emoji: '🏊',
    fromColor: '#7ab5a0',
    toColor: '#d4a853',
    large: true,
  },
]

const spaces = [
  {
    title: 'Garden Villa Suite',
    desc: 'Direct access to tropical gardens and a private plunge pool fed by a natural stone fountain.',
    tags: ['Plunge Pool', 'Garden', 'King Bed'],
    emoji: '🌿',
    fromColor: '#7ab5a0',
    toColor: '#c97b4b',
    large: false,
  },
  {
    title: 'Spa Pavilion',
    desc: 'Traditional Balinese massage, aromatherapy steam room, and a dedicated sunrise yoga deck.',
    tags: ['Massage', 'Steam Room', 'Yoga'],
    emoji: '💆',
    fromColor: '#c97b4b',
    toColor: '#d4a853',
    large: false,
  },
  {
    title: 'Open-Air Pavilion',
    desc: 'Beneath a hand-crafted alang-alang thatched roof, dine on personalised menus prepared by your private chef.',
    tags: ['Chef\'s Table', 'Al Fresco', 'Bar'],
    emoji: '🍽️',
    fromColor: '#d4a853',
    toColor: '#7ab5a0',
    large: false,
  },
  {
    title: 'Cinema Lounge',
    desc: 'A 120-inch cinema screen, Dolby Atmos audio, and a curated vinyl library for late-evening indulgence.',
    tags: ['Cinema', 'Dolby Atmos', 'Vinyl'],
    emoji: '🎬',
    fromColor: '#c97b4b',
    toColor: '#7ab5a0',
    large: false,
  },
]

const details = [
  { label: 'Total Area', value: '800 m²' },
  { label: 'Bedrooms', value: '5 Suites' },
  { label: 'Max Guests', value: '10 Adults' },
  { label: 'Pool Length', value: '20 Metres' },
  { label: 'Minimum Stay', value: '3 Nights' },
  { label: 'Location', value: 'Ubud, Bali' },
]

export default function GalleryPage() {
  return (
    <>
      {/* ── Header ────────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,100px) clamp(40px,5vh,60px)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div className="orb orb-1" style={{ opacity: 0.4 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <div className="section-label">Gallery</div>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 900, letterSpacing: '-2px',
                lineHeight: 1.05, marginBottom: 20,
              }}
            >
              Explore{' '}
              <span className="gradient-text">the Villa</span>
            </h1>
            <p style={{ color: 'var(--muted-2)', fontSize: '1.05rem', maxWidth: 520, lineHeight: 1.8 }}>
              Each space has been designed by award-winning architects to harmonise
              Balinese craftsmanship with contemporary luxury.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Estate details strip ──────────────────────── */}
      <section
        style={{
          padding: '0 clamp(24px,6vw,100px) clamp(48px,6vh,72px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <StaggerGrid
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 1,
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}
        >
          {details.map(({ label, value }) => (
            <StaggerItem key={label}>
              <div
                style={{
                  padding: '28px 24px', background: 'var(--bg)',
                  textAlign: 'center',
                }}
              >
                <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
                  {value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-2)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {label}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* ── Featured spaces ───────────────────────────── */}
      <section style={{ padding: 'clamp(48px,6vh,72px) clamp(24px,6vw,100px) 24px' }}>
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

      {/* ── Other spaces ──────────────────────────────── */}
      <section style={{ padding: '24px clamp(24px,6vw,100px) clamp(80px,10vh,120px)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {spaces.map((p, i) => (
            <ProjectCardMotion key={p.title} {...p} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* ── Booking CTA ───────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(40px,6vh,60px) clamp(24px,6vw,100px) clamp(60px,8vh,100px)',
          borderTop: '1px solid var(--border)', textAlign: 'center',
        }}
      >
        <ScrollReveal>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16 }}>
            Ready to experience this in person?
          </h2>
          <p style={{ color: 'var(--muted-2)', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.8 }}>
            Availability is limited. Reach out to secure your exclusive dates at Villa Serenara.
          </p>
          <Link href="/contact" className="btn-primary" transitionTypes={['nav-forward']}>
            Enquire Now ↗
          </Link>
        </ScrollReveal>
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
