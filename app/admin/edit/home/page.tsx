"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Upload, Save, ArrowLeft, Palette, CheckCircle2, Link as LinkIcon, Plus, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { syncHeroSlidesAction } from "./actions";

interface HeroSlide {
  id?: string;
  bg: string;
  src: string;
  slug: string;
}

export default function EditHomePage() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    // {
    //   bg: '#cec4b1',
    //   src: '/assets/images/1_bed_new.png',
    //   slug: 'canggu-residence'
    // },
    // {
    //   bg: '#cebeaf',
    //   src: '/assets/images/2_bed_new.png',
    //   slug: 'bingin-residence'
    // }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletedSlides, setDeletedSlides] = useState<HeroSlide[]>([]);
  const [obsoleteImageUrls, setObsoleteImageUrls] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01') {
          // Table doesn't exist yet, it's fine, we'll use mock data
          console.warn("Table 'hero_slides' not found. Using default data.");
        } else {
          throw error;
        }
      } else if (data && data.length > 0) {
        setHeroSlides(data);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Could not connect to Supabase. Please ensure your 'hero_slides' table is set up.");
    } finally {
      setIsLoading(false);
    }
  };

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleHeroChange = (index: number, field: keyof HeroSlide, value: any) => {
    const updatedSlides = [...heroSlides];
    
    if (field === 'src') {
      const oldUrl = updatedSlides[index].src;
      if (oldUrl && oldUrl.includes('/storage/v1/object/public/') && oldUrl !== value) {
        setObsoleteImageUrls(prev => [...prev, oldUrl]);
      }
    }
    
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setHeroSlides(updatedSlides);
    setSaveSuccess(false);
  };

  const handleAddSlide = () => {
    setHeroSlides([...heroSlides, {
      bg: '#ffffff',
      src: '',
      slug: `new-project-${Date.now()}`
    }]);
  };

  const handleRemoveSlide = (index: number) => {
    if (heroSlides.length <= 1) return;
    
    const slideToRemove = heroSlides[index];
    
    // Always track the image for deletion if it's a Supabase URL
    if (slideToRemove.src.includes('/storage/v1/object/public/hero-images/')) {
      setObsoleteImageUrls(prev => [...prev, slideToRemove.src]);
    }
    
    // If it has an ID, we need to track it for DB deletion too
    if (slideToRemove.id) {
      setDeletedSlides(prev => [...prev, slideToRemove]);
    }
    
    const updatedSlides = heroSlides.filter((_, i) => i !== index);
    setHeroSlides(updatedSlides);
    setSaveSuccess(false);
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `hero-images/${fileName}`;

    const { error } = await supabase.storage
      .from('hero-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSave = async () => {
    const slugs = heroSlides.map(s => s.slug);
    const duplicateSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (duplicateSlugs.length > 0) {
      setError(`Duplicate URL slug detected: "${duplicateSlugs[0]}". Each slide must have a unique slug.`);
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      const updatedSlides = await Promise.all(heroSlides.map(async (slide, index) => {
        let imageUrl = slide.src;
        
        // Only upload if it's a new local image (data URL or blob URL)
        if (imageUrl.startsWith('data:image') || imageUrl.startsWith('blob:')) {
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const file = new File([blob], `slide-${index}.png`, { type: 'image/png' });
          imageUrl = await uploadImage(file);
        }
        
        const { id, ...slideData } = slide;
        const cleanedSlide: any = {
          ...slideData,
          src: imageUrl,
          order: index + 1
        };
        
        // Only include ID if it actually exists and is not an empty string
        if (id && id !== "") {
          cleanedSlide.id = id;
        }
        
        return cleanedSlide;
      }));

      const idsToDelete = deletedSlides.map(s => s.id).filter(Boolean) as string[];
      const urlsToDelete = [
        ...obsoleteImageUrls,
        ...deletedSlides.map(s => s.src),
      ].filter(url => url.includes('/storage/v1/object/public/'));

      const response = await syncHeroSlidesAction({ idsToDelete, urlsToDelete, updatedSlides });

      if (!response.success) {
        throw new Error(response.error || (response as any).results?.errors?.join(", ") || "Failed to sync changes");
      }

      setDeletedSlides([]);
      setObsoleteImageUrls([]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      fetchData(); // Refresh data
    } catch (err: any) {
      console.error("Error saving:", err);
      setError(err.message || "Failed to save changes. Make sure 'hero_slides' table and 'hero-images' bucket exist.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h, 72px))', backgroundColor: 'var(--bg)', padding: '48px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
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
                <h1 className="section-title" style={{ marginBottom: '4px', fontSize: '1.8rem' }}>Edit Home Page</h1>
                <p style={{ color: 'var(--muted-2)' }}>Manage the hero slider projects that appear on the main landing page.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)', color: '#059669', padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(5, 150, 105, 0.2)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  <CheckCircle2 size={18} />
                  Changes saved successfully!
                </motion.div>
              )}
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(220, 38, 38, 0.2)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', fontWeight: 500 }}
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}

          {isLoading ? (
            <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--accent-1)', borderRadius: '50%' }}
              />
            </div>
          ) : (
            <AnimatePresence>
              {heroSlides.map((slide, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="card" 
                  style={{ padding: '32px', marginBottom: '40px', position: 'relative' }}
                >
                  {/* Card Header - Using Project Name as Title */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(184,146,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-1)' }}>
                        <ImageIcon size={20} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{`Slide ${index + 1}`}</h3>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '6px 12px', backgroundColor: 'var(--surface)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-2)', border: '1px solid var(--border)' }}>
                        Order: {index + 1}
                      </div>
                      {heroSlides.length > 1 && (
                        <button 
                          onClick={() => handleRemoveSlide(index)}
                          style={{ border: 'none', background: 'rgba(220, 38, 38, 0.05)', color: '#dc2626', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.05)'}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }}>
                    {/* Left Column: Image with Upload Overlay */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Hero Image</label>
                      <div 
                        onClick={() => fileInputRefs.current[index]?.click()}
                        style={{ 
                          position: 'relative', 
                          width: '100%', 
                          height: '280px', 
                          borderRadius: '20px', 
                          overflow: 'hidden', 
                          border: '1px solid var(--border)', 
                          boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          const overlay = e.currentTarget.querySelector('.upload-overlay') as HTMLElement;
                          if (overlay) overlay.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          const overlay = e.currentTarget.querySelector('.upload-overlay') as HTMLElement;
                          if (overlay) overlay.style.opacity = '0';
                        }}
                      >
                        {slide.src ? (
                          <Image src={slide.src} alt="Villa" fill style={{ objectFit: 'cover' }} />
                        ) : (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: 'var(--surface)', color: 'var(--muted-2)' }}>
                            <ImageIcon size={36} strokeWidth={1.2} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Click to upload image</span>
                          </div>
                        )}

                        <div
                          className="upload-overlay"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: slide.src ? 'rgba(0,0,0,0.4)' : 'transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            opacity: slide.src ? 0 : 1,
                            transition: 'all 0.3s ease',
                            backdropFilter: slide.src ? 'blur(4px)' : 'none',
                          }}
                        >
                          {slide.src && (
                            <>
                              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
                                <Upload size={22} />
                              </div>
                              <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Change Image</span>
                            </>
                          )}
                        </div>
                      </div>
                      <input 
                        type="file" 
                        ref={el => { fileInputRefs.current[index] = el }} 
                        style={{ display: 'none' }} 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              handleHeroChange(index, 'src', reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted-2)', textAlign: 'center' }}>Recommended: 1920x1080px (PNG/JPG)</p>
                    </div>

                    {/* Right Column: Text Data */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Palette size={14} /> Background Color
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="color"
                            className="form-input"
                            style={{ width: '45px', padding: '4px', height: '42px' }}
                            value={slide.bg}
                            onChange={(e) => handleHeroChange(index, 'bg', e.target.value)}
                          />
                          <input
                            type="text"
                            className="form-input"
                            value={slide.bg}
                            onChange={(e) => handleHeroChange(index, 'bg', e.target.value)}
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <LinkIcon size={14} /> URL Location
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <span style={{ padding: '12px 16px', backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--muted-2)', fontSize: '0.85rem', whiteSpace: 'nowrap', borderRight: '1px solid var(--border)' }}>
                            {baseUrl}/map?location=
                          </span>
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}
                            value={slide.slug} 
                            onChange={(e) => handleHeroChange(index, 'slug', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Add Slide Button - Bottom */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleAddSlide}
            style={{ 
              width: '100%', 
              padding: '20px', 
              borderRadius: '16px', 
              border: '2px dashed var(--border-h)', 
              background: 'rgba(255,255,255,0.3)', 
              color: 'var(--muted-2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              marginBottom: '48px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-1)'; e.currentTarget.style.color = 'var(--accent-1)'; e.currentTarget.style.backgroundColor = 'rgba(184,146,42,0.03)' }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-h)'; e.currentTarget.style.color = 'var(--muted-2)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(184,146,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={20} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Add New Hero Slide</span>
          </motion.button>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '32px', marginBottom: '64px' }}>
            <Link 
              href="/admin"
              className="btn-outline" 
              style={{ padding: '12px 28px', textDecoration: 'none' }}
            >
              Cancel
            </Link>
            <button 
              className="btn-primary" 
              style={{ padding: '12px 32px', gap: '10px', opacity: isSaving ? 0.8 : 1 }}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Save size={18} style={{ opacity: 0.5 }} />
                </motion.div>
              ) : (
                <Save size={18} />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
