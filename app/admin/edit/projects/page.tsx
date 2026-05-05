"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProjectsListPage() {
  // Mock data for multiple projects
  const projects = [
    {
      slug: "master-bedroom",
      title: "Master Bedroom",
      description: "A luxurious master bedroom overlooking the lush tropical forest.",
      image: "/assets/images/1_bed_new.png"
    },
    {
      slug: "living-area",
      title: "Living Area",
      description: "Spacious open-plan living area with bespoke teakwood furniture.",
      image: "/assets/images/2_bed_new.png"
    },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h, 72px))', backgroundColor: 'var(--bg)', padding: '48px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link 
                href="/admin"
                style={{ background: 'transparent', border: '1px solid var(--border-h)', borderRadius: '50%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="section-title" style={{ marginBottom: '4px', fontSize: '1.8rem' }}>Gallery Projects</h1>
                <p style={{ color: 'var(--muted-2)' }}>Manage all the projects displayed in your portfolio gallery.</p>
              </div>
            </div>
            
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
              <Plus size={18} />
              Add New Project
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
            {projects.map((project, index) => (
              <motion.div 
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card" 
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', width: '100%', height: '200px', borderBottom: '1px solid var(--border)' }}>
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
                
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>{project.title}</h3>
                  <p style={{ color: 'var(--muted-2)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
                    {project.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Link 
                      href={`/admin/edit/projects/${project.slug}`}
                      className="btn-outline"
                      style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '8px', padding: '10px 0', textDecoration: 'none' }}
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>
                    <button 
                      style={{ padding: '10px 16px', background: 'rgba(192,112,64,0.05)', border: '1px solid rgba(192,112,64,0.3)', borderRadius: '8px', color: 'var(--accent-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
        </motion.div>
      </div>
    </div>
  );
}
