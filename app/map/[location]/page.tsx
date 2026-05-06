"use client";

import { use, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const details: Record<
  string,
  {
    name: string;
    label: string;
    address: string;
    description: string;
    description2: string;
    details: string;
    details2: string;
    coords: string;
    images: string[];
    view360a?: string;
    view360b?: string;
  }
> = {
  "canggu-residence": {
    name: "Canggu Residence",
    label: "Our Villa",
    address: "Jl. Raya Ubud, Ubud, Gianyar Regency, Bali 80571",
    description:
      "The Canggu Residence harmonizes sleek, minimalist architecture with the cozy comfort of a true sanctuary. Offering a fresh perspective on modern tropical living, this development creates a striking silhouette against the sky while providing the best offer to live in Canggu.",
    description2:
      "Secure the best spot to live in Canggu in a calm, welcoming neighborhood. Our residences come fully ready with modern kitchens, private gardens, and custom interior design. Enjoy the luxury of maintenance-free living with our dedicated cleaning teams.",
    details:
      "Find your perfect minimalist sanctuary in the heart of Bali. With custom furnishings, warm interiors, and a private pool, this is the best offer to live in Canggu.",
    details2:
      "Perfect for solo travelers or couples: one cozy bedroom, a homie kitchen, and breathable space filled with natural light. Complete with a private mini pool.",
    coords: "8°30'25\"S  115°15'45\"E",
    images: ["/assets/images/1_bed_new.png"],
  },
  "binging-residence": {
    name: "Binging Residence",
    label: "Our Villa",
    address: "Jl. Raya Ubud, Ubud, Gianyar Regency, Bali 80571",
    description:
      "The Bingin residence merges clean, minimalist design with the genuine warmth of a home. The Bingin Residence presents a contemporary interpretation of tropical living. The architecture creates a distinct visual rhythm against the skyline, balancing a clean, minimalist aesthetic with the warmth of a true home.",
    coords: "8°30'25\"S  115°15'45\"E",
    description2:
      "A quiet retreat designed for a slower pace. The space is compact yet feels open and airy, offering a genuine sense of calm and room to breathe. High ceilings amplify the sense of calm, while the living area transitions seamlessly to a private mini pool.",
    details:
      "This minimalist sanctuary redefines the weekend home. With warm interiors, custom furnishings, and a private pool, every corner feels intentionally 'homie'.",
    details2:
      "Designed as a compact retreat, the villa connects you instantly with nature. Enjoy your morning coffee by the private plunge pool, feeling the warmth and peace of a true second home.",
    images: [
      "/assets/images/binging/bingin-pool.png",
      "/assets/images/binging/bingin-living-room.png",
      "/assets/images/binging/bingin-bedroom.png",
      "/assets/images/binging/bingin-kitchen.png",
      "/assets/images/binging/bingin-bathroom.png",
      "/assets/images/binging/bingin-parking.png",
    ],
    view360a: "https://ccs.viewin360.co/Bingin",
    view360b: "https://ccs.viewin360.co/bingin2"
  },
};

// Parallax hero
function ParallaxHero({ images, name, label }: { images: string[]; name: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div ref={ref} style={{ height: "100svh", position: "relative", overflow: "hidden" }}>
      {/* Parallax image */}
      <motion.div style={{ y, position: "absolute", inset: "-15% 0", height: "130%" }}>
        <Image src={images[0]} alt={name} fill style={{ objectFit: "cover" }} priority />
      </motion.div>

      {/* Gradient layers */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(184,146,42,0.1) 0%, transparent 55%)" }} />

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
        style={{ position: "absolute", top: 28, left: "clamp(24px, 5vw, 56px)", zIndex: 10 }}
      >
        <Link
          href="/map"
          transitionTypes={["nav-back"]}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.5px",
            color: "rgba(255,255,255,0.85)", textDecoration: "none",
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.18)", padding: "8px 16px", borderRadius: 99,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Map
        </Link>
      </motion.div>

      {/* Hero title */}
      <motion.div
        style={{ opacity, position: "absolute", bottom: "clamp(56px, 8vh, 96px)", left: "clamp(24px, 5vw, 56px)", zIndex: 10 }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease }}
          style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "5px", textTransform: "uppercase", color: "#e8c870", marginBottom: 12 }}
        >
          {label}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease }}
          style={{
            fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 900,
            color: "#fff", lineHeight: 0.95, letterSpacing: "-2px",
            textShadow: "0 4px 40px rgba(0,0,0,0.3)",
          }}
        >
          {name.split(" ").map((word, i) => (
            <span key={i} style={{ display: "block" }}>{word}</span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.7, ease }}
          style={{ height: 2, width: 64, background: "#e8c870", transformOrigin: "left", marginTop: 24 }}
        />
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{ position: "absolute", bottom: 28, right: "clamp(24px, 5vw, 56px)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
      >
        <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", writingMode: "vertical-rl" }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }}
        />
      </motion.div>
    </div>
  );
}

