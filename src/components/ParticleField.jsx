import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 42
const MAX_LINK_DISTANCE = 130
const SPEED = 0.12
const PARALLAX_MAX = 14 // px — subtle on purpose, this is depth, not a gimmick
const COLORS = ['62, 198, 255', '167, 139, 250'] // --py-blue, --accent-violet as rgb triplets

export default function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let particles = []
    let frameId = null
    let running = true

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function initParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        color: COLORS[Math.random() < 0.72 ? 0 : 1],
      }))
    }

    function step() {
      if (!running) return
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${a.color}, ${0.1 * (1 - dist / MAX_LINK_DISTANCE)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(${p.color}, 0.55)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2)
        ctx.fill()
      }

      frameId = requestAnimationFrame(step)
    }

    let resizeTimer = null
    function handleResize() {
      // Debounced — a window drag-resize can fire this dozens of times a
      // second; without this, each one triggers a full canvas resize and
      // particle reinit for no visible benefit until the drag settles.
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        initParticles()
      }, 150)
    }

    function handleVisibility() {
      running = !document.hidden
      if (running) {
        frameId = requestAnimationFrame(step)
      } else if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }

    // Mouse parallax — small, smoothed shift toward the cursor. Cheap: one
    // transform write per tick (throttled to animation frames), CSS itself
    // does the easing, no extra per-particle computation.
    let parallaxTicking = false
    function handleMouseMove(e) {
      if (parallaxTicking) return
      parallaxTicking = true
      requestAnimationFrame(() => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        canvas.style.transform = `translate(${nx * PARALLAX_MAX}px, ${ny * PARALLAX_MAX}px)`
        parallaxTicking = false
      })
    }
    canvas.style.transition = 'transform 0.6s ease-out'

    resize()
    initParticles()
    frameId = requestAnimationFrame(step)

    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      running = false
      clearTimeout(resizeTimer)
      if (frameId) cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
