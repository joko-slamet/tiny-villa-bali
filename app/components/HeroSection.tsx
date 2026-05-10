'use client'

import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  Variants,
} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ProcessOfBuying from './ProcessOfBuying'

interface HeroSlide {
  id: string;
  bg: string;
  src: string;
  slug: string;
  order: number;
}

const sweepVariants: Variants = {
  enter: (dir: number) => ({ rotateY: dir > 0 ? -75 : 75, rotateX: dir > 0 ? -22 : 22, y: dir > 0 ? -60 : 60, opacity: 0 }),
  center: {
    rotateY: 0, rotateX: 0, y: 0, opacity: 1,
    transition: {
      duration: 2.2,
      ease: [0.4, 0, 0.2, 1],
      opacity: { delay: 1.0, duration: 1.2, ease: "easeInOut" }
    }
  },
  exit: (dir: number) => ({
    rotateY: dir > 0 ? 75 : -75, rotateX: dir > 0 ? 22 : -22, y: dir > 0 ? 60 : -60, opacity: 0,
    transition: {
      duration: 2.2,
      ease: [0.4, 0, 0.2, 1],
      opacity: { duration: 1.0, ease: "easeInOut" }
    }
  }),
}

export default function HeroSection() {
  const tiltRef  = useRef<HTMLDivElement>(null)
  const cooldown = useRef(false)

  const [images, setImages]       = useState<HeroSlide[]>([])
  const [current, setCurrent]     = useState(0)
  const [direction, setDirection] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const clickSound = useRef<HTMLAudioElement | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchSlides()
    clickSound.current = new Audio('/assets/audio/click.wav')
    clickSound.current.volume = 0.5
    clickSound.current.load()
  }, [])

  const fetchSlides = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order', { ascending: true })

      if (error) throw error
      if (data && data.length > 0) {
        setImages(data)
      } else {
        setImages([
          { id: '1', src: '/assets/images/1_bed_new.png', bg: '#cec4b1', slug: 'canggu-residence', order: 1 },
          { id: '2', src: '/assets/images/2_bed_new.png', bg: '#cebeaf', slug: 'bingin-residence',  order: 2 },
        ])
      }
    } catch (err) {
      console.error('Error fetching hero slides:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const mx  = useMotionValue(0)
  const my  = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 18 })
  const smy = useSpring(my, { stiffness: 60, damping: 18 })
  const tiltY = useTransform(smx, [-1, 1], [-6, 6])
  const tiltX = useTransform(smy, [-1, 1], [4, -4])

  const imgParallaxX = useTransform(smx, [-1, 1], [4, -4])
  const imgParallaxY = useTransform(smy, [-1, 1], [4, -4])
  const imgRotateY   = useTransform(smx, [-1, 1], [-2, 2])
  const imgRotateX   = useTransform(smy, [-1, 1], [1.5, -1.5])

  function handleTiltMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = tiltRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width * 2 - 1)
    my.set((e.clientY - rect.top)  / rect.height * 2 - 1)
  }

  function handleTiltLeave() {
    mx.set(0)
    my.set(0)
  }

  function navigate(dir: number) {
    const next = current + dir
    if (next < 0 || next >= images.length) return
    if (clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play().catch(() => {})
    }
    setDirection(dir)
    setCurrent(next)
  }

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (cooldown.current) return
      cooldown.current = true
      setTimeout(() => { cooldown.current = false }, 900)
      navigate(e.deltaY > 0 ? 1 : -1)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [current, images.length])

  const navBtnBase: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(28,21,16,0.85)',
    zIndex: 10,
    padding: '20px 10px',
  }


  if (isLoading || images.length === 0) {
    return <div style={{ height: 'calc(100vh - var(--nav-h))', backgroundColor: '#cec4b1' }} />
  }

  return (
    <motion.section
      animate={{ backgroundColor: images[current].bg }}
      transition={{ duration: 1.8, ease: 'easeInOut' }}
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="orb orb-1" style={{ opacity: 0.45 }} />
      <div className="orb orb-3" style={{ opacity: 0.3  }} />

      <div
        ref={tiltRef}
        onMouseMove={handleTiltMove}
        onMouseLeave={handleTiltLeave}
        style={{ width: '100%', maxWidth: 1000, position: 'relative', zIndex: 1, padding: '0 16px' }}
      >
        {/* Image carousel */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX: tiltX, rotateY: tiltY }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1514 / 651',
              perspective: '900px',
              perspectiveOrigin: '50% 50%',
              overflow: 'visible',
              borderRadius: 28,
            }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={images[current].id}
                custom={direction}
                variants={sweepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 2.2 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: 'center center 2000px',
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: -20,
                    x: imgParallaxX,
                    y: imgParallaxY,
                    rotateX: imgRotateX,
                    rotateY: imgRotateY,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <Image
                    src={images[current].src}
                    alt="Villa"
                    fill
                    style={{ objectFit: 'cover', pointerEvents: 'none' }}
                    priority
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Title + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ marginTop: 48 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <Link href={`/map?location=${images[current].slug}`} className="btn-primary">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                  <line x1="9" y1="3" x2="9" y2="18"/>
                  <line x1="15" y1="6" x2="15" y2="21"/>
                </svg>
                View Locations
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <ProcessOfBuying />

      {/* Navigation arrows */}
      <AnimatePresence>
        {current > 0 && (
          <motion.button
            key={`nav-left-${current}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(-1)}
            style={{ ...navBtnBase, left: 24, bottom: '50%', top: 'auto', transform: 'none' }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: '50%',
              border: '1px solid rgba(28,21,16,0.12)',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.45) 0%, rgba(28,21,16,0.06) 100%)',
              boxShadow: '4px 4px 10px rgba(28,21,16,0.14), -2px -2px 6px rgba(255,255,255,0.6), inset 0 1px 0 rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17,8 L8,8 L8,5 L3,10 L8,15 L8,12 L17,12 Z" fill="rgba(28,21,16,0.13)" transform="translate(1,1.2)"/>
                <path d="M17,12 L18,13.2 L9,13.2 L9,15 L8,15 L8,12 Z" fill="rgba(28,21,16,0.28)"/>
                <path d="M8,15 L9,16.2 L4,11.2 L3,10 L8,15 Z" fill="rgba(28,21,16,0.22)"/>
                <path d="M17,8 L8,8 L8,5 L3,10 L8,15 L8,12 L17,12 Z" fill="rgba(28,21,16,0.62)"/>
                <path d="M17,8 L8,8 L8,5 L3,10" stroke="rgba(255,255,255,0.35)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {current < images.length - 1 && (
          <motion.button
            key={`nav-right-${current}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(1)}
            style={{ ...navBtnBase, right: 24, top: '50%', transform: 'none' }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: '50%',
              border: '1px solid rgba(28,21,16,0.12)',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.45) 0%, rgba(28,21,16,0.06) 100%)',
              boxShadow: '4px 4px 10px rgba(28,21,16,0.14), -2px -2px 6px rgba(255,255,255,0.6), inset 0 1px 0 rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3,8 L12,8 L12,5 L17,10 L12,15 L12,12 L3,12 Z" fill="rgba(28,21,16,0.13)" transform="translate(1,1.2)"/>
                <path d="M3,12 L4,13.2 L13,13.2 L13,15 L12,15 L12,12 Z" fill="rgba(28,21,16,0.28)"/>
                <path d="M12,15 L13,16.2 L18,11.2 L17,10 L12,15 Z" fill="rgba(28,21,16,0.22)"/>
                <path d="M3,8 L12,8 L12,5 L17,10 L12,15 L12,12 L3,12 Z" fill="rgba(28,21,16,0.62)"/>
                <path d="M3,8 L12,8 L12,5 L17,10" stroke="rgba(255,255,255,0.35)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
