"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const REGIONS = [
  { id: "north", label: "North Bali Projects", x: 70, y: 43, yMobile: 40 },
  { id: "west",  label: "West Bali Projects",  x: 52, y: 54, yMobile: 52 },
  { id: "south", label: "South Bali Projects", x: 55, y: 74, yMobile: 66 },
];

type RegionId = typeof REGIONS[number]["id"];

interface RegionInfo {
  count: number;
  locations: string[];
}

export default function MapPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [regionData, setRegionData] = useState<Record<string, RegionInfo>>({});
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  const supabase = createClient();

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("region, location")
          .not("region", "is", null);

        if (error || !data) return;

        const map: Record<string, RegionInfo> = {};
        for (const row of data) {
          if (!row.region) continue;
          if (!map[row.region]) map[row.region] = { count: 0, locations: [] };
          map[row.region].count++;
          const loc = row.location?.split(",")[0]?.trim();
          if (loc && !map[row.region].locations.includes(loc)) {
            map[row.region].locations.push(loc);
          }
        }
        setRegionData(map);
      } catch {
        // no-op
      }
    }
    fetchRegions();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ height: "calc(100vh - var(--nav-h))", width: "100%", position: "relative", background: "var(--bg)", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", top: 40, left: 40, zIndex: 50, pointerEvents: "none" }}>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          style={{ fontSize: "3.5rem", fontWeight: 800, letterSpacing: "-2px", color: "var(--text)", margin: 0 }}
        >
          Project Map
        </motion.h1>
      </div>

      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(16px, 3vw, 40px)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease }}
          style={{ position: "relative", width: "100%", maxWidth: "calc((100svh - var(--nav-h, 72px) - clamp(32px, 6vw, 80px)) * 2594 / 1632)" }}
        >
          <Image
            src="/assets/images/map.png"
            alt="Villa Location Map"
            width={2594}
            height={1632}
            style={{ display: "block", width: "100%", height: "auto", borderRadius: 14, filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.38)) drop-shadow(0 3px 10px rgba(0,0,0,0.22))" }}
            priority
          />

          {REGIONS.map((region, i) => {
            const info = regionData[region.id as RegionId];
            const locations = info?.locations ?? [];
            const displayed = locations.slice(0, 4);
            const extra = locations.length > 4 ? locations.length - 4 : 0;

            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.15, ease }}
                style={{
                  position: "absolute",
                  left: `${region.x}%`,
                  top: `${windowWidth < 768 ? region.yMobile : region.y}%`,
                  transform: "translate(-50%, -100%)",
                  zIndex: hovered === region.id ? 100 : 10,
                }}
                onMouseEnter={() => setHovered(region.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <Link href={`/projects/${region.id}`} style={{ textDecoration: "none" }}>
                  <span style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "clamp(24px, 3.2vw, 36px)",
                    height: "clamp(24px, 3.2vw, 36px)",
                    borderRadius: "50%",
                    background: "rgba(184,146,42,0.3)",
                    animation: "pulse-ring 2s ease-in-out infinite",
                    pointerEvents: "none",
                  }} />

                  <motion.div
                    animate={{ scale: hovered === region.id ? 1.2 : 1, y: hovered === region.id ? -6 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "block", cursor: "pointer", position: "relative" }}
                  >
                    <svg width="36" height="48" viewBox="0 0 28 38" fill="none" style={{ width: "clamp(24px, 3.2vw, 36px)", height: "clamp(32px, 4.3vw, 48px)", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}>
                      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 24 14 24S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="#b8922a" />
                      <circle cx="14" cy="13" r="5.5" fill="#fff" opacity="0.9" />
                    </svg>
                  </motion.div>

                  <AnimatePresence>
                    {hovered === region.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: "absolute",
                          bottom: "calc(100% + 14px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "rgba(255,255,255,0.97)",
                          backdropFilter: "blur(16px)",
                          color: "#1a1a1a",
                          borderRadius: 16,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                          minWidth: "min(220px, calc(100vw - 48px))",
                        }}
                      >
                        <div style={{ height: 3, background: "linear-gradient(to right, #e8c870, #b8922a)" }} />
                        <div style={{ padding: "14px 18px 16px" }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 800, marginBottom: 10, letterSpacing: "-0.3px" }}>
                            {region.label}
                          </div>
                          {locations.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 6px", marginBottom: 10 }}>
                              {displayed.map(loc => (
                                <span key={loc} style={{ fontSize: "0.67rem", fontWeight: 600, color: "#555", background: "rgba(0,0,0,0.06)", padding: "2px 8px", borderRadius: 99 }}>
                                  {loc}
                                </span>
                              ))}
                              {extra > 0 && (
                                <span style={{ fontSize: "0.67rem", fontWeight: 600, color: "#b8922a", padding: "2px 4px" }}>
                                  +{extra} more
                                </span>
                              )}
                            </div>
                          )}
                          {info && (
                            <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#b8922a" }}>
                              {info.count} project{info.count !== 1 ? "s" : ""} &rarr;
                            </div>
                          )}
                        </div>
                        <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "7px solid rgba(255,255,255,0.97)" }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ position: "absolute", bottom: 40, right: 40, color: "var(--muted-2)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}
      >
        Click markers to explore projects
      </motion.div>
    </motion.section>
  );
}
