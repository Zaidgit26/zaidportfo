"use client"

import { useEffect, useRef, useCallback } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface TrailPoint {
  x: number
  y: number
  opacity: number
  scale: number
  life: number
}

export function CosmicCursor() {
  const isMobile = useIsMobile()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const isVisibleRef = useRef(false)
  const trailRef = useRef<TrailPoint[]>([])
  const lastUpdateRef = useRef(0)
  const idCounterRef = useRef(0)

  // Performance constants
  const TRAIL_LENGTH = 8
  const UPDATE_INTERVAL = 16.67 // ~60fps
  const FADE_SPEED = 0.08
  const TRAIL_SPACING = 12 // Minimum distance between trail points

  // Pre-calculated styles for better performance
  const cursorStyle = useRef({
    position: 'fixed' as const,
    width: '20px',
    height: '20px',
    pointerEvents: 'none' as const,
    zIndex: 9999,
    borderRadius: '50%',
    willChange: 'transform',
    transform: 'translate3d(0, 0, 0)', // Hardware acceleration
  })

  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = performance.now()
    if (now - lastUpdateRef.current < UPDATE_INTERVAL) return

    const newX = e.clientX
    const newY = e.clientY

    // Check if mouse moved enough to add new trail point
    const lastTrail = trailRef.current[trailRef.current.length - 1]
    if (lastTrail) {
      const dx = newX - lastTrail.x
      const dy = newY - lastTrail.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < TRAIL_SPACING) {
        mouseRef.current = { x: newX, y: newY }
        return
      }
    }

    mouseRef.current = { x: newX, y: newY }
    isVisibleRef.current = true

    // Add new trail point
    trailRef.current.push({
      x: newX,
      y: newY,
      opacity: 1,
      scale: 1,
      life: 1
    })

    // Keep only last TRAIL_LENGTH points
    if (trailRef.current.length > TRAIL_LENGTH) {
      trailRef.current = trailRef.current.slice(-TRAIL_LENGTH)
    }

    lastUpdateRef.current = now
  }, [])

  const handleMouseLeave = useCallback(() => {
    isVisibleRef.current = false
  }, [])

  const handleMouseEnter = useCallback(() => {
    isVisibleRef.current = true
  }, [])

  // Optimized animation loop using canvas for better performance
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !isVisibleRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      animationFrameRef.current = requestAnimationFrame(animate)
      return
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw trail points
    trailRef.current = trailRef.current.map((point, index) => {
      // Update life and opacity
      point.life -= FADE_SPEED
      point.opacity = Math.max(0, point.life)
      point.scale = 0.3 + (index / TRAIL_LENGTH) * 0.7

      if (point.opacity > 0) {
        // Draw trail point with optimized rendering
        const size = 6 * point.scale
        const alpha = point.opacity * (index / TRAIL_LENGTH)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.globalCompositeOperation = 'screen'

        // Create gradient once and reuse
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, size
        )
        gradient.addColorStop(0, `rgba(255,255,255,${point.opacity * 0.8})`)
        gradient.addColorStop(0.5, `rgba(56,139,253,${point.opacity * 0.6})`)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      return point
    }).filter(point => point.opacity > 0)

    // Draw main cursor
    if (mouseRef.current.x && mouseRef.current.y) {
      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      // Main cursor gradient
      const mainGradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, 10
      )
      mainGradient.addColorStop(0, 'rgba(255,255,255,0.9)')
      mainGradient.addColorStop(0.3, 'rgba(56,139,253,0.8)')
      mainGradient.addColorStop(0.6, 'rgba(124,58,237,0.6)')
      mainGradient.addColorStop(1, 'transparent')

      ctx.fillStyle = mainGradient
      ctx.beginPath()
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 10, 0, Math.PI * 2)
      ctx.fill()

      // Inner bright core
      ctx.fillStyle = 'rgba(255,255,255,1)'
      ctx.beginPath()
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    // Disable cursor effects on mobile devices for performance
    if (isMobile) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true })

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isMobile, handleMouseMove, handleMouseLeave, handleMouseEnter, animate])

  // Don't render anything on mobile
  if (isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}
