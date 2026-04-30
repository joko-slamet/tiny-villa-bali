'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children: ReactNode
  style?: React.CSSProperties
  stagger?: number
}

export default function StaggerGrid({ children, style, stagger = 0.12 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const items = el.children
    gsap.fromTo(
      items,
      { opacity: 0, y: 50, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [stagger])

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  )
}
