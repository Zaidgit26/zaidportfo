"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Monitor, Zap, Eye, EyeOff } from "lucide-react"

export type PerformanceMode = "low" | "medium" | "high" | "auto"

interface PerformanceSettingsProps {
  onModeChange?: (mode: PerformanceMode) => void
}

export function PerformanceSettings({ onModeChange }: PerformanceSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<PerformanceMode>("auto")
  const [showMonitor, setShowMonitor] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("performance-mode") as PerformanceMode
    const savedMonitor = localStorage.getItem("show-performance-monitor") === "true"

    if (savedMode) {
      setMode(savedMode)
      onModeChange?.(savedMode)
    }

    setShowMonitor(savedMonitor)
  }, [onModeChange])

  const handleModeChange = (newMode: PerformanceMode) => {
    setMode(newMode)
    localStorage.setItem("performance-mode", newMode)
    onModeChange?.(newMode)
  }

  const handleMonitorToggle = () => {
    const newValue = !showMonitor
    setShowMonitor(newValue)
    localStorage.setItem("show-performance-monitor", newValue.toString())
    // Trigger a storage event to notify the PerformanceMonitor component
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'show-performance-monitor',
      newValue: newValue.toString()
    }))
  }

  const modes = [
    {
      id: "auto" as const,
      name: "Auto",
      description: "Automatically adjusts based on device",
      icon: Zap,
      color: "text-blue-400"
    },
    {
      id: "high" as const,
      name: "High",
      description: "Maximum visual quality",
      icon: Eye,
      color: "text-green-400"
    },
    {
      id: "medium" as const,
      name: "Medium",
      description: "Balanced performance and quality",
      icon: Settings,
      color: "text-yellow-400"
    },
    {
      id: "low" as const,
      name: "Low",
      description: "Best performance, minimal particles",
      icon: Zap,
      color: "text-orange-400"
    }
  ]

  return (
    <>
      {/* Settings Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-full p-3 text-white border border-white/20 hover:border-white/40 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Performance Settings"
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 right-4 z-50 bg-black/90 backdrop-blur-sm rounded-lg p-6 text-white border border-white/20 w-80"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Performance Settings
                </h3>
                <p className="text-sm text-gray-400">
                  Adjust visual effects for optimal performance
                </p>
              </div>

              {/* Performance Mode Selection */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-300">Quality Mode</h4>
                <div className="space-y-2">
                  {modes.map((modeOption) => {
                    const Icon = modeOption.icon
                    return (
                      <motion.button
                        key={modeOption.id}
                        onClick={() => handleModeChange(modeOption.id)}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${
                          mode === modeOption.id
                            ? "border-blue-500 bg-blue-500/20"
                            : "border-white/20 hover:border-white/40 hover:bg-white/5"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${modeOption.color}`} />
                          <div className="flex-1">
                            <div className="font-medium">{modeOption.name}</div>
                            <div className="text-xs text-gray-400">
                              {modeOption.description}
                            </div>
                          </div>
                          {mode === modeOption.id && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Performance Monitor Toggle */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-300">Monitoring</h4>
                <motion.button
                  onClick={handleMonitorToggle}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    showMonitor
                      ? "border-green-500 bg-green-500/20"
                      : "border-white/20 hover:border-white/40 hover:bg-white/5"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <Monitor className="w-4 h-4 text-green-400" />
                    <div className="flex-1">
                      <div className="font-medium">Performance Monitor</div>
                      <div className="text-xs text-gray-400">
                        Show FPS and performance stats
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${showMonitor ? "bg-green-500" : "bg-gray-500"}`} />
                  </div>
                </motion.button>
              </div>

              {/* Current Device Info */}
              <div className="pt-4 border-t border-white/20">
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Device: {window.innerWidth < 768 ? "Mobile" : "Desktop"}</div>
                  <div>CPU Cores: {navigator.hardwareConcurrency || "Unknown"}</div>
                  <div>Screen: {window.innerWidth}×{window.innerHeight}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Hook to get current performance multiplier based on mode
export function usePerformanceMultiplier() {
  const [mode, setMode] = useState<PerformanceMode>("auto")

  useEffect(() => {
    const savedMode = localStorage.getItem("performance-mode") as PerformanceMode
    if (savedMode) {
      setMode(savedMode)
    }
  }, [])

  const getMultiplier = () => {
    const isMobile = window.innerWidth < 768
    const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile

    switch (mode) {
      case "low":
        return 0.2
      case "medium":
        return 0.5
      case "high":
        return 1.0
      case "auto":
      default:
        return isLowEnd ? 0.3 : isMobile ? 0.5 : 0.7
    }
  }

  return { mode, multiplier: getMultiplier() }
}
