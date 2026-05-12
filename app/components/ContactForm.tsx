'use client'

import { useState } from 'react'
import { sendContactEmail } from '../contact/actions'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendContactEmail(form)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div
        style={{
          background: 'rgba(184,146,42,0.06)',
          border: '1px solid rgba(184,146,42,0.2)',
          borderRadius: 20,
          padding: '60px 40px',
          textAlign: 'center',
          animation: 'scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✦</div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 10, letterSpacing: '-0.5px' }}>
          Message Sent
        </h3>
        <p style={{ color: 'var(--muted-2)', lineHeight: 1.8, maxWidth: 320, margin: '0 auto', fontSize: '0.9rem' }}>
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }) }}
          className="btn-outline"
          style={{ marginTop: 28 }}
        >
          Send Another Message
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
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {status === 'error' && (
          <div style={{
            background: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: '0.85rem',
            color: '#dc2626',
          }}>
            Something went wrong. Please try again or email us directly.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
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

        <div className="form-group">
          <label className="form-label" htmlFor="message">Message</label>
          <textarea
            id="message" name="message" required
            placeholder="Tell us about your interest…"
            className="form-input"
            rows={6}
            style={{ resize: 'vertical', lineHeight: 1.7 }}
            value={form.message} onChange={handleChange}
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
              Sending…
            </>
          ) : (
            <>Send Message ↗</>
          )}
        </button>
      </div>
    </form>
  )
}
