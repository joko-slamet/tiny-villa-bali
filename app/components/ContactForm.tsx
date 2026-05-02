'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name: '', email: '', checkin: '', checkout: '', guests: '', requests: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1400))
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div
        style={{
          background: 'rgba(212,168,83,0.07)',
          border: '1px solid rgba(212,168,83,0.28)',
          borderRadius: 20,
          padding: '52px 40px',
          textAlign: 'center',
          animation: 'scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🌿</div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 10 }}>
          Enquiry Received
        </h3>
        <p style={{ color: 'var(--muted-2)', lineHeight: 1.75, maxWidth: 320, margin: '0 auto' }}>
          Thank you for your interest in Villa Serenara. Our concierge team
          will be in touch within 24 hours to confirm availability.
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', email: '', checkin: '', checkout: '', guests: '', requests: '' }) }}
          className="btn-outline"
          style={{ marginTop: 28 }}
        >
          Send Another Enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 'clamp(28px,4vw,44px)',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Booking Enquiry
          </h2>
          <p style={{ color: 'var(--muted-2)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            Complete this form and our concierge will respond within 24 hours
            with availability and pricing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name" name="name" type="text" required
              placeholder="Your full name"
              className="form-input"
              value={form.name} onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email" name="email" type="email" required
              placeholder="you@example.com"
              className="form-input"
              value={form.email} onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="checkin">Check-In Date</label>
            <input
              id="checkin" name="checkin" type="date" required
              className="form-input"
              value={form.checkin} onChange={handleChange}
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="checkout">Check-Out Date</label>
            <input
              id="checkout" name="checkout" type="date" required
              className="form-input"
              value={form.checkout} onChange={handleChange}
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="guests">Number of Guests</label>
          <select
            id="guests" name="guests" className="form-input" required
            value={form.guests} onChange={handleChange}
            style={{ appearance: 'none' }}
          >
            <option value="" disabled>Select number of guests…</option>
            <option>2 Adults</option>
            <option>4 Adults</option>
            <option>6 Adults</option>
            <option>8 Adults</option>
            <option>10 Adults</option>
            <option>Mixed (adults + children)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="requests">Special Requests (optional)</label>
          <textarea
            id="requests" name="requests"
            placeholder="Dietary requirements, airport transfer, special occasions, preferred activities…"
            className="form-input"
            value={form.requests} onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={status === 'sending'}
          style={{
            justifyContent: 'center',
            opacity: status === 'sending' ? 0.7 : 1,
            cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          }}
        >
          {status === 'sending' ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin-slow 1s linear infinite', width: 16 }}>⟳</span>
              Sending Enquiry…
            </>
          ) : (
            <>Send Enquiry ↗</>
          )}
        </button>
      </div>
    </form>
  )
}
