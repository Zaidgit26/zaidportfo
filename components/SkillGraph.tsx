"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import skillsData from "@/data/skills.json"

interface Skill {
  id: number
  title: string
  description: string
  color: string
}

export function SkillGraph() {
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null)
  const [clickedSkill, setClickedSkill] = useState<number | null>(null)

  // Separate refs for mobile and desktop
  const mobileContainerRef = useRef<HTMLDivElement>(null)
  const desktopContainerRef = useRef<HTMLDivElement>(null)

  // Separate useInView hooks for mobile and desktop
  const isMobileInView = useInView(mobileContainerRef, { once: true, amount: 0.3 })
  const isDesktopInView = useInView(desktopContainerRef, { once: true, amount: 0.1 })

  // Central node position - positioned right below "My Skills" header
  const centerNode = { x: 600, y: 50 }

  // Function to check if two positions overlap (with buffer for spacing)
  const checkOverlap = (pos1: {x: number, y: number}, pos2: {x: number, y: number}, buffer: number = 180) => {
    const distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2))
    return distance < buffer
  }

  // Generate evenly distributed positions across full screen width
  const skillPositions = useMemo(() => {
    const positions = []
    const containerWidth = 1200 // Match the new viewBox width
    const cardWidth = 240
    const margin = 100 // Margin from edges

    // Calculate positions for perfect distribution across full width
    // First row: 2 cards (Frontend and Backend only) - TOP ROW
    const availableWidth = containerWidth - (2 * margin)
    const firstRowPositions = [
      { x: margin + (availableWidth * 0.2), y: 80 },       // Frontend Development - TOP
      null,                                                 // UI/UX will be in 3rd row
      { x: margin + (availableWidth * 0.8), y: 80 }        // Backend Development - TOP
    ]

    // Second row: 2 cards (DevOps and AI) - MIDDLE ROW WITH HUGE GAP
    const secondRowPositions = [
      { x: margin + (availableWidth * 0.25), y: 320 },     // DevOps & Tools - MUCH LOWER
      { x: margin + (availableWidth * 0.75), y: 320 }      // AI & Automation - MUCH LOWER
    ]

    // Third row: 1 card (UI/UX in center) - BOTTOM ROW
    const thirdRowPosition = { x: containerWidth / 2, y: 560 }  // UI/UX Design in center - BOTTOM

    // Combine all positions - handle the UI/UX card separately
    const allPositions = [
      firstRowPositions[0],    // Frontend
      thirdRowPosition,        // UI/UX (moved to 3rd row)
      firstRowPositions[2],    // Backend
      secondRowPositions[0],   // DevOps
      secondRowPositions[1]    // AI
    ]

    // Create positions with minimal randomness to maintain even distribution
    allPositions.forEach((basePos, i) => {
      const randomOffsetX = (Math.random() - 0.5) * 15 // ±7.5px horizontal variation
      const randomOffsetY = (Math.random() - 0.5) * 10 // ±5px vertical variation

      positions.push({
        x: Math.max(margin, Math.min(containerWidth - margin, basePos.x + randomOffsetX)),
        y: Math.max(160, basePos.y + randomOffsetY),
        skill: skillsData.skills[i]
      })
    })

    return positions
  }, [skillsData.skills.length])

  // Generate curved path for connection lines - improved natural flow like user's drawing
  const generateCurvePath = (startX: number, startY: number, endX: number, endY: number) => {
    // Calculate the distance and direction
    const deltaX = endX - startX
    const deltaY = endY - startY

    // Create more natural curves with better control points
    const controlX1 = startX + deltaX * 0.3
    const controlY1 = startY + deltaY * 0.1
    const controlX2 = startX + deltaX * 0.7
    const controlY2 = startY + deltaY * 0.9

    // Use cubic bezier for smoother curves
    return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
  }

  return (
    <div className="w-full flex justify-center items-center py-8 px-4">
      {/* Mobile Simple Layout - Hidden on Desktop */}
      <div className="md:hidden w-full">
        <div ref={mobileContainerRef} className="space-y-4">
          {skillsData.skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              className="w-full"
              initial={{ opacity: 0, x: -50 }}
              animate={isMobileInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className={`
                  w-full p-4 rounded-xl cursor-pointer transition-all duration-300
                  bg-black/40 backdrop-blur-lg border border-white/20
                  hover:border-white/40 hover:bg-black/60
                  ${hoveredSkill === skill.id ? 'neo-glow' : ''}
                `}
                style={{
                  boxShadow: hoveredSkill === skill.id
                    ? `0 0 25px ${skill.color}50, 0 0 50px ${skill.color}30`
                    : '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: skill.color }}
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white font-space-grotesk mb-1">
                      {skill.title}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {skill.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop Complex Layout - Hidden on Mobile */}
      <div ref={desktopContainerRef} className="hidden md:block relative w-full max-w-[1200px] h-[650px] overflow-visible">
      {/* SVG for connections and central node */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 1200 650"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connection Lines - All 5 lines to each card - MOVED BEFORE CENTRAL NODE */}
        {skillPositions.map((position, index) => (
          <motion.path
            key={`line-${index}`}
            d={generateCurvePath(centerNode.x, centerNode.y, position.x, position.y)}
            stroke={hoveredSkill === position.skill.id || clickedSkill === position.skill.id ? position.skill.color : "url(#lineGradient)"}
            strokeWidth={hoveredSkill === position.skill.id || clickedSkill === position.skill.id ? "4" : "2"}
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isDesktopInView ? {
              pathLength: 1,
              opacity: 1
            } : {
              pathLength: 0,
              opacity: 0
            }}
            transition={{
              duration: 1.5,
              delay: 0.8 + (index * 0.2),
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Central Node - MOVED AFTER LINES SO IT APPEARS ON TOP */}
        <motion.circle
          cx={centerNode.x}
          cy={centerNode.y}
          r="15"
          fill="#3B82F6"
          filter="url(#glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={isDesktopInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="drop-shadow-lg"
        />

      </svg>



      {/* Skill Cards */}
      {skillPositions.map((position, index) => (
        <motion.div
          key={`card-${index}`}
          className="absolute z-30"
          style={{
            left: position.x - 120, // Center the card (240px width / 2)
            top: position.y - 60,   // Center the card (120px height / 2)
          }}
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={isDesktopInView ? {
            opacity: 1,
            scale: 1,
            y: 0
          } : { opacity: 0, scale: 0, y: 50 }}
          transition={{
            duration: 0.6,
            delay: 1.5 + index * 0.2,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{
            scale: 1.05,
            y: -8,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setHoveredSkill(position.skill.id)}
          onHoverEnd={() => setHoveredSkill(null)}
          onClick={() => setClickedSkill(clickedSkill === position.skill.id ? null : position.skill.id)}
        >
          <div
            className={`
              w-60 h-32 rounded-xl p-4 cursor-pointer transition-all duration-300
              bg-black/40 backdrop-blur-lg border border-white/20
              hover:border-white/40 hover:bg-black/60
              ${hoveredSkill === position.skill.id || clickedSkill === position.skill.id ? 'neo-glow' : ''}
              ${clickedSkill === position.skill.id ? 'ring-2 ring-white/30' : ''}
            `}
            style={{
              boxShadow: (hoveredSkill === position.skill.id || clickedSkill === position.skill.id)
                ? `0 0 25px ${position.skill.color}50, 0 0 50px ${position.skill.color}30`
                : '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white font-space-grotesk mb-2">
                  {position.skill.title}
                </h4>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {position.skill.description}
                </p>
              </div>
              <div
                className="w-full h-1.5 rounded-full mt-3"
                style={{ backgroundColor: position.skill.color }}
              />
            </div>

            {/* Click indicator */}
            {clickedSkill === position.skill.id && (
              <motion.div
                className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}

        {/* Tooltip for clicked skill */}
        {clickedSkill && (
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-black/80 backdrop-blur-lg border border-white/30 rounded-lg p-4 max-w-xs">
              <p className="text-white text-sm text-center">
                Click on skill cards to explore them!
                <br />
                <span className="text-gray-400 text-xs">
                  (Future: Detailed skill information will appear here)
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
