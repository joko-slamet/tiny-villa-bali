"use client";

import React from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Upload, Save, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditMapPage() {
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
              <h1 className="section-title" style={{ marginBottom: '4px', fontSize: '1.8rem' }}>Edit Map Page</h1>
              <p style={{ color: 'var(--muted-2)' }}>Update the location details and map image for the /map page.</p>
            </div>
          </div>

          {/* Map Image Section */}
          <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <ImageIcon size={24} color="var(--accent-1)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Map Background Image</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {/* Current Image */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '12px' }}>Current Map Image</label>
                <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <Image src="/assets/images/map.png" alt="Current Map" fill style={{ objectFit: 'cover' }} />
                </div>
              </div>

              {/* Upload New Image */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '12px' }}>Upload New Image</label>
                <div 
                  style={{ width: '100%', height: '240px', border: '2px dashed var(--border-h)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s' }} 
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-1)'; e.currentTarget.style.backgroundColor = 'rgba(184,146,42,0.03)' }} 
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-h)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)' }}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--accent-1)' }}>
                    <Upload size={24} />
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>Click to browse or drag image here</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted-2)', marginTop: '8px' }}>Supported formats: JPG, PNG, WEBP (Max 5MB)</span>
                </div>
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
