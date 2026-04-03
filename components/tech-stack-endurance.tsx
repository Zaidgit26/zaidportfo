"use client"

import { motion } from "framer-motion"
import { Database, Globe, Server, Code, Terminal, Cpu, Layers, Workflow } from "lucide-react"

const skills = [
    { icon: Code, name: "React", angle: 0 },
    { icon: Server, name: "Node.js", angle: 45 },
    { icon: Database, name: "SQL/NoSQL", angle: 90 },
    { icon: Globe, name: "Next.js", angle: 135 },
    { icon: Terminal, name: "DevOps", angle: 180 },
    { icon: Cpu, name: "AI Integration", angle: 225 },
    { icon: Layers, name: "UI/UX", angle: 270 },
    { icon: Workflow, name: "Git/CI", angle: 315 },
]

export function TechStackEndurance() {
    return (
        <section className="py-32 overflow-hidden relative flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-16 relative z-10 w-full px-4">
                <div className="inline-block px-3 py-1 border border-blue-500/30 rounded-full bg-black/50 backdrop-blur-sm mb-4">
                    <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">Engine Core Status</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white font-space-grotesk tracking-tighter">THE ENDURANCE</h2>
            </div>

            <div className="relative w-[600px] h-[600px] flex items-center justify-center scale-[0.6] md:scale-100">
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-white/5 border-dashed"
                />

                {/* Middle Ring with Skills */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[50px] rounded-full border border-white/10"
                >
                    {skills.map((skill, index) => {
                        const angleRad = (skill.angle * Math.PI) / 180;
                        const radius = 250; // Half of (600 - 100)
                        const x = Math.cos(angleRad) * radius + 250;
                        const y = Math.sin(angleRad) * radius + 250;

                        return (
                            <div
                                key={skill.name}
                                className="absolute w-16 h-16 -ml-8 -mt-8 flex items-center justify-center bg-black border border-white/20 rounded-full text-white/70 hover:text-orange-400 hover:border-orange-500 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer group"
                                style={{ left: x, top: y }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }} // Counter-rotate to keep icon upright
                                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                                >
                                    <skill.icon className="w-6 h-6" />
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black px-2 py-1 border border-orange-500/30 rounded">
                                        {skill.name}
                                    </div>
                                </motion.div>
                            </div>
                        )
                    })}
                </motion.div>

                {/* Inner Core */}
                <div className="absolute w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute w-[150px] h-[150px] border border-blue-400/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white font-space-grotesk">100%</div>
                        <div className="text-[10px] text-blue-400 uppercase tracking-widest">Operational</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
