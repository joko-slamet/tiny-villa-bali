"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Project {
  name: string;
  location: string;
  status: string;
  units: string;
  available: boolean;
  src: string;
  slug: string;
}

const FALLBACK: Project[] = [
  { name: "Canggu Residence",  location: "Canggu, Bali",   status: "Completed",          units: "12 units · 1 bedroom", available: false, src: "/assets/images/1_bed_new.png",                  slug: "canggu-residence"  },
  { name: "Bingin Residence",  location: "Bingin, Bali",   status: "Completed",          units: "16 units · 1 bedroom", available: true,  src: "/assets/images/binging/bingin-pool.png",        slug: "binging-residence" },
  { name: "Seminyak Villas",   location: "Seminyak, Bali", status: "Under Construction", units: "8 units · 2 bedroom",  available: false, src: "/assets/images/binging/bingin-bedroom.png",     slug: "seminyak-villas"   },
  { name: "Ubud Retreat",      location: "Ubud, Bali",     status: "Coming Soon",        units: "6 units · 3 bedroom",  available: false, src: "/assets/images/binging/bingin-living-room.png", slug: "ubud-retreat"      },
  { name: "Jimbaran Estate",   location: "Jimbaran, Bali", status: "Coming Soon",        units: "4 units · 4 bedroom",  available: false, src: "/assets/images/binging/bingin-kitchen.png",     slug: "jimbaran-estate"   },
  { name: "Uluwatu Cliff",     location: "Uluwatu, Bali",  status: "Under Construction", units: "10 units · 2 bedroom", available: false, src: "/assets/images/binging/bingin-parking.png",     slug: "uluwatu-cliff"     },
];

const statusColor: Record<string, string> = {
  Completed: "#059669",
  "Under Construction": "#b8922a",
  "Coming Soon": "#64748b",
};

const cardConfigs: Record<
  number,
  { x: number; rotateY: number; scale: number; z: number; opacity: number; brightness: number }
> = {
  [-2]: { x: -560, rotateY: 62,  scale: 0.55, z: -240, opacity: 0.35, brightness: 0.7  },
  [-1]: { x: -300, rotateY: 48,  scale: 0.78, z: -110, opacity: 0.65, brightness: 0.82 },
  [0]:  { x: 0,    rotateY: 0,   scale: 1.0,  z: 0,    opacity: 1.0,  brightness: 1.0  },
  [1]:  { x: 300,  rotateY: -48, scale: 0.78, z: -110, opacity: 0.65, brightness: 0.82 },
  [2]:  { x: 560,  rotateY: -62, scale: 0.55, z: -240, opacity: 0.35, brightness: 0.7  },
};

const CARD_W = 480;
const CARD_H = 360;

