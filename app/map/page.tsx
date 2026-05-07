"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Marker {
  slug: string;
  name: string;
  location: string;
  src: string;
  x: number;
  y: number;
}

export default function MapPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("slug, name, location, src, x, y")
          .not("x", "is", null)
          .not("y", "is", null)
          .order("order", { ascending: true });

        if (!error && data && data.length > 0) {
          setMarkers(data as Marker[]);
        }
      } catch {
        // no-op
      }
    }
    fetchMarkers();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        height: "calc(100vh - var(--nav-h))",
        width: "100%",
        position: "relative",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* Cinematic Header Overlay */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "var(--muted-2)",
            marginBottom: 8,
          }}
        >
          Master Plan
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          style={{
            fontSize: "3.5rem",
            fontWeight: 800,
            letterSpacing: "-2px",
            color: "var(--text)",
            margin: 0,
          }}
        >
          Project Map
        </motion.h1>
      </div>

      {/* Map Content */}
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "calc((100vh - var(--nav-h, 72px) - 80px) * 2594 / 1632)",
          }}
        >
          <Image
            src="/assets/images/map.png"
            alt="Villa Location Map"
            width={2594}
            height={1632}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              borderRadius: 14,
            }}
            priority
          />

          {markers.map((m, i) => (
            <motion.div
              key={m.slug}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease }}
              style={{
                position: "absolute",
                left: `${m.x}%`,
                top: `${m.y - 3}%`,
                transform: "translate(-50%, -100%)",
                zIndex: hovered === m.slug ? 100 : 10,
              }}
              onMouseEnter={() => setHovered(m.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                href={`/project/${m.slug}`}
                style={{ textDecoration: "none" }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(184,146,42,0.3)",
                    animation: "pulse-ring 2s ease-in-out infinite",
                    pointerEvents: "none",
                  }}
                />

                <motion.div
                  animate={{
                    scale: hovered === m.slug ? 1.25 : 1,
                    y: hovered === m.slug ? -5 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: "block",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <svg
                    width="28"
                    height="38"
                    viewBox="0 0 28 38"
                    fill="none"
                    style={{
                      filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
                    }}
                  >
                    <path
                      d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 24 14 24S28 23.333 28 14C28 6.268 21.732 0 14 0z"
                      fill="#b8922a"
                    />
                    <circle cx="14" cy="13" r="5.5" fill="#fff" opacity="0.9" />
                  </svg>
                </motion.div>

                <AnimatePresence>
                  {hovered === m.slug && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute",
                        bottom: "calc(100% + 12px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(12px)",
                        color: "#1a1a1a",
                        borderRadius: 14,
                        overflow: "hidden",
                        whiteSpace: "normal",
                        pointerEvents: "none",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                        width: 280,
                      }}
                    >
                      {m.src && (
                        <div style={{ position: "relative", width: "100%", height: 120 }}>
                          <Image
                            src={m.src}
                            alt={m.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                      <div style={{ padding: "12px 14px" }}>
                        <div style={{ fontSize: "0.9rem", fontWeight: 800, marginBottom: 2 }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.6, fontWeight: 500 }}>
                          {m.location}
                        </div>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          borderLeft: "7px solid transparent",
                          borderRight: "7px solid transparent",
                          borderTop: "7px solid rgba(255,255,255,0.95)",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer Instruction */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          color: "var(--muted-2)",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Click markers to explore projects
      </motion.div>
    </motion.section>
  );
}
