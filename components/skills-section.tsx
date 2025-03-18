"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Layout, Smartphone, Zap, Cpu, PenTool, Code, Server, Database } from "lucide-react"
import { motion } from "framer-motion"

export function SkillsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }
  
  // Check if section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const skills = [
    {
      category: "Frontend",
      icon: <Layout className="w-10 h-10 text-primary" />,
      technologies: ["HTML", "CSS", "JavaScript", "React", "Responsive Design"],
    },
    {
      category: "UI/UX",
      icon: <PenTool className="w-10 h-10 text-primary" />,
      technologies: ["Figma", "User Research", "Wireframing", "Prototyping"],
    },
    {
      category: "Tools",
      icon: <Zap className="w-10 h-10 text-primary" />,
      technologies: ["Git", "Power BI", "VS Code", "Chrome DevTools"],
    },
    {
      category: "Learning",
      icon: <Cpu className="w-10 h-10 text-primary" />,
      technologies: ["Node.js", "Express", "MongoDB", "DevOps", "AWS"],
    },
    {
      category: "Soft Skills",
      icon: <Globe className="w-10 h-10 text-primary" />,
      technologies: ["Problem Solving", "Team Collaboration", "Communication", "Time Management"],
    },
    {
      category: "Other",
      icon: <Smartphone className="w-10 h-10 text-primary" />,
      technologies: ["Prompt Engineering", "SEO Basics", "Performance Optimization", "Accessibility"],
    },
  ]

  return (
    <section id="skills" className="py-20 relative overflow-hidden" ref={sectionRef}>
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 neo-text bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
            My Skills
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-blue-500 mx-auto mb-6 neo-glow rounded-full"></div>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            I've developed expertise in various technologies and continue to expand my knowledge in new areas.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {skills.map((skill, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`group relative overflow-hidden transition-all duration-500 ${hoveredIndex === index ? "neo-glow" : ""}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Card background with gradient border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`mb-6 p-4 rounded-full bg-gradient-to-br from-black/60 to-black/20 border border-white/5 transition-all duration-500 ${hoveredIndex === index ? "scale-110 neo-glow" : ""}`}
                      >
                        {skill.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-primary transition-colors duration-300">
                        {skill.category}
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2">
                        {skill.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs border border-primary/20 transition-all duration-300 hover:bg-primary/20 hover:border-primary/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced floating elements */}
      <div className="absolute top-1/3 left-10 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 backdrop-blur-3xl floating-delay-3 opacity-30 hidden lg:block"></div>
      <div className="absolute bottom-1/3 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-3xl floating opacity-30 hidden lg:block"></div>
    </section>
  )
}

