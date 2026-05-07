"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Save, Image as ImageIcon, Upload, Type,
  MapPin, Info, CheckCircle2, AlertCircle, Star, Link as LinkIcon,
  AlignLeft, List, DollarSign, Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { syncProjectsAction, uploadImageAction } from "../actions";

interface ProjectForm {
  id?: string;
  name: string;
  location: string;
  status: string;
  units: string;
  available: boolean;
  featured: boolean;
  src: string;
  slug: string;
  order?: number;
  images: string[];
  description1: string;
  description2: string;
  details1: string;
  details2: string;
  price: string;
  url_360a: string;
  url_360b: string;
  url_maps: string;
  x: number | null;
  y: number | null;
}

const EMPTY_IMAGES = ["", "", "", "", ""];

const STATUS_OPTIONS = ["Completed", "Under Construction", "Coming Soon"];

const FALLBACK_EXTRA = { images: [...EMPTY_IMAGES], description1: "", description2: "", details1: "", details2: "", price: "", url_360a: "", url_360b: "", url_maps: "", x: null, y: null };

const FALLBACK_DATA: Record<string, ProjectForm> = {
  "canggu-residence":  { ...FALLBACK_EXTRA, name: "Canggu Residence",  location: "Canggu, Bali",   status: "Completed",   units: "12 units · 1 bedroom", available: false, featured: true,  src: "/assets/images/1_bed_new.png",                  slug: "canggu-residence",  order: 1 },
  "binging-residence": { ...FALLBACK_EXTRA, name: "Bingin Residence",   location: "Bingin, Bali",   status: "Completed",   units: "16 units · 1 bedroom", available: true,  featured: true,  src: "/assets/images/binging/bingin-pool.png",        slug: "binging-residence", order: 2 },
  "seminyak-villas":   { ...FALLBACK_EXTRA, name: "Seminyak Villas",    location: "Seminyak, Bali", status: "Under Construction", units: "8 units · 2 bedroom",  available: false, featured: false, src: "/assets/images/binging/bingin-bedroom.png",     slug: "seminyak-villas",   order: 3 },
  "ubud-retreat":      { ...FALLBACK_EXTRA, name: "Ubud Retreat",       location: "Ubud, Bali",     status: "Coming Soon", units: "6 units · 3 bedroom",  available: false, featured: false, src: "/assets/images/binging/bingin-living-room.png", slug: "ubud-retreat",      order: 4 },
  "jimbaran-estate":   { ...FALLBACK_EXTRA, name: "Jimbaran Estate",    location: "Jimbaran, Bali", status: "Coming Soon", units: "4 units · 4 bedroom",  available: false, featured: false, src: "/assets/images/binging/bingin-kitchen.png",     slug: "jimbaran-estate",   order: 5 },
  "uluwatu-cliff":     { ...FALLBACK_EXTRA, name: "Uluwatu Cliff",      location: "Uluwatu, Bali",  status: "Under Construction", units: "10 units · 2 bedroom", available: false, featured: false, src: "/assets/images/binging/bingin-parking.png",     slug: "uluwatu-cliff",     order: 6 },
};

