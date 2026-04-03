"use client"

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ReactNode, useState, useEffect } from 'react'
import { usePerformanceOptimizer } from '@/hooks/use-performance-optimizer'

// Page transition variants
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    filter: 'blur(4px)'
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)'
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    filter: 'blur(4px)'
  }
}

// Modal transition variants
const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50
  }
}

// Slide transition variants
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
}

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const { getOptimalDuration, settings } = usePerformanceOptimizer()

  const transitionSettings = {
    type: settings.enableAnimations ? "tween" : "tween",
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: getOptimalDuration(600) / 1000
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={settings.enableAnimations ? pageVariants : {}}
      transition={transitionSettings}
      className={className}
      style={{
        willChange: settings.enableWillChange ? 'transform, opacity, filter' : 'auto',
        transform: settings.enableHardwareAcceleration ? 'translateZ(0)' : 'none'
      }}
    >
      {children}
    </motion.div>
  )
}

interface ModalTransitionProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function ModalTransition({ isOpen, onClose, children, className = '' }: ModalTransitionProps) {
  const { getOptimalDuration, settings } = usePerformanceOptimizer()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: getOptimalDuration(200) / 1000 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            variants={settings.enableAnimations ? modalVariants : {}}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: settings.enableAnimations ? "spring" : "tween",
              stiffness: 300,
              damping: 30,
              duration: getOptimalDuration(400) / 1000
            }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
            style={{
              willChange: settings.enableWillChange ? 'transform, opacity' : 'auto',
              transform: settings.enableHardwareAcceleration ? 'translateZ(0)' : 'none'
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface SlideTransitionProps {
  children: ReactNode
  direction: number
  className?: string
}

export function SlideTransition({ children, direction, className = '' }: SlideTransitionProps) {
  const { getOptimalDuration, settings } = usePerformanceOptimizer()

  return (
    <motion.div
      custom={direction}
      variants={settings.enableAnimations ? slideVariants : {}}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: getOptimalDuration(200) / 1000 }
      }}
      className={className}
      style={{
        willChange: settings.enableWillChange ? 'transform, opacity' : 'auto',
        transform: settings.enableHardwareAcceleration ? 'translateZ(0)' : 'none'
      }}
    >
      {children}
    </motion.div>
  )
}

interface FadeTransitionProps {
  show: boolean
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeTransition({ show, children, className = '', delay = 0 }: FadeTransitionProps) {
  const { getOptimalDuration, settings } = usePerformanceOptimizer()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: getOptimalDuration(300) / 1000,
            delay: delay / 1000,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className={className}
          style={{
            willChange: settings.enableWillChange ? 'opacity' : 'auto'
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ScaleTransitionProps {
  show: boolean
  children: ReactNode
  className?: string
  delay?: number
}

export function ScaleTransition({ show, children, className = '', delay = 0 }: ScaleTransitionProps) {
  const { getOptimalDuration, settings } = usePerformanceOptimizer()

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: getOptimalDuration(400) / 1000,
            delay: delay / 1000,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className={className}
          style={{
            willChange: settings.enableWillChange ? 'transform, opacity' : 'auto',
            transform: settings.enableHardwareAcceleration ? 'translateZ(0)' : 'none'
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ListTransitionProps {
  items: any[]
  children: (item: any, index: number) => ReactNode
  className?: string
  staggerDelay?: number
}

export function ListTransition({ items, children, className = '', staggerDelay = 100 }: ListTransitionProps) {
  const { getOptimalDuration, settings } = usePerformanceOptimizer()

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: settings.enableAnimations ? staggerDelay / 1000 : 0
          }
        }
      }}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: getOptimalDuration(300) / 1000,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }
          }}
          style={{
            willChange: settings.enableWillChange ? 'transform, opacity' : 'auto',
            transform: settings.enableHardwareAcceleration ? 'translateZ(0)' : 'none'
          }}
        >
          {children(item, index)}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Hook for managing transition states
export function useTransitionState(initialState = false) {
  const [isVisible, setIsVisible] = useState(initialState)
  const [isAnimating, setIsAnimating] = useState(false)

  const show = () => {
    setIsAnimating(true)
    setIsVisible(true)
  }

  const hide = () => {
    setIsAnimating(true)
    setIsVisible(false)
  }

  const toggle = () => {
    if (isVisible) {
      hide()
    } else {
      show()
    }
  }

  // Reset animating state after transition
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 500) // Adjust based on your transition duration

      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  return {
    isVisible,
    isAnimating,
    show,
    hide,
    toggle
  }
}
