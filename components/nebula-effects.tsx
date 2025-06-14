'use client'

import { useEffect, useRef } from 'react'

interface NebulaParticle {
  x: number
  y: number
  z: number
  size: number
  color: string
  opacity: number
  drift: { x: number; y: number }
  life: number
  maxLife: number
}

interface NebulaEffectsProps {
  section: string
}

export default function NebulaEffects({ section }: NebulaEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>()
  const particles = useRef<NebulaParticle[]>([])
  const time = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Create nebula particle
    const createParticle = (): NebulaParticle => {
      const colors = [
        'rgba(138, 43, 226, 0.1)', // Purple
        'rgba(75, 0, 130, 0.08)',  // Indigo
        'rgba(25, 25, 112, 0.06)', // Midnight blue
        'rgba(72, 61, 139, 0.05)', // Dark slate blue
        'rgba(106, 90, 205, 0.04)' // Slate blue
      ]

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000 + 100,
        size: Math.random() * 200 + 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.1,
        drift: {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2
        },
        life: Math.random() * 1000 + 500,
        maxLife: 1000
      }
    }

    // Initialize particles
    const initParticles = () => {
      particles.current = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 100000) + 5
      
      for (let i = 0; i < particleCount; i++) {
        particles.current.push(createParticle())
      }
    }

    // Draw nebula particle
    const drawParticle = (particle: NebulaParticle) => {
      const scale = 800 / (800 + particle.z)
      const x = particle.x * scale
      const y = particle.y * scale
      const size = particle.size * scale
      const lifeRatio = particle.life / particle.maxLife
      const opacity = particle.opacity * lifeRatio

      ctx.save()
      ctx.globalAlpha = opacity
      
      // Create organic nebula gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, particle.color.replace(/[\d.]+\)/, '0.15)'))
      gradient.addColorStop(0.3, particle.color.replace(/[\d.]+\)/, '0.08)'))
      gradient.addColorStop(0.6, particle.color.replace(/[\d.]+\)/, '0.03)'))
      gradient.addColorStop(1, 'transparent')
      
      ctx.fillStyle = gradient
      
      // Create organic, flowing shape
      ctx.beginPath()
      const points = 20
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2
        const waveOffset = Math.sin(time.current * 0.001 + angle * 3) * 0.3
        const radius = size * (0.6 + waveOffset + Math.sin(angle * 2) * 0.2)
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius
        
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      
      ctx.restore()
    }

    // Animation loop
    const animate = (currentTime: number) => {
      time.current = currentTime
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particles.current.forEach((particle, index) => {
        // Update position with slow drift
        particle.x += particle.drift.x
        particle.y += particle.drift.y
        
        // Update life
        particle.life -= 0.5
        
        // Respawn particle if it dies or goes off screen
        if (particle.life <= 0 || 
            particle.x < -particle.size || particle.x > canvas.width + particle.size ||
            particle.y < -particle.size || particle.y > canvas.height + particle.size) {
          particles.current[index] = createParticle()
        } else {
          drawParticle(particle)
        }
      })
      
      animationFrameId.current = requestAnimationFrame(animate)
    }

    // Initialize
    resizeCanvas()
    animate(0)

    // Event listeners
    window.addEventListener('resize', resizeCanvas)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [section])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-60"
      aria-hidden="true"
    />
  )
}
