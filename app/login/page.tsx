"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000); // Simulate login
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--nav-h, 72px))', width: '100%', backgroundColor: 'var(--bg)' }}>
      {/* Left Side - Image (Hidden on smaller screens, shown on lg) */}
      <div className="hidden lg:flex" style={{ width: '50%', position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
        <Image
          src="/assets/images/1_bed_new.png"
          alt="Villa Serenara Interior"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
        
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px 40px 60px 40px', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontFamily: 'var(--font-geist-sans, Georgia, serif)', color: '#fff', marginBottom: '12px', lineHeight: 1.2, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              Experience unparalleled luxury at<br />Villa Serenara.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500, letterSpacing: '2px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              UBUD, BALI
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative' }}>
        
        {/* Fix for Webkit Autofill targeting .form-input specifically to blend with our theme */}
        <style dangerouslySetInnerHTML={{__html: `
          .form-input:-webkit-autofill,
          .form-input:-webkit-autofill:hover, 
          .form-input:-webkit-autofill:focus, 
          .form-input:-webkit-autofill:active{
              -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
              -webkit-text-fill-color: var(--text) !important;
          }
        `}} />

        <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ marginBottom: '40px' }}>
              <span className="section-label" style={{ marginBottom: '12px' }}>Admin Portal</span>
              <h1 className="section-title" style={{ marginBottom: '16px' }}>
                Login
              </h1>
              <p style={{ color: 'var(--muted-2)', fontSize: '1rem', lineHeight: 1.5 }}>
                Sign in to manage content of Villa Serenara website.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="password" className="form-label" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
                    Password
                  </label>
                  <Link href="#" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-1)', textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                  />
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

          </motion.div>
        </div>

        {/* Floating Orbs for extra detail on the right side */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0, opacity: 0.5 }}>
          <div className="orb orb-2" style={{ top: '10%', right: '-20%' }} />
          <div className="orb orb-3" style={{ bottom: '-10%', left: '10%' }} />
        </div>
      </div>
    </div>
  );
}