function CoverflowStage({ projects }: { projects: Project[] }) {
  const [current, setCurrent] = useState(0);
  const centerCardRef = useRef<HTMLDivElement>(null);
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-1, 1], [14, -14]), { stiffness: 90, damping: 22 });
  const tiltY = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 90, damping: 22 });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft")  setCurrent((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(projects.length - 1, c + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projects.length]);

  // clamp current index when projects length changes
  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, projects.length - 1)));
  }, [projects.length]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = centerCardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width * 2 - 1);
    my.set((e.clientY - rect.top)  / rect.height * 2 - 1);
    setGlare({
      x: (e.clientX - rect.left) / rect.width * 100,
      y: (e.clientY - rect.top)  / rect.height * 100,
    });
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  if (projects.length === 0) return null;

  const proj     = projects[current];
  const padIndex = String(current + 1).padStart(2, "0");
  const padTotal = String(projects.length).padStart(2, "0");

  return (
    <section
      style={{
        height: "calc(100svh - var(--nav-h))",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="orb orb-1" style={{ opacity: 0.5 }} />
      <div className="orb orb-3" style={{ opacity: 0.3 }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease }}
          style={{
            position: "absolute",
            width: 640, height: 420, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(184,146,42,0.22) 0%, transparent 70%)",
            filter: "blur(72px)", pointerEvents: "none", zIndex: 0,
          }}
        />
      </AnimatePresence>

      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -28, 0], opacity: [0.12, 0.4, 0.12], x: [0, (i % 2 === 0 ? 1 : -1) * 10, 0] }}
          transition={{ duration: 3 + (i * 0.37) % 3, repeat: Infinity, delay: (i * 0.29) % 3, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: 2 + (i % 3), height: 2 + (i % 3), borderRadius: "50%",
            background: i % 4 === 0 ? "var(--accent-1)" : "rgba(28,21,16,0.25)",
            left: `${8 + (i * 5.3) % 84}%`, top: `${10 + (i * 7.1) % 80}%`,
            pointerEvents: "none", zIndex: 0,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}
        style={{ position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", alignItems: "center", gap: 16 }}
      >
        <div style={{ width: 32, height: 1, background: "var(--border-h)" }} />
        <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "5px", textTransform: "uppercase", color: "var(--muted)" }}>Our Projects</span>
        <div style={{ width: 32, height: 1, background: "var(--border-h)" }} />
      </motion.div>

      {/* 3D Stage */}
      <div style={{ position: "relative", width: "100%", height: CARD_H + 80, perspective: "1400px", perspectiveOrigin: "50% 50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
        {projects.map((project, index) => {
          const pos        = index - current;
          const clampedPos = Math.max(-2, Math.min(2, pos));
          if (Math.abs(pos) > 2) return null;
          const cfg      = cardConfigs[clampedPos];
          const isCenter = pos === 0;

          return (
            <motion.div
              key={project.slug}
              animate={{ x: cfg.x, rotateY: cfg.rotateY, scale: cfg.scale, z: cfg.z, opacity: cfg.opacity }}
              transition={{ type: "spring", stiffness: 220, damping: 30 }}
              onClick={isCenter ? undefined : () => setCurrent(index)}
              style={{
                position: "absolute", width: CARD_W, height: CARD_H,
                transformStyle: "preserve-3d", zIndex: 5 - Math.abs(pos),
                cursor: isCenter ? "default" : "pointer",
                filter: isCenter ? "none" : `brightness(${cfg.brightness}) blur(${Math.abs(pos) * 1.2}px)`,
              }}
            >
              {isCenter ? (
                <motion.div
                  ref={centerCardRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={handleMouseLeave}
                  style={{ width: "100%", height: "100%", rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d", borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 100px rgba(28,21,16,0.28), 0 0 0 1px rgba(28,21,16,0.06)" }}
                >
                  <Image src={project.src} alt={project.name} fill style={{ objectFit: "cover" }} priority />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,21,16,0.65) 0%, rgba(28,21,16,0.1) 55%, transparent 100%)" }} />

                  <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
                    style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.2) 0%, transparent 55%)`, pointerEvents: "none" }} />

                  <div style={{ position: "absolute", top: 18, left: 18, display: "flex", alignItems: "center", gap: 6 }}>
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      style={{ width: 7, height: 7, borderRadius: "50%", background: project.available ? "#059669" : "#94a3b8", boxShadow: project.available ? "0 0 10px rgba(5,150,105,0.6)" : "none" }} />
                    <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: project.available ? "rgba(167,243,208,0.9)" : "rgba(255,255,255,0.4)" }}>
                      {project.available ? "Available" : "Not Available"}
                    </span>
                  </div>

                  <div style={{ position: "absolute", top: 18, right: 18, padding: "5px 11px", background: "rgba(206,196,177,0.2)", backdropFilter: "blur(12px)", border: "1px solid rgba(206,196,177,0.3)", borderRadius: 99, display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: statusColor[project.status] }} />
                    <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>{project.status}</span>
                  </div>

                  <div style={{ position: "absolute", bottom: 18, right: 18 }}>
                    <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px" }}>{project.units}</span>
                  </div>
                </motion.div>
              ) : (
                <div style={{ width: "100%", height: "100%", borderRadius: 20, overflow: "hidden", boxShadow: "0 16px 48px rgba(28,21,16,0.2)" }}>
                  <Image src={project.src} alt={project.name} fill style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(206,196,177,0.15)" }} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Project info */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginTop: 40, minHeight: 120 }}>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "var(--accent-1)", marginBottom: 10 }}>{proj.location}</p>
            <h2 style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)", fontWeight: 200, letterSpacing: "12px", textTransform: "uppercase", color: "var(--text)", lineHeight: 1, marginBottom: 20 }}>
              {proj.name}
            </h2>
            <Link href={`/project/${proj.slug}`} transitionTypes={["nav-forward"]}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--accent-1)", textDecoration: "none", border: "1px solid var(--border-h)", padding: "10px 22px", borderRadius: 99, background: "var(--surface)", backdropFilter: "blur(8px)" }}>
              View Project
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav arrows + dots */}
      <div style={{ position: "absolute", bottom: 36, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <motion.button onClick={() => setCurrent((c) => Math.max(0, c - 1))} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} disabled={current === 0}
          style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border-h)", color: current === 0 ? "rgba(28,21,16,0.2)" : "var(--text)", cursor: current === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </motion.button>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "2px", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>{padIndex}</span>
          <div style={{ display: "flex", gap: 6 }}>
            {projects.map((_, i) => (
              <motion.button key={i} onClick={() => setCurrent(i)}
                animate={{ width: i === current ? 24 : 6, background: i === current ? "var(--accent-1)" : "rgba(28,21,16,0.18)" }}
                transition={{ duration: 0.3, ease }}
                style={{ height: 6, borderRadius: 99, border: "none", cursor: "pointer", padding: 0 }} />
            ))}
          </div>
          <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "2px", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>{padTotal}</span>
        </div>

        <motion.button onClick={() => setCurrent((c) => Math.min(projects.length - 1, c + 1))} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} disabled={current === projects.length - 1}
          style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border-h)", color: current === projects.length - 1 ? "rgba(28,21,16,0.2)" : "var(--text)", cursor: current === projects.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </motion.button>
      </div>

      <motion.div animate={{ y: [0, 8, 0], opacity: [0.35, 0.7, 0.35] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: 36, right: 40, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, var(--muted), transparent)" }} />
        <span style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", writingMode: "vertical-rl" }}>Scroll</span>
      </motion.div>
    </section>
  );
}

function ListItem({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.45"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [38, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  const y       = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const [hovered, setHovered] = useState(false);
  const padded = String(index + 1).padStart(2, "0");

  return (
    <motion.div ref={ref} style={{ rotateX, opacity, y, transformPerspective: 900, transformOrigin: "top center" }}>
      <Link href={`/project/${project.slug}`} transitionTypes={["nav-forward"]} style={{ textDecoration: "none", display: "block" }}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          style={{ display: "grid", gridTemplateColumns: "80px 1fr 320px", alignItems: "center", gap: 32, padding: "32px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
        >
          <motion.span animate={{ color: hovered ? "var(--accent-1)" : "rgba(28,21,16,0.07)" }} transition={{ duration: 0.25 }}
            style={{ fontSize: "clamp(2.5rem, 4vw, 3.8rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, userSelect: "none" }}>
            {padded}
          </motion.span>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: statusColor[project.status] }} />
              <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)" }}>{project.status}</span>
              <span style={{ fontSize: "0.6rem", color: "var(--border-h)" }}>·</span>
              <span style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: project.available ? "#059669" : "var(--muted)" }}>
                {project.available ? "Available" : "Not Available"}
              </span>
            </div>
            <motion.h3 animate={{ x: hovered ? 8 : 0, color: hovered ? "var(--text)" : "var(--muted-2)" }} transition={{ duration: 0.3, ease }}
              style={{ fontSize: "clamp(1.3rem, 2.5vw, 2rem)", fontWeight: 200, letterSpacing: "6px", textTransform: "uppercase", lineHeight: 1.1, marginBottom: 8 }}>
              {project.name}
            </motion.h3>
            <p style={{ fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.5px" }}>{project.location} · {project.units}</p>
          </div>

          <motion.div animate={{ scale: hovered ? 1.04 : 1, rotateY: hovered ? -4 : 0 }} transition={{ duration: 0.5, ease }}
            style={{ position: "relative", height: 100, borderRadius: 12, overflow: "hidden", transformStyle: "preserve-3d", boxShadow: hovered ? "0 16px 48px rgba(28,21,16,0.22)" : "0 4px 16px rgba(28,21,16,0.12)", transition: "box-shadow 0.4s ease" }}>
            <Image src={project.src} alt={project.name} fill style={{ objectFit: "cover" }} />
            <motion.div animate={{ opacity: hovered ? 0 : 0.3 }} style={{ position: "absolute", inset: 0, background: "var(--bg)" }} />
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ProjectV2Page() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("name, location, status, units, available, src, slug")
          .order("order", { ascending: true });

        if (error || !data || data.length === 0) {
          setProjects(FALLBACK);
        } else {
          setProjects(data as Project[]);
        }
      } catch {
        setProjects(FALLBACK);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100svh", background: "var(--bg)" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: 40, height: 40, border: "3px solid rgba(184,146,42,0.2)", borderTopColor: "#b8922a", borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <>
      <CoverflowStage projects={projects} />

      <section style={{ background: "var(--bg)", padding: "clamp(64px, 8vh, 96px) clamp(40px, 7vw, 100px)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 56, flexWrap: "wrap", gap: 16 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "5px", textTransform: "uppercase", color: "var(--accent-1)", marginBottom: 10 }}>Full Portfolio</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 200, letterSpacing: "8px", textTransform: "uppercase", color: "var(--text)" }}>All Projects</h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15, ease }}
            style={{ fontSize: "0.85rem", color: "var(--muted-2)", maxWidth: 300, lineHeight: 1.8 }}>
            Each property is a carefully considered response to its landscape — where architecture meets the soul of Bali.
          </motion.p>
        </div>

        <div style={{ height: 1, background: "var(--border)", marginBottom: 0 }} />
        <div style={{ perspective: "1000px" }}>
          {projects.map((project, i) => (
            <ListItem key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>

      <section style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", padding: "clamp(64px, 8vh, 96px) clamp(40px, 7vw, 100px)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
          <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "6px", textTransform: "uppercase", color: "var(--accent-1)", marginBottom: 20 }}>Ready to invest?</p>
          <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 200, letterSpacing: "14px", textTransform: "uppercase", color: "var(--text)", lineHeight: 1, marginBottom: 28 }}>
            Let's Build<br />Together
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--muted-2)", maxWidth: 380, margin: "0 auto 40px", lineHeight: 1.8 }}>
            Reach out to explore availability, pricing, and upcoming developments across Bali's most coveted locations.
          </p>
          <Link href="/contact" className="btn-primary" transitionTypes={["nav-forward"]}>Get in Touch ↗</Link>
        </motion.div>
      </section>
    </>
  );
}
