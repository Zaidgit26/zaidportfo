"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

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

  const smoothScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      // Smooth scroll with custom easing
      const startPosition = window.pageYOffset
      const targetPosition = element.offsetTop - 80 // Account for navbar height
      const distance = targetPosition - startPosition
      const duration = 800 // 0.8 seconds for smooth but practical scrolling
      let start: number | null = null

      function animation(currentTime: number) {
        if (start === null) start = currentTime
        const timeElapsed = currentTime - start
        const progress = Math.min(timeElapsed / duration, 1)

        // Easing function for smooth animation (ease-in-out-cubic)
        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        window.scrollTo(0, startPosition + distance * easeInOutCubic)

        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        }
      }

      requestAnimationFrame(animation)
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-16 overflow-hidden">
      {/* Removed floating geometric shapes - keeping only galaxy background effects */}

      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center relative z-10">
        <div className="max-w-4xl transform-gpu">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 cosmic-text font-space-grotesk group cursor-default ${nameVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-700`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200 drop-shadow-lg group-hover:from-blue-100 group-hover:via-purple-200 group-hover:to-white transition-all duration-500">
              Hi, I'm Zaid Ahmed S
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl font-medium mb-6 text-white/80 font-space-grotesk">
            {typedText}
            <span className={cn("ml-1 inline-block w-2 h-8 bg-primary transition-opacity duration-300", showCursor ? "opacity-100" : "opacity-0")}>
              &nbsp;
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg font-poppins">
            Simplifying the complex with clean code and clever AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <Button
              size="lg"
              className="bg-primary/20 border border-primary/50 hover:bg-primary/30 text-primary galaxy-glow transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-primary/25"
              onClick={() => smoothScrollTo("projects")}
            >
              View My Work
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="nebula-card border-white/20 hover:border-white/40 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-white/25"
              onClick={() => window.location.href = "mailto:reachme.zaid@gmail.com"}
            >
              Contact Me
            </Button>
          </div>

          <div className="flex space-x-6 mb-16 justify-center">
            <a
              href="https://github.com/Zaidgit26"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-300 p-3 rounded-full nebula-card hover:border-primary/30"
            >
              <Github size={24} />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://in.linkedin.com/in/zaid-ahmed-s-33008023b"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-300 p-3 rounded-full nebula-card hover:border-primary/30"
            >
              <Linkedin size={24} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-300 p-3 rounded-full nebula-card hover:border-primary/30"
            >
              <ExternalLink size={24} />
              <span className="sr-only">Portfolio</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="text-white/50 mb-2 text-sm animate-cosmic-pulse">Scroll Down</div>
          <button
            onClick={() => smoothScrollTo("about")}
            className="animate-gentle-bounce nebula-card rounded-full p-4 border border-primary/30 hover:border-primary/50 transition-all duration-600 hover:scale-110"
            aria-label="Scroll down"
          >
            <ArrowDown size={20} className="text-primary" />
          </button>
        </div>

        {/* Removed additional floating geometric shapes - galaxy background provides the cosmic effect */}
      </div>
    </section>
  )
}