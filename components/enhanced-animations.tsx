"use client"

import { motion, useAnimation, useInView, Variants } from 'framer-motion'
import { useRef, useEffect, ReactNode } from 'react'
import { useMobileNavigationPerformance } from '@/hooks/use-mobile-navigation-performance'

// Enhanced animation variants with hardware acceleration
export const enhancedVariants = {
  // Fade animations with GPU acceleration
  fadeIn: {
    hidden: { 
      opacity: 0,
      transform: 'translateZ(0)' // Force hardware acceleration
    },
    visible: { 
      opacity: 1,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom bezier for smooth feel
      }
    }
  },

  // Slide animations with optimized transforms
  slideUp: {
    hidden: { 
      opacity: 0, 
      y: 60,
      transform: 'translateZ(0)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  },

  slideDown: {
    hidden: { 
      opacity: 0, 
      y: -60,
      transform: 'translateZ(0)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  },

  slideLeft: {
    hidden: { 
      opacity: 0, 
      x: 60,
      transform: 'translateZ(0)'
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  },

  slideRight: {
    hidden: { 
      opacity: 0, 
      x: -60,
      transform: 'translateZ(0)'
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  },

  // Scale animations
  scaleIn: {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transform: 'translateZ(0)'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  },

  // Stagger container for child animations
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  // Stagger items
  staggerItem: {
    hidden: { 
      opacity: 0, 
      y: 20,
      transform: 'translateZ(0)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transform: 'translateZ(0)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }
}

// Enhanced motion component with performance optimizations
interface EnhancedMotionProps {
  children: ReactNode
  variant?: keyof typeof enhancedVariants
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
  style?: React.CSSProperties
}

export function EnhancedMotion({
  children,
  variant = 'fadeIn',
  className = '',
  delay = 0,
  duration,
  once = true,
  threshold = 0.1,
  style = {}
}: EnhancedMotionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-10%' })
  const controls = useAnimation()
  const { optimizedSettings, getAnimationDuration } = useMobileNavigationPerformance()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  // Get the animation variant with performance optimizations
  const getOptimizedVariant = () => {
    const baseVariant = enhancedVariants[variant]
    const optimizedDuration = duration || getAnimationDuration(
      baseVariant.visible.transition?.duration ? baseVariant.visible.transition.duration * 1000 : 600
    ) / 1000

    return {
      ...baseVariant,
      visible: {
        ...baseVariant.visible,
        transition: {
          ...baseVariant.visible.transition,
          duration: optimizedDuration,
          delay: delay,
          type: optimizedSettings.enableSpringAnimations ? 'spring' : 'tween'
        }
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={getOptimizedVariant()}
      className={className}
      style={{
        ...style,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        perspective: 1000
      }}
    >
      {children}
    </motion.div>
  )
}

// Stagger animation container
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  once = true
}: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-10%' })
  const { optimizedSettings } = useMobileNavigationPerformance()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: optimizedSettings.enableStaggeredAnimations ? staggerDelay : 0,
        delayChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function StaggerItem({
  children,
  className = '',
  delay = 0
}: StaggerItemProps) {
  const { getAnimationDuration } = useMobileNavigationPerformance()

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      transform: 'translateZ(0)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transform: 'translateZ(0)',
      transition: {
        duration: getAnimationDuration(500) / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay
      }
    }
  }

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  )
}

// Hover animation wrapper
interface HoverAnimationProps {
  children: ReactNode
  className?: string
  scale?: number
  rotate?: number
  y?: number
}

export function HoverAnimation({
  children,
  className = '',
  scale = 1.05,
  rotate = 0,
  y = -5
}: HoverAnimationProps) {
  const { optimizedSettings } = useMobileNavigationPerformance()

  if (!optimizedSettings.enableHoverEffects) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      whileHover={{
        scale,
        rotate,
        y,
        transition: {
          duration: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
      whileTap={{
        scale: scale * 0.95,
        transition: {
          duration: 0.1
        }
      }}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)'
      }}
    >
      {children}
    </motion.div>
  )
}
