"use client"

import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import NebulaEffects from "./nebula-effects"
import AuroraEffects from "./aurora-effects"

interface Star {
  x: number
  y: number
  z: number
  size: number
  color: string
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

interface FallingStar {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
  trail: { x: number; y: number; opacity: number }[]
}

interface CosmicDust {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  twinkle: number
  twinkleSpeed: number
}

interface DistantGalaxy {
  x: number
  y: number
  size: number
  opacity: number
  color: string
  pulseSpeed: number
  pulseOffset: number
  rotation: number
  rotationSpeed: number
}

interface GalaxyParticle {
  x: number
  y: number
  z: number
  size: number
  color: string
  opacity: number
  angle: number
  distance: number
  speed: number
}



interface Interactive3DBackgroundProps {
  section: string
}

export function GalaxyBackground({ section }: Interactive3DBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, rawX: 0, rawY: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const zoomRef = useRef(1.0)
  const isMobile = useIsMobile()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let stars: Star[] = []
    let backgroundStars: Star[] = []
    let foregroundStars: Star[] = []
    let galaxyParticles: GalaxyParticle[] = []
    let shootingStars: ShootingStar[] = []
    let fallingStars: FallingStar[] = []
    let cosmicDust: CosmicDust[] = []
    let distantGalaxies: DistantGalaxy[] = []
    let time = 0
    let lastShootingStarTime = 0
    let lastFallingStarTime = 0
    let lastCursorParticleTime = 0
    let lastFrameTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initGalaxy()
    }

