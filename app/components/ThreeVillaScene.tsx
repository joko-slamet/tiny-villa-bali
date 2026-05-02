'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeVillaScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.clientWidth
    const h = canvas.clientHeight

    // ── Renderer ────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h, false)
    renderer.setClearColor(0x0a080e, 1)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a080e, 0.045)

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 200)
    camera.position.set(0, 5.5, 18)
    camera.lookAt(0, 1.5, 0)

    // ── Helpers ─────────────────────────────────────────────
    const mat = (color: number, rough = 0.6, metal = 0.1, emissive?: number, emissiveIntensity = 1) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal })
      if (emissive !== undefined) { m.emissive.setHex(emissive); m.emissiveIntensity = emissiveIntensity }
      return m
    }
    const box = (w: number, h: number, d: number, material: THREE.Material, x = 0, y = 0, z = 0) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      return mesh
    }

    // ── Ground ───────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      mat(0x1a1510, 0.95, 0)
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // ── Garden grass patch ───────────────────────────────────
    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 14),
      mat(0x1d2b1a, 0.98, 0)
    )
    grass.rotation.x = -Math.PI / 2
    grass.position.set(0, 0.01, 1)
    grass.receiveShadow = true
    scene.add(grass)

    // ── Villa main body ──────────────────────────────────────
    const villaGroup = new THREE.Group()
    scene.add(villaGroup)

    // Main lower floor
    const floor1 = box(12, 2.8, 7, mat(0xd8ccbc, 0.85, 0.05), 0, 1.4, 0)
    villaGroup.add(floor1)

    // Upper floor (offset left)
    const floor2 = box(7.5, 2.4, 6.5, mat(0xe0d5c8, 0.8, 0.05), -2, 4.6, 0)
    villaGroup.add(floor2)

    // Flat roof slabs
    const roof1 = box(12.4, 0.22, 7.4, mat(0xb8ae9e, 0.9, 0.05), 0, 2.81, 0)
    villaGroup.add(roof1)
    const roof2 = box(7.9, 0.22, 6.9, mat(0xb8ae9e, 0.9, 0.05), -2, 5.81, 0)
    villaGroup.add(roof2)

    // Roof overhang on lower right
    const overhang = box(5.5, 0.18, 7.4, mat(0xb8ae9e, 0.9, 0.05), 3.25, 2.81, 0)
    villaGroup.add(overhang)

    // Ground-floor terrace slab (extends forward)
    const terrace = box(14, 0.18, 5, mat(0xc8bfb0, 0.88, 0.02), 0, 0.09, 5.5)
    terrace.receiveShadow = true
    villaGroup.add(terrace)

    // ── Windows (glowing warm amber) ─────────────────────────
    const winMat = mat(0xffa040, 0.1, 0.0, 0xffa040, 1.8)
    const addWindow = (wx: number, wy: number, wz: number, ww = 1.6, wh = 1.1) => {
      const win = box(ww, wh, 0.08, winMat, wx, wy, wz)
      win.castShadow = false
      villaGroup.add(win)
    }

    // Floor 1 windows — front face (z = 3.54)
    addWindow(-4, 1.8, 3.54)
    addWindow(-1.5, 1.8, 3.54, 2.2, 1.8)
    addWindow(1.5, 1.8, 3.54, 1.0, 1.2)
    addWindow(3.5, 1.8, 3.54)
    // Floor 1 windows — back face (z = -3.54)
    addWindow(-3, 1.8, -3.54)
    addWindow(2, 1.8, -3.54, 2.0, 1.4)
    // Floor 2 windows — front (z = 2.76 in world)
    addWindow(-3.5, 4.8, 3.26)
    addWindow(-1.2, 4.8, 3.26, 2.0, 1.4)
    // Floor 2 side window
    addWindow(2.31, 4.8, 0, 0.08, 1.4)

    // ── Sliding glass doors (wider, floor-to-near-ceiling) ───
    const doorMat = mat(0xffe0a0, 0.05, 0.2, 0xffe0a0, 0.9)
    const door = box(3.2, 2.4, 0.06, doorMat, 0, 1.4, 3.54)
    villaGroup.add(door)

    // ── Pillars / columns ────────────────────────────────────
    const pillarMat = mat(0xd0c8b8, 0.85, 0.05)
    for (const px of [-5, 5]) {
      villaGroup.add(box(0.25, 2.8, 0.25, pillarMat, px, 1.4, 3.2))
      villaGroup.add(box(0.25, 2.8, 0.25, pillarMat, px, 1.4, -3.2))
    }

    // ── Pool ─────────────────────────────────────────────────
    const poolGroup = new THREE.Group()
    poolGroup.position.set(4.5, 0, 5.5)
    scene.add(poolGroup)

    // Pool surround
    poolGroup.add(box(7, 0.22, 4.5, mat(0xc8c0b0, 0.88, 0.02), 0, 0.0, 0))
    // Pool water
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x1a9aaa,
      roughness: 0.05,
      metalness: 0.3,
      transparent: true,
      opacity: 0.88,
      emissive: new THREE.Color(0x0d7080),
      emissiveIntensity: 0.4,
    })
    poolGroup.add(new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.12, 3.7), waterMat).translateY(0.08))

    // Pool edge coping
    for (const [ex, ez, ew, ed] of [
      [0, -2.1, 6.4, 0.2],
      [0, 2.1, 6.4, 0.2],
      [-3.3, 0, 0.2, 4.5],
      [3.3, 0, 0.2, 4.5],
    ] as [number, number, number, number][]) {
      poolGroup.add(box(ew, 0.12, ed, mat(0xddd5c5, 0.85, 0.02), ex, 0.16, ez))
    }

    // ── Palm trees ───────────────────────────────────────────
    const addPalm = (px: number, pz: number, scale = 1) => {
      const g = new THREE.Group()
      // Trunk
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08 * scale, 0.14 * scale, 3 * scale, 8),
        mat(0x7a5c3a, 0.95, 0)
      )
      trunk.castShadow = true
      trunk.position.y = 1.5 * scale
      g.add(trunk)
      // Fronds
      const frondMat = mat(0x3a6b30, 0.9, 0)
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2
        const frond = new THREE.Mesh(
          new THREE.ConeGeometry(0.06 * scale, 1.4 * scale, 5),
          frondMat
        )
        frond.castShadow = true
        frond.position.set(
          Math.cos(angle) * 0.55 * scale,
          3 * scale + 0.3 * scale,
          Math.sin(angle) * 0.55 * scale
        )
        frond.rotation.z = Math.PI * 0.35
        frond.rotation.y = angle
        g.add(frond)
      }
      // Top frond cluster
      const topFrond = new THREE.Mesh(
        new THREE.SphereGeometry(0.42 * scale, 6, 5),
        mat(0x2d5a24, 0.9, 0)
      )
      topFrond.castShadow = true
      topFrond.position.y = 3.1 * scale
      g.add(topFrond)

      g.position.set(px, 0, pz)
      scene.add(g)
    }

    addPalm(-8, 3, 1.1)
    addPalm(-9, -1, 0.9)
    addPalm(9, 6, 1.2)
    addPalm(10, -0.5, 0.85)
    addPalm(-7, 7, 0.95)

    // ── Ornamental shrubs ─────────────────────────────────────
    const shrubMat = mat(0x3a5c2a, 0.95, 0)
    const addShrub = (sx: number, sz: number, r = 0.4) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 6), shrubMat)
      s.castShadow = true
      s.position.set(sx, r, sz)
      scene.add(s)
    }
    addShrub(-6, 3.5)
    addShrub(-5.5, 4, 0.3)
    addShrub(7, 4.5)
    addShrub(7.5, 5, 0.3)
    addShrub(-6, -2)
    addShrub(6, -2)

    // ── Pathway ──────────────────────────────────────────────
    const pathMat = mat(0xb8a890, 0.95, 0)
    const path = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 8), pathMat)
    path.rotation.x = -Math.PI / 2
    path.position.set(0, 0.02, 8)
    path.receiveShadow = true
    scene.add(path)

    // ── Lighting ─────────────────────────────────────────────
    // Ambient — warm night
    scene.add(new THREE.AmbientLight(0x201810, 1.2))

    // Moon — cool blue-white from upper right
    const moon = new THREE.DirectionalLight(0xc8d8f0, 1.0)
    moon.position.set(12, 18, 8)
    moon.castShadow = true
    moon.shadow.mapSize.set(2048, 2048)
    moon.shadow.camera.near = 0.5
    moon.shadow.camera.far = 60
    moon.shadow.camera.left = -20
    moon.shadow.camera.right = 20
    moon.shadow.camera.top = 20
    moon.shadow.camera.bottom = -20
    scene.add(moon)

    // Warm window glow — interior lights spill out
    const winLight1 = new THREE.PointLight(0xffa040, 4.5, 9)
    winLight1.position.set(0, 2.2, 4.5)
    scene.add(winLight1)
    const winLight2 = new THREE.PointLight(0xffb060, 3.0, 7)
    winLight2.position.set(-3.5, 5.2, 4)
    scene.add(winLight2)

    // Pool underwater glow
    const poolLight = new THREE.PointLight(0x20d0e0, 3.5, 8)
    poolLight.position.set(4.5, 0.5, 5.5)
    scene.add(poolLight)

    // Ground uplighting on villa facade
    const upLight1 = new THREE.SpotLight(0xffd080, 3, 14, Math.PI / 6, 0.4)
    upLight1.position.set(-3, 0.5, 5)
    upLight1.target.position.set(-3, 5, 0)
    scene.add(upLight1)
    scene.add(upLight1.target)

    const upLight2 = new THREE.SpotLight(0xffd080, 3, 14, Math.PI / 6, 0.4)
    upLight2.position.set(3, 0.5, 5)
    upLight2.target.position.set(3, 5, 0)
    scene.add(upLight2)
    scene.add(upLight2.target)

    // Accent — rim light from back
    const rimLight = new THREE.DirectionalLight(0x6080c0, 0.5)
    rimLight.position.set(-10, 8, -10)
    scene.add(rimLight)

    // ── Floating particles (firefly/bokeh effect) ─────────────
    const PARTICLE_COUNT = 120
    const pPos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 24
      pPos[i * 3 + 1] = Math.random() * 6
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 18
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xffcc60,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ── Bloom ────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let composer: any = null
    const initBloom = async () => {
      try {
        const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }] = await Promise.all([
          import('three/examples/jsm/postprocessing/EffectComposer.js'),
          import('three/examples/jsm/postprocessing/RenderPass.js'),
          import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
        ])
        composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))
        const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.9, 0.6, 0.1)
        composer.addPass(bloom)
      } catch { /* fallback */ }
    }
    initBloom()

    // ── Mouse parallax ───────────────────────────────────────
    let mx = 0, my = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    // ── Resize ───────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const nw = canvas.clientWidth
      const nh = canvas.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh, false)
      composer?.setSize(nw, nh)
    })
    ro.observe(canvas)

    // ── Animate ──────────────────────────────────────────────
    let raf: number
    let smx = 0, smy = 0
    const clock = new THREE.Clock()
    const baseX = camera.position.x
    const baseY = camera.position.y

    function animate() {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      smx += (mx - smx) * 0.025
      smy += (my - smy) * 0.025

      // Gentle camera sway
      camera.position.x = baseX + smx * 1.2
      camera.position.y = baseY + smy * 0.6
      camera.lookAt(0, 1.5, 0)

      // Pool water shimmer
      waterMat.emissiveIntensity = 0.35 + Math.sin(t * 1.8) * 0.12

      // Window light pulse
      winLight1.intensity = 4.2 + Math.sin(t * 0.7) * 0.4
      winLight2.intensity = 2.8 + Math.sin(t * 0.5 + 1) * 0.3
      poolLight.intensity = 3.2 + Math.sin(t * 2.1) * 0.6

      // Firefly particles drift
      particles.rotation.y = t * 0.012
      pMat.opacity = 0.45 + Math.sin(t * 0.9) * 0.1

      if (composer) composer.render()
      else renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      ro.disconnect()
      renderer.dispose()
      pGeo.dispose()
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
