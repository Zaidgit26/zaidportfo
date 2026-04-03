"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

export const TesseractContact = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationId: number
        let time = 0

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        resize()
        window.addEventListener("resize", resize)

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            setMousePos({
                x: (e.clientX - rect.left) / rect.width - 0.5,
                y: (e.clientY - rect.top) / rect.height - 0.5,
            })
        }
        canvas.addEventListener("mousemove", handleMouseMove)

        const render = () => {
            const w = canvas.width
            const h = canvas.height
            time += 0.01

            ctx.fillStyle = "rgba(10, 10, 12, 0.1)"
            ctx.fillRect(0, 0, w, h)

            const cx = w / 2
            const cy = h / 2
            const gridSize = 40
            const cols = Math.ceil(w / gridSize) + 2
            const rows = Math.ceil(h / gridSize) + 2

            ctx.strokeStyle = "rgba(255, 150, 50, 0.15)"
            ctx.lineWidth = 1

            // Draw perspective grid (Tesseract-like infinite bookshelf)
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * gridSize - gridSize
                    const y = j * gridSize - gridSize

                    // 3D transformation based on mouse and time
                    const dx = x - cx
                    const dy = y - cy
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    const maxDist = Math.sqrt(cx * cx + cy * cy)
                    const z = Math.sin(dist / 100 + time) * 20

                    const perspective = 1 + z / 500 + mousePos.x * 0.1
                    const px = cx + dx * perspective
                    const py = cy + dy * perspective + mousePos.y * 20

                    // Pulsing opacity based on distance
                    const alpha = 0.05 + (1 - dist / maxDist) * 0.2

                    ctx.strokeStyle = `rgba(255, ${150 + z * 2}, 50, ${alpha})`

                    // Horizontal lines
                    if (i < cols - 1) {
                        const nx = (i + 1) * gridSize - gridSize
                        const ndx = nx - cx
                        const nz = Math.sin(Math.sqrt(ndx * ndx + dy * dy) / 100 + time) * 20
                        const nperspective = 1 + nz / 500 + mousePos.x * 0.1
                        const npx = cx + ndx * nperspective

                        ctx.beginPath()
                        ctx.moveTo(px, py)
                        ctx.lineTo(npx, py)
                        ctx.stroke()
                    }

                    // Vertical lines
                    if (j < rows - 1) {
                        const ny = (j + 1) * gridSize - gridSize
                        const ndy = ny - cy
                        const nz = Math.sin(Math.sqrt(dx * dx + ndy * ndy) / 100 + time) * 20
                        const nperspective = 1 + nz / 500 + mousePos.x * 0.1
                        const npy = cy + ndy * nperspective + mousePos.y * 20

                        ctx.beginPath()
                        ctx.moveTo(px, py)
                        ctx.lineTo(px, npy)
                        ctx.stroke()
                    }
                }
            }

            // Central glow
            const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) / 2)
            glowGrad.addColorStop(0, "rgba(255, 150, 50, 0.1)")
            glowGrad.addColorStop(0.5, "rgba(255, 100, 30, 0.05)")
            glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)")
            ctx.fillStyle = glowGrad
            ctx.fillRect(0, 0, w, h)

            animationId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener("resize", resize)
            canvas.removeEventListener("mousemove", handleMouseMove)
            cancelAnimationFrame(animationId)
        }
    }, [mousePos.x, mousePos.y])

    return (
        <section id="signal-transmission" className="relative py-24 px-4 min-h-screen flex items-center justify-center overflow-hidden">
            {/* Tesseract Background Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-0"
            />

            {/* Content */}
            <div className="relative z-10 max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative p-8 md:p-12 rounded-lg border border-orange-500/20 bg-black/80 backdrop-blur-xl overflow-hidden"
                >
                    {/* Tesseract Corner Accents */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-orange-500/50 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-orange-500/50 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-orange-500/50 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-orange-500/50 rounded-br-lg" />

                    {/* Animated corner dots */}
                    <motion.div
                        className="absolute top-2 left-2 w-2 h-2 bg-orange-500 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div
                        className="absolute bottom-2 left-2 w-2 h-2 bg-orange-500 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    <motion.div
                        className="absolute bottom-2 right-2 w-2 h-2 bg-orange-500 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    />

                    <div className="text-center mb-10">
                        <div className="inline-block px-3 py-1 border border-orange-500/30 rounded-full bg-black/50 mb-4">
                            <span className="text-orange-400 font-mono text-xs tracking-widest uppercase">The Tesseract</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-space-grotesk tracking-tighter mb-3">
                            TRANSMIT MESSAGE
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Across time and space, your message will find me
                        </p>
                    </div>

                    <form className="space-y-6" action="mailto:reachme.zaid@gmail.com" method="GET">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-orange-400/80 pl-1">Identifier</label>
                                <Input
                                    placeholder="Your Name"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500 transition-colors h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-orange-400/80 pl-1">Frequency</label>
                                <Input
                                    placeholder="your@email.com"
                                    type="email"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-orange-500 transition-colors h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-orange-400/80 pl-1">Encoded Message</label>
                            <Textarea
                                placeholder="Your message through the dimensions..."
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 min-h-[150px] focus:border-orange-500 transition-colors resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold uppercase tracking-widest transition-all text-base"
                        >
                            <Send className="w-5 h-5 mr-3" />
                            Send Through Singularity
                        </Button>
                    </form>
                </motion.div>
            </div>
        </section>
    )
}
