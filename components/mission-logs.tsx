"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const checkpoints = [
    {
        id: 1,
        title: "Mission Launch - BCA",
        date: "2020 - 2023",
        missionTime: "T-Minus 3 Years",
        description: "Islamiah College (Autonomous), Vaniyambadi. Graduation with 7.8 GPA. Initial systems check complete.",
        type: "education"
    },
    {
        id: 2,
        title: "Advanced Diploma (ADCA)",
        date: "2022 - 2023",
        missionTime: "T-Minus 1 Year",
        description: "Jawa Computer Center. 7.8 GPA. Core memory upgrades installed.",
        type: "education"
    },
    {
        id: 3,
        title: "Orbit Injection - MCA",
        date: "2023 - Present",
        missionTime: "Mission Start",
        description: "Measi Institute of Information Technology. Advanced maneuvers in Software Development.",
        type: "education"
    },
    {
        id: 4,
        title: "Web Ops - Freelance",
        date: "2020 - Present",
        missionTime: "Continuous",
        description: "Deployed multiple web applications. Responsive UI designs. Agile development protocols.",
        type: "experience"
    },
    {
        id: 5,
        title: "Hackathon - EVA Sortie",
        date: "2025",
        missionTime: "T+6 Months",
        description: "50-hour endurance run. Led 5-unit squadron. Design Thinking applied.",
        type: "experience"
    },
    {
        id: 6,
        title: "Cyber Guardians",
        date: "2025",
        missionTime: "Current Cycle",
        description: "Cybersecurity protocol event. Coordinated defense activities.",
        type: "experience"
    }
]

export function MissionLogs() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    return (
        <section className="relative py-24 px-4 overflow-hidden min-h-screen">
            <div className="max-w-4xl mx-auto" ref={containerRef}>
                <div className="text-center mb-16">
                    <div className="inline-block px-3 py-1 border border-orange-500/30 rounded-full bg-black/50 backdrop-blur-sm mb-4">
                        <span className="text-orange-400 font-mono text-xs tracking-widest uppercase">Flight Recorder Data</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-space-grotesk tracking-tighter">MISSION LOGS</h2>
                </div>

                <div className="relative">
                    {/* Central Timeline Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 md:-translate-x-1/2" />
                    <motion.div
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500 via-purple-500 to-blue-500 md:-translate-x-1/2 origin-top"
                        style={{ scaleY }}
                    />

                    <div className="space-y-16">
                        {checkpoints.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7, delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row gap-8 items-start md:items-center relative ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                            >
                                {/* Content Card */}
                                <div className="flex-1 pl-12 md:pl-0 w-full">
                                    <div className={`p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-orange-500/30 transition-all duration-300 md:text-right ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                                        <div className="flex items-center gap-2 mb-2 justify-start md:justify-end text-orange-400 font-mono text-xs uppercase tracking-wider">
                                            <span>{item.missionTime}</span>
                                            <span className="w-1 h-1 bg-orange-500 rounded-full" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-1 font-space-grotesk">{item.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{item.date}</p>
                                        <p className="text-gray-300 leading-relaxed font-light">{item.description}</p>
                                        <div className="mt-4">
                                            <Badge variant="outline" className={`border-white/20 text-white/70 ${item.type === 'education' ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}>
                                                {item.type === 'education' ? 'ACADEMIC' : 'FIELD OPS'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Center Node */}
                                <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-orange-500 z-10 shadow-[0_0_10px_rgba(255,165,0,0.5)]">
                                    <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20" />
                                </div>

                                {/* Empty Space for alignment */}
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
