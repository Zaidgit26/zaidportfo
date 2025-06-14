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
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      // Add trail point with unique ID
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, {
          x: e.clientX,
          y: e.clientY,
          opacity: 1,
          id: generateUniqueId()
        }]

        // Keep only last 8 trail points
        return newTrail.slice(-8)
      })
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  // Fade out trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prevTrail =>
        prevTrail.map((point, index) => ({
          ...point,
          opacity: Math.max(0, point.opacity - 0.1)
        })).filter(point => point.opacity > 0)
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Trail particles */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: point.x - 3,
            top: point.y - 3,
            width: '6px',
            height: '6px',
            background: `radial-gradient(circle, rgba(255,255,255,${point.opacity * 0.8}) 0%, rgba(56,139,253,${point.opacity * 0.6}) 50%, transparent 100%)`,
            borderRadius: '50%',
            opacity: point.opacity * (index / trail.length),
            transform: `scale(${0.3 + (index / trail.length) * 0.7})`,
            boxShadow: `0 0 ${4 + index}px rgba(255,255,255,${point.opacity * 0.5})`,
            filter: 'blur(0.5px)',
            mixBlendMode: 'screen'
          }}
        />
      ))}

      {/* Main cursor */}
      <div
        className="cosmic-cursor"
        style={{
          left: mousePosition.x - 10, // Center the cursor
          top: mousePosition.y - 10,
        }}
      />
    </>
  )
}