// 3D tilt image card
function TiltCard({ src, alt, onClick }: { src: string; alt: string; featured?: boolean; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  function onMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const y = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    setTilt({ x: x * -10, y: y * 10 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onClick={onClick}
      style={{ perspective: "900px", cursor: onClick ? "pointer" : "default", height: "100%", width: "100%" }}
    >
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hovered ? 1.03 : 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", borderRadius: 16, overflow: "hidden" }}
      >
        <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} />

        {/* Glare on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />

        {/* Overlay on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {onClick && (
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#fff" }}>
              View
            </span>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Lightbox
function Lightbox({ images, index, onClose, onNav }: { images: string[]; index: number; onClose: () => void; onNav: (i: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", width: "min(90vw, 1100px)", aspectRatio: "16/9" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.3, ease }}
            style={{ position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden" }}
          >
            <Image src={images[index]} alt="" fill style={{ objectFit: "cover" }} />
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        {index > 0 && (
          <button onClick={() => onNav(index - 1)} style={navBtn("left")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}
        {index < images.length - 1 && (
          <button onClick={() => onNav(index + 1)} style={navBtn("right")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}

        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: -48, right: 0, background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "2px" }}>
          ESC ×
        </button>

        {/* Counter */}
        <div style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "2px", color: "rgba(255,255,255,0.4)" }}>
          {index + 1} / {images.length}
        </div>
      </div>
    </motion.div>
  );
}

function navBtn(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%", transform: "translateY(-50%)",
    [side]: -60,
    width: 44, height: 44, borderRadius: "50%",
    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)", color: "#fff",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  };
}

