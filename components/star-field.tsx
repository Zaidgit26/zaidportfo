"use client"

import { useEffect, useRef } from "react"
import { useCosmic } from "./cosmic-provider"

export const StarField = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { warpSpeed } = useCosmic()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let stars: { x: number; y: number; z: number; size: number }[] = []

        // Config
        let speed = 0.2
        const baseSpeed = 0.2
        const warpSpeedVal = 20.0

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initStars()
        }

        const initStars = () => {
            stars = []
            const numStars = Math.floor((window.innerWidth * window.innerHeight) / 2000)
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width - canvas.width / 2,
                    y: Math.random() * canvas.height - canvas.height / 2,
                    z: Math.random() * canvas.width,
                    size: Math.random() * 1.5,
                })
            }
        }

        const render = () => {
            // Smoothly transition speed
            const targetSpeed = warpSpeed ? warpSpeedVal : baseSpeed
            speed += (targetSpeed - speed) * 0.1

            // Clear
            ctx.fillStyle = "#0B0C10"
            // If warping, use slight transparency for trail effect? No, clean is better for lines
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const cx = canvas.width / 2
            const cy = canvas.height / 2

            stars.forEach((star) => {
                // Move star
                star.z -= speed
                if (star.z <= 0) {
                    star.x = Math.random() * canvas.width - canvas.width / 2
                    star.y = Math.random() * canvas.height - canvas.height / 2
                    star.z = canvas.width
                    // Keep center clearer during warp
                    if (warpSpeed && Math.abs(star.x) < 50 && Math.abs(star.y) < 50) {
                        star.x += 100
                    }
                }

                const x = (star.x / star.z) * canvas.width + cx
                const y = (star.y / star.z) * canvas.height + cy
                const size = (1 - star.z / canvas.width) * star.size * 2

                const isWarping = speed > 2

                if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
                    const alpha = 1 - star.z / canvas.width
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`

                    if (isWarping) {
                        // Draw streak lines for warp effect
                        const prevZ = star.z + speed * 2
                        const prevX = (star.x / prevZ) * canvas.width + cx
                        const prevY = (star.y / prevZ) * canvas.height + cy

                        ctx.beginPath()
                        ctx.moveTo(prevX, prevY)
                        ctx.lineTo(x, y)
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
                        ctx.lineWidth = size
                        ctx.stroke()
                    } else {
                        // Draw dots
                        ctx.beginPath()
                        ctx.arc(x, y, size, 0, Math.PI * 2)
                        ctx.fill()
                    }
                }
            })

            animationFrameId = requestAnimationFrame(render)
        }

        window.addEventListener("resize", resizeCanvas)
        resizeCanvas()
        render()

        return () => {
            window.removeEventListener("resize", resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [warpSpeed]) // Re-bind if warpSpeed changes (though speed var handles interpolation)

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}
