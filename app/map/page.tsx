'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function MapPage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vh, 80px) clamp(24px, 6vw, 80px)',
        background: 'var(--bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 900 }}>
        <motion.p
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          Location
        </motion.p>

        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
        >
          Find Us
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.28, ease }}
          style={{
            marginTop: 32,
            borderRadius: 24,
            overflow: 'hidden',
          }}
        >
          <Image
            src="/assets/images/map.png"
            alt="Villa Serenara Location Map"
            width={1800}
            height={900}
            style={{ display: 'block', width: '100%', height: 'auto' }}
            priority
          />
        </motion.div>
      </div>
    </motion.section>
  )
}
