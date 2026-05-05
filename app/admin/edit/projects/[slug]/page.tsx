"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, ArrowLeft, FileText, Image as ImageIcon, Upload, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;
  
  // Format the slug for display (e.g. "master-bedroom" -> "Master Bedroom")
  const formattedTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const [markerPos, setMarkerPos] = useState({ x: 50, y: 50 });

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMarkerPos({ x, y });
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h, 72px))', backgroundColor: 'var(--bg)', padding: '48px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <Link 
              href="/admin/edit/projects"
              style={{ background: 'transparent', border: '1px solid var(--border-h)', borderRadius: '50%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="section-title" style={{ marginBottom: '4px', fontSize: '1.8rem' }}>Edit Project Gallery</h1>
              <p style={{ color: 'var(--muted-2)' }}>Update the details and cover image for the gallery project.</p>
            </div>
          </div>

          {/* Project Details Section */}
          <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <FileText size={24} color="var(--accent-1)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Project Details</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Project Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    defaultValue={`Villa Serenara - ${formattedTitle}`} 
                    style={{ fontSize: '1rem', padding: '16px' }}
                  />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
                <textarea 
                  className="form-input" 
                  defaultValue="A luxurious master bedroom overlooking the lush tropical forest, featuring bespoke teakwood furniture and floor-to-ceiling windows." 
                  style={{ fontSize: '1rem', padding: '16px', minHeight: '120px' }}
                />
              </div>
            </div>
          </div>

          {/* Map Location Section */}
          <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <MapPin size={24} color="var(--accent-1)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Map Marker Location</h3>
            </div>
            
            <p style={{ color: 'var(--muted-2)', marginBottom: '24px' }}>Click anywhere on the map to set the location pin for this project.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {/* Map Interactive Area */}
              <div>
                <div 
                  onClick={handleMapClick}
                  style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', cursor: 'crosshair', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                >
                  <Image src="/assets/images/map.png" alt="Resort Map" fill style={{ objectFit: 'cover' }} />
                  
                  {/* The Marker */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      position: 'absolute',
                      top: `${markerPos.y}%`,
                      left: `${markerPos.x}%`,
                      transform: 'translate(-50%, -50%)', // Anchor exactly at the center
                      zIndex: 10,
                      pointerEvents: 'none', // Prevents marker from interfering with clicks
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ 
                      width: '32px', height: '32px', 
                      backgroundColor: 'rgba(220, 38, 38, 0.2)', 
                      borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(220, 38, 38, 0.5)'
                    }}>
                      <div style={{ 
                        width: '12px', height: '12px', 
                        backgroundColor: '#dc2626', 
                        borderRadius: '50%', 
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }} />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Coordinates Output */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>X Axis (%)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={markerPos.x.toFixed(2)} 
                      readOnly
                      style={{ fontSize: '1.2rem', padding: '16px', flex: 1, backgroundColor: 'rgba(0,0,0,0.02)' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Y Axis (%)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={markerPos.y.toFixed(2)} 
                      readOnly
                      style={{ fontSize: '1.2rem', padding: '16px', flex: 1, backgroundColor: 'rgba(0,0,0,0.02)' }}
                    />
                  </div>
                </div>
                
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-2)' }}>These relative coordinates will be saved in the database to position this project perfectly on the interactive map regardless of screen size.</p>
              </div>
            </div>
          </div>

          {/* Project Image Section */}
          <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <ImageIcon size={24} color="var(--accent-1)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Project Image</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {/* Current Image */}
              <div>
                <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '12px' }}>Current Image</label>
                <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <Image src="/assets/images/1_bed_new.png" alt="Current Project" fill style={{ objectFit: 'cover' }} />
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
              href="/admin/edit/projects"
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
