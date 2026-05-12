"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
  order: number;
}

const statusColor: Record<string, string> = {
  Completed: "#059669",
  "Under Construction": "#b8922a",
  "Coming Soon": "#64748b",
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function ProjectCard({ project, index, large = false }: { project: Project; index: number; large?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={index * 0.06}>
      <Link href={`/project/${project.slug}`} transitionTypes={["nav-forward"]} style={{ textDecoration: "none", display: "block" }}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          style={{ position: "relative", width: "100%", aspectRatio: large ? "16/9" : "4/3", borderRadius: 20, overflow: "hidden", cursor: "pointer" }}
        >
          <motion.div animate={{ scale: hovered ? 1.07 : 1 }} transition={{ duration: 0.65, ease }} style={{ position: "absolute", inset: 0 }}>
            <Image src={project.src} alt={project.name} fill style={{ objectFit: "cover" }} />
          </motion.div>

          <motion.div
            animate={{ opacity: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.4 }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,21,16,0.85) 0%, rgba(28,21,16,0.3) 50%, transparent 100%)" }}
          />

          <div style={{ position: "absolute", top: 18, right: 18, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(206,196,177,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(206,196,177,0.25)", borderRadius: 99 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor[project.status] ?? "#64748b" }} />
            <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>{project.status}</span>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 22px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#e8c870" }}>{project.location}</p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
              <h3 style={{ fontSize: large ? "clamp(1.5rem, 3vw, 2.2rem)" : "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 200, letterSpacing: large ? "8px" : "5px", textTransform: "uppercase", color: "#fff", lineHeight: 1.1 }}>
                {project.name}
              </h3>
              <motion.div
                animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8 }}
                transition={{ duration: 0.3 }}
                style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: "rgba(184,146,42,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.div>
            </div>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", marginTop: 8, letterSpacing: "0.5px" }}>{project.units}</p>
          </div>
        </motion.div>
      </Link>
    </Reveal>
  );
}

const REGION_LABELS: Record<string, string> = {
  south: "South Bali",
  west:  "West Bali",
  north: "North Bali",
};

export default function ProjectsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const regionLabel = REGION_LABELS[slug] ?? "Our Projects";

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProjects() {
      try {
        let query = supabase
          .from("projects")
          .select("id, name, location, status, units, available, featured, src, slug, order")
          .order("order", { ascending: true });

        if (REGION_LABELS[slug]) {
          query = query.eq("region", slug);
        }

        const { data, error } = await query;

        if (!error && data) {
          setProjects(data as Project[]);
        }
      } catch {
        // no-op
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, [slug]);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <>
      {/* Header */}
      <section style={{ padding: "clamp(64px, 9vh, 112px) clamp(24px, 5vw, 80px) clamp(32px, 4vh, 48px)", position: "relative", overflow: "hidden" }}>
        <div className="orb orb-1" style={{ opacity: 0.35 }} />
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
          <h1 style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 200, letterSpacing: "10px", textTransform: "uppercase", lineHeight: 1.05, color: "var(--text)", marginBottom: 20 }}>
            {regionLabel} Projects
          </h1>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.85, color: "var(--muted-2)", maxWidth: 560 }}>
            Tiny Villa Bali specializes in creating exquisite tiny villas that offer a unique blend of comfort and style. Our projects are designed to provide the perfect escape, ensuring an unforgettable experience for our guests. We pride ourselves on our attention to detail and commitment to quality, making sure every tiny villa is a cozy retreat that feels like home.
          </p>
        </motion.div>
      </section>

      {/* Stats strip */}
      <Reveal>
        <div style={{ margin: "0 clamp(24px, 5vw, 80px) clamp(40px, 5vh, 64px)", display: "flex", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
          {[
            { value: `${projects.length}`, label: "Total Projects", accent: true },
            { value: `${projects.filter((p) => p.status === "Under Construction").length}`, label: "Under Construction", accent: false },
          ].map(({ value, label, accent }, i) => (
            <div key={label} style={{ flex: 1, padding: "44px 32px", background: "var(--bg)", textAlign: "center", borderLeft: i > 0 ? "1px solid var(--border)" : "none", position: "relative", overflow: "hidden" }}>
              <div className="gradient-text" style={{ fontSize: "clamp(2.4rem, 4vw, 3.6rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: 10 }}>
                {isLoading ? "—" : value}
              </div>
              <div style={{ fontSize: "0.62rem", color: "var(--muted-2)", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Project grid */}
      <div style={{ padding: "0 clamp(24px, 5vw, 80px) clamp(80px, 10vh, 120px)" }}>
        {!isLoading && projects.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--muted-2)", border: "1px dashed var(--border-h)", borderRadius: 20 }}>
            <p style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8 }}>No projects yet</p>
            <p style={{ fontSize: "0.85rem" }}>Projects in this region will appear here.</p>
          </div>
        )}
        {!isLoading && projects.length > 0 && (
          <>
            {featured.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 12, marginBottom: 12 }}>
                {featured.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} large />)}
              </div>
            )}
            {rest.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                {rest.map((p, i) => <ProjectCard key={p.slug} project={p} index={featured.length + i} />)}
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <section style={{ borderTop: "1px solid var(--border)", padding: "clamp(48px, 6vh, 72px) clamp(24px, 5vw, 80px) clamp(64px, 8vh, 100px)", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "var(--accent-1)", marginBottom: 16 }}>Interested?</p>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 200, letterSpacing: "6px", textTransform: "uppercase", marginBottom: 16 }}>Let's Talk</h2>
          <p style={{ color: "var(--muted-2)", maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.8, fontSize: "0.9rem" }}>
            Reach out to learn more about availability, pricing, and upcoming developments across Bali.
          </p>
          <Link href="/contact" className="btn-primary" transitionTypes={["nav-forward"]}>Get in Touch ↗</Link>
        </Reveal>
      </section>
    </>
  );
}
