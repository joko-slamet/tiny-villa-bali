'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

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
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: 16,
          padding: '48px 36px',
          textAlign: 'center',
          animation: 'scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 10 }}>Message Sent!</h3>
        <p style={{ color: 'var(--muted-2)', lineHeight: 1.6 }}>
          Thanks for reaching out. I'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }) }}
          className="btn-outline"
          style={{ marginTop: 24 }}
        >
          Send Another
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
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Send a Message
          </h2>
          <p style={{ color: 'var(--muted-2)', fontSize: '0.88rem' }}>
            Fill out the form and I'll get back to you shortly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Alex Johnson"
              className="form-input"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="alex@company.com"
              className="form-input"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="subject">Project Type</label>
          <select
            id="subject"
            name="subject"
            className="form-input"
            required
            value={form.subject}
            onChange={handleChange}
            style={{ appearance: 'none' }}
          >
            <option value="" disabled>Select a project type…</option>
            <option>Website Redesign (3+ pages)</option>
            <option>Landing Page with Animations</option>
            <option>Full-Stack Web Application</option>
            <option>3D / WebGL Experience</option>
            <option>Motion Design Consultation</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="message">Project Details</label>
          <textarea
            id="message"
            name="message"
            required
            placeholder="Tell me about your project, timeline, and budget…"
            className="form-input"
            value={form.message}
            onChange={handleChange}
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
            <>Send Message →</>
          )}
        </button>
      </div>
    </form>
  )
}