    // Enhanced mouse tracking for cosmic particle interaction (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      // Skip expensive calculations on mobile
      if (isMobile) return

      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1, // Full range -1 to 1
        y: (e.clientY / window.innerHeight) * 2 - 1,
        rawX: e.clientX, // Store actual pixel coordinates
        rawY: e.clientY
      }
    }

    // Initialize enhanced galaxy with more cosmic effects and three layers
    const initGalaxy = () => {
      stars = []
      backgroundStars = []
      foregroundStars = []
      galaxyParticles = []
      cosmicDust = []

      // Create three layers of stars for depth - optimized counts
      // Background layer (far, slow moving, small)
      const backgroundStarCount = Math.floor((window.innerWidth * window.innerHeight) / 1500) // Reduced from 800
      for (let i = 0; i < backgroundStarCount; i++) {
        backgroundStars.push(createLayeredStar('background'))
      }

      // Middle layer (medium distance, medium movement)
      const starCount = Math.floor((window.innerWidth * window.innerHeight) / 2000) // Reduced from 1200
      for (let i = 0; i < starCount; i++) {
        stars.push(createLayeredStar('middle'))
      }

      // Foreground layer (close, fast moving, larger)
      const foregroundStarCount = Math.floor((window.innerWidth * window.innerHeight) / 3500) // Reduced from 2000
      for (let i = 0; i < foregroundStarCount; i++) {
        foregroundStars.push(createLayeredStar('foreground'))
      }

      // Create galaxy spiral particles - optimized
      const galaxyCount = Math.floor((window.innerWidth * window.innerHeight) / 40000) // Reduced for performance
      for (let i = 0; i < galaxyCount; i++) {
        galaxyParticles.push(createGalaxyParticle())
      }

      // Create cosmic dust particles - optimized
      const dustCount = Math.floor((window.innerWidth * window.innerHeight) / 15000) // Reduced for performance
      for (let i = 0; i < dustCount; i++) {
        cosmicDust.push(createCosmicDust())
      }

      // Create distant galaxies
      const distantGalaxyCount = 3
      for (let i = 0; i < distantGalaxyCount; i++) {
        distantGalaxies.push(createDistantGalaxy())
      }

      setIsLoaded(true)
    }

    // Create layered stars for depth effect
    const createLayeredStar = (layer: 'background' | 'middle' | 'foreground'): Star => {
      const starTypes = [
        { color: '#ffffff', size: 0.8, opacity: 0.9 },
        { color: '#ffffff', size: 1.2, opacity: 0.8 },
        { color: '#ffffcc', size: 1.0, opacity: 0.85 },
        { color: '#ccddff', size: 1.4, opacity: 0.7 },
        { color: '#ffddcc', size: 0.9, opacity: 0.6 },
        { color: '#ffffff', size: 2.0, opacity: 1.0 },
      ]

      const type = Math.random() < 0.6 ? starTypes[0] : starTypes[Math.floor(Math.random() * starTypes.length)]

      let zRange, sizeMultiplier, opacityMultiplier

      switch (layer) {
        case 'background':
          zRange = { min: 800, max: 1200 }
          sizeMultiplier = 0.5
          opacityMultiplier = 0.3
          break
        case 'middle':
          zRange = { min: 400, max: 800 }
          sizeMultiplier = 1.0
          opacityMultiplier = 0.7
          break
        case 'foreground':
          zRange = { min: 100, max: 400 }
          sizeMultiplier = 1.5
          opacityMultiplier = 1.0
          break
      }

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * (zRange.max - zRange.min) + zRange.min,
        size: (type.size + Math.random() * 0.4) * sizeMultiplier,
        color: type.color,
        opacity: type.opacity * opacityMultiplier * (0.6 + Math.random() * 0.4),
        twinkleSpeed: Math.random() * 0.005 + 0.001,
        twinkleOffset: Math.random() * Math.PI * 2
      }
    }

    // Create galaxy dust particle (very subtle, no circles)
    const createGalaxyParticle = (): GalaxyParticle => {
      const centerX = canvas.width * 0.2 // Far left side
      const centerY = canvas.height * 0.3
      const angle = Math.random() * Math.PI * 6 // Multiple spiral arms
      const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.6

      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        z: Math.random() * 800,
        size: Math.random() * 120 + 80, // Larger, more diffuse
        color: '#0a0a1a',
        opacity: Math.random() * 0.03 + 0.01, // Much more subtle
        angle,
        distance,
        speed: Math.random() * 0.0003 + 0.0001 // Much slower
      }
    }



    // Create shooting star
    const createShootingStar = (): ShootingStar => {
      const side = Math.floor(Math.random() * 4)
      let x, y, vx, vy

      switch (side) {
        case 0: // From top
          x = Math.random() * canvas.width
          y = -50
          vx = (Math.random() - 0.5) * 3
          vy = Math.random() * 2 + 1
          break
        case 1: // From right
          x = canvas.width + 50
          y = Math.random() * canvas.height
          vx = -(Math.random() * 2 + 1)
          vy = (Math.random() - 0.5) * 3
          break
        case 2: // From bottom
          x = Math.random() * canvas.width
          y = canvas.height + 50
          vx = (Math.random() - 0.5) * 3
          vy = -(Math.random() * 2 + 1)
          break
        default: // From left
          x = -50
          y = Math.random() * canvas.height
          vx = Math.random() * 2 + 1
          vy = (Math.random() - 0.5) * 3
      }

      const maxLife = Math.random() * 80 + 40

      return {
        x, y, vx, vy,
        length: Math.random() * 60 + 30,
        opacity: 1,
        color: '#ffffff',
        life: maxLife,
        maxLife
      }
    }

    // Create falling star (cascading downward)
    const createFallingStar = (): FallingStar => {
      return {
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        size: Math.random() * 3 + 1,
        opacity: 1,
        color: Math.random() > 0.5 ? '#ffffff' : '#87ceeb',
        life: Math.random() * 120 + 60,
        maxLife: Math.random() * 120 + 60,
        trail: []
      }
    }

    // Create cosmic dust particle
    const createCosmicDust = (): CosmicDust => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.7 ? '#4169e1' : '#ffffff',
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.01
      }
    }

    // Create distant galaxy
    const createDistantGalaxy = (): DistantGalaxy => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 150 + 100,
        opacity: Math.random() * 0.15 + 0.05,
        color: Math.random() > 0.5 ? '#4169e1' : '#8a2be2',
        pulseSpeed: Math.random() * 0.01 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.001 + 0.0005
      }
    }

    // Draw layered star with enhanced cursor interaction and zoom effect
    const drawLayeredStar = (star: Star, layer: 'background' | 'middle' | 'foreground') => {
      const baseScale = 800 / (800 + star.z)
      const zoomScale = zoomRef.current
      const scale = baseScale * zoomScale

      // Calculate distance to cursor for attraction effect
      const dx = mouseRef.current.rawX - star.x
      const dy = mouseRef.current.rawY - star.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = layer === 'foreground' ? 400 : layer === 'middle' ? 300 : 200

      // Layer-specific mouse influence
      let mouseInfluence = 0
      switch (layer) {
        case 'background':
          mouseInfluence = Math.max(0, 1 - star.z / 1200) * 10
          break
        case 'middle':
          mouseInfluence = Math.max(0, 1 - star.z / 800) * 25
          break
        case 'foreground':
          mouseInfluence = Math.max(0, 1 - star.z / 400) * 40
          break
      }

      if (distance < maxDistance) {
        mouseInfluence *= (1 - distance / maxDistance) * (layer === 'foreground' ? 4 : layer === 'middle' ? 3 : 2)
      }

      // Apply enhanced zoom movement effect
      const zoomMovement = (zoomRef.current - 1) * 0.8 // More pronounced movement
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const zoomOffsetX = (star.x - centerX) * zoomMovement
      const zoomOffsetY = (star.y - centerY) * zoomMovement

      const x = star.x + mouseRef.current.x * mouseInfluence * scale + zoomOffsetX
      const y = star.y + mouseRef.current.y * mouseInfluence * scale + zoomOffsetY
      const size = star.size * scale

      // Enhanced twinkling effect
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7
      const opacity = star.opacity * twinkle * scale

      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = star.color

      // Draw star as a cross/plus shape
      const armLength = size * 1.5
      const armWidth = size * 0.2

      // Horizontal arm
      ctx.fillRect(x - armLength, y - armWidth, armLength * 2, armWidth * 2)
      // Vertical arm
      ctx.fillRect(x - armWidth, y - armLength, armWidth * 2, armLength * 2)

      // Add bright center point
      const centerSize = size * 0.6
      ctx.fillRect(x - centerSize/2, y - centerSize/2, centerSize, centerSize)

      ctx.restore()
    }

    // Draw galaxy particle as irregular dust cloud (no circles)
    const drawGalaxyParticle = (particle: GalaxyParticle) => {
      const scale = 800 / (800 + particle.z)

      // Calculate distance to cursor for attraction effect
      const dx = mouseRef.current.rawX - particle.x
      const dy = mouseRef.current.rawY - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 400

      let mouseInfluence = 15 * scale // Increased influence
      if (distance < maxDistance) {
        mouseInfluence *= (1 - distance / maxDistance) * 2
      }

      const x = particle.x + mouseRef.current.x * mouseInfluence
      const y = particle.y + mouseRef.current.y * mouseInfluence
      const size = particle.size * scale

      ctx.save()
      ctx.globalAlpha = particle.opacity * scale * 0.2 // Much more subtle

      // Create very diffuse gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient.addColorStop(0, particle.color + '20')
      gradient.addColorStop(0.4, particle.color + '10')
      gradient.addColorStop(0.8, particle.color + '05')
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient

      // Create irregular dust cloud shape instead of circle
      ctx.beginPath()
      const points = 12
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2
        const radius = size * (0.5 + Math.random() * 0.8) // Irregular radius
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }



    // Draw shooting star
    const drawShootingStar = (star: ShootingStar) => {
      const opacity = star.opacity * (star.life / star.maxLife)

      ctx.save()
      ctx.globalAlpha = opacity
      ctx.strokeStyle = star.color
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'

      // Create gradient tail
      const gradient = ctx.createLinearGradient(
        star.x, star.y,
        star.x - star.vx * star.length / 4, star.y - star.vy * star.length / 4
      )
      gradient.addColorStop(0, star.color)
      gradient.addColorStop(1, 'transparent')

      ctx.strokeStyle = gradient
      ctx.beginPath()
      ctx.moveTo(star.x, star.y)
      ctx.lineTo(
        star.x - star.vx * star.length / 4,
        star.y - star.vy * star.length / 4
      )
      ctx.stroke()

      // Bright head (diamond shape instead of circle)
      ctx.fillStyle = star.color
      ctx.beginPath()
      ctx.moveTo(star.x, star.y - 2)
      ctx.lineTo(star.x + 1.5, star.y)
      ctx.lineTo(star.x, star.y + 2)
      ctx.lineTo(star.x - 1.5, star.y)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }

    // Draw falling star with trail
    const drawFallingStar = (star: FallingStar) => {
      // Update trail
      star.trail.push({ x: star.x, y: star.y, opacity: star.opacity })
      if (star.trail.length > 8) star.trail.shift()

      // Draw trail
      ctx.save()
      star.trail.forEach((point, index) => {
        const trailOpacity = (index / star.trail.length) * point.opacity * 0.5
        ctx.globalAlpha = trailOpacity
        ctx.fillStyle = star.color
        const trailSize = star.size * (index / star.trail.length)
        ctx.fillRect(point.x - trailSize/2, point.y - trailSize/2, trailSize, trailSize)
      })

      // Draw main star
      ctx.globalAlpha = star.opacity
      ctx.fillStyle = star.color
      ctx.fillRect(star.x - star.size/2, star.y - star.size/2, star.size, star.size)

      // Add sparkle effect
      const sparkleSize = star.size * 0.3
      ctx.fillRect(star.x - sparkleSize/2, star.y - star.size*1.5, sparkleSize, star.size*3)
      ctx.fillRect(star.x - star.size*1.5, star.y - sparkleSize/2, star.size*3, sparkleSize)

      ctx.restore()
    }

    // Draw cosmic dust particle with zoom effect
    const drawCosmicDust = (dust: CosmicDust) => {
      const baseScale = 800 / (800 + dust.z)
      const zoomScale = zoomRef.current
      const scale = baseScale * zoomScale

      // Calculate distance to cursor for attraction effect
      const dx = mouseRef.current.rawX - dust.x
      const dy = mouseRef.current.rawY - dust.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 250

      let mouseInfluence = Math.max(0, 1 - dust.z / 800) * 30 // Enhanced influence
      if (distance < maxDistance) {
        mouseInfluence *= (1 - distance / maxDistance) * 5 // Stronger attraction
      }

      // Apply enhanced zoom movement effect
      const zoomMovement = (zoomRef.current - 1) * 0.6 // More pronounced movement
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const zoomOffsetX = (dust.x - centerX) * zoomMovement
      const zoomOffsetY = (dust.y - centerY) * zoomMovement

      const x = dust.x + mouseRef.current.x * mouseInfluence * scale + zoomOffsetX
      const y = dust.y + mouseRef.current.y * mouseInfluence * scale + zoomOffsetY
      const size = dust.size * scale

      // Enhanced twinkling effect
      const twinkle = Math.sin(time * dust.twinkleSpeed + dust.twinkle) * 0.4 + 0.6
      const opacity = dust.opacity * twinkle * scale

      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = dust.color

      // Draw as small diamond
      ctx.beginPath()
      ctx.moveTo(x, y - size)
      ctx.lineTo(x + size*0.7, y)
      ctx.lineTo(x, y + size)
      ctx.lineTo(x - size*0.7, y)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }

    // Draw distant galaxy
    const drawDistantGalaxy = (galaxy: DistantGalaxy) => {
      const pulse = Math.sin(time * galaxy.pulseSpeed + galaxy.pulseOffset) * 0.3 + 0.7
      const opacity = galaxy.opacity * pulse

      ctx.save()
      ctx.globalAlpha = opacity
      ctx.translate(galaxy.x, galaxy.y)
      ctx.rotate(galaxy.rotation)

      // Create spiral galaxy gradient
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size)
      gradient.addColorStop(0, galaxy.color + '40')
      gradient.addColorStop(0.3, galaxy.color + '20')
      gradient.addColorStop(0.6, galaxy.color + '10')
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient

      // Draw spiral arms
      ctx.beginPath()
      const arms = 2
      for (let arm = 0; arm < arms; arm++) {
        const armAngle = (arm / arms) * Math.PI * 2
        for (let i = 0; i < 50; i++) {
          const t = i / 50
          const angle = armAngle + t * Math.PI * 4
          const radius = t * galaxy.size * 0.8
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius * 0.6 // Flatten for galaxy shape

          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
      }
      ctx.fill()

      // Add bright center
      const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size * 0.1)
      centerGradient.addColorStop(0, galaxy.color + '80')
      centerGradient.addColorStop(1, 'transparent')
      ctx.fillStyle = centerGradient
      ctx.fillRect(-galaxy.size * 0.1, -galaxy.size * 0.1, galaxy.size * 0.2, galaxy.size * 0.2)

      ctx.restore()
    }

    // Optimized animation loop with frame rate limiting
    const animate = (currentTime: number) => {
      // Frame rate limiting for better performance
      if (currentTime - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      lastFrameTime = currentTime

      time = currentTime * 0.001

      // Enhanced infinite zoom effect - more noticeable and slower
      zoomRef.current = Math.max(0.6, 1 + Math.sin(time * 0.0003) * 0.6 + 0.2) // Much slower and more pronounced zoom

      // Create shooting stars less frequently for performance
      if (currentTime - lastShootingStarTime > 4000 + Math.random() * 4000 && shootingStars.length < 5) {
        shootingStars.push(createShootingStar())
        lastShootingStarTime = currentTime
      }

      // Create falling stars less frequently
      if (currentTime - lastFallingStarTime > 6000 + Math.random() * 6000 && fallingStars.length < 3) {
        fallingStars.push(createFallingStar())
        lastFallingStarTime = currentTime
      }

      // Create cursor-following particles only on desktop for performance
      if (!isMobile && currentTime - lastCursorParticleTime > 600 + Math.random() * 800) {
        if (mouseRef.current.rawX && mouseRef.current.rawY && cosmicDust.length < 150) { // Reduced particle limit
          cosmicDust.push({
            x: mouseRef.current.rawX + (Math.random() - 0.5) * 80,
            y: mouseRef.current.rawY + (Math.random() - 0.5) * 80,
            z: Math.random() * 200,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 1.2 + 0.4,
            opacity: Math.random() * 0.7 + 0.3,
            color: Math.random() > 0.5 ? '#ffffff' : '#87ceeb',
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.025 + 0.015
          })
        }
        lastCursorParticleTime = currentTime
      }

      // Clear canvas with deep space background
      ctx.fillStyle = '#000008'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle gradient overlay for depth
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.4, 0,
        canvas.width * 0.3, canvas.height * 0.4, Math.max(canvas.width, canvas.height) * 0.8
      )
      gradient.addColorStop(0, 'rgba(10, 10, 25, 0.2)')
      gradient.addColorStop(0.5, 'rgba(5, 5, 15, 0.4)')
      gradient.addColorStop(1, 'rgba(0, 0, 8, 0.8)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw cosmic dust
      cosmicDust.forEach(dust => {
        dust.x += dust.vx
        dust.y += dust.vy
        dust.twinkle += dust.twinkleSpeed

        // Wrap around edges
        if (dust.x < -50) dust.x = canvas.width + 50
        if (dust.x > canvas.width + 50) dust.x = -50
        if (dust.y < -50) dust.y = canvas.height + 50
        if (dust.y > canvas.height + 50) dust.y = -50

        drawCosmicDust(dust)
      })

      // Update and draw galaxy particles
      galaxyParticles.forEach(particle => {
        particle.angle += particle.speed
        particle.x = (canvas.width * 0.2) + Math.cos(particle.angle) * particle.distance
        particle.y = (canvas.height * 0.3) + Math.sin(particle.angle) * particle.distance * 0.5

        drawGalaxyParticle(particle)
      })

      // Update and draw shooting stars
      shootingStars = shootingStars.filter(star => {
        star.x += star.vx
        star.y += star.vy
        star.life--
        star.opacity = star.life / star.maxLife

        if (star.life <= 0 ||
            star.x < -100 || star.x > canvas.width + 100 ||
            star.y < -100 || star.y > canvas.height + 100) {
          return false
        }

        drawShootingStar(star)
        return true
      })

      // Update and draw falling stars
      fallingStars = fallingStars.filter(star => {
        star.x += star.vx
        star.y += star.vy
        star.life--
        star.opacity = star.life / star.maxLife

        if (star.life <= 0 || star.y > canvas.height + 50) {
          return false
        }

        drawFallingStar(star)
        return true
      })

      // Draw all three layers of stars for depth
      // Background layer (furthest, most subtle)
      backgroundStars.forEach(star => {
        drawLayeredStar(star, 'background')
      })

      // Middle layer (main star field)
      stars.forEach(star => {
        drawLayeredStar(star, 'middle')
      })

      // Foreground layer (closest, most interactive)
      foregroundStars.forEach(star => {
        drawLayeredStar(star, 'foreground')
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Initialize
    resizeCanvas()
    animate(0)

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
    <div className="absolute inset-0 z-0">
      {/* Nebula background layer */}
      <NebulaEffects section={section} />

      {/* Aurora effects layer */}
      <AuroraEffects section={section} />

      {/* Main galaxy canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
    </div>
  )
}
