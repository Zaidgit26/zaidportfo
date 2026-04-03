"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const projects = [
    {
        id: 1,
        title: "PRODIGY_WD_03",
        systemName: "Tic-Tac-Toe Prime",
        description: "Interactive multiplayer game logic. Real-time application state management.",
        image: "/id1preview.png",
        tags: ["React", "State Management"],
        demoUrl: "https://zaidgit26.github.io/PRODIGY_WD_03/",
        githubUrl: "https://github.com/Zaidgit26/PRODIGY_WD_03",
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: 2,
        title: "Atmospheric Probe",
        systemName: "Weather Check",
        description: "Real-time meteorological data acquisition via external API integration.",
        image: "/id2preview.png",
        tags: ["API", "Async/Await"],
        demoUrl: "https://zaidgit26.github.io/PRODIGY_WD_05/",
        githubUrl: "https://github.com/Zaidgit26/PRODIGY_WD_05",
        color: "from-purple-500 to-pink-500"
    },
    {
        id: 3,
        title: "Signal Identifier",
        systemName: "Unknown Caller ID",
        description: "Full-stack database lookup system for identifying transmission sources.",
        image: "/id3preview.png",
        tags: ["Full Stack", "Database"],
        demoUrl: "#",
        githubUrl: "https://github.com/Zaidgit26/Caller-Identifier",
        color: "from-green-500 to-emerald-500"
    },
    {
        id: 4,
        title: "Colony Landing",
        systemName: "Responsive Page",
        description: "High-fidelity UI/UX implementation for planetary landing sites.",
        image: "/id4preview.png",
        tags: ["UI/UX", "CSS Grid"],
        demoUrl: "https://zaidgit26.github.io/PRODIGY_WD_01/",
        githubUrl: "https://github.com/Zaidgit26/PRODIGY_WD_01",
        color: "from-orange-500 to-red-500"
    },
]

export function PlanetaryProjects() {
    return (
        <section className="py-24 px-4 min-h-screen flex flex-col justify-center">
            <div className="max-w-6xl mx-auto w-full">
                <div className="text-center mb-20">
                    <div className="inline-block px-3 py-1 border border-purple-500/30 rounded-full bg-black/50 backdrop-blur-sm mb-4">
                        <span className="text-purple-400 font-mono text-xs tracking-widest uppercase">System Destinations</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-space-grotesk tracking-tighter">PLANETARY PROJECTS</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-[400px] rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm hover:border-white/30 transition-all duration-500"
                        >
                            {/* Background Image Area */}
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                                />
                            </div>

                            {/* Holographic Overlay on Hover */}
                            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 bg-[linear-gradient(transparent_2px,rgba(0,0,0,0.5)_2px)] bg-[length:100%_4px]" />

                            {/* Content */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className={`inline-block mb-3 px-2 py-1 bg-gradient-to-r ${project.color} bg-clip-text text-transparent font-bold text-xs uppercase tracking-widest border border-white/10 rounded-md`}>
                                        {project.systemName}
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2 font-space-grotesk">{project.title}</h3>
                                    <p className="text-gray-400 text-sm mb-6 max-w-sm line-clamp-2">{project.description}</p>

                                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                            <Button size="sm" className="bg-white text-black hover:bg-gray-200 border-none">
                                                <ExternalLink className="w-4 h-4 mr-2" /> Live System
                                            </Button>
                                        </a>
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                                <Github className="w-4 h-4 mr-2" /> Source Code
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
