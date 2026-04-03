"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export const BlackHoleVideo = () => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8 // Slow down for scale
        }
    }, [])

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* Fallback/Poster while loading */}
            <div className="absolute inset-0 bg-[#0a0a0c]" />

            {/* Video Element */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="relative w-[1200px] h-[1200px] md:w-full md:h-full max-w-none flex items-center justify-center"
            >
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-[1.5] md:scale-125 opacity-90 mix-blend-screen"
                    poster="/blackhole-poster.jpg"
                // Using a placeholder filename. User must place the file.
                // Recommended: A high quality h.264 mp4.
                >
                    <source src="/blackhole.mp4" type="video/mp4" />
                    <source src="/blackhole.webm" type="video/webm" />
                </video>

                {/* Overlay Gradients to blend edges */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#0a0a0c] scale-110" />
            </motion.div>
        </div>
    )
}
