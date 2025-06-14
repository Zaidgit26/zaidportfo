"use client"

import { useEffect, useRef, useState } from "react"

interface Particle3D {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  color: string
  opacity: number
  type: 'sphere' | 'cube' | 'triangle' | 'code' | 'network'
  rotation: number
  rotationSpeed: number
}

interface Interactive3DBackgroundProps {
  section: string
}

export function Interactive3DBackground({ section }: Interactive3DBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle3D[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let currentParticles: Particle3D[] = []

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      }
    }

    // Initialize particles based on section
    const initParticles = () => {
      currentParticles = []
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000)
      
      for (let i = 0; i < particleCount; i++) {
        currentParticles.push(createParticleForSection(section))
      }
    }

    // Create particle based on current section
    const createParticleForSection = (currentSection: string): Particle3D => {
      const baseParticle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000 - 500,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.8 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      }

      switch (currentSection) {
        case 'home':
          return {
            ...baseParticle,
            type: Math.random() > 0.5 ? 'sphere' : 'cube',
            color: Math.random() > 0.7 ? '#3b82f6' : '#ffffff',
            size: Math.random() * 6 + 3
          }
        case 'about':
          return {
            ...baseParticle,
            type: 'sphere',
            color: Math.random() > 0.6 ? '#06b6d4' : '#8b5cf6',
            size: Math.random() * 5 + 2
          }
        case 'skills':
          return {
            ...baseParticle,
            type: Math.random() > 0.3 ? 'triangle' : 'cube',
            color: Math.random() > 0.5 ? '#10b981' : '#f59e0b',
            size: Math.random() * 4 + 2
          }
        case 'projects':
          return {
            ...baseParticle,
            type: 'code',
            color: Math.random() > 0.6 ? '#ef4444' : '#3b82f6',
            size: Math.random() * 3 + 1
          }
        case 'experience':
          return {
            ...baseParticle,
            type: 'network',
            color: Math.random() > 0.7 ? '#8b5cf6' : '#06b6d4',
            size: Math.random() * 4 + 2
          }
        case 'contact':
          return {
            ...baseParticle,
            type: 'sphere',
            color: Math.random() > 0.5 ? '#f97316' : '#ec4899',
            size: Math.random() * 5 + 3
          }
        default:
          return {
            ...baseParticle,
            type: 'sphere',
            color: '#ffffff',
            size: Math.random() * 4 + 2
          }
      }
    }

    // Draw different particle types
    const drawParticle = (particle: Particle3D) => {
      const scale = 1000 / (1000 + particle.z)
      const x = particle.x + mouseRef.current.x * 50 * scale
      const y = particle.y + mouseRef.current.y * 50 * scale
      const size = particle.size * scale

      ctx.save()
      ctx.globalAlpha = particle.opacity * scale
      ctx.fillStyle = particle.color
      ctx.strokeStyle = particle.color

      switch (particle.type) {
        case 'sphere':
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
          break
        
        case 'cube':
          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(particle.rotation)
          ctx.fillRect(-size/2, -size/2, size, size)
          ctx.restore()
          break
        
        case 'triangle':
          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(particle.rotation)
          ctx.beginPath()
          ctx.moveTo(0, -size)
          ctx.lineTo(-size, size)
          ctx.lineTo(size, size)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
          break
        
        case 'code':
          ctx.font = `${size * 2}px monospace`
          ctx.fillText(Math.random() > 0.5 ? '0' : '1', x, y)
          break
        
        case 'network':
          ctx.beginPath()
          ctx.arc(x, y, size/2, 0, Math.PI * 2)
          ctx.fill()
          // Draw connections to nearby particles
          currentParticles.forEach(otherParticle => {
            if (otherParticle !== particle) {
              const dx = x - (otherParticle.x + mouseRef.current.x * 50 * (1000 / (1000 + otherParticle.z)))
              const dy = y - (otherParticle.y + mouseRef.current.y * 50 * (1000 / (1000 + otherParticle.z)))
              const distance = Math.sqrt(dx * dx + dy * dy)
              
              if (distance < 100) {
                ctx.globalAlpha = (particle.opacity * scale) * (1 - distance / 100) * 0.3
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.lineTo(otherParticle.x + mouseRef.current.x * 50 * (1000 / (1000 + otherParticle.z)), 
                          otherParticle.y + mouseRef.current.y * 50 * (1000 / (1000 + otherParticle.z)))
                ctx.stroke()
              }
            }
          })
          break
      }
      
      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      currentParticles.forEach(particle => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz
        particle.rotation += particle.rotationSpeed

        // Wrap around edges
        if (particle.x < -50) particle.x = canvas.width + 50
        if (particle.x > canvas.width + 50) particle.x = -50
        if (particle.y < -50) particle.y = canvas.height + 50
        if (particle.y > canvas.height + 50) particle.y = -50
        if (particle.z < -500) particle.z = 500
        if (particle.z > 500) particle.z = -500

        drawParticle(particle)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Initialize
    resizeCanvas()
    animate()

    // Event listeners
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [section])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none" 
      aria-hidden="true" 
    />
  )
}
