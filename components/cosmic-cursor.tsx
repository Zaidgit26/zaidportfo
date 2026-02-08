"use client"

import { useEffect, useState } from "react"

interface TrailPoint {
  x: number
  y: number
  opacity: number
  id: string
}

export function CosmicCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [idCounter, setIdCounter] = useState(0)

  // Generate unique ID for trail points
  const generateUniqueId = () => {
    const newId = idCounter + 1
    setIdCounter(newId)
    return `trail-${Date.now()}-${newId}-${Math.random().toString(36).substr(2, 9)}`
  }

  useEffect(() => {
    let lastTrailTime = 0
    const trailInterval = 16 // ~60fps for trail updates

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = performance.now()

      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      // Throttle trail point creation for better performance
      if (currentTime - lastTrailTime >= trailInterval) {
        setTrail(prevTrail => {
          const lastPoint = prevTrail[prevTrail.length - 1]

          // Only add trail point if mouse moved significantly (reduces trail density)
          const distance = lastPoint ?
            Math.sqrt(Math.pow(e.clientX - lastPoint.x, 2) + Math.pow(e.clientY - lastPoint.y, 2)) :
            Infinity

          if (distance > 8) { // Minimum distance threshold
            const newTrail = [...prevTrail, {
              x: e.clientX,
              y: e.clientY,
              opacity: 1,
              id: generateUniqueId()
            }]

            // Keep only last 6 trail points for better performance
            return newTrail.slice(-6)
          }

          return prevTrail
        })
        lastTrailTime = currentTime
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    // Use passive event listeners for better performance
    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true })

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  // Optimized fade out trail points using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number
    let lastFadeTime = 0
    const fadeInterval = 50 // Fade every 50ms

    const fadeTrail = (currentTime: number) => {
      if (currentTime - lastFadeTime >= fadeInterval) {
        setTrail(prevTrail =>
          prevTrail.map((point, index) => ({
            ...point,
            opacity: Math.max(0, point.opacity - 0.12) // Slightly faster fade for better performance
          })).filter(point => point.opacity > 0)
        )
        lastFadeTime = currentTime
      }

      animationFrameId = requestAnimationFrame(fadeTrail)
    }

    animationFrameId = requestAnimationFrame(fadeTrail)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Hardware-accelerated trail particles */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            width: '6px',
            height: '6px',
            background: `radial-gradient(circle, rgba(255,255,255,${point.opacity * 0.8}) 0%, rgba(56,139,253,${point.opacity * 0.6}) 50%, transparent 100%)`,
            borderRadius: '50%',
            opacity: point.opacity * (index / trail.length),
            // Use transform3d for hardware acceleration instead of left/top
            transform: `translate3d(${point.x - 3}px, ${point.y - 3}px, 0) scale(${0.3 + (index / trail.length) * 0.7})`,
            boxShadow: `0 0 ${4 + index}px rgba(255,255,255,${point.opacity * 0.5})`,
            filter: 'blur(0.5px)',
            mixBlendMode: 'screen',
            // Hardware acceleration optimizations
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden'
          }}
        />
      ))}

      {/* Hardware-accelerated main cursor */}
      <div
        className="cosmic-cursor"
        style={{
          // Use transform3d for hardware acceleration instead of left/top
          transform: `translate3d(${mousePosition.x - 10}px, ${mousePosition.y - 10}px, 0)`,
        }}
      />
    </>
  )
}
