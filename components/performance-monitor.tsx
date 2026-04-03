"use client"

import { useEffect, useState, useRef } from "react"

interface PerformanceStats {
  fps: number
  frameTime: number
  memoryUsage?: number
  particleCount: number
  deviceInfo: {
    cores: number
    isMobile: boolean
    isLowEnd: boolean
  }
}

interface PerformanceMonitorProps {
  onStatsUpdate?: (stats: PerformanceStats) => void
}

export function PerformanceMonitor({ onStatsUpdate }: PerformanceMonitorProps) {
  const [showOverlay, setShowOverlay] = useState(false)
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    particleCount: 0,
    deviceInfo: {
      cores: navigator.hardwareConcurrency || 4,
      isMobile: false,
      isLowEnd: false
    }
  })

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsHistoryRef = useRef<number[]>([])

  useEffect(() => {
    // Load monitor visibility from localStorage
    const savedMonitor = localStorage.getItem("show-performance-monitor") === "true"
    setShowOverlay(savedMonitor)

    // Listen for storage events to sync with PerformanceSettings
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "show-performance-monitor") {
        setShowOverlay(e.newValue === "true")
      }
    }

    window.addEventListener("storage", handleStorageChange)

    const isMobile = window.innerWidth < 768
    const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile

    setStats(prev => ({
      ...prev,
      deviceInfo: {
        cores: navigator.hardwareConcurrency || 4,
        isMobile,
        isLowEnd
      }
    }))

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }

    let animationFrameId: number

    const measurePerformance = (currentTime: number) => {
      frameCountRef.current++
      const deltaTime = currentTime - lastTimeRef.current

      // Update FPS every second
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime)
        const frameTime = deltaTime / frameCountRef.current

        // Keep FPS history for smoothing
        fpsHistoryRef.current.push(fps)
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift()
        }

        const smoothedFps = Math.round(
          fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
        )

        const newStats: PerformanceStats = {
          fps: smoothedFps,
          frameTime: Math.round(frameTime * 100) / 100,
          memoryUsage: (performance as any).memory?.usedJSHeapSize 
            ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
            : undefined,
          particleCount: estimateParticleCount(),
          deviceInfo: {
            cores: navigator.hardwareConcurrency || 4,
            isMobile,
            isLowEnd
          }
        }

        setStats(newStats)
        onStatsUpdate?.(newStats)

        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }

      animationFrameId = requestAnimationFrame(measurePerformance)
    }

    animationFrameId = requestAnimationFrame(measurePerformance)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [onStatsUpdate])

  // Estimate total particle count across all components
  const estimateParticleCount = () => {
    const screenArea = window.innerWidth * window.innerHeight
    const isMobile = window.innerWidth < 768
    const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile
    const performanceMultiplier = isLowEnd ? 0.3 : isMobile ? 0.5 : 0.7

    // Galaxy background particles
    const galaxyParticles = 
      Math.floor((screenArea / 8000) * performanceMultiplier) + // background stars
      Math.floor((screenArea / 12000) * performanceMultiplier) + // middle stars
      Math.floor((screenArea / 20000) * performanceMultiplier) + // foreground stars
      Math.floor((screenArea / 100000) * performanceMultiplier) + // galaxy particles
      Math.floor((screenArea / 50000) * performanceMultiplier) // cosmic dust

    // Particle background
    const baseCount = isLowEnd ? 25000 : isMobile ? 20000 : 15000
    const particleBackground = Math.floor(screenArea / baseCount)

    // 3D background (if used)
    const baseCount3D = isLowEnd ? 40000 : isMobile ? 30000 : 20000
    const particles3D = Math.floor(screenArea / baseCount3D)

    return galaxyParticles + particleBackground + particles3D
  }

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return "text-green-400"
    if (fps >= 40) return "text-yellow-400"
    if (fps >= 25) return "text-orange-400"
    return "text-red-400"
  }

  const getPerformanceStatus = (fps: number) => {
    if (fps >= 55) return "Excellent"
    if (fps >= 40) return "Good"
    if (fps >= 25) return "Fair"
    return "Poor"
  }

  if (!showOverlay) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-sm font-mono text-white border border-white/20">
      <div className="space-y-2">
        <div className="text-blue-400 font-semibold">Performance Monitor</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-400">FPS:</div>
            <div className={`text-lg font-bold ${getPerformanceColor(stats.fps)}`}>
              {stats.fps} ({getPerformanceStatus(stats.fps)})
            </div>
          </div>
          
          <div>
            <div className="text-gray-400">Frame Time:</div>
            <div className="text-white">{stats.frameTime}ms</div>
          </div>
          
          <div>
            <div className="text-gray-400">Particles:</div>
            <div className="text-white">{stats.particleCount.toLocaleString()}</div>
          </div>
          
          <div>
            <div className="text-gray-400">CPU Cores:</div>
            <div className="text-white">{stats.deviceInfo.cores}</div>
          </div>
        </div>

        {stats.memoryUsage && (
          <div>
            <div className="text-gray-400">Memory:</div>
            <div className="text-white">{stats.memoryUsage}MB</div>
          </div>
        )}

        <div className="pt-2 border-t border-white/20">
          <div className="text-xs text-gray-400">
            Device: {stats.deviceInfo.isMobile ? "Mobile" : "Desktop"} 
            {stats.deviceInfo.isLowEnd && " (Low-end)"}
          </div>
        </div>
      </div>
    </div>
  )
}
