'use client'

import { useEffect, useRef } from 'react'

interface AuroraWave {
  x: number
  y: number
  width: number
  height: number
  color: string
  opacity: number
  speed: number
  frequency: number
  amplitude: number
  phase: number
}

interface AuroraEffectsProps {
  section: string
}

export default function AuroraEffects({ section }: AuroraEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>()
  const waves = useRef<AuroraWave[]>([])
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
      initWaves()
    }

    // Create aurora wave
    const createWave = (): AuroraWave => {
      const colors = [
        'rgba(0, 255, 127, 0.03)', // Spring green
        'rgba(50, 205, 50, 0.025)', // Lime green
        'rgba(0, 191, 255, 0.02)', // Deep sky blue
        'rgba(138, 43, 226, 0.015)', // Blue violet
        'rgba(75, 0, 130, 0.01)' // Indigo
      ]

      return {
        x: Math.random() * canvas.width,
        y: canvas.height * 0.2 + Math.random() * canvas.height * 0.6,
        width: canvas.width * (1.2 + Math.random() * 0.8),
        height: 100 + Math.random() * 200,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.1 + Math.random() * 0.2,
        speed: 0.0005 + Math.random() * 0.001,
        frequency: 0.01 + Math.random() * 0.02,
        amplitude: 20 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2
      }
    }

    // Initialize waves
    const initWaves = () => {
      waves.current = []
      const waveCount = 4 + Math.floor(Math.random() * 3)
      
      for (let i = 0; i < waveCount; i++) {
        waves.current.push(createWave())
      }
    }

    // Draw aurora wave
    const drawWave = (wave: AuroraWave) => {
      ctx.save()
      ctx.globalAlpha = wave.opacity * (0.5 + Math.sin(time.current * 0.001) * 0.3)
      
      // Create gradient for aurora effect
      const gradient = ctx.createLinearGradient(0, wave.y - wave.height/2, 0, wave.y + wave.height/2)
      gradient.addColorStop(0, 'transparent')
      gradient.addColorStop(0.2, wave.color)
      gradient.addColorStop(0.5, wave.color.replace(/[\d.]+\)/, '0.08)'))
      gradient.addColorStop(0.8, wave.color)
      gradient.addColorStop(1, 'transparent')
      
      ctx.fillStyle = gradient
      
      // Draw flowing wave
      ctx.beginPath()
      const points = 100
      const stepX = wave.width / points
      
      // Top curve
      for (let i = 0; i <= points; i++) {
        const x = wave.x - wave.width/2 + i * stepX
        const waveY = wave.y - wave.height/2 + 
                     Math.sin(x * wave.frequency + time.current * wave.speed + wave.phase) * wave.amplitude
        
        if (i === 0) ctx.moveTo(x, waveY)
        else ctx.lineTo(x, waveY)
      }
      
      // Bottom curve (reverse)
      for (let i = points; i >= 0; i--) {
        const x = wave.x - wave.width/2 + i * stepX
        const waveY = wave.y + wave.height/2 + 
                     Math.sin(x * wave.frequency + time.current * wave.speed + wave.phase + Math.PI) * wave.amplitude * 0.7
        
        ctx.lineTo(x, waveY)
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
      
      // Draw waves
      waves.current.forEach(wave => {
        // Slowly drift the wave
        wave.x += Math.sin(time.current * 0.0003) * 0.1
        wave.phase += wave.speed * 0.5
        
        drawWave(wave)
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
      className="absolute inset-0 z-5 pointer-events-none opacity-40"
      aria-hidden="true"
    />
  )
}
