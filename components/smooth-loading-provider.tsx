"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePerformanceOptimizer } from '@/hooks/use-performance-optimizer'

interface LoadingState {
  isLoading: boolean
  progress: number
  stage: 'initializing' | 'loading-assets' | 'rendering' | 'complete'
  message: string
}

interface LoadingContextType {
  loadingState: LoadingState
  setLoading: (loading: boolean) => void
  setProgress: (progress: number) => void
  setStage: (stage: LoadingState['stage']) => void
  setMessage: (message: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a SmoothLoadingProvider')
  }
  return context
}

interface SmoothLoadingProviderProps {
  children: ReactNode
}

export function SmoothLoadingProvider({ children }: SmoothLoadingProviderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    stage: 'initializing',
    message: 'Initializing...'
  })

  const { settings, getOptimalDuration } = usePerformanceOptimizer()

  const setLoading = (loading: boolean) => {
    setLoadingState(prev => ({ ...prev, isLoading: loading }))
  }

  const setProgress = (progress: number) => {
    setLoadingState(prev => ({ ...prev, progress: Math.max(0, Math.min(100, progress)) }))
  }

  const setStage = (stage: LoadingState['stage']) => {
    setLoadingState(prev => ({ ...prev, stage }))
  }

  const setMessage = (message: string) => {
    setLoadingState(prev => ({ ...prev, message }))
  }

  // Simulate loading process
  useEffect(() => {
    const loadingSequence = async () => {
      // Stage 1: Initializing
      setStage('initializing')
      setMessage('Preparing experience...')
      setProgress(10)
      await new Promise(resolve => setTimeout(resolve, 300))

      // Stage 2: Loading assets
      setStage('loading-assets')
      setMessage('Loading assets...')
      
      // Simulate asset loading with progress
      for (let i = 20; i <= 70; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Stage 3: Rendering
      setStage('rendering')
      setMessage('Rendering interface...')
      setProgress(80)
      await new Promise(resolve => setTimeout(resolve, 200))

      setProgress(90)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Stage 4: Complete
      setStage('complete')
      setMessage('Ready!')
      setProgress(100)
      await new Promise(resolve => setTimeout(resolve, 300))

      // Fade out loading screen
      setLoading(false)
    }

    loadingSequence()
  }, [])

  const contextValue: LoadingContextType = {
    loadingState,
    setLoading,
    setProgress,
    setStage,
    setMessage
  }

  return (
    <LoadingContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
        {loadingState.isLoading && (
          <LoadingScreen 
            loadingState={loadingState} 
            duration={getOptimalDuration(500)}
            enableAnimations={settings.enableAnimations}
          />
        )}
      </AnimatePresence>
      
      {!loadingState.isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: getOptimalDuration(800) / 1000,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {children}
        </motion.div>
      )}
    </LoadingContext.Provider>
  )
}

interface LoadingScreenProps {
  loadingState: LoadingState
  duration: number
  enableAnimations: boolean
}

function LoadingScreen({ loadingState, duration, enableAnimations }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration / 1000 }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: duration / 1000,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200 font-space-grotesk">
            Zaid Ahmed
          </h1>
          <p className="text-white/60 mt-2 font-poppins">Portfolio</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ 
            duration: duration / 1000,
            delay: 0.4
          }}
          className="relative"
        >
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${loadingState.progress}%` }}
              transition={{ 
                duration: enableAnimations ? 0.3 : 0,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
          </div>
          
          {/* Progress percentage */}
          <motion.div
            className="absolute -top-8 left-0 text-white/80 text-sm font-mono"
            animate={{ left: `${loadingState.progress}%` }}
            transition={{ 
              duration: enableAnimations ? 0.3 : 0,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{ transform: 'translateX(-50%)' }}
          >
            {Math.round(loadingState.progress)}%
          </motion.div>
        </motion.div>

        {/* Loading Message */}
        <motion.div
          key={loadingState.message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ 
            duration: enableAnimations ? duration / 2000 : 0,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="text-white/70 font-poppins"
        >
          {loadingState.message}
        </motion.div>

        {/* Loading Stage Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: duration / 1000 }}
          className="flex justify-center space-x-2"
        >
          {['initializing', 'loading-assets', 'rendering', 'complete'].map((stage, index) => (
            <motion.div
              key={stage}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                ['initializing', 'loading-assets', 'rendering', 'complete'].indexOf(loadingState.stage) >= index
                  ? 'bg-primary'
                  : 'bg-white/20'
              }`}
              animate={
                loadingState.stage === stage && enableAnimations
                  ? { scale: [1, 1.2, 1] }
                  : { scale: 1 }
              }
              transition={{ 
                duration: 0.6,
                repeat: loadingState.stage === stage ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Animated particles for visual interest */}
        {enableAnimations && typeof window !== 'undefined' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
                  y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 10,
                  opacity: 0
                }}
                animate={{
                  y: -10,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