// Reveal wrapper
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export default function LocationDetailPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = use(params);
  const detail = details[location];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!detail) {
    return (
      <section style={{ minHeight: "calc(100vh - var(--nav-h))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)" }}>Location not found.</p>
      </section>
    );
  }

  const hasMultipleImages = detail.images.length > 1;

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={detail.images}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNav={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      {/* 1. Parallax hero */}
      <ParallaxHero images={detail.images} name={detail.name} label={detail.label} />

      {/* 2. Image gallery */}
      {hasMultipleImages && (
        <section style={{ padding: "clamp(64px, 8vh, 96px) clamp(24px, 5vw, 64px)" }}>
          <Reveal>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: 24 }}>
              Gallery
            </p>
          </Reveal>

          {/* Grid: 1 large + 2 tall on right, then 3 below */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "320px 220px", gap: 12 }}>
            {/* Featured */}
            <div style={{ gridRow: "1 / 3", gridColumn: "1 / 2" }}>
              <TiltCard src={detail.images[0]} alt={detail.name} featured onClick={() => setLightboxIndex(0)} />
            </div>
            {detail.images.slice(1, 3).map((src, i) => (
              <div key={i} style={{ gridColumn: `${i + 2} / ${i + 3}`, gridRow: "1 / 2" }}>
                <TiltCard src={src} alt={detail.name} onClick={() => setLightboxIndex(i + 1)} />
              </div>
            ))}
            {detail.images.slice(3, 6).map((src, i) => (
              <div key={i} style={{ gridRow: "2 / 3", gridColumn: `${i + 1} / ${i + 2}` }}>
                <TiltCard src={src} alt={detail.name} onClick={() => setLightboxIndex(i + 3)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. 360° Virtual Tour */}
      {(detail.view360a || detail.view360b) && (
        <section style={{ padding: "0 clamp(24px, 5vw, 64px) clamp(64px, 8vh, 96px)" }}>
          <Reveal>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: 24 }}>
              360° Virtual Tour
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: detail.view360a && detail.view360b ? "1fr 1fr" : "1fr", gap: 12 }}>
            {[detail.view360a, detail.view360b].filter(Boolean).map((url, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16/9",
                      borderRadius: 16,
                      overflow: "hidden",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 20,
                      cursor: "pointer",
                    }}
                  >
                    {/* Decorative rings */}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                      {[180, 260, 340].map((size, j) => (
                        <div key={j} style={{
                          position: "absolute",
                          width: size, height: size,
                          borderRadius: "50%",
                          border: "1px solid var(--border)",
                          opacity: 0.5 - j * 0.12,
                        }} />
                      ))}
                    </div>

                    {/* 360 icon */}
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: "var(--accent-1)", opacity: 0.9,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 32px rgba(184,146,42,0.3)",
                      }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
                          <path d="M12 2c-2.8 4-4 6.7-4 10s1.2 6 4 10"/>
                          <path d="M12 2c2.8 4 4 6.7 4 10s-1.2 6-4 10"/>
                          <path d="M2 12h20"/>
                        </svg>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "0.5px" }}>
                          Virtual Tour {i + 1}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "var(--muted-2)", margin: "4px 0 0", letterSpacing: "0.3px" }}>
                          Opens in new tab
                        </p>
                      </div>

                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1.5px",
                        textTransform: "uppercase", color: "var(--accent-1)",
                        border: "1px solid var(--accent-1)", borderRadius: 99,
                        padding: "6px 16px", opacity: 0.85,
                      }}>
                        Explore 360°
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* 4. Editorial content */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(48px, 6vh, 80px) clamp(24px, 5vw, 56px)" }}>

        {/* Coords */}
        <Reveal>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, border: "1px solid var(--border-h)", background: "var(--surface)", marginBottom: 40 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
            <span style={{ fontSize: "0.73rem", fontWeight: 600, letterSpacing: "0.5px", color: "var(--muted-2)", fontFamily: "var(--font-mono)" }}>
              {detail.coords}
            </span>
          </div>
        </Reveal>

        {/* Description */}
        <Reveal delay={0.05}>
          <p style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.2rem)", lineHeight: 1.9, color: "var(--muted-2)", fontWeight: 400, marginBottom: 0 }}>
            {detail.description}
          </p>
        </Reveal>

        {/* Decorative divider */}
        <Reveal delay={0.1}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "52px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 0l2 6h6l-5 3.6 1.9 6L8 12 3.1 15.6 5 9.6 0 6h6z" fill="var(--accent-1)" opacity="0.6" />
            </svg>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
        </Reveal>

        {/* Two-column details */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px 48px" }}>
          <Reveal delay={0.0}>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.85, color: "var(--muted-2)" }}>{detail.description2}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.85, color: "var(--muted-2)" }}>{detail.details}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.85, color: "var(--muted-2)", gridColumn: "1 / -1" }}>{detail.details2}</p>
          </Reveal>
        </div>

        {/* Address */}
        <Reveal delay={0.08}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "20px 24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, margin: "52px 0 0" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
            <span style={{ fontSize: "0.88rem", color: "var(--muted-2)", lineHeight: 1.6 }}>{detail.address}</span>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.04}>
          <div style={{ marginTop: 56, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary" transitionTypes={["nav-forward"]}>
              Book a Stay
            </Link>
            <Link href="/map" className="btn-outline" transitionTypes={["nav-back"]}>
              ← Back to Map
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
