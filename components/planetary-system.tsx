"use client"

import { motion } from "framer-motion"

interface OrbitingPlanetProps {
    name: string
    color: string
    size: number
    orbitRadius: number
    duration: number
    delay?: number
    glowColor: string
    reverse?: boolean
}

const OrbitingPlanet = ({
    name, color, size, orbitRadius, duration, delay = 0, glowColor, reverse = false
}: OrbitingPlanetProps) => {
    return (
        <div
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
                width: orbitRadius * 2,
                height: orbitRadius * 2,
                marginLeft: -orbitRadius,
                marginTop: -orbitRadius,
            }}
        >
            {/* Orbit Path */}
            <div
                className="absolute inset-0 rounded-full border border-white/5"
                style={{ transform: 'rotateX(75deg)' }}
            />

            {/* Planet Container (Rotating) */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: reverse ? -360 : 360 }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                    delay
                }}
            >
                {/* Planet */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full cursor-pointer pointer-events-auto group"
                    style={{
                        width: size,
                        height: size,
                        background: `radial-gradient(circle at 30% 30%, ${color}, ${color}88)`,
                        boxShadow: `0 0 ${size}px ${glowColor}, inset -${size / 4}px -${size / 4}px ${size / 2}px rgba(0,0,0,0.5)`,
                        marginTop: -size / 2,
                    }}
                    title={name}
                >
                    {/* Planet Label on Hover */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] text-white/70 uppercase tracking-widest bg-black/80 px-2 py-1 rounded border border-white/10">
                        {name}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export const PlanetarySystem = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
            <div className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px]">

                {/* Miller's Planet - Close, Fast, Water World */}
                <OrbitingPlanet
                    name="Miller's Planet"
                    color="#22d3ee"
                    size={16}
                    orbitRadius={180}
                    duration={15}
                    glowColor="rgba(34, 211, 238, 0.6)"
                />

                {/* Mann's Planet - Ice World */}
                <OrbitingPlanet
                    name="Mann's Planet"
                    color="#e5e7eb"
                    size={20}
                    orbitRadius={250}
                    duration={35}
                    delay={5}
                    glowColor="rgba(229, 231, 235, 0.4)"
                    reverse
                />

                {/* Edmund's Planet - Habitable */}
                <OrbitingPlanet
                    name="Edmund's Planet"
                    color="#4ade80"
                    size={14}
                    orbitRadius={320}
                    duration={55}
                    delay={10}
                    glowColor="rgba(74, 222, 128, 0.5)"
                />

            </div>
        </div>
    )
}
