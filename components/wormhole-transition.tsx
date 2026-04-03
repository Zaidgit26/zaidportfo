"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useCosmic } from "./cosmic-provider"
import { useEffect, useRef } from "react"

export const WormholeTransition = () => {
    const { warpSpeed } = useCosmic()
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (warpSpeed && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    }, [warpSpeed])

    return (
        <AnimatePresence>
            {warpSpeed && (
                <motion.div
                    className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover mix-blend-screen"
                        >
                            <source src="/wormhole.mp4" type="video/mp4" />
                        </video>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
