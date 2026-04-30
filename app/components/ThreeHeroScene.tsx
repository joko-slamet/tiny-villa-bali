'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeHeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const isMobile = w < 768

    // ── Renderer ────────────────────────────────────────
    // Pass canvas directly — React owns the DOM node lifecycle
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h, false)
    renderer.setClearColor(0x08080f, 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.9

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 0, 7)

    // ── Main Group (offset right on desktop) ────────────
    const group = new THREE.Group()
    group.position.x = isMobile ? 0 : 2.2
    scene.add(group)

    // ── TORUS KNOT — wireframe edges ────────────────────
    const knotGeo = new THREE.TorusKnotGeometry(1.05, 0.36, 140, 22)
    const knotEdges = new THREE.EdgesGeometry(knotGeo)
    const knotLineMat = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })
    const knotMesh = new THREE.LineSegments(knotEdges, knotLineMat)
    group.add(knotMesh)

    // ── TORUS KNOT — surface point cloud ────────────────
    const knotPointGeo = new THREE.BufferGeometry()
    knotPointGeo.setAttribute('position', knotGeo.attributes.position.clone())
    const knotPointMat = new THREE.PointsMaterial({
      size: 0.022,
      color: 0xc084fc,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      sizeAttenuation: true,
    })
    group.add(new THREE.Points(knotPointGeo, knotPointMat))

    // ── ORBIT RING 1 — cyan ─────────────────────────────
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.009, 3, 90),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      })
    )
    ring1.rotation.x = Math.PI / 2.8
    ring1.rotation.y = Math.PI / 7
    group.add(ring1)

    // ── ORBIT RING 2 — purple ───────────────────────────
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.75, 0.006, 3, 90),
      new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      })
    )
    ring2.rotation.x = Math.PI / 4
    ring2.rotation.z = Math.PI / 3
    group.add(ring2)

    // ── ORBIT RING 3 — indigo (outer) ───────────────────
    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.004, 3, 90),
      new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      })
    )
    ring3.rotation.x = -Math.PI / 6
    ring3.rotation.z = Math.PI / 4
    group.add(ring3)

    // ── AMBIENT PARTICLE CLOUD ──────────────────────────
    const AMBIENT_COUNT = 240
    const ambientPos = new Float32Array(AMBIENT_COUNT * 3)
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.6 + Math.random() * 1.8
      ambientPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      ambientPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      ambientPos[i * 3 + 2] = r * Math.cos(phi)
    }
    const ambientGeo = new THREE.BufferGeometry()
    ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3))
    const ambientMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x818cf8,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const ambient = new THREE.Points(ambientGeo, ambientMat)
    group.add(ambient)

    // ── INNER GLOW SPHERE ───────────────────────────────
    const glowSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      })
    )
    group.add(glowSphere)

    // ── BLOOM POST-PROCESSING ───────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let composer: any = null

    const initBloom = async () => {
      try {
        const [
          { EffectComposer },
          { RenderPass },
          { UnrealBloomPass },
        ] = await Promise.all([
          import('three/examples/jsm/postprocessing/EffectComposer.js'),
          import('three/examples/jsm/postprocessing/RenderPass.js'),
          import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
        ])
        composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))
        const bloom = new UnrealBloomPass(
          new THREE.Vector2(w, h),
          1.4,   // strength
          0.55,  // radius
          0.0    // threshold — glow everything
        )
        composer.addPass(bloom)
      } catch {
        // Fallback: render without bloom
      }
    }
    initBloom()

    // ── MOUSE ───────────────────────────────────────────
    let mx = 0, my = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    // ── RESIZE ──────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const nw = canvas.clientWidth
      const nh = canvas.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh, false)
      composer?.setSize(nw, nh)
      group.position.x = nw < 768 ? 0 : 2.2
    })
    ro.observe(canvas)

    // ── ANIMATE ─────────────────────────────────────────
    let raf: number
    let smx = 0, smy = 0
    const clock = new THREE.Clock()

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      smx += (mx - smx) * 0.035
      smy += (my - smy) * 0.035

      // Rotate torus knot (all children share rotation via group)
      knotMesh.rotation.x = t * 0.22 + smy * 0.5
      knotMesh.rotation.y = t * 0.38 + smx * 0.5
      // Sync point cloud
      knotPointGeo.attributes.position.needsUpdate = false
      const pts = group.children[1] as THREE.Points
      pts.rotation.copy(knotMesh.rotation)

      // Orbit rings
      ring1.rotation.y = t * 0.28
      ring1.rotation.z = t * 0.08
      ring2.rotation.y = -t * 0.18
      ring2.rotation.x = t * 0.14 + Math.PI / 4
      ring3.rotation.z = t * 0.06
      ring3.rotation.y = -t * 0.1

      // Ambient cloud drift
      ambient.rotation.y = t * 0.04
      ambient.rotation.x = Math.sin(t * 0.06) * 0.15

      // Glow sphere pulse
      const pulse = 0.04 + Math.sin(t * 1.4) * 0.02
      glowSphere.material.opacity = pulse

      // Camera parallax
      camera.position.x += (smx * 0.55 - camera.position.x) * 0.04
      camera.position.y += (smy * 0.35 - camera.position.y) * 0.04
      camera.lookAt(scene.position)

      if (composer) {
        composer.render()
      } else {
        renderer.render(scene, camera)
      }
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      ro.disconnect()
      // renderer.domElement is the canvas React owns — don't removeChild
      renderer.dispose()
      knotGeo.dispose()
      knotEdges.dispose()
      ambientGeo.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  )
}
