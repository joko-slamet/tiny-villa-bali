"use client";

import React from "react";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Phone, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function EditContactPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h, 72px))', backgroundColor: 'var(--bg)', padding: '48px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <Link 
              href="/admin"
              style={{ background: 'transparent', border: '1px solid var(--border-h)', borderRadius: '50%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="section-title" style={{ marginBottom: '4px', fontSize: '1.8rem' }}>Edit Contact Info</h1>
              <p style={{ color: 'var(--muted-2)' }}>Update the phone numbers, emails, and social media links for the website.</p>
            </div>
          </div>

          {/* Primary Contact Information Section */}
          <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <Phone size={24} color="var(--accent-1)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Direct Contact Methods</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="var(--muted-2)" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="form-input" 
                  defaultValue="reservations@villaserenara.com" 
                  style={{ fontSize: '1rem', padding: '16px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="var(--muted-2)" />
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  className="form-input" 
                  defaultValue="+62 812 3456 7890" 
                  style={{ fontSize: '1rem', padding: '16px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={16} color="var(--accent-3)" />
                  WhatsApp Number
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input 
                    type="tel" 
                    className="form-input" 
                    defaultValue="+6281234567890" 
                    style={{ fontSize: '1rem', padding: '16px', flex: 1 }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted-2)' }}>Format: include country code without '+', e.g. 628...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Social Media Links</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  Instagram URL
                </label>
                <input 
                  type="url" 
                  className="form-input" 
                  defaultValue="https://instagram.com/villaserenara" 
                  style={{ fontSize: '1rem', padding: '16px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  Facebook URL
                </label>
                <input 
                  type="url" 
                  className="form-input" 
                  defaultValue="https://facebook.com/villaserenara" 
                  style={{ fontSize: '1rem', padding: '16px' }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <Link 
              href="/admin"
              className="btn-outline" 
              style={{ padding: '12px 24px', textDecoration: 'none' }}
            >
              Cancel
            </Link>
            <button className="btn-primary" style={{ padding: '12px 24px', gap: '8px' }}>
              <Save size={18} />
              Save Changes
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
