"use client";

import { use, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
  units: string;
  available: boolean;
  featured: boolean;
  src: string;
  slug: string;
  images: string[] | null;
  description1: string | null;
  description2: string | null;
  details1: string | null;
  details2: string | null;
  price: string | null;
  url_360a: string | null;
  url_360b: string | null;
  url_maps: string | null;
}

// ─── Parallax hero ───────────────────────────────────────────────────────────
function ParallaxHero({ src, name }: { src: string; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div ref={ref} style={{ height: "100svh", position: "relative", overflow: "hidden" }}>
      <motion.div style={{ y, position: "absolute", inset: "-15% 0", height: "130%" }}>
        <Image src={src} alt={name} fill style={{ objectFit: "cover" }} priority />
      </motion.div>

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(184,146,42,0.1) 0%, transparent 55%)" }} />

      <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15, ease }}
        style={{ position: "absolute", top: 28, left: "clamp(24px, 5vw, 56px)", zIndex: 10 }}>
        <Link href="/projects" transitionTypes={["nav-back"]}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.5px", color: "rgba(255,255,255,0.85)", textDecoration: "none", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.18)", padding: "8px 16px", borderRadius: 99 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Projects
        </Link>
      </motion.div>

      <motion.div style={{ opacity, position: "absolute", bottom: "clamp(56px, 8vh, 96px)", left: "clamp(24px, 5vw, 56px)", zIndex: 10 }}>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25, ease }}
          style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "5px", textTransform: "uppercase", color: "#e8c870", marginBottom: 12 }}>
          Our Villa
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.35, ease }}
          style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900, color: "#fff", lineHeight: 0.95, letterSpacing: "-2px", textShadow: "0 4px 40px rgba(0,0,0,0.3)" }}>
          {name.split(" ").map((word, i) => <span key={i} style={{ display: "block" }}>{word}</span>)}
        </motion.h1>
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.7, delay: 0.7, ease }}
          style={{ height: 2, width: 64, background: "#e8c870", transformOrigin: "left", marginTop: 24 }} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
        style={{ position: "absolute", bottom: 28, right: "clamp(24px, 5vw, 56px)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", writingMode: "vertical-rl" }}>Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
      </motion.div>
    </div>
  );
}

