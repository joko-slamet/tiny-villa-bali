'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    camera.position.z = 80

    // ── Particle system ────────────────────────────────────
    const PARTICLE_COUNT = 180
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const particleData: { x: number; y: number; z: number; vx: number; vy: number }[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 160
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 60
      positions[i * 3]     = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      particleData.push({ x, y, z, vx: (Math.random() - 0.5) * 0.05, vy: (Math.random() - 0.5) * 0.03 })
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.7,
      color: 0x6366f1,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Connection lines ───────────────────────────────────
    const lineGeo = new THREE.BufferGeometry()
    const MAX_LINES = PARTICLE_COUNT * 10
    const linePositions = new Float32Array(MAX_LINES * 6)
    const lineColors = new Float32Array(MAX_LINES * 6)
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
    lineGeo.setDrawRange(0, 0)

    const lineMat = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.25 })
    )
    scene.add(lineMat)

    // ── Mouse parallax ─────────────────────────────────────
    let mouseX = 0, mouseY = 0
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    // ── Resize ─────────────────────────────────────────────
    const onResize = () => {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(canvas)

    // ── Render loop ────────────────────────────────────────
    const MAX_DIST = 28
    const color1 = new THREE.Color(0x6366f1)
    const color2 = new THREE.Color(0xa855f7)

    let raf: number
    const clock = new THREE.Clock()

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Drift particles
      const pos = particleGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particleData[i].x += particleData[i].vx
        particleData[i].y += particleData[i].vy
        if (Math.abs(particleData[i].x) > 80) particleData[i].vx *= -1
        if (Math.abs(particleData[i].y) > 50) particleData[i].vy *= -1
        pos.setXYZ(i, particleData[i].x, particleData[i].y, particleData[i].z)
      }
      pos.needsUpdate = true

      // Build connections
      let lineIdx = 0
      const lp = lineGeo.attributes.position as THREE.BufferAttribute
      const lc = lineGeo.attributes.color as THREE.BufferAttribute
      for (let a = 0; a < PARTICLE_COUNT && lineIdx < MAX_LINES; a++) {
        for (let b = a + 1; b < PARTICLE_COUNT && lineIdx < MAX_LINES; b++) {
          const dx = particleData[a].x - particleData[b].x
          const dy = particleData[a].y - particleData[b].y
          const dz = particleData[a].z - particleData[b].z
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
          if (dist < MAX_DIST) {
            const alpha = 1 - dist / MAX_DIST
            const col = color1.clone().lerp(color2, b / PARTICLE_COUNT)
            lp.setXYZ(lineIdx * 2,     particleData[a].x, particleData[a].y, particleData[a].z)
            lp.setXYZ(lineIdx * 2 + 1, particleData[b].x, particleData[b].y, particleData[b].z)
            lc.setXYZ(lineIdx * 2,     col.r * alpha, col.g * alpha, col.b * alpha)
            lc.setXYZ(lineIdx * 2 + 1, col.r * alpha, col.g * alpha, col.b * alpha)
            lineIdx++
          }
        }
      }
      lineGeo.setDrawRange(0, lineIdx * 2)
      lp.needsUpdate = true
      lc.needsUpdate = true

      // Slow camera drift + mouse parallax
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.02
      camera.position.y += (-mouseY * 5 - camera.position.y) * 0.02
      particles.rotation.y = t * 0.015
      particles.rotation.x = t * 0.008

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      resizeObserver.disconnect()
      renderer.dispose()
      particleGeo.dispose()
      lineGeo.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