const EMPTY_FORM: ProjectForm = {
  name: "", location: "", status: "Under Construction",
  units: "", available: false, featured: false, src: "", slug: "", images: [...EMPTY_IMAGES],
  description1: "", description2: "", details1: "", details2: "",
  price: "", url_360a: "", url_360b: "", url_maps: "", x: null, y: null,
};

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: 32, marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(184,146,42,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-1)", flexShrink: 0 }}>
          {icon}
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const isNew = slug === "new";

  const router = useRouter();
  const [form, setForm]         = useState<ProjectForm>(isNew ? EMPTY_FORM : { ...EMPTY_FORM, slug });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [toast, setToast]       = useState(false);
  const [baseUrl, setBaseUrl]   = useState("https://yourdomain.com");
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRefs = useRef<(HTMLInputElement | null)[]>([]);

  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== "undefined") setBaseUrl(window.location.origin);
    if (!isNew) fetchProject();
  }, []);

  async function fetchProject() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        const fallback = FALLBACK_DATA[slug];
        if (fallback) setForm(fallback);
        else setError("Project not found in database. Using empty form.");
      } else {
        setForm({
          ...EMPTY_FORM, ...data,
          images:       data.images       ?? [...EMPTY_IMAGES],
          description1: data.description1 ?? "",
          description2: data.description2 ?? "",
          details1:     data.details1     ?? "",
          details2:     data.details2     ?? "",
          price:        data.price        ?? "",
          url_360a:     data.url_360a     ?? "",
          url_360b:     data.url_360b     ?? "",
          url_maps:     data.url_maps     ?? "",
          x:            data.x            ?? null,
          y:            data.y            ?? null,
        });
      }
    } catch {
      const fallback = FALLBACK_DATA[slug];
      if (fallback) setForm(fallback);
    } finally {
      setIsLoading(false);
    }
  }

  function update<K extends keyof ProjectForm>(field: K, value: ProjectForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadImageAction(fd);
    if ("error" in result) throw new Error(result.error);
    return result.url;
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Name and URL slug are required.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      let src = form.src;
      if (src.startsWith("data:image") || src.startsWith("blob:")) {
        const res  = await fetch(src);
        const blob = await res.blob();
        const file = new File([blob], "project.png", { type: "image/png" });
        src = await uploadImage(file);
      }

      const uploadedImages = await Promise.all(
        form.images.map(async (img, i) => {
          if (!img || (!img.startsWith("data:image") && !img.startsWith("blob:"))) return img;
          const res  = await fetch(img);
          const blob = await res.blob();
          const ext  = blob.type.split("/")[1] || "jpg";
          const file = new File([blob], `gallery-${i}.${ext}`, { type: blob.type });
          return uploadImage(file);
        })
      );

      const payload = { ...form, src, images: uploadedImages };
      const res = await syncProjectsAction({ idsToDelete: [], urlsToDelete: [], updatedProjects: [payload] });
      if (!res.success) throw new Error(res.error || "Save failed");

      setToast(true);
      setTimeout(() => router.push("/admin/edit/projects"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--accent-1)", borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-h, 72px))", backgroundColor: "var(--bg)", padding: "48px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Link
                href="/admin/edit/projects"
                style={{ background: "transparent", border: "1px solid var(--border-h)", borderRadius: "50%", padding: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", textDecoration: "none" }}
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>
                  {isNew ? "Add New Project" : `Edit: ${form.name || slug}`}
                </h1>
                <p style={{ color: "var(--muted-2)", fontSize: "0.88rem" }}>
                  {isNew ? "Fill in the details to create a new project." : "Update the details for this project."}
                </p>
              </div>
            </div>

          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(220,38,38,0.2)", display: "flex", alignItems: "center", gap: 10, marginBottom: 24, fontSize: "0.9rem" }}>
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 1: Project Details */}
          <Section icon={<Type size={18} />} title="Project Details">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Project Name *</label>
                  <input className="form-input" type="text" placeholder="e.g. Canggu Residence"
                    value={form.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <MapPin size={13} /> Location
                  </label>
                  <input className="form-input" type="text" placeholder="e.g. Canggu, Bali"
                    value={form.location} onChange={(e) => update("location", e.target.value)} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Units</label>
                  <input className="form-input" type="text" placeholder="e.g. 12 units · 1 bedroom"
                    value={form.units} onChange={(e) => update("units", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Status</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {STATUS_OPTIONS.map((s) => (
                      <button key={s} onClick={() => update("status", s)}
                        style={{
                          flex: 1, padding: "10px 4px", borderRadius: 10, border: "1px solid",
                          borderColor: form.status === s ? "var(--accent-1)" : "var(--border-h)",
                          background: form.status === s ? "rgba(184,146,42,0.1)" : "transparent",
                          color: form.status === s ? "var(--accent-1)" : "var(--muted-2)",
                          fontWeight: form.status === s ? 700 : 500,
                          fontSize: "0.72rem", cursor: "pointer", transition: "all 0.2s",
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <LinkIcon size={13} /> URL Slug *
                </label>
                <div style={{ display: "flex", alignItems: "center", background: "var(--surface)", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
                  <span style={{ padding: "12px 14px", background: "rgba(0,0,0,0.04)", color: "var(--muted-2)", fontSize: "0.82rem", whiteSpace: "nowrap", borderRight: "1px solid var(--border)" }}>
                    {baseUrl}/project/
                  </span>
                  <input className="form-input" type="text" placeholder="canggu-residence"
                    style={{ border: "none", background: "transparent", boxShadow: "none" }}
                    value={form.slug} onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))} />
                </div>
              </div>

              <div
                onClick={() => update("available", !form.available)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 20px", borderRadius: 12,
                  border: `1px solid ${form.available ? "rgba(5,150,105,0.35)" : "var(--border-h)"}`,
                  background: form.available ? "rgba(5,150,105,0.06)" : "var(--surface)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>Available for Sale</p>
                </div>
                <div style={{
                  width: 44, height: 24, borderRadius: 99,
                  background: form.available ? "#059669" : "rgba(28,21,16,0.15)",
                  position: "relative", transition: "background 0.2s", flexShrink: 0,
                }}>
                  <motion.div animate={{ x: form.available ? 22 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    style={{ position: "absolute", top: 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            </div>
          </Section>

          {/* Section 2: Cover Image */}
          <Section icon={<ImageIcon size={18} />} title="Cover Image">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
              <div>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)", cursor: "pointer", background: "var(--surface)" }}
                  onMouseEnter={(e) => { const o = e.currentTarget.querySelector(".img-overlay") as HTMLElement; if (o) o.style.opacity = "1"; }}
                  onMouseLeave={(e) => { const o = e.currentTarget.querySelector(".img-overlay") as HTMLElement; if (o) o.style.opacity = "0"; }}
                >
                  {form.src ? (
                    <Image src={form.src} alt={form.name} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--muted)" }}>
                      <ImageIcon size={32} strokeWidth={1.2} />
                      <span style={{ fontSize: "0.8rem" }}>No image yet</span>
                    </div>
                  )}
                  <div className="img-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: 0, transition: "opacity 0.25s", backdropFilter: "blur(4px)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <Upload size={20} />
                    </div>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem" }}>{form.src ? "Change Image" : "Upload Image"}</span>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => update("src", reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
                <p style={{ fontSize: "0.72rem", color: "var(--muted-2)", marginTop: 8, textAlign: "center" }}>Click to upload · JPG, PNG, WEBP · Max 5MB</p>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--muted-2)", lineHeight: 1.7 }}>
                Recommended resolution: <strong>1920×1080px</strong> or <strong>4:3</strong> ratio.<br />The image will be displayed as the project cover card on the portfolio page.
              </p>
            </div>
          </Section>

          {/* Section 2: Gallery Images */}
          <Section icon={<ImageIcon size={18} />} title="Gallery Images">
            <p style={{ fontSize: "0.82rem", color: "var(--muted-2)", marginBottom: 20, lineHeight: 1.6 }}>
              Upload 5 gallery images: <strong>2 landscape</strong> (top row, 4:3) and <strong>3 portrait</strong> (bottom row, 3:4).
            </p>

            {/* Row 1 — 2 landscape */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              {[0, 1].map((i) => (
                <div key={i}>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
                    Landscape {i + 1}
                  </label>
                  <div
                    onClick={() => galleryRefs.current[i]?.click()}
                    style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", cursor: "pointer", background: "var(--surface)" }}
                    onMouseEnter={(e) => { const o = e.currentTarget.querySelector(".g-overlay") as HTMLElement; if (o) o.style.opacity = "1"; }}
                    onMouseLeave={(e) => { const o = e.currentTarget.querySelector(".g-overlay") as HTMLElement; if (o) o.style.opacity = "0"; }}
                  >
                    {form.images[i] ? (
                      <Image src={form.images[i]} alt={`Landscape ${i + 1}`} fill style={{ objectFit: "cover" }} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--muted)" }}>
                        <Upload size={22} strokeWidth={1.4} />
                        <span style={{ fontSize: "0.72rem" }}>4:3 · Landscape</span>
                      </div>
                    )}
                    <div className="g-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s", backdropFilter: "blur(4px)" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                          <Upload size={16} />
                        </div>
                        <span style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 600 }}>{form.images[i] ? "Change" : "Upload"}</span>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={(el) => { galleryRefs.current[i] = el; }}
                    type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const imgs = [...form.images];
                        imgs[i] = reader.result as string;
                        update("images", imgs);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Row 2 — 3 portrait */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[2, 3, 4].map((i) => (
                <div key={i}>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
                    Portrait {i - 1}
                  </label>
                  <div
                    onClick={() => galleryRefs.current[i]?.click()}
                    style={{ position: "relative", width: "100%", aspectRatio: "3/4", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", cursor: "pointer", background: "var(--surface)" }}
                    onMouseEnter={(e) => { const o = e.currentTarget.querySelector(".g-overlay") as HTMLElement; if (o) o.style.opacity = "1"; }}
                    onMouseLeave={(e) => { const o = e.currentTarget.querySelector(".g-overlay") as HTMLElement; if (o) o.style.opacity = "0"; }}
                  >
                    {form.images[i] ? (
                      <Image src={form.images[i]} alt={`Portrait ${i - 1}`} fill style={{ objectFit: "cover" }} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--muted)" }}>
                        <Upload size={22} strokeWidth={1.4} />
                        <span style={{ fontSize: "0.72rem" }}>3:4 · Portrait</span>
                      </div>
                    )}
                    <div className="g-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s", backdropFilter: "blur(4px)" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                          <Upload size={16} />
                        </div>
                        <span style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 600 }}>{form.images[i] ? "Change" : "Upload"}</span>
                      </div>
                    </div>
                  </div>
                  <input
                    ref={(el) => { galleryRefs.current[i] = el; }}
                    type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const imgs = [...form.images];
                        imgs[i] = reader.result as string;
                        update("images", imgs);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* Section 3: Descriptions */}
          <Section icon={<AlignLeft size={18} />} title="Descriptions">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Description 1</label>
                <textarea className="form-input" rows={4} placeholder="Main description — introduction to the project…"
                  style={{ resize: "vertical", lineHeight: 1.7 }}
                  value={form.description1} onChange={(e) => update("description1", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Description 2</label>
                <textarea className="form-input" rows={4} placeholder="Secondary description — highlights, story, atmosphere…"
                  style={{ resize: "vertical", lineHeight: 1.7 }}
                  value={form.description2} onChange={(e) => update("description2", e.target.value)} />
              </div>
            </div>
          </Section>

          {/* Section 4: Details */}
          <Section icon={<List size={18} />} title="Details">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Details 1</label>
                <textarea className="form-input" rows={5} placeholder="e.g. Land size: 150m²&#10;Building size: 80m²&#10;Bedrooms: 1&#10;Bathrooms: 1"
                  style={{ resize: "vertical", lineHeight: 1.8 }}
                  value={form.details1} onChange={(e) => update("details1", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Details 2</label>
                <textarea className="form-input" rows={5} placeholder="e.g. ROI: 12%&#10;Lease: 25 years&#10;Ownership: Leasehold&#10;Year Built: 2024"
                  style={{ resize: "vertical", lineHeight: 1.8 }}
                  value={form.details2} onChange={(e) => update("details2", e.target.value)} />
              </div>
            </div>
          </Section>

          {/* Section 5: Pricing & 360° Links */}
          <Section icon={<DollarSign size={18} />} title="Pricing & 360° Links">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <DollarSign size={13} /> Price
                </label>
                <input className="form-input" type="text" placeholder="e.g. Starting from $250,000"
                  value={form.price} onChange={(e) => update("price", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <Globe size={13} /> 360° URL A
                  </label>
                  <input className="form-input" type="url" placeholder="https://360.example.com/tour-a"
                    value={form.url_360a} onChange={(e) => update("url_360a", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <Globe size={13} /> 360° URL B
                  </label>
                  <input className="form-input" type="url" placeholder="https://360.example.com/tour-b"
                    value={form.url_360b} onChange={(e) => update("url_360b", e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <MapPin size={13} /> Google Maps URL
                </label>
                <input className="form-input" type="url" placeholder="https://maps.google.com/?q=..."
                  value={form.url_maps} onChange={(e) => update("url_maps", e.target.value)} />
              </div>
            </div>
          </Section>

          {/* Section 7: Map Location */}
          <Section icon={<MapPin size={18} />} title="Map Location">
            <p style={{ fontSize: "0.82rem", color: "var(--muted-2)", marginBottom: 16, lineHeight: 1.6 }}>
              Click on the map to place the marker. Fine-tune with the X / Y inputs below (values in %).
            </p>
            <div
              style={{ position: "relative", borderRadius: 14, overflow: "hidden", cursor: "crosshair", border: "1px solid var(--border)", userSelect: "none" }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.round(((e.clientX - rect.left) / rect.width)  * 1000) / 10;
                const y = Math.round(((e.clientY - rect.top)  / rect.height) * 1000) / 10;
                update("x", Math.min(100, Math.max(0, x)));
                update("y", Math.min(100, Math.max(0, y)));
              }}
            >
              <Image
                src="/assets/images/map.png"
                alt="Map"
                width={2594}
                height={1632}
                style={{ display: "block", width: "100%", height: "auto", pointerEvents: "none" }}
              />
              {form.x !== null && form.y !== null && (
                <div style={{
                  position: "absolute",
                  left: `${form.x}%`,
                  top:  `${form.y}%`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 10,
                }}>
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(184,146,42,0.25)",
                    animation: "pulse-ring 2s ease-in-out infinite",
                  }} />
                  <svg width="28" height="38" viewBox="0 0 28 38" fill="none"
                    style={{ filter: "drop-shadow(0 3px 8px rgba(184,146,42,0.55))", display: "block" }}>
                    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 24 14 24S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="#b8922a" />
                    <circle cx="14" cy="13" r="5.5" fill="#fff" opacity="0.9" />
                  </svg>
                </div>
              )}
              {form.x === null && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none",
                }}>
                  <div style={{ background: "rgba(28,21,16,0.55)", backdropFilter: "blur(6px)", color: "#fff", borderRadius: 10, padding: "10px 18px", fontSize: "0.8rem", fontWeight: 600 }}>
                    Click to place marker
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>X (%)</label>
                <input className="form-input" type="number" min={0} max={100} step={0.1}
                  placeholder="e.g. 46"
                  value={form.x ?? ""}
                  onChange={(e) => update("x", e.target.value === "" ? null : Math.min(100, Math.max(0, parseFloat(e.target.value))))} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Y (%)</label>
                <input className="form-input" type="number" min={0} max={100} step={0.1}
                  placeholder="e.g. 36"
                  value={form.y ?? ""}
                  onChange={(e) => update("y", e.target.value === "" ? null : Math.min(100, Math.max(0, parseFloat(e.target.value))))} />
              </div>
            </div>
          </Section>

          {/* Section 8: Visibility & Flags */}
          <Section icon={<Info size={18} />} title="Visibility & Flags">
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              {/* Featured toggle */}
              <div
                onClick={() => update("featured", !form.featured)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 20px", borderRadius: 12,
                  border: `1px solid ${form.featured ? "rgba(184,146,42,0.35)" : "var(--border-h)"}`,
                  background: form.featured ? "rgba(184,146,42,0.06)" : "var(--surface)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <Star size={14} color={form.featured ? "var(--accent-1)" : "var(--muted)"} fill={form.featured ? "var(--accent-1)" : "none"} />
                    Featured Project
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted-2)" }}>Shown larger in the 2-column top row</p>
                </div>
                <div style={{
                  width: 44, height: 24, borderRadius: 99,
                  background: form.featured ? "var(--accent-1)" : "rgba(28,21,16,0.15)",
                  position: "relative", transition: "background 0.2s", flexShrink: 0,
                }}>
                  <motion.div animate={{ x: form.featured ? 22 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    style={{ position: "absolute", top: 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            </div>
          </Section>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: "1px solid var(--border)", paddingTop: 24, marginBottom: 64 }}>
            <Link href="/admin/edit/projects" className="btn-outline" style={{ padding: "12px 28px", textDecoration: "none" }}>
              Cancel
            </Link>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={isSaving}
              style={{ padding: "12px 32px", gap: 8, opacity: isSaving ? 0.8 : 1 }}
            >
              {isSaving ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Save size={18} style={{ opacity: 0.5 }} />
                </motion.div>
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Saving…" : isNew ? "Create Project" : "Save Changes"}
            </button>
          </div>

        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
              zIndex: 9999, display: "flex", alignItems: "center", gap: 10,
              background: "#059669", color: "#fff",
              padding: "14px 24px", borderRadius: 14,
              boxShadow: "0 8px 32px rgba(5,150,105,0.35)",
              fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap",
            }}
          >
            <CheckCircle2 size={18} />
            {isNew ? "Project created!" : "Changes saved!"} Redirecting…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
