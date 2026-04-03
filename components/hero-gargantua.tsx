"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useCosmic } from "./cosmic-provider"
import { BlackHoleVideo } from "./gargantua-black-hole"
import { PlanetarySystem } from "./planetary-system"

export const HeroGargantua = () => {
    const { scrollY } = useScroll()
    const { triggerWarp } = useCosmic()

    const y = useTransform(scrollY, [0, 500], [0, 200])
    const opacity = useTransform(scrollY, [0, 400], [1, 0])
    const scale = useTransform(scrollY, [0, 500], [1, 1.2])

    const handleMissionLogClick = () => {
        triggerWarp()
        setTimeout(() => {
            const element = document.getElementById("mission-logs")
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            } else {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
            }
        }, 800) // Wait for warp peak
    }

    const handleContactClick = () => {
        triggerWarp()
        setTimeout(() => {
            const element = document.getElementById("signal-transmission")
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }, 800)
    }

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0c]">

            {/* Gargantua Black Hole (Video Background) */}
            <motion.div style={{ scale }}>
                <BlackHoleVideo />
            </motion.div>

            {/* Planetary Orbits (Overlay on top of video) */}
            <PlanetarySystem />

            {/* Hero Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-40 text-center px-4 flex flex-col items-center"
            >
                {/* Mission Status Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-orange-500/30 rounded-full bg-black/70 backdrop-blur-md"
                >
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-orange-400 font-mono text-xs tracking-[0.2em] uppercase">
                        Time Dilation: 6 Months = ∞ Growth
                    </span>
                </motion.div>

                {/* Name Title */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 font-space-grotesk tracking-tighter"
                    style={{
                        textShadow: '0 0 80px rgba(255, 150, 50, 0.3), 0 0 120px rgba(255, 100, 30, 0.2)',
                    }}
                >
                    ZAID AHMED
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto font-light mb-10 leading-relaxed"
                >
                    Software Engineer navigating the <span className="text-orange-400 font-medium">Event Horizon</span>
                    <br className="hidden md:block" />
                    <span className="text-gray-500">Where complexity bends into elegant solutions</span>
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <button
                        onClick={handleMissionLogClick}
                        className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-black font-bold uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,150,50,0.5)] rounded-sm"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Enter The Tesseract <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    <button
                        onClick={handleContactClick}
                        className="group px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/5 hover:border-orange-500/50 transition-all backdrop-blur-sm rounded-sm"
                    >
                        Send Signal
                    </button>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-[10px] uppercase tracking-[0.3em] flex flex-col items-center gap-2 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
            >
                <span>Cross The Event Horizon</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5 text-orange-500/50" />
                </motion.div>
            </motion.div>
        </section>
    )
}
