"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [typedText, setTypedText] = useState("")
  const fullText = "Full-Stack Developer | UI/UX Enthusiast"
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [typedText, fullText])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-16">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 neo-text">
            Hi, I'm <span className="text-primary">Zaid Ahmed S</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-medium mb-6 text-white/80">
            {typedText}
            <span className={cn("ml-1 inline-block w-2 h-8 bg-primary", showCursor ? "opacity-100" : "opacity-0")}>
              &nbsp;
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            Building interactive, scalable, and user-friendly web experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <Button
              size="lg"
              className="bg-primary/20 border border-primary/50 hover:bg-primary/30 text-primary neo-glow"
              onClick={() => document.getElementById("projects").scrollIntoView({ behavior: "smooth" })}
            >
              View My Work
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white/20 hover:border-white/40 backdrop-blur-sm"
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
              className="hover:text-primary transition-colors neo-glow p-2 rounded-full"
            >
              <Github size={24} />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://in.linkedin.com/in/zaid-ahmed-s-33008023b"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors neo-glow p-2 rounded-full"
            >
              <Linkedin size={24} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors neo-glow p-2 rounded-full"
            >
              <ExternalLink size={24} />
              <span className="sr-only">Portfolio</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="text-white/50 mb-2 text-sm">Scroll Down</div>
          <a href="#about" className="animate-bounce bg-black/30 neo-glow rounded-full p-3 border border-primary/30" aria-label="Scroll down">
            <ArrowDown size={18} className="text-primary" />
          </a>
        </div>

        {/* Enhanced floating elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 backdrop-blur-3xl floating opacity-40 hidden lg:block"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-3xl floating-delay-1 opacity-40 hidden lg:block"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-3xl floating-delay-2 opacity-40 hidden lg:block"></div>
        <div className="absolute bottom-1/3 left-1/4 w-36 h-36 rounded-full bg-gradient-to-br from-cyan-500/20 to-primary/20 backdrop-blur-3xl floating-delay-3 opacity-40 hidden lg:block"></div>
      </div>
    </section>
  )
}