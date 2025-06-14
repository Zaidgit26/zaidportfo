"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Project = {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl: string
  githubUrl: string
}

export function ProjectsSection() {
  const projects: Project[] = [
    {
      id: 1,
      title: "Dynamic Tic-Tac-Toe Web App",
      description: "Interactive and responsive web-based game with multiplayer functionality and score tracking.",
      image: "/id1preview.png",
      tags: ["JavaScript", "HTML", "CSS", "Game Logic"],
      demoUrl: "https://zaidgit26.github.io/PRODIGY_WD_03/",
      githubUrl: "https://github.com/Zaidgit26/PRODIGY_WD_03",
    },
    {
      id: 2,
      title: "Weather Check",
      description: "Weather forecasting application using APIs to provide real-time weather data and forecasts.",
      image: "/id2preview.png",
      tags: ["JavaScript", "API Integration", "CSS", "Responsive Design"],
      demoUrl: "https://zaidgit26.github.io/PRODIGY_WD_05/",
      githubUrl: "https://github.com/Zaidgit26/PRODIGY_WD_05",
    },
    {
      id: 3,
      title: "Unknown Number Identifier",
      description:
        "Full-stack solution for identifying unknown callers with database integration and search functionality.",
      image: "/id3preview.png",
      tags: ["Full Stack", "Database", "UI/UX", "Search Algorithm"],
      demoUrl: "#",
      githubUrl: "https://github.com/Zaidgit26/Caller-Identifier",
    },
    {
      id: 4,
      title: "Responsive Landing Page",
      description: "UI/UX-focused web design project showcasing modern design principles and responsive layouts.",
      image: "/id4preview.png",
      tags: ["HTML", "CSS", "Responsive Design", "UI/UX"],
      demoUrl: "https://zaidgit26.github.io/PRODIGY_WD_01/",
      githubUrl: "https://github.com/Zaidgit26/PRODIGY_WD_01",
    },
  ]

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 neo-text bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90 font-space-grotesk">
            My Projects
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-blue-500 mx-auto mb-6 neo-glow rounded-full"></div>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Here are some of my recent projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className={`group relative overflow-hidden transition-all duration-500 ${hoveredIndex === index ? "neo-glow" : ""}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card background with gradient border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-700",
                      hoveredIndex === index ? "scale-110" : "scale-100",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-sm flex items-center justify-center gap-4 transition-all duration-500",
                      hoveredIndex === index ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        size="sm"
                        className="gap-2 bg-gradient-to-r from-primary/80 to-blue-500/80 hover:from-primary hover:to-blue-500 text-white neo-glow group transition-all duration-300 border-none"
                      >
                        <ExternalLink size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                        Live Demo
                      </Button>
                    </a>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-black/50 border border-white/20 hover:border-primary/40 hover:bg-black/70 text-white transition-all duration-300"
                      >
                        <Github size={16} className="group-hover:scale-110 transition-transform duration-300" />
                        View Code
                      </Button>
                    </a>
                  </div>
                </div>
                
                <CardContent className="p-6 relative">
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-primary transition-colors duration-300 font-space-grotesk">
                    {project.title}
                  </h3>
                  <p className="text-white/80 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs border border-primary/20 transition-all duration-300 hover:bg-primary/20 hover:border-primary/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        
        {/* View all projects button */}
        <div className="text-center mt-12">
          <Button 
            className="bg-black/30 hover:bg-black/50 text-white border border-white/10 hover:border-primary/30 transition-all duration-300 group"
            onClick={() => window.open("https://github.com/Zaidgit26?tab=repositories", "_blank")}
          >
            View All Projects
            <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Removed floating geometric shapes - galaxy background provides the cosmic effect */}
    </section>
  )
}

