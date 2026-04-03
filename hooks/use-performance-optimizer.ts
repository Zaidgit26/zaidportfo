"use client"

import { useEffect, useState, useCallback, useRef } from 'react'

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  connectionSpeed: 'slow' | 'fast' | 'unknown'
  deviceType: 'mobile' | 'tablet' | 'desktop'
  cpuCores: number
  isLowEndDevice: boolean
  batteryLevel?: number
  isCharging?: boolean
}

interface OptimizationSettings {
  enableAnimations: boolean
  enableParticles: boolean
  enableBlur: boolean
  enableShadows: boolean
  animationDuration: number
  particleCount: number
  blurIntensity: string
  shadowQuality: string
  enableHardwareAcceleration: boolean
  enableWillChange: boolean
  enableTransform3d: boolean
  maxConcurrentAnimations: number
}

export function usePerformanceOptimizer() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    connectionSpeed: 'unknown',
    deviceType: 'desktop',
    cpuCores: 4,
    isLowEndDevice: false
  })

  const [settings, setSettings] = useState<OptimizationSettings>({
    enableAnimations: true,
    enableParticles: true,
    enableBlur: true,
    enableShadows: true,
    animationDuration: 300,
    particleCount: 50,
    blurIntensity: 'blur(20px)',
    shadowQuality: 'shadow-xl',
    enableHardwareAcceleration: true,
    enableWillChange: true,
    enableTransform3d: true,
    maxConcurrentAnimations: 10
  })

  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fpsHistory = useRef<number[]>([])
  const animationFrame = useRef<number>()

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent)
    const isTablet = /tablet|ipad/i.test(userAgent) && !isMobile
    
    const deviceType: PerformanceMetrics['deviceType'] = 
      isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
    
    const cpuCores = navigator.hardwareConcurrency || 4
    const isLowEndDevice = cpuCores <= 4 || isMobile

    // Detect connection speed
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    const connectionSpeed: PerformanceMetrics['connectionSpeed'] = 
      connection ? (connection.effectiveType === '4g' ? 'fast' : 'slow') : 'unknown'

    // Get memory info if available
    const memoryInfo = (performance as any).memory
    const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize : 0

    // Battery API
    let batteryLevel: number | undefined
    let isCharging: boolean | undefined
    
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        batteryLevel = battery.level
        isCharging = battery.charging
      })
    }

    setMetrics(prev => ({
      ...prev,
      deviceType,
      cpuCores,
      isLowEndDevice,
      connectionSpeed,
      memoryUsage,
      batteryLevel,
      isCharging
    }))
  }, [])

  // FPS monitoring
  const measureFPS = useCallback(() => {
    const measure = (currentTime: number) => {
      frameCount.current++
      const deltaTime = currentTime - lastTime.current

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / deltaTime)
        
        fpsHistory.current.push(fps)
        if (fpsHistory.current.length > 10) {
          fpsHistory.current.shift()
        }

        const averageFps = Math.round(
          fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
        )

        setMetrics(prev => ({ ...prev, fps: averageFps }))

        frameCount.current = 0
        lastTime.current = currentTime
      }

      animationFrame.current = requestAnimationFrame(measure)
    }

    animationFrame.current = requestAnimationFrame(measure)
  }, [])

  // Optimize settings based on performance
  const optimizeSettings = useCallback(() => {
    const { fps, isLowEndDevice, deviceType, memoryUsage, batteryLevel, isCharging } = metrics
    
    // Base optimization on FPS
    const isPerformancePoor = fps < 45
    const isPerformanceFair = fps >= 45 && fps < 55
    const isPerformanceGood = fps >= 55

    // Battery optimization
    const isBatteryLow = batteryLevel !== undefined && batteryLevel < 0.2 && !isCharging

    const newSettings: OptimizationSettings = {
      // Animation settings
      enableAnimations: !isPerformancePoor && !isBatteryLow,
      animationDuration: isPerformancePoor ? 150 : isPerformanceFair ? 200 : 300,
      maxConcurrentAnimations: isPerformancePoor ? 3 : isPerformanceFair ? 6 : 10,

      // Visual effects
      enableParticles: isPerformanceGood && deviceType === 'desktop' && !isBatteryLow,
      particleCount: isPerformancePoor ? 10 : isPerformanceFair ? 25 : 50,
      
      enableBlur: !isPerformancePoor && !isBatteryLow,
      blurIntensity: isPerformancePoor ? 'blur(4px)' : isPerformanceFair ? 'blur(8px)' : 'blur(20px)',
      
      enableShadows: !isPerformancePoor,
      shadowQuality: isPerformancePoor ? 'shadow-sm' : isPerformanceFair ? 'shadow-lg' : 'shadow-xl',

      // Hardware acceleration
      enableHardwareAcceleration: !isLowEndDevice,
      enableWillChange: !isPerformancePoor,
      enableTransform3d: !isLowEndDevice && !isPerformancePoor
    }

    setSettings(newSettings)
  }, [metrics])

  // Apply CSS optimizations
  const applyCSSOptimizations = useCallback(() => {
    const root = document.documentElement
    
    // Set CSS custom properties for dynamic optimization
    root.style.setProperty('--animation-duration', `${settings.animationDuration}ms`)
    root.style.setProperty('--blur-intensity', settings.blurIntensity)
    root.style.setProperty('--shadow-quality', settings.shadowQuality)
    root.style.setProperty('--particle-count', settings.particleCount.toString())

    // Add performance classes
    document.body.classList.toggle('performance-poor', metrics.fps < 45)
    document.body.classList.toggle('performance-fair', metrics.fps >= 45 && metrics.fps < 55)
    document.body.classList.toggle('performance-good', metrics.fps >= 55)
    document.body.classList.toggle('low-end-device', metrics.isLowEndDevice)
    document.body.classList.toggle('mobile-device', metrics.deviceType === 'mobile')
    document.body.classList.toggle('animations-disabled', !settings.enableAnimations)
    document.body.classList.toggle('particles-disabled', !settings.enableParticles)
    document.body.classList.toggle('blur-disabled', !settings.enableBlur)
    document.body.classList.toggle('shadows-disabled', !settings.enableShadows)

    // Hardware acceleration hints
    if (settings.enableHardwareAcceleration) {
      root.style.setProperty('--gpu-acceleration', 'translateZ(0)')
      root.style.setProperty('--will-change', settings.enableWillChange ? 'transform, opacity' : 'auto')
    }
  }, [settings, metrics])

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    // Preload fonts
    const fontPreloads = [
      'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
    ]

    fontPreloads.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = href
      document.head.appendChild(link)
    })

    // Hint browser about upcoming animations
    const style = document.createElement('style')
    style.textContent = `
      * {
        ${settings.enableHardwareAcceleration ? 'transform: translateZ(0);' : ''}
        ${settings.enableWillChange ? 'will-change: transform, opacity;' : ''}
      }
    `
    document.head.appendChild(style)
  }, [settings])

  // Initialize performance monitoring
  useEffect(() => {
    detectDeviceCapabilities()
    measureFPS()
    preloadCriticalResources()

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [detectDeviceCapabilities, measureFPS, preloadCriticalResources])

  // Update settings when metrics change
  useEffect(() => {
    optimizeSettings()
  }, [optimizeSettings])

  // Apply CSS optimizations when settings change
  useEffect(() => {
    applyCSSOptimizations()
  }, [applyCSSOptimizations])

  // Adaptive quality adjustment
  const adjustQuality = useCallback((increase: boolean) => {
    setSettings(prev => {
      const factor = increase ? 1.2 : 0.8
      return {
        ...prev,
        animationDuration: Math.max(100, Math.min(500, prev.animationDuration * factor)),
        particleCount: Math.max(5, Math.min(100, Math.round(prev.particleCount * factor)))
      }
    })
  }, [])

  return {
    metrics,
    settings,
    
    // Utility functions
    isPerformanceGood: () => metrics.fps >= 55,
    isPerformanceFair: () => metrics.fps >= 45 && metrics.fps < 55,
    isPerformancePoor: () => metrics.fps < 45,
    
    shouldUseAnimation: () => settings.enableAnimations,
    shouldUseParticles: () => settings.enableParticles,
    shouldUseBlur: () => settings.enableBlur,
    shouldUseShadows: () => settings.enableShadows,
    
    getOptimalDuration: (baseDuration: number) => 
      Math.round(baseDuration * (settings.animationDuration / 300)),
    
    adjustQuality,
    
    // Manual overrides
    forceHighQuality: () => setSettings(prev => ({
      ...prev,
      enableAnimations: true,
      enableParticles: true,
      enableBlur: true,
      enableShadows: true,
      animationDuration: 300,
      particleCount: 50
    })),
    
    forceLowQuality: () => setSettings(prev => ({
      ...prev,
      enableAnimations: false,
      enableParticles: false,
      enableBlur: false,
      enableShadows: false,
      animationDuration: 150,
      particleCount: 10
    }))
  }
}
