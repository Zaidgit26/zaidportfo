"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { EnhancedMotion, StaggerContainer, StaggerItem, HoverAnimation } from "@/components/enhanced-animations"
import { smoothScrollTo } from "@/components/smooth-scroll-provider"

export function HeroSection() {
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [nameVisible, setNameVisible] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'typing' | 'backspacing' | 'waiting'>('typing')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const texts = ["Creative Web Developer", "AI Automation Enthusiast"]

  // Greeting fade-in effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setNameVisible(true)
    }, 300) // Start greeting animation after 300ms
    return () => clearTimeout(timer)
  }, [])

  // Continuous looping typewriter effect
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const currentText = texts[currentTextIndex]

    if (currentPhase === 'typing') {
      if (currentIndex < currentText.length) {
        timeout = setTimeout(() => {
          setTypedText(currentText.slice(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        }, 80) // Typing speed
      } else {
        // Wait before starting to backspace
        timeout = setTimeout(() => {
          setCurrentPhase('waiting')
        }, 2000) // Wait 2 seconds before backspacing
      }
    } else if (currentPhase === 'waiting') {
      timeout = setTimeout(() => {
        setCurrentPhase('backspacing')
        setCurrentIndex(currentText.length)
      }, 1000) // Brief pause before backspacing
    } else if (currentPhase === 'backspacing') {
      if (currentIndex > 0) {
        timeout = setTimeout(() => {
          setTypedText(currentText.slice(0, currentIndex - 1))
          setCurrentIndex(currentIndex - 1)
        }, 50) // Backspace speed (faster)
      } else {
        // Move to next text and start typing
        timeout = setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          setCurrentPhase('typing')
          setCurrentIndex(0)
        }, 500) // Brief pause before next text
      }
    }

    return () => clearTimeout(timeout)
  }, [currentPhase, currentIndex, currentTextIndex])

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  // Enhanced smooth scroll function using Lenis
  const handleSmoothScrollTo = (targetId: string) => {
    smoothScrollTo(`#${targetId}`, {
      offset: -80, // Account for navbar height
      duration: 1.2 // Buttery smooth duration
    })
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-16 overflow-hidden">
      {/* Removed floating geometric shapes - keeping only galaxy background effects */}

      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center relative z-10">
        <StaggerContainer className="max-w-4xl transform-gpu">
          <StaggerItem>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4 cosmic-text font-space-grotesk group cursor-default"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: nameVisible ? 1 : 0, y: nameVisible ? 0 : 30 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2
              }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200 drop-shadow-lg group-hover:from-blue-100 group-hover:via-purple-200 group-hover:to-white transition-all duration-500">
                Hi, I'm Zaid Ahmed
              </span>
            </motion.h1>
          </StaggerItem>
          <StaggerItem delay={0.1}>
            <motion.h2
              className="text-xl md:text-2xl font-medium mb-6 text-white/80 font-space-grotesk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.6
              }}
            >
              {typedText}
              <span className={cn("ml-1 inline-block w-2 h-8 bg-primary transition-opacity duration-300", showCursor ? "opacity-100" : "opacity-0")}>
                &nbsp;
              </span>
            </motion.h2>
          </StaggerItem>

          <StaggerItem delay={0.2}>
            <EnhancedMotion variant="fadeIn" delay={0.8}>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg font-poppins">
                "Simplifying the complex with clean code and clever AI".
              </p>
            </EnhancedMotion>
          </StaggerItem>

          <StaggerItem delay={0.3}>
            <EnhancedMotion variant="slideUp" delay={1.0}>
              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
                <HoverAnimation scale={1.05} y={-4}>
                  <Button
                    size="lg"
                    className="bg-primary/20 border border-primary/50 hover:bg-primary/30 text-primary galaxy-glow smooth-transition shadow-lg hover:shadow-primary/25"
                    onClick={() => handleSmoothScrollTo("projects")}
                  >
                    View My Work
                  </Button>
                </HoverAnimation>

                <HoverAnimation scale={1.05} y={-4}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="nebula-card border-white/20 hover:border-white/40 smooth-transition shadow-lg hover:shadow-white/25"
                    onClick={() => window.location.href = "mailto:reachme.zaid@gmail.com"}
                  >
                    Contact Me
                  </Button>
                </HoverAnimation>
              </div>
            </EnhancedMotion>
          </StaggerItem>

          <StaggerItem delay={0.4}>
            <EnhancedMotion variant="fadeIn" delay={1.2}>
              <div className="flex space-x-6 mb-16 justify-center">
                <HoverAnimation scale={1.1} y={-3}>
                  <a
                    href="https://github.com/Zaidgit26"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary smooth-transition p-3 rounded-full nebula-card hover:border-primary/30"
                  >
                    <Github size={24} />
                    <span className="sr-only">GitHub</span>
                  </a>
                </HoverAnimation>

                <HoverAnimation scale={1.1} y={-3}>
                  <a
                    href="https://in.linkedin.com/in/zaid-ahmed-s-33008023b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary smooth-transition p-3 rounded-full nebula-card hover:border-primary/30"
                  >
                    <Linkedin size={24} />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </HoverAnimation>

                <HoverAnimation scale={1.1} y={-3}>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary smooth-transition p-3 rounded-full nebula-card hover:border-primary/30"
                  >
                    <ExternalLink size={24} />
                    <span className="sr-only">Portfolio</span>
                  </a>
                </HoverAnimation>
              </div>
            </EnhancedMotion>
          </StaggerItem>
        </StaggerContainer>

        <EnhancedMotion variant="fadeIn" delay={1.5}>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <motion.div
              className="text-white/50 mb-2 text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Scroll Down
            </motion.div>
            <HoverAnimation scale={1.1} y={-2}>
              <motion.button
                onClick={() => handleSmoothScrollTo("about")}
                className="nebula-card rounded-full p-4 border border-primary/30 hover:border-primary/50 smooth-transition"
                aria-label="Scroll down"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown size={20} className="text-primary" />
              </motion.button>
            </HoverAnimation>
          </div>
        </EnhancedMotion>

        {/* Removed additional floating geometric shapes - galaxy background provides the cosmic effect */}
      </div>
    </section>
  )
}