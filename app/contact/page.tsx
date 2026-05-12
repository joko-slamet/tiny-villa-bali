import type { Metadata } from 'next'
import ContactForm from '../components/ContactForm'
import ScrollReveal from '../components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Contact — Animate Mbuchacher',
  description: 'Get in touch with us for business proposals, project enquiries, or purchasing information.',
}

const contactDetails: { label: string; value: string; href?: string }[] = [
  { label: 'Email', value: 'office@tinyvillabali.com' },
  { label: 'Instagram', value: '@tinyvillabali', href: 'https://www.instagram.com/tinyvillabali' },
  { label: 'Location', value: 'Bali, Indonesia' },
  { label: 'Response Time', value: 'Within 24 hours' },
]

export default function ContactPage() {
  return (
    <section
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
        gap: 0,
      }}
    >
      {/* Left — copy */}
      <div
        style={{
          padding: 'clamp(60px,8vh,100px) clamp(32px,6vw,80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ScrollReveal>
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'var(--accent-1)',
              marginBottom: 24,
            }}
          >
            Send Us a Message
          </p>

          <h1
            style={{
              fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1.05,
              marginBottom: 28,
            }}
          >
            Let's Talk
          </h1>

          <p
            style={{
              color: 'var(--muted-2)',
              fontSize: '1rem',
              lineHeight: 1.85,
              maxWidth: 420,
              marginBottom: 56,
            }}
          >
            If you're interested in hearing more about the way we work, have a
            business proposal, or are interested in making a purchase, we'd love
            to hear from you.
          </p>

          {/* Contact details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {contactDetails.map(({ label, value, href }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)', textDecoration: 'underline', textUnderlineOffset: 3 }}
                  >
                    {value}
                  </a>
                ) : (
                  <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)' }}>
                    {value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Right — form */}
      <div
        style={{
          padding: 'clamp(60px,8vh,100px) clamp(32px,6vw,80px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'var(--bg)',
        }}
      >
        <ScrollReveal delay={0.1}>
          <ContactForm />
        </ScrollReveal>
      </div>
    </section>
  )
}
