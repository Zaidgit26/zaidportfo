"use client"

import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  pulse: boolean
  pulseSpeed: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Initialize particles
    const initParticles = () => {
      particles = []
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 12000)

      // Get primary color from CSS variable
      const primaryRgb = getComputedStyle(document.documentElement).getPropertyValue('--primary-rgb').trim() || '56, 139, 253'
      
      for (let i = 0; i < particleCount; i++) {
        // Determine if this will be a primary-colored particle
        const isPrimary = Math.random() > 0.7
        const baseColor = isPrimary ? primaryRgb : '255, 255, 255'
        const opacity = isPrimary ? (Math.random() * 0.3 + 0.1) : (Math.random() * 0.15 + 0.05)
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          color: `rgba(${baseColor}, ${opacity})`,
          opacity: opacity,
          pulse: Math.random() > 0.8, // Some particles will pulse
          pulseSpeed: Math.random() * 0.01 + 0.005
        })
      }
    }

    // Draw particles
    const drawParticles = (deltaTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Update position with delta time for smooth motion
        particle.x += particle.speedX * deltaTime
        particle.y += particle.speedY * deltaTime

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Update particle size if pulsing
        if (particle.pulse) {
          const pulseAmount = Math.sin(Date.now() * particle.pulseSpeed) * 0.5 + 1
          const pulsedSize = particle.size * pulseAmount
          ctx.fillStyle = `rgba(${particle.color.split(',')[0].split('(')[1]}, ${particle.color.split(',')[1]}, ${particle.color.split(',')[2]}, ${particle.opacity * pulseAmount})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, pulsedSize, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        }

        // Connect particles
        connectParticles(particle, index)
      })
    }

    // Connect nearby particles with lines
    const connectParticles = (particle: Particle, index: number) => {
      const connectionDistance = 100

      for (let i = index + 1; i < particles.length; i++) {
        const dx = particle.x - particles[i].x
        const dy = particle.y - particles[i].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          const opacity = 1 - distance / connectionDistance
          ctx.strokeStyle = `rgba(150, 150, 255, ${opacity * 0.2})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particles[i].x, particles[i].y)
          ctx.stroke()
        }
      }
    }

    // Animation loop with delta time
    let lastTime = performance.now()
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16.67 // Normalize to ~60 FPS
      lastTime = currentTime
      
      drawParticles(deltaTime)
      animationFrameId = requestAnimationFrame(animate)
    }

    // Initialize
    resizeCanvas()
    animate()

    // Handle resize
    window.addEventListener("resize", resizeCanvas)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" aria-hidden="true" />
}

