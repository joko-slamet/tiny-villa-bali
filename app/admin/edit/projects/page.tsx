"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, AlertCircle, CheckCircle2,
  MapPin, Home, Star, Eye, EyeOff, LayoutGrid, List,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { deleteProjectAction } from "./actions";

interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
  units: string;
  available: boolean;
  region: string;
  src: string;
  images: string[];
  slug: string;
  order: number;
}

const REGION_LABELS: Record<string, string> = {
  south: "South Bali",
  west:  "West Bali",
  north: "North Bali",
};

const statusColor: Record<string, { bg: string; text: string; dot: string }> = {
  Completed:    { bg: "rgba(5,150,105,0.08)",  text: "#059669", dot: "#059669"  },
  "Under Construction":{ bg: "rgba(184,146,42,0.08)", text: "#b8922a", dot: "#b8922a"  },
  "Coming Soon":{ bg: "rgba(100,116,139,0.08)",text: "#64748b", dot: "#64748b"  },
};



export default function AdminProjectsPage() {
  const [projects, setProjects]   = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const supabase = createClient();

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      setError("Could not connect to database.");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(project: Project) {
    setDeletingId(project.id);
    setConfirmDelete(null);
    setError(null);
    try {
      const res = await deleteProjectAction(project.id, [project.src, ...(project.images ?? [])]);
      if (!res.success) throw new Error(res.error);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      showSuccess(`"${project.name}" deleted.`);
    } catch (err: any) {
      setError(err.message || "Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  }

  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.status === "Completed").length,
    available: projects.filter((p) => p.available).length,
  };

  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-h, 72px))", backgroundColor: "var(--bg)", padding: "48px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>Projects</h1>
              <p style={{ color: "var(--muted-2)", fontSize: "0.9rem" }}>Manage all villa projects shown on the public portfolio.</p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* View Toggle */}
              <div style={{ display: "flex", background: "rgba(255,255,255,0.5)", padding: 4, borderRadius: 10, border: "1px solid var(--border)" }}>
                <button 
                  onClick={() => setViewMode("list")}
                  style={{ 
                    display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 7, border: "none",
                    background: viewMode === "list" ? "#fff" : "transparent",
                    color: viewMode === "list" ? "var(--text)" : "var(--muted-2)",
                    boxShadow: viewMode === "list" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  <List size={18} />
                </button>
                <button 
                  onClick={() => setViewMode("grid")}
                  style={{ 
                    display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 7, border: "none",
                    background: viewMode === "grid" ? "#fff" : "transparent",
                    color: viewMode === "grid" ? "var(--text)" : "var(--muted-2)",
                    boxShadow: viewMode === "grid" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  <LayoutGrid size={18} />
                </button>
              </div>

              <Link
                href="/admin/edit/projects/new"
                className="btn-primary"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", textDecoration: "none" }}
              >
                <Plus size={18} />
                Add Project
              </Link>
            </div>
          </div>

          {/* Toasts */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#dc2626", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(220,38,38,0.2)", display: "flex", alignItems: "center", gap: 10, marginBottom: 24, fontSize: "0.9rem", fontWeight: 500 }}>
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ backgroundColor: "rgba(5,150,105,0.08)", color: "#059669", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(5,150,105,0.2)", display: "flex", alignItems: "center", gap: 10, marginBottom: 24, fontSize: "0.9rem", fontWeight: 600 }}>
                <CheckCircle2 size={18} /> {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 32 }}>
            {[
              { label: "Total", value: stats.total },
              { label: "Completed", value: stats.completed },
              { label: "Available", value: stats.available },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.6)", padding: "20px 24px", textAlign: "center" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.5px", background: "var(--grad)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{value}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted-2)", letterSpacing: "1px", textTransform: "uppercase", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Loading */}
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--accent-1)", borderRadius: "50%" }} />
            </div>
          ) : (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: viewMode === "list" ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", 
              gap: viewMode === "list" ? 12 : 24 
            }}>
              {projects.map((project, i) => {
                const sc = statusColor[project.status] ?? statusColor["Coming Soon"];
                const isDeleting = deletingId === project.id;

                if (viewMode === "list") {
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: isDeleting ? 0.4 : 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid var(--border)",
                        borderRadius: 16,
                        overflow: "hidden",
                        display: "grid",
                        gridTemplateColumns: "120px 1fr auto",
                        alignItems: "center",
                        gap: 0,
                        transition: "box-shadow 0.2s",
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{ position: "relative", height: 90, flexShrink: 0 }}>
                        {project.src ? (
                          <Image src={project.src} alt={project.name} fill style={{ objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
                            <Home size={24} strokeWidth={1.2} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                        <div style={{ minWidth: 180 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>{project.name}</span>

                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted-2)", fontSize: "0.8rem" }}>
                            <MapPin size={12} />
                            {project.location}
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: sc.bg, border: `1px solid ${sc.dot}22` }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: sc.text, letterSpacing: "0.5px" }}>{project.status}</span>
                        </div>

                        {project.region && REGION_LABELS[project.region] && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 99, background: "rgba(184,146,42,0.07)", border: "1px solid rgba(184,146,42,0.2)" }}>
                            <MapPin size={11} color="#b8922a" />
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#b8922a", letterSpacing: "0.5px" }}>{REGION_LABELS[project.region]}</span>
                          </div>
                        )}

                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {project.available ? (
                            <><Eye size={14} color="#059669" /><span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 600 }}>Available</span></>
                          ) : (
                            <><EyeOff size={14} color="var(--muted)" /><span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 500 }}>Not Available</span></>
                          )}
                        </div>

                        <span style={{ fontSize: "0.78rem", color: "var(--muted-2)" }}>{project.units}</span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 20px" }}>
                        <Link
                          href={`/admin/edit/projects/${project.slug}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "8px 16px", borderRadius: 10,
                            background: "var(--surface)", border: "1px solid var(--border-h)",
                            color: "var(--text)", textDecoration: "none",
                            fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap",
                            transition: "all 0.2s",
                          }}
                        >
                          <Edit2 size={14} /> Edit
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(project)}
                          disabled={isDeleting}
                          style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: 36, height: 36, borderRadius: 10,
                            background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.2)",
                            color: "#dc2626", cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </motion.div>
                  );
                }

                {/* Grid Mode */}
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isDeleting ? 0.4 : 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid var(--border)",
                      borderRadius: 20,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                    }}
                  >
                    {/* Thumbnail Grid */}
                    <div style={{ position: "relative", height: 200, width: "100%" }}>
                      {project.src ? (
                        <Image src={project.src} alt={project.name} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
                          <Home size={32} strokeWidth={1.2} />
                        </div>
                      )}
                      
                      {/* Floating Badges */}
                      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 6 }}>

                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, background: sc.bg, border: `1px solid ${sc.dot}22`, backdropFilter: "blur(4px)" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: sc.text, letterSpacing: "0.5px", textTransform: "uppercase" }}>{project.status}</span>
                        </div>
                        {project.region && REGION_LABELS[project.region] && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, background: "rgba(184,146,42,0.15)", border: "1px solid rgba(184,146,42,0.3)", backdropFilter: "blur(4px)" }}>
                            <MapPin size={10} color="#b8922a" />
                            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#b8922a", letterSpacing: "0.5px", textTransform: "uppercase" }}>{REGION_LABELS[project.region]}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ marginBottom: 16 }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>{project.name}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--muted-2)", fontSize: "0.85rem" }}>
                          <MapPin size={14} />
                          {project.location}
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--muted-2)", fontWeight: 500 }}>{project.units}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {project.available ? (
                            <><Eye size={14} color="#059669" /><span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700 }}>Available</span></>
                          ) : (
                            <><EyeOff size={14} color="var(--muted)" /><span style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600 }}>Not Available</span></>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 48px", gap: 8, padding: "0 20px 20px" }}>
                      <Link
                        href={`/admin/edit/projects/${project.slug}`}
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                          padding: "10px", borderRadius: 12,
                          background: "var(--text)", color: "#fff", textDecoration: "none",
                          fontSize: "0.85rem", fontWeight: 700,
                          transition: "all 0.2s",
                        }}
                      >
                        <Edit2 size={15} /> Edit Details
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(project)}
                        disabled={isDeleting}
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          borderRadius: 12,
                          background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.1)",
                          color: "#dc2626", cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {/* Empty state */}
              {projects.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--muted-2)", background: "rgba(255,255,255,0.5)", borderRadius: 16, border: "1px dashed var(--border-h)" }}>
                  <Home size={40} strokeWidth={1} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <p style={{ fontWeight: 600, marginBottom: 8 }}>No projects yet</p>
                  <p style={{ fontSize: "0.85rem" }}>Click "Add Project" to create your first one.</p>
                </div>
              )}
            </div>
          )}


        </motion.div>
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: 20, padding: 32, maxWidth: 420, width: "90%", boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
            >
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(220,38,38,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Trash2 size={22} color="#dc2626" />
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 8 }}>Delete Project?</h3>
              <p style={{ color: "var(--muted-2)", fontSize: "0.9rem", marginBottom: 24, lineHeight: 1.6 }}>
                "<strong>{confirmDelete.name}</strong>" will be permanently removed from the database and its image deleted from storage. This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="btn-outline"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  style={{ flex: 1, padding: "12px 0", borderRadius: 50, background: "#dc2626", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