// ─── 3D tilt card ────────────────────────────────────────────────────────────
function TiltCard({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  function onMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setTilt({ x: (((e.clientY - rect.top) / rect.height) * 2 - 1) * -10, y: (((e.clientX - rect.left) / rect.width) * 2 - 1) * 10 });
  }

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }} onClick={onClick}
      style={{ perspective: "900px", cursor: onClick ? "pointer" : "default", height: "100%", width: "100%", overflow: "hidden" }}>
      <motion.div animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hovered ? 1.06 : 1 }} transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
        <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} />
        <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.25 }}
          style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)", pointerEvents: "none" }} />
        <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {onClick && <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#fff" }}>View</span>}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onNav }: { images: string[]; index: number; onClose: () => void; onNav: (i: number) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "min(90vw, 1100px)", aspectRatio: "16/9" }}>
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.3, ease }}
            style={{ position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden" }}>
            <Image src={images[index]} alt="" fill style={{ objectFit: "cover" }} />
          </motion.div>
        </AnimatePresence>
        {index > 0 && <button onClick={() => onNav(index - 1)} style={navBtn("left")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg></button>}
        {index < images.length - 1 && <button onClick={() => onNav(index + 1)} style={navBtn("right")}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg></button>}
        <button onClick={onClose} style={{ position: "absolute", top: -48, right: 0, background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "2px" }}>ESC ×</button>
        <div style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2px", color: "rgba(255,255,255,0.4)" }}>{index + 1} / {images.length}</div>
      </div>
    </motion.div>
  );
}

function navBtn(side: "left" | "right"): React.CSSProperties {
  return { position: "absolute", top: "50%", transform: "translateY(-50%)", [side]: -60, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
}

function formatIDR(raw: string): string {
  const num = parseInt(raw.replace(/\D/g, ""), 10);
  if (isNaN(num)) return raw;
  return num.toLocaleString("id-ID");
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay, ease }}>
      {children}
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProject() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          setNotFound(true);
        } else {
          setProject(data as Project);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100svh" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: 40, height: 40, border: "3px solid rgba(184,146,42,0.2)", borderTopColor: "#b8922a", borderRadius: "50%" }} />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <section style={{ minHeight: "calc(100vh - var(--nav-h))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ color: "var(--muted)", fontSize: "1rem" }}>Project not found.</p>
        <Link href="/projects" className="btn-outline">← Back to Projects</Link>
      </section>
    );
  }

  const galleryImages = (project.images ?? []).filter(Boolean);
  const heroSrc = project.src || galleryImages[0] || "/assets/images/1_bed_new.png";
  const landscape = galleryImages.slice(0, 2);
  const portrait  = galleryImages.slice(2, 5);
  const has360    = project.url_360a || project.url_360b;

  return (
    <>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox images={galleryImages} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNav={setLightboxIndex} />
        )}
      </AnimatePresence>

      {/* 1. Parallax hero */}
      <ParallaxHero src={heroSrc} name={project.name} />

      {/* 2. Gallery */}
      {galleryImages.length > 0 && (
        <section style={{ padding: "clamp(48px, 6vh, 72px) clamp(24px, 5vw, 64px)" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
            <Reveal>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: 14 }}>Gallery</p>
            </Reveal>

            {landscape.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${landscape.length}, 1fr)`, gap: 8 }}>
                {landscape.map((src, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden" }}>
                      <TiltCard src={src} alt={project.name} onClick={() => setLightboxIndex(i)} />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {portrait.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${portrait.length}, 1fr)`, gap: 8 }}>
                {portrait.map((src, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: 12, overflow: "hidden" }}>
                      <TiltCard src={src} alt={project.name} onClick={() => setLightboxIndex(landscape.length + i)} />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. 360° Virtual Tour */}
      {has360 && (
        <section style={{ padding: "0 clamp(24px, 5vw, 64px) clamp(48px, 6vh, 72px)" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <Reveal>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: 14 }}>360° Virtual Tour</p>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: project.url_360a && project.url_360b ? "1fr 1fr" : "1fr", gap: 8 }}>
              {([project.url_360a, project.url_360b] as (string | null)[]).filter(Boolean).map((url, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <a href={url!} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                    <motion.div whileHover="hovered" whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", cursor: "pointer", background: "var(--surface)" }}>
                      <Image src={heroSrc} alt={`Virtual Tour ${i + 1}`} fill style={{ objectFit: "cover" }} />
                      <motion.div variants={{ hovered: { opacity: 1 }, initial: { opacity: 0.55 } }} initial="initial"
                        style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
                      <motion.div variants={{ hovered: { scale: 1.12 }, initial: { scale: 1 } }} transition={{ type: "spring", stiffness: 300, damping: 24 }}
                        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><polygon points="6,3 20,12 6,21" /></svg>
                        </div>
                      </motion.div>
                      <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}>Virtual Tour {i + 1}</span>
                        <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>360°</span>
                      </div>
                    </motion.div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Editorial content */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(48px, 6vh, 80px) clamp(24px, 5vw, 56px)" }}>

        {/* Price */}
        {project.price && (
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "stretch", marginBottom: 48, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(184,146,42,0.25)", boxShadow: "0 4px 32px rgba(184,146,42,0.08)" }}>
              {/* Accent bar */}
              <div style={{ width: 4, background: "linear-gradient(to bottom, #e8c870, #b8922a)", flexShrink: 0 }} />
              <div style={{ padding: "20px 28px", background: "linear-gradient(135deg, rgba(184,146,42,0.07) 0%, transparent 100%)" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "6px", textTransform: "uppercase", color: "var(--accent-1)", marginBottom: 8 }}>
                  IDR
                </p>
                <p style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 200, letterSpacing: "3px", color: "var(--text)", lineHeight: 1 }}>
                  {formatIDR(project.price)}
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* Description 1 */}
        {project.description1 && (
          <Reveal delay={0.05}>
            <p style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.2rem)", lineHeight: 1.9, color: "var(--muted-2)", fontWeight: 400, marginBottom: 0 }}>
              {project.description1}
            </p>
          </Reveal>
        )}

        {(project.description2 || project.details1 || project.details2) && (
          <Reveal delay={0.1}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "52px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 0l2 6h6l-5 3.6 1.9 6L8 12 3.1 15.6 5 9.6 0 6h6z" fill="var(--accent-1)" opacity="0.6" /></svg>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
          </Reveal>
        )}

        {/* Description 2 + Details grid */}
        {(project.description2 || project.details1 || project.details2) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 48px" }}>
            {project.description2 && (
              <Reveal delay={0.0}>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.85, color: "var(--muted-2)" }}>{project.description2}</p>
              </Reveal>
            )}
            {project.details1 && (
              <Reveal delay={0.08}>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.85, color: "var(--muted-2)" }}>{project.details1}</p>
              </Reveal>
            )}
            {project.details2 && (
              <Reveal delay={0.12}>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.85, color: "var(--muted-2)", gridColumn: "1 / -1" }}>{project.details2}</p>
              </Reveal>
            )}
          </div>
        )}

        {/* Location / Maps link */}
        <Reveal delay={0.08}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "20px 24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, margin: "52px 0 0" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
            {project.url_maps ? (
              <a href={project.url_maps} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.88rem", color: "var(--accent-1)", lineHeight: 1.6, textDecoration: "underline", textUnderlineOffset: 3 }}>
                {project.location}
              </a>
            ) : (
              <span style={{ fontSize: "0.88rem", color: "var(--muted-2)", lineHeight: 1.6 }}>{project.location}</span>
            )}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.04}>
          <div style={{ marginTop: 56, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary" transitionTypes={["nav-forward"]}>Book a Stay</Link>
            <Link href="/projects" className="btn-outline" transitionTypes={["nav-back"]}>← Back to Projects</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
